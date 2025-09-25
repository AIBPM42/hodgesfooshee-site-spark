import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const t0 = performance.now();
  const rid = crypto.randomUUID();
  
  try {
    console.log(`[${rid}] Starting sync function...`);
    
    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!, 
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    console.log(`[${rid}] Supabase client created, starting Realtyna sync...`);

    // Get active Client Credentials token
    console.log(`[${rid}] Fetching client credentials token from database...`);
    
    const { data: token, error: tokenError } = await sb
      .from("realtyna_tokens")
      .select("*")
      .eq("principal_type", "app")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
      
    if (tokenError) {
      console.error(`[${rid}] Error fetching token:`, tokenError);
      return new Response("Token fetch error", { 
        status: 500, 
        headers: corsHeaders 
      });
    }
      
    if (!token) {
      console.error(`[${rid}] No client credentials token found in database`);
      
      // Set error in ingest_state using new key-value structure
      await sb.from("ingest_state").upsert({
        key: "realtyna_listings",
        value: {
          last_error: "No authentication token available - run Client Credentials auth first",
          last_run_at: new Date().toISOString()
        }
      }, { onConflict: "key" });
      
      return new Response(JSON.stringify({
        success: false,
        error: "No authentication token available",
        message: "Use the 'Connect to Realtyna' button to authenticate first"
      }), { 
        status: 401, 
        headers: { ...corsHeaders, 'content-type': 'application/json' }
      });
    }

    console.log(`[${rid}] Token found - expires at: ${token.expires_at}`);
    console.log(`[${rid}] Token scope: ${token.scope}`);
    
    // Check if token is expired
    const now = new Date();
    const expiresAt = new Date(token.expires_at);
    if (now >= expiresAt) {
      console.error(`[${rid}] Token is expired (expires: ${expiresAt}, now: ${now})`);
      
      // Set error in ingest_state using new key-value structure
      await sb.from("ingest_state").upsert({
        key: "realtyna_listings",
        value: {
          last_error: "Authentication token expired - reconnect to Realtyna",
          last_run_at: new Date().toISOString()
        }
      }, { onConflict: "key" });
      
      return new Response(JSON.stringify({
        success: false,
        error: "Authentication token expired",
        message: "Use the 'Reconnect to Realtyna' button to get a fresh token"
      }), { 
        status: 401, 
        headers: { ...corsHeaders, 'content-type': 'application/json' }
      });
    }

    // RESO OData pagination sync
    const BASE_URL = "https://api.realtyfeed.com/reso/odata/Property";
    const BATCH_SIZE = 100;
    const MAX_PAGES = 20; // Limit pages per run
    
    console.log(`[${rid}] Starting paginated sync with base URL: ${BASE_URL}`);
    console.log(`[${rid}] Using token: ${token.access_token.substring(0, 10)}...`);

    // Validate token format before making API call
    if (!token.access_token || typeof token.access_token !== 'string') {
      console.error(`[${rid}] Invalid token format:`, typeof token.access_token);
      return new Response("Invalid token format", { 
        status: 500, 
        headers: corsHeaders 
      });
    }

    // Log token details for debugging (first 10 chars only)
    console.log(`[${rid}] Token type: ${typeof token.access_token}`);
    console.log(`[${rid}] Token length: ${token.access_token.length}`);
    console.log(`[${rid}] Token starts with: ${token.access_token.substring(0, 10)}`);

    // Prepare headers with optional API key
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${token.access_token}`,
      'Accept': 'application/json'
    };

    // Add API key if available
    if (Deno.env.get("realtyna_api_key")) {
      headers['x-api-key'] = Deno.env.get("realtyna_api_key")!;
    }

    console.log(`[${rid}] Request headers prepared (auth header length: ${headers.Authorization.length})`);

    // Paginated fetch function
    const fetchPage = async (url?: string) => {
      const requestUrl = url || `${BASE_URL}?$filter=StandardStatus in ('Active','Coming Soon','ComingSoon')&$top=${BATCH_SIZE}&$select=ListingKey,ListPrice,BedroomsTotal,BathroomsTotalInteger,LivingArea,PropertyType,UnparsedAddress,City,CountyOrParish,StateOrProvince,PostalCode,StandardStatus,PublicRemarks,Latitude,Longitude,ModificationTimestamp&$expand=Media($select=MediaURL)`;
      
      console.log(`[${rid}] Fetching: ${requestUrl.substring(0, 100)}...`);
      
      const res = await fetch(requestUrl, { headers });
      
      console.log(`[${rid}] API response status: ${res.status}`);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`[${rid}] API call failed: ${res.status}`);
        console.error(`[${rid}] Error response: ${errorText}`);
        
        // Set error in ingest_state and stop processing on 403
        if (res.status === 403) {
          console.error(`[${rid}] 403 Forbidden - stopping sync and setting error state`);
          await sb.from("ingest_state").upsert({
            key: "realtyna_listings",
            value: {
              last_error: `403 Forbidden: ${errorText.substring(0, 200)}`,
              last_run_at: new Date().toISOString()
            }
          }, { onConflict: "key" });
        }
        
        throw new Error(`API error ${res.status}: ${errorText}`);
      }
      
      return res.json();
    };

    let totalProcessed = 0;
    let totalErrors = 0;
    let nextUrl: string | undefined;
    
    console.log(`[${rid}] Starting paginated sync (max ${MAX_PAGES} pages)`);

    for (let pageNum = 1; pageNum <= MAX_PAGES; pageNum++) {
      try {
        const pageData = await fetchPage(nextUrl);
        const items = pageData.value || [];
        nextUrl = pageData['@odata.nextLink'];
        
        console.log(`[${rid}] Page ${pageNum}: ${items.length} items, nextLink: ${!!nextUrl}`);
        
        if (items.length === 0) {
          console.log(`[${rid}] No more items, ending sync`);
          break;
        }

        // Process items from this page
        for (const listing of items) {
          try {
            // Map to new standardized schema using RESO field names
            const mappedListing = {
              listing_key: listing.ListingKey,
              listing_id: listing.ListingId || listing.Id,
              list_price: listing.ListPrice || 0,
              city: listing.City || '',
              standard_status: listing.StandardStatus || 'Active',
              bedrooms_total: listing.BedroomsTotal || 0,
              bathrooms_total_integer: listing.BathroomsTotalInteger || 0,
              living_area: listing.LivingArea || 0,
              modification_timestamp: listing.ModificationTimestamp ? 
                new Date(listing.ModificationTimestamp).toISOString() : 
                null,
              rf_modification_timestamp: new Date().toISOString()
            };

            // Upsert using listing_key as unique identifier
            const { error: upsertError } = await sb
              .from("mls_listings")
              .upsert(mappedListing, { onConflict: "listing_key" });

            if (upsertError) {
              console.error(`[${rid}] Upsert error for ${mappedListing.listing_key}:`, upsertError);
              totalErrors++;
            } else {
              totalProcessed++;
            }
            
          } catch (itemError) {
            console.error(`[${rid}] Error processing item:`, itemError);
            totalErrors++;
          }
        }
        
        // Stop if no next page
        if (!nextUrl) {
          console.log(`[${rid}] No more pages, sync complete`);
          break;
        }
        
      } catch (pageError) {
        console.error(`[${rid}] Error fetching page ${pageNum}:`, pageError);
        
        // If it's a 403, we already set the error state, so break the loop
        if (pageError instanceof Error && pageError.message.includes('403')) {
          break;
        }
        
        totalErrors++;
        break; // Stop on page errors
      }
    }

    // Clear any previous error if sync is successful
    if (totalProcessed > 0) {
      await sb.from("ingest_state").upsert({
        key: "realtyna_listings",
        value: {
          last_run_at: new Date().toISOString(),
          last_item_ts: new Date().toISOString(),
          last_error: null // Clear previous errors on success
        }
      }, { onConflict: "key" });
    }

    console.log(`[${rid}] Updated sync state`);

    // Log API usage
    await sb.from("api_usage_logs").insert({
      endpoint: "/reso/odata/Property",
      provider: "realtyna",
      method: "GET",
      status_code: 200,
      response_time_ms: Math.round(performance.now() - t0),
      metadata: {
        request_id: rid,
        items_processed: totalProcessed,
        items_failed: totalErrors,
        pages_fetched: Math.min(MAX_PAGES, Math.ceil(totalProcessed / BATCH_SIZE))
      }
    });

    const log = {
      success: true,
      at: new Date().toISOString(),
      request_id: rid,
      duration_ms: Math.round(performance.now() - t0),
      count: totalProcessed,
      processed: totalProcessed,
      synced: totalProcessed,
      total: totalProcessed,
      errors: totalErrors,
      message: `Successfully synced ${totalProcessed} listings from Realtyna RESO OData API`,
      note: "sync_realtyna_paginated"
    };

    console.log(`[${rid}] Sync complete:`, log);

    return new Response(JSON.stringify(log), {
      headers: { ...corsHeaders, "content-type": "application/json" }
    });

  } catch (error) {
    console.error(`[${rid}] Sync failed:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    const errorLog = {
      at: new Date().toISOString(),
      request_id: rid,
      duration_ms: Math.round(performance.now() - t0),
      error: errorMessage,
      note: "sync_realtyna_failed"
    };

    return new Response(JSON.stringify(errorLog), {
      status: 500,
      headers: { ...corsHeaders, 'content-type': 'application/json' },
    });
  }
});