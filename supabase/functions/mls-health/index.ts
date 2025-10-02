import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
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
    let token_ok = false;
    let base_ok = false;
    let error_message = '';

    // Test token fetch
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
        token_ok = !!tokenData.access_token;

        // Test API base with token
        if (token_ok) {
          const baseResponse = await fetch(`${RF_BASE}/Property?$top=1`, {
            headers: {
              'Authorization': `Bearer ${tokenData.access_token}`,
              'x-api-key': REALTYNA_API_KEY,
            },
          });
          base_ok = baseResponse.ok;
        }
      } else {
        error_message = `Token fetch failed: ${tokenResponse.status}`;
      }
    } catch (error) {
      error_message = `Health check error: ${error.message}`;
    }

    const health = {
      ok: token_ok && base_ok,
      token_ok,
      base_ok,
      base: RF_BASE,
      timestamp,
      error: error_message || undefined,
    };

    return new Response(JSON.stringify(health), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: health.ok ? 200 : 503,
    });
  } catch (error) {
    console.error('Health check error:', error);
    return new Response(
      JSON.stringify({
        ok: false,
        token_ok: false,
        base_ok: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
