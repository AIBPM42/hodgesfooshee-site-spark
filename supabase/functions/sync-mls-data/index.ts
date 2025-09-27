import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const REALTY_FEED_API_BASE = 'https://api.realtyfeed.com';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Environment variable helper with fallbacks
function getEnv(name: string, aliases: string[] = []) {
  for (const k of [name, ...aliases]) {
    const v = Deno.env.get(k);
    if (v && v.trim()) return v;
  }
  throw new Error(`Missing env: one of ${[name, ...aliases].join(", ")}`);
}

const MLS_CLIENT_ID     = getEnv("MLS_CLIENT_ID",     ["REALTYNA_CLIENT_ID","RF_CLIENT_ID"]);
const MLS_CLIENT_SECRET = getEnv("MLS_CLIENT_SECRET", ["REALTYNA_CLIENT_SECRET","RF_CLIENT_SECRET"]);
const REALTYNA_API_KEY  = getEnv("REALTYNA_API_KEY",  ["MLS_API_KEY","RF_API_KEY"]);

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
      client_secret: clientSecret
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
  const url = `${REALTY_FEED_API_BASE}/v1/listings?page=${page}&page_size=${pageSize}`;
  
  const headers: Record<string,string> = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
  };
  
  if (REALTYNA_API_KEY) {
    headers['x-api-key'] = REALTYNA_API_KEY;
    console.log('fetch.using_api_key', { hasApiKey: true, keyPrefix: REALTYNA_API_KEY.slice(0,4) + "..." });
  }

  console.log('fetch.request', { 
    url, 
    method: 'GET',
    headerKeys: Object.keys(headers),
    hasAuth: headers.Authorization?.startsWith('Bearer ')
  });

  const res = await fetch(url, { method: 'GET', headers });
  const raw = await res.text();
  
  console.log('fetch.response', {
    status: res.status,
    statusText: res.statusText,
    contentType: res.headers.get('content-type'),
    responseLength: raw.length,
    responsePreview: raw.slice(0, 500)
  });
  
  if (!res.ok) throw new Error(`Listings failed: ${res.status} ${raw}`);

  let json: any;
  try { 
    json = JSON.parse(raw); 
  } catch { 
    throw new Error(`Listings non-JSON: ${raw?.slice(0,300)}`); 
  }

  console.log('fetch.parsed', {
    type: typeof json,
    isArray: Array.isArray(json),
    topLevelKeys: typeof json === 'object' ? Object.keys(json) : [],
    hasData: !!json?.data,
    hasValue: !!json?.value,
    hasResults: !!json?.results,
    dataLength: Array.isArray(json?.data) ? json.data.length : 'not array',
    valueLength: Array.isArray(json?.value) ? json.value.length : 'not array'
  });

  // v1 commonly uses { data: [...] }; also tolerate OData { value: [...] }
  const items: any[] = Array.isArray(json?.data) ? json.data :
                       (Array.isArray(json?.value) ? json.value : 
                       (Array.isArray(json?.results) ? json.results :
                       (Array.isArray(json) ? json : [])));

  console.log('probe.status', res.status);
  console.log('probe.items_len', items.length);
  console.log('probe.raw_response_structure', {
    topLevelKeys: typeof json === 'object' ? Object.keys(json) : 'not object',
    jsonType: typeof json,
    jsonValue: Array.isArray(json) ? `array[${json.length}]` : typeof json,
    rawPreview: typeof json === 'object' ? JSON.stringify(json).slice(0, 300) : json
  });
  
  if (items.length > 0) {
    console.log('probe.first_keys', Object.keys(items[0]).slice(0, 25));
    console.log('probe.first_item_sample', {
      ListingKey: items[0].ListingKey,
      id: items[0].id,
      listingKey: items[0].listingKey,
      ListPrice: items[0].ListPrice,
      price: items[0].price,
      City: items[0].City,
      StandardStatus: items[0].StandardStatus,
      status: items[0].status
    });
  } else {
    console.log('probe.zero_items_debug', {
      responseStructure: json,
      possibleDataKeys: typeof json === 'object' ? Object.keys(json) : 'none'
    });
  }

  return items;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

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
  const payload = items.map(mapToDb).filter(r => r.listing_key);
  
  console.log('upsert.prepare', {
    originalCount: items.length,
    filteredCount: payload.length,
    samplePayload: payload[0]
  });
  
  if (!payload.length) {
    console.log('upsert.skip_no_payload');
    return { inserted: 0 };
  }

  const { error } = await supabase
    .from('mls_listings')
    .upsert(payload, { onConflict: 'listing_key', ignoreDuplicates: false });

  const count = payload.length;

  if (error) {
    console.error('upsert.error', error);
    throw error;
  }
  
  console.log('upsert.count', count ?? payload.length);
  return { inserted: count ?? payload.length };
}

// Main handler: tiny probe only; no filters; cap at 25 for proof
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('sync.start', { timestamp: new Date().toISOString() });
    
    const token = await getToken();
    const sample = await fetchSampleListings(token, 1, 25);
    const result = await upsertSample(sample);

    const response = {
      success: true,
      message: 'MLS probe sync completed',
      fetched: sample.length,
      inserted: result.inserted,
      ts: new Date().toISOString()
    };
    
    console.log('sync.success', response);

    return new Response(JSON.stringify(response), { 
      headers: { 
        'content-type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (e) {
    console.error('sync.error', String(e));
    return new Response(JSON.stringify({ 
      success: false, 
      error: String(e),
      ts: new Date().toISOString()
    }), { 
      status: 500,
      headers: {
        'content-type': 'application/json',
        ...corsHeaders
      }
    });
  }
});