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
    console.log('[sync-mls-offices] Starting sync...');
    
    const accessToken = await getAccessToken();
    console.log('[sync-mls-offices] Token acquired');

    const { data: syncState } = await supabase
      .from('mls_sync_state')
      .select('*')
      .eq('resource', 'Office')
      .single();

    const baseUrl = 'https://api.realtyfeed.com/reso/odata/Office';
    const selectFields = 'OfficeKey,OfficeId,OfficeName,OfficePhone,OfficeEmail,OfficeAddress1,OfficeCity,OfficeStateOrProvince,OfficePostalCode,OfficeCountry,OfficeStatus,ModificationTimestamp,RFModificationTimestamp';
    
    let filterClause = '';
    if (syncState?.last_mod) {
      const lastMod = new Date(syncState.last_mod).toISOString();
      filterClause = `&$filter=RFModificationTimestamp gt ${lastMod}`;
    } else {
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

    while (nextUrl && pageCount < 50) {
      pageCount++;
      console.log(`[sync-mls-offices] Fetching page ${pageCount}`);

      const response = await fetchWithBackoff(nextUrl, requestHeaders);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[sync-mls-offices] API Error ${response.status}:`, errorText);
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const records = data.value || [];
      totalFetched += records.length;

      console.log(`[sync-mls-offices] Page ${pageCount}: ${records.length} records`);

      if (records.length > 0) {
        const pageLatest = records[records.length - 1]?.RFModificationTimestamp;
        if (pageLatest) {
          latestModTimestamp = pageLatest;
        }

        const transformed = records.map((item: any) => ({
          office_key: item.OfficeKey,
          office_id: item.OfficeId,
          office_name: item.OfficeName,
          office_phone: item.OfficePhone,
          office_email: item.OfficeEmail,
          office_address1: item.OfficeAddress1,
          office_city: item.OfficeCity,
          office_state_or_province: item.OfficeStateOrProvince,
          office_postal_code: item.OfficePostalCode,
          office_country: item.OfficeCountry,
          office_status: item.OfficeStatus,
          modification_timestamp: item.ModificationTimestamp,
          rf_modification_timestamp: item.RFModificationTimestamp,
          updated_at: new Date().toISOString(),
        }));

        const { error: upsertError, count } = await supabase
          .from('mls_offices')
          .upsert(transformed, { 
            onConflict: 'office_key',
            count: 'exact'
          });

        if (upsertError) {
          console.error('[sync-mls-offices] Upsert error:', upsertError);
          throw upsertError;
        }

        totalUpserted += count || records.length;
      }

      nextUrl = data['@odata.nextLink'] || null;
      
      if (!nextUrl) break;
    }

    if (latestModTimestamp) {
      await supabase
        .from('mls_sync_state')
        .upsert({
          resource: 'Office',
          last_mod: latestModTimestamp,
          last_run: new Date().toISOString(),
          notes: `Synced ${totalUpserted} records in ${pageCount} pages`,
        }, { onConflict: 'resource' });
    }

    const duration = Date.now() - startTime;
    const result = {
      ok: true,
      resource: 'Office',
      pages: pageCount,
      fetched: totalFetched,
      upserted: totalUpserted,
      duration_ms: duration,
      last_mod: latestModTimestamp,
    };

    console.log('[sync-mls-offices] Sync complete:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('[sync-mls-offices] Error:', error);
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
