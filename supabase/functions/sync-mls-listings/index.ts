import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { corsHeaders } from '../_shared/cors.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const REALTYFEED_ORIGIN = Deno.env.get('REALTYFEED_ORIGIN') || 'https://hodges.realtyfeed.com';
const MLS_CLIENT_ID = Deno.env.get('MLS_CLIENT_ID')!;
const MLS_CLIENT_SECRET = Deno.env.get('MLS_CLIENT_SECRET')!;
const REALTYNA_API_KEY = Deno.env.get('REALTYNA_API_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function getAccessToken(): Promise<string> {
  const tokenUrl = 'https://api.realtyfeed.com/reso/oauth2/token';
  
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(`${MLS_CLIENT_ID}:${MLS_CLIENT_SECRET}`)}`,
      'X-API-KEY': REALTYNA_API_KEY,
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      scope: 'api/read',
    }),
  });

  if (!response.ok) {
    throw new Error(`Token request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function fetchWithBackoff(url: string, headers: HeadersInit, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(url, { headers });
    
    if (response.status === 429) {
      const waitTime = Math.pow(2, i) * 1000;
      console.log(`Rate limited, waiting ${waitTime}ms before retry ${i + 1}/${retries}`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      continue;
    }
    
    return response;
  }
  
  throw new Error('Max retries exceeded due to rate limiting');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  let pageCount = 0;
  let totalFetched = 0;
  let totalUpserted = 0;

  try {
    console.log('[sync-mls-listings] Starting sync...');
    
    // Get access token
    const accessToken = await getAccessToken();
    console.log('[sync-mls-listings] Token acquired');

    // Get last sync state
    const { data: syncState } = await supabase
      .from('mls_sync_state')
      .select('*')
      .eq('resource', 'Property')
      .single();

    console.log('[sync-mls-listings] Last sync state:', syncState);

    // Build initial URL with incremental filter
    const baseUrl = 'https://api.realtyfeed.com/reso/odata/Property';
    const selectFields = 'ListingKey,ListingId,ListPrice,City,StandardStatus,BedroomsTotal,BathroomsTotalInteger,LivingArea,ModificationTimestamp,RFModificationTimestamp,ListAgentKey,ListOfficeKey,OriginalListPrice,DaysOnMarket';
    
    let filterClause = '';
    if (syncState?.last_mod) {
      // Incremental: only get records modified since last sync
      const lastMod = new Date(syncState.last_mod).toISOString();
      filterClause = `&$filter=RFModificationTimestamp gt ${lastMod}`;
    } else {
      // Initial backfill: get last 365 days
      const oneYearAgo = new Date();
      oneYearAgo.setDate(oneYearAgo.getDate() - 365);
      filterClause = `&$filter=RFModificationTimestamp gt ${oneYearAgo.toISOString()}`;
    }

    let nextUrl = `${baseUrl}?$top=200&$select=${selectFields}${filterClause}&$orderby=RFModificationTimestamp asc`;

    const requestHeaders = {
      'Authorization': `Bearer ${accessToken}`,
      'X-API-KEY': REALTYNA_API_KEY,
      'Origin': REALTYFEED_ORIGIN,
      'Referer': REALTYFEED_ORIGIN,
    };

    let latestModTimestamp: string | null = null;

    // Pagination loop
    while (nextUrl && pageCount < 50) {
      pageCount++;
      console.log(`[sync-mls-listings] Fetching page ${pageCount}: ${nextUrl}`);

      const response = await fetchWithBackoff(nextUrl, requestHeaders);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[sync-mls-listings] API Error ${response.status}:`, errorText);
        throw new Error(`API request failed: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      const records = data.value || [];
      totalFetched += records.length;

      console.log(`[sync-mls-listings] Page ${pageCount}: ${records.length} records`);

      if (records.length > 0) {
        // Track latest modification timestamp
        const pageLatest = records[records.length - 1]?.RFModificationTimestamp;
        if (pageLatest) {
          latestModTimestamp = pageLatest;
        }

        // Transform and upsert
        const transformed = records.map((item: any) => ({
          listing_key: item.ListingKey,
          listing_id: item.ListingId,
          list_price: item.ListPrice,
          city: item.City,
          standard_status: item.StandardStatus,
          bedrooms_total: item.BedroomsTotal,
          bathrooms_total_integer: item.BathroomsTotalInteger,
          living_area: item.LivingArea,
          modification_timestamp: item.ModificationTimestamp,
          rf_modification_timestamp: item.RFModificationTimestamp,
          listing_agent_key: item.ListAgentKey,
          listing_office_key: item.ListOfficeKey,
          original_list_price: item.OriginalListPrice || item.ListPrice,
          days_on_market: item.DaysOnMarket,
          updated_at: new Date().toISOString(),
        }));

        const { error: upsertError, count } = await supabase
          .from('mls_listings')
          .upsert(transformed, { 
            onConflict: 'listing_key',
            count: 'exact'
          });

        if (upsertError) {
          console.error('[sync-mls-listings] Upsert error:', upsertError);
          throw upsertError;
        }

        totalUpserted += count || records.length;
      }

      // Check for next page
      nextUrl = data['@odata.nextLink'] || null;
      
      if (!nextUrl) {
        console.log('[sync-mls-listings] No more pages');
        break;
      }
    }

    // Update sync state
    if (latestModTimestamp) {
      const { error: stateError } = await supabase
        .from('mls_sync_state')
        .upsert({
          resource: 'Property',
          last_mod: latestModTimestamp,
          last_run: new Date().toISOString(),
          notes: `Synced ${totalUpserted} records in ${pageCount} pages`,
        }, { onConflict: 'resource' });

      if (stateError) {
        console.error('[sync-mls-listings] State update error:', stateError);
      }
    }

    const duration = Date.now() - startTime;
    const result = {
      ok: true,
      resource: 'Property',
      pages: pageCount,
      fetched: totalFetched,
      upserted: totalUpserted,
      duration_ms: duration,
      last_mod: latestModTimestamp,
    };

    console.log('[sync-mls-listings] Sync complete:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('[sync-mls-listings] Error:', error);
    return new Response(
      JSON.stringify({ 
        ok: false, 
        error: error.message,
        pages: pageCount,
        fetched: totalFetched,
        upserted: totalUpserted,
      }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
