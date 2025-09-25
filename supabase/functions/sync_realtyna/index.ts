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
    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!, 
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    console.log(`[${rid}] Starting Realtyna sync...`);

    // Ensure valid token by calling realtyna-refresh
    try {
      await fetch(`${Deno.env.get("SUPABASE_URL")!}/functions/v1/realtyna-refresh`, {
        headers: { 'Authorization': `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!}` }
      });
    } catch (error) {
      console.log(`[${rid}] Token refresh failed, continuing with existing token:`, error);
    }

    // Get current cursor state
    const { data: state } = await sb
      .from("ingest_state")
      .select("*")
      .eq("source", "realtyna_listings")
      .maybeSingle();
      
    const cursor = state?.last_cursor ?? null;
    console.log(`[${rid}] Current cursor: ${cursor}`);

    // Get active token
    const { data: token } = await sb
      .from("oauth_tokens")
      .select("*")
      .eq("provider", "realtyna")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
      
    if (!token) {
      console.error(`[${rid}] No app token found`);
      return new Response("No token available", { 
        status: 500, 
        headers: corsHeaders 
      });
    }

    // Build Smart Package API URL with Middle Tennessee geographic coverage
    const base = "https://api.realtyfeed.com";
    // Smart Package listings endpoint
    const url = new URL("/api/v1/smart/listings", base);
    
    if (cursor) {
      url.searchParams.set("cursor", cursor);
    }
    url.searchParams.set("status", "Active,ComingSoon");
    url.searchParams.set("limit", "100"); // Reasonable batch size
    
    // Add geographic parameters for Middle Tennessee RealTracs coverage
    // Davidson County (Nashville metro core)
    url.searchParams.set("counties", "Davidson,Williamson,Rutherford,Sumner,Wilson,Cheatham,Robertson,Maury");
    // Alternative: MLS-specific parameter if counties don't work
    url.searchParams.set("mls", "RealTracs");
    // State filter to ensure Tennessee focus
    url.searchParams.set("state", "TN");
    // Geographic bounds for Middle Tennessee metro area
    url.searchParams.set("bounds", "35.8,-87.1,36.8,-86.0"); // Rough Nashville metro bounds
    
    console.log(`[${rid}] Calling API: ${url.toString()}`);

    // Call Realtyna Smart Package API
    const res = await fetch(url.toString(), {
      headers: { 
        'Authorization': `Bearer ${token.access_token}`,
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[${rid}] API call failed: ${res.status} ${errorText}`);
      return new Response(`Upstream API error: ${res.status}`, { 
        status: 502, 
        headers: { ...corsHeaders, 'content-type': 'application/json' }
      });
    }

    const body = await res.json();
    console.log(`[${rid}] API response received`);

    // Extract items and next cursor
    const items = body.items ?? body.data ?? body.listings ?? [];
    const nextCursor = body.nextCursor ?? body.next ?? body.cursor ?? null;
    
    console.log(`[${rid}] Processing ${items.length} items, next cursor: ${nextCursor}`);

    let processedCount = 0;
    let errorCount = 0;

    // Process each listing
    for (const listing of items) {
      try {
        // Map fields to existing mls_listings schema
        const mappedListing = {
          mls_id: listing.MLSId ?? listing.Id ?? listing.mls_id,
          price: listing.ListPrice ?? listing.Price ?? 0,
          beds: listing.Bedrooms ?? listing.BedroomsTotal ?? 0,
          baths: listing.Bathrooms ?? listing.BathroomsTotalInteger ?? 0,
          sqft: listing.LivingArea ?? listing.SquareFeet ?? 0,
          property_type: listing.PropertyType ?? listing.PropertySubType ?? 'Residential',
          address: listing.UnparsedAddress ?? 
                  (`${listing.StreetNumber ?? ''} ${listing.StreetName ?? ''}`.trim() ||
                  'Address not available'),
          city: listing.City ?? '',
          county: listing.CountyOrParish ?? '',
          state: listing.StateOrProvince ?? 'TN',
          zip: listing.PostalCode ?? '',
          status: listing.Status ?? listing.StandardStatus ?? 'Active',
          remarks: listing.PublicRemarks ?? listing.Remarks ?? '',
          lat: listing.Latitude ?? 0,
          lng: listing.Longitude ?? 0,
          source_updated_at: listing.ModificationTimestamp ? 
            new Date(listing.ModificationTimestamp).toISOString() : 
            new Date().toISOString(),
          // Store photos as JSONB array (existing schema)
          photos: (listing.Media ?? listing.Photos ?? [])
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
      endpoint: "/api/v1/smart/listings",
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