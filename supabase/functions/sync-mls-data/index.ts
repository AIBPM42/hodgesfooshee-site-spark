import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const REALTY_FEED_API_BASE = 'https://api.realtyfeed.com';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-api-key, x-client-info, content-type, x-run-source, x-user-id',
};

// Environment variable helper with fallbacks
function getEnv(name: string, aliases: string[] = []) {
  for (const k of [name, ...aliases]) {
    const v = Deno.env.get(k);
    if (v && v.trim()) return v;
  }
  throw new Error(`Missing env: one of ${[name, ...aliases].join(", ")}`);
}

const MLS_CLIENT_ID     = getEnv("MLS_CLIENT_ID",     ["realtyna_client_id"]);
const MLS_CLIENT_SECRET = getEnv("MLS_CLIENT_SECRET", ["realtyna_client_secret"]);
const REALTYNA_API_KEY  = getEnv("REALTYNA_API_KEY",  ["realtyna_api_key", "REALTY_API_KEY", "REALTYNA_API_KEY"]);

console.log("[env] using", {
  MLS_CLIENT_ID: MLS_CLIENT_ID.slice(0,4) + "...",
  MLS_CLIENT_SECRET: "***",
  REALTYNA_API_KEY: REALTYNA_API_KEY.slice(0,4) + "..."
});

async function getToken() {
  const clientId = MLS_CLIENT_ID;
  const clientSecret = MLS_CLIENT_SECRET;
  
  console.log('auth.attempt', { 
    hasClientId: !!clientId, 
    hasClientSecret: !!clientSecret,
    clientIdPrefix: clientId?.slice(0, 8) + '...'
  });
  
  if (!clientId || !clientSecret) throw new Error('MLS credentials not configured');

  const url = `${REALTY_FEED_API_BASE}/v1/auth/token`;
  console.log('auth.url', url);

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'api/read'
    }),
  });
  
  const responseText = await resp.text();
  console.log('auth.response', { 
    status: resp.status, 
    statusText: resp.statusText,
    responseLength: responseText.length,
    responsePreview: responseText.slice(0, 200)
  });
  
  if (!resp.ok) throw new Error(`Token request failed: ${resp.status} ${responseText}`);
  
  let data: any;
  try {
    data = JSON.parse(responseText);
  } catch (e) {
    throw new Error(`Token response not JSON: ${responseText}`);
  }
  
  console.log('auth.success', { 
    hasAccessToken: !!data.access_token,
    tokenType: data.token_type,
    expiresIn: data.expires_in 
  });
  
  return data.access_token as string;
}

async function fetchSampleListings(token: string, page = 1, pageSize = 25) {
  console.log('fetch.attempt', { page, pageSize, tokenPrefix: token.slice(0, 8) + "..." });
  
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const REALTYFEED_ORIGIN = Deno.env.get("REALTYFEED_ORIGIN") || SUPABASE_URL;
  
  // Use OData (RESO) format - first run probe with top 25
  const resp = await fetch("https://api.realtyfeed.com/reso/odata/Property?$top=25&$select=*&$orderby=ModificationTimestamp desc", {
    headers: {
      Authorization: `Bearer ${token}`,
      "x-api-key": REALTYNA_API_KEY,
      Accept: "application/json",
      "Origin": REALTYFEED_ORIGIN,
      "Referer": REALTYFEED_ORIGIN
    }
  });

  console.log('fetch.response', { 
    status: resp.status, 
    statusText: resp.statusText,
    contentType: resp.headers.get('content-type')
  });

  if (!resp.ok) {
    const errorText = await resp.text();
    console.log('fetch.error_details', { 
      status: resp.status, 
      errorText: errorText.slice(0, 500)
    });
    throw new Error(`odata ${resp.status}: ${errorText}`);
  }

  const js = await resp.json();
  const items = Array.isArray(js?.value) ? js.value : [];

  console.log('probe.items_len', items.length);
  
  if (items.length > 0) {
    console.log('probe.first_keys', Object.keys(items[0]).slice(0, 25));
    console.log('probe.first_item_sample', {
      ListingKey: items[0].ListingKey,
      ListPrice: items[0].ListPrice,
      BedroomsTotal: items[0].BedroomsTotal,
      BathroomsTotalInteger: items[0].BathroomsTotalInteger,
      LivingArea: items[0].LivingArea,
      City: items[0].City,
      StandardStatus: items[0].StandardStatus
    });
  } else {
    console.log('probe.zero_items_debug', {
      responseStructure: js,
      possibleDataKeys: typeof js === 'object' ? Object.keys(js) : 'none'
    });
  }

  return items;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Sync logging helpers
async function beginRun(functionName: string, runSource = 'manual', triggeredBy?: string) {
  const { data, error } = await supabase
    .from('sync_log')
    .insert({
      function_name: functionName,
      run_source: runSource,
      triggered_by: triggeredBy,
      started_at: new Date().toISOString()
    })
    .select('id')
    .single();
  
  if (error) console.error('beginRun error:', error);
  return data?.id;
}

async function finishRun(runId: string, success: boolean, fetched = 0, inserted = 0, message?: string) {
  if (!runId) return;
  
  const { error } = await supabase
    .from('sync_log')
    .update({
      completed_at: new Date().toISOString(),
      success,
      fetched,
      inserted,
      records_processed: inserted,
      message: message?.slice(0, 512) // Truncate to 512 chars
    })
    .eq('id', runId);
    
  if (error) console.error('finishRun error:', error);
}

// Adjust mapping once we see probe.first_keys in logs
function mapToDb(row: any) {
  const mapped = {
    listing_key: String(row.ListingKey ?? row.id ?? row.listingKey ?? ''),
    list_price: row.ListPrice ?? row.price ?? null,
    bedrooms_total: row.BedroomsTotal ?? row.bedrooms ?? null,
    bathrooms_total_integer: row.BathroomsTotalInteger ?? row.baths ?? null,
    living_area: row.LivingArea ?? row.sqft ?? null,
    city: row.City ?? null,
    standard_status: row.StandardStatus ?? row.status ?? null,
    modification_timestamp: row.ModificationTimestamp ?? row.updated_at ?? null,
  };
  
  console.log('mapping.sample', {
    originalKeys: Object.keys(row).slice(0, 10),
    mappedKeys: Object.keys(mapped),
    hasListingKey: !!mapped.listing_key,
    listingKey: mapped.listing_key
  });
  
  return mapped;
}

async function upsertSample(items: any[]) {
  if (!items?.length) {
    console.log('upsert.skip', 'no items');
    return 0;
  }

  console.log('upsert.attempt', { itemCount: items.length });

  const rows = items.map((r: any) => ({
    listing_key: String(r.ListingKey ?? r.id ?? r.listingKey ?? ""),
    list_price: r.ListPrice ?? r.price ?? null,
    bedrooms_total: r.BedroomsTotal ?? r.bedrooms ?? null,
    bathrooms_total_integer: r.BathroomsTotalInteger ?? r.baths ?? null,
    living_area: r.LivingArea ?? r.sqft ?? null,
    city: r.City ?? null,
    standard_status: r.StandardStatus ?? r.status ?? null,
    modification_timestamp: r.ModificationTimestamp ?? r.updated_at ?? null,
  })).filter(x => x.listing_key);

  console.log('upsert.mapped', { 
    originalCount: items.length, 
    mappedCount: rows.length,
    sampleKeys: rows.slice(0, 3).map(r => r.listing_key)
  });

  if (!rows.length) {
    console.log('upsert.skip', 'no valid rows after mapping');
    return 0;
  }

  const { error, count } = await supabase
    .from("mls_listings")
    .upsert(rows, { onConflict: "listing_key", count: "exact" });

  if (error) {
    console.log('upsert.error', error);
    throw error;
  }

  console.log("upsert.count", count ?? rows.length);
  return count ?? rows.length;
}

// Main handler: tiny probe only; no filters; cap at 25 for proof
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Read optional headers for logging
  const runSource = req.headers.get('x-run-source') || 'manual';
  const triggeredBy = req.headers.get('x-user-id') || undefined;
  
  let runId: string | undefined;
  
  try {
    console.log('sync.start', { timestamp: new Date().toISOString(), runSource, triggeredBy });
    
    // Begin logging
    runId = await beginRun('sync-mls-data', runSource, triggeredBy);
    
    const token = await getToken();
    const listings = await fetchSampleListings(token, 1, 25);
    const upserted = await upsertSample(listings);

    // Log success
    if (runId) {
      await finishRun(runId, true, listings.length, upserted, 'Sync completed successfully');
    }

    return new Response(JSON.stringify({
      ok: true,
      fetched: listings.length,
      inserted: upserted
    }), { 
      headers: { 
        "content-type": "application/json",
        ...corsHeaders
      }
    });
  } catch (e) {
    const errorMessage = String(e);
    console.error('sync.error', errorMessage);
    
    // Log failure
    if (runId) {
      await finishRun(runId, false, 0, 0, errorMessage);
    }
    
    return new Response(JSON.stringify({ 
      ok: false, 
      error: errorMessage
    }), { 
      status: 500,
      headers: {
        'content-type': 'application/json',
        ...corsHeaders
      }
    });
  }
});