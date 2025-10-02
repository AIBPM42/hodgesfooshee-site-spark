import { corsHeaders } from '../_shared/cors.ts';

const REALTYNA_API_KEY = Deno.env.get('REALTYNA_API_KEY') || '';
const MLS_CLIENT_ID = Deno.env.get('MLS_CLIENT_ID') || '';
const MLS_CLIENT_SECRET = Deno.env.get('MLS_CLIENT_SECRET') || '';
const RF_TOKEN_URL = 'https://api.realtyfeed.com/reso/oauth2/token';
const RF_BASE = 'https://api.realtyfeed.com/reso/odata';

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const timestamp = new Date().toISOString();
    
    // Get OAuth token
    let token = '';
    try {
      const tokenResponse = await fetch(RF_TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-api-key': REALTYNA_API_KEY,
        },
        body: new URLSearchParams({
          client_id: MLS_CLIENT_ID,
          client_secret: MLS_CLIENT_SECRET,
          grant_type: 'client_credentials',
          scope: 'OData',
        }),
      });

      if (tokenResponse.ok) {
        const tokenData = await tokenResponse.json();
        token = tokenData.access_token;
      }
    } catch (error) {
      console.error('Token fetch failed:', error);
    }

    const services = {
      properties: { ok: false, status: 0, t: 0, error: '', countProbe: 0 },
      openHouses: { ok: false, status: 0, t: 0, error: '', countProbe: 0 },
      members: { ok: false, status: 0, t: 0, error: '', countProbe: 0 },
      offices: { ok: false, status: 0, t: 0, error: '', countProbe: 0 },
    };

    if (!token) {
      return new Response(
        JSON.stringify({ services, timestamp, error: 'Failed to obtain token' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 503 }
      );
    }

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
          const response = await fetch(url, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'x-api-key': REALTYNA_API_KEY,
            },
          });
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
          } else {
            services[key as keyof typeof services] = {
              ok: false,
              status: response.status,
              t,
              error: `${response.status} ${response.statusText}`,
              countProbe: 0,
            };
          }
          
          if (!response.ok) {
            console.error(`[${key}] Failed: ${url} -> ${response.status}`);
          }
        } catch (error) {
          const t = Date.now() - start;
          services[key as keyof typeof services] = {
            ok: false,
            status: 0,
            t,
            error: error.message || 'Network error',
            countProbe: 0,
          };
          console.error(`[${key}] Error: ${url}`, error);
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
