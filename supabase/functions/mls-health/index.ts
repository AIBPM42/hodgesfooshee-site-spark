import { corsHeaders } from '../_shared/cors.ts';
import { getRealtynaToken } from '../_shared/realtyna-auth.ts';
import { getRealtynaBaseUrl, getRealtynaHeaders, fetchWithRetry } from '../_shared/realtyna-client.ts';

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const timestamp = new Date().toISOString();
    console.log('[mls-health] Health check started');
    
    // Get OAuth token with caching
    let token = '';
    try {
      token = await getRealtynaToken();
      console.log('[mls-health] Token obtained successfully');
    } catch (error) {
      console.error('[mls-health] Token fetch failed:', error);
      return new Response(
        JSON.stringify({ 
          services: {
            properties: { ok: false, status: 0, t: 0, error: 'Token fetch failed', countProbe: 0 },
            openHouses: { ok: false, status: 0, t: 0, error: 'Token fetch failed', countProbe: 0 },
            members: { ok: false, status: 0, t: 0, error: 'Token fetch failed', countProbe: 0 },
            offices: { ok: false, status: 0, t: 0, error: 'Token fetch failed', countProbe: 0 },
          }, 
          timestamp, 
          error: 'Failed to obtain token' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 503 }
      );
    }

    const services = {
      properties: { ok: false, status: 0, t: 0, error: '', countProbe: 0 },
      openHouses: { ok: false, status: 0, t: 0, error: '', countProbe: 0 },
      members: { ok: false, status: 0, t: 0, error: '', countProbe: 0 },
      offices: { ok: false, status: 0, t: 0, error: '', countProbe: 0 },
    };

    const RF_BASE = getRealtynaBaseUrl();
    const headers = getRealtynaHeaders(token);

    // Check each service
    const checks = [
      { key: 'properties', url: `${RF_BASE}/Property?$top=1` },
      { key: 'openHouses', url: `${RF_BASE}/OpenHouse?$top=1` },
      { key: 'members', url: `${RF_BASE}/Member?$top=1` },
      { key: 'offices', url: `${RF_BASE}/Office?$top=1` },
    ];

    await Promise.all(
      checks.map(async ({ key, url }) => {
        const start = Date.now();
        try {
          console.log(`[mls-health] Checking ${key}: ${url}`);
          const response = await fetchWithRetry(url, { headers }, 2);
          const t = Date.now() - start;
          
          if (response.ok) {
            const data = await response.json();
            const count = data?.value?.length || 0;
            services[key as keyof typeof services] = {
              ok: true,
              status: response.status,
              t,
              error: '',
              countProbe: count,
            };
            console.log(`[mls-health] ${key} OK: ${count} items in ${t}ms`);
          } else {
            const errorBody = await response.text();
            const errorMsg = `${response.status} ${response.statusText}`;
            services[key as keyof typeof services] = {
              ok: false,
              status: response.status,
              t,
              error: errorMsg,
              countProbe: 0,
            };
            console.error(`[mls-health] ${key} failed: ${errorMsg}`, errorBody.substring(0, 200));
          }
        } catch (error) {
          const t = Date.now() - start;
          const errorMsg = error.message || 'Network error';
          services[key as keyof typeof services] = {
            ok: false,
            status: 0,
            t,
            error: errorMsg,
            countProbe: 0,
          };
          console.error(`[mls-health] ${key} error:`, errorMsg);
        }
      })
    );

    const allOk = Object.values(services).every((s) => s.ok);

    return new Response(
      JSON.stringify({ services, timestamp }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: allOk ? 200 : 503,
      }
    );
  } catch (error) {
    console.error('Health check error:', error);
    return new Response(
      JSON.stringify({
        services: {
          properties: { ok: false, status: 0, t: 0, error: 'Server error', countProbe: 0 },
          openHouses: { ok: false, status: 0, t: 0, error: 'Server error', countProbe: 0 },
          members: { ok: false, status: 0, t: 0, error: 'Server error', countProbe: 0 },
          offices: { ok: false, status: 0, t: 0, error: 'Server error', countProbe: 0 },
        },
        timestamp: new Date().toISOString(),
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
