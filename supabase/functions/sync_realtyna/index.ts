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

    // Skip token refresh for now to isolate the main issue
    console.log(`[${rid}] Skipping token refresh to isolate sync issues`);
    
    // Note: We'll re-enable token refresh once the main sync is working

    // Get current cursor state
    const { data: state } = await sb
      .from("ingest_state")
      .select("*")
      .eq("source", "realtyna_listings")
      .maybeSingle();
      
    const cursor = state?.last_cursor ?? null;
    console.log(`[${rid}] Current cursor: ${cursor}`);

    // Get active token with detailed logging
    console.log(`[${rid}] Fetching oauth token from database...`);
    
    const { data: token, error: tokenError } = await sb
      .from("oauth_tokens")
      .select("*")
      .eq("provider", "realtyna")
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
      console.error(`[${rid}] No oauth token found in database`);
      return new Response("No token available", { 
        status: 500, 
        headers: corsHeaders 
      });
    }

    console.log(`[${rid}] Token found - expires at: ${token.expires_at}`);
    console.log(`[${rid}] Token scope: ${token.scope}`);
    
    // Check if token is expired
    const now = new Date();
    const expiresAt = new Date(token.expires_at);
    if (now >= expiresAt) {
      console.error(`[${rid}] Token is expired (expires: ${expiresAt}, now: ${now})`);
      return new Response("Token expired", { 
        status: 401, 
        headers: corsHeaders 
      });
    }

    // Build RESO OData API URL with geographic and MLS filters
    const baseUrl = "https://api.realtyfeed.com/reso/odata/Property";
    const params = new URLSearchParams({
      '$filter': "StandardStatus eq 'Active' or StandardStatus eq 'Coming Soon'",
      '$top': "100",
      '$select': "ListingId,ListPrice,BedroomsTotal,BathroomsTotalInteger,LivingArea,PropertyType,UnparsedAddress,City,CountyOrParish,StateOrProvince,PostalCode,StandardStatus,PublicRemarks,Latitude,Longitude,ModificationTimestamp,Photos"
    });
    
    // Add cursor for pagination if available
    if (cursor) {
      params.append('$skip', cursor);
    }
    
    const apiUrl = `${baseUrl}?${params.toString()}`;
    
    console.log(`[${rid}] Calling API: ${apiUrl}`);
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

    // Call Realtyna Smart Package API with properly formatted headers
    const headers = {
      'Authorization': `Bearer ${token.access_token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'Supabase-Edge-Function/1.0'
    };

    console.log(`[${rid}] Request headers prepared (auth header length: ${headers.Authorization.length})`);

    const res = await fetch(apiUrl, {
      headers: headers
    });

    console.log(`[${rid}] API response status: ${res.status}`);
    console.log(`[${rid}] API response headers:`, Object.fromEntries(res.headers.entries()));

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[${rid}] API call failed: ${res.status}`);
      console.error(`[${rid}] Error response: ${errorText}`);
      console.error(`[${rid}] Request URL: ${apiUrl}`);
      console.error(`[${rid}] Request headers used:`, headers);
      
      // Log specific error details for common issues
      if (res.status === 401) {
        console.error(`[${rid}] Authentication failed - token may be expired or invalid`);
      } else if (res.status === 403) {
        console.error(`[${rid}] Authorization failed - check token format and permissions`);
      }
      
      return new Response(JSON.stringify({
        error: `Upstream API error: ${res.status}`,
        details: errorText,
        request_id: rid
      }), { 
        status: 502, 
        headers: { ...corsHeaders, 'content-type': 'application/json' }
      });
    }

    const body = await res.json();
    console.log(`[${rid}] API response received`);

    // Extract items and next cursor from OData response
    const items = body.value ?? body.data ?? body.listings ?? [];
    // OData uses @odata.nextLink for pagination
    const nextCursor = body['@odata.nextLink'] ? 
      new URL(body['@odata.nextLink']).searchParams.get('$skip') : null;
    
    console.log(`[${rid}] Processing ${items.length} items, next cursor: ${nextCursor}`);

    let processedCount = 0;
    let errorCount = 0;

    // Process each listing
    for (const listing of items) {
      try {
        // Map fields to existing mls_listings schema (OData field names)
        const mappedListing = {
          mls_id: listing.ListingId ?? listing.MLSId ?? listing.Id ?? listing.mls_id,
          price: listing.ListPrice ?? listing.Price ?? 0,
          beds: listing.BedroomsTotal ?? listing.Bedrooms ?? 0,
          baths: listing.BathroomsTotalInteger ?? listing.Bathrooms ?? 0,
          sqft: listing.LivingArea ?? listing.SquareFeet ?? 0,
          property_type: listing.PropertyType ?? listing.PropertySubType ?? 'Residential',
          address: listing.UnparsedAddress ?? 
                  (`${listing.StreetNumber ?? ''} ${listing.StreetName ?? ''}`.trim() ||
                  'Address not available'),
          city: listing.City ?? '',
          county: listing.CountyOrParish ?? '',
          state: listing.StateOrProvince ?? 'TN',
          zip: listing.PostalCode ?? '',
          status: listing.StandardStatus ?? listing.Status ?? 'Active',
          remarks: listing.PublicRemarks ?? listing.Remarks ?? '',
          lat: listing.Latitude ?? 0,
          lng: listing.Longitude ?? 0,
          source_updated_at: listing.ModificationTimestamp ? 
            new Date(listing.ModificationTimestamp).toISOString() : 
            new Date().toISOString(),
          // Store photos as JSONB array (existing schema)
          photos: (listing.Photos ?? listing.Media ?? [])
            .map((media: any) => media.MediaURL ?? media.Url ?? media.url)
            .filter((url: string) => url && url.trim() !== '')
        };

        // Upsert to mls_listings
        const { error: upsertError } = await sb
          .from("mls_listings")
          .upsert(mappedListing, { onConflict: "mls_id" });

        if (upsertError) {
          console.error(`[${rid}] Upsert error for MLS ${mappedListing.mls_id}:`, upsertError);
          errorCount++;
        } else {
          processedCount++;
        }
        
      } catch (itemError) {
        console.error(`[${rid}] Error processing item:`, itemError);
        errorCount++;
      }
    }

    // Update cursor state if we have a next cursor
    if (nextCursor && items.length > 0) {
      await sb.from("ingest_state").upsert({
        source: "realtyna_listings",
        last_cursor: nextCursor,
        last_item_ts: new Date().toISOString(),
        last_run_at: new Date().toISOString()
      }, { onConflict: "source" });
      
      console.log(`[${rid}] Updated cursor to: ${nextCursor}`);
    }

    // Log API usage
    await sb.from("api_usage_logs").insert({
      endpoint: "/reso/odata/Property",
      provider: "realtyna",
      method: "GET",
      status_code: res.status,
      response_time_ms: Math.round(performance.now() - t0),
      metadata: {
        request_id: rid,
        items_processed: processedCount,
        items_failed: errorCount,
        cursor_used: cursor,
        next_cursor: nextCursor
      }
    });

    const log = {
      at: new Date().toISOString(),
      request_id: rid,
      duration_ms: Math.round(performance.now() - t0),
      count: items.length,
      processed: processedCount,
      errors: errorCount,
      next_cursor: nextCursor,
      note: "sync_realtyna"
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