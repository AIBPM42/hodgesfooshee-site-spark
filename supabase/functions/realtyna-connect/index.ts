import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const base = Deno.env.get("realtyna_base") || "https://api.realtyfeed.com";
    const clientId = Deno.env.get("realtyna_client_id");
    const redirectUri = `https://xhqwmtzawqfffepcqxwf.functions.supabase.co/realtyna-callback`;
    
    console.log(`OAuth Connect - Base: ${base}, ClientID: ${clientId?.substring(0, 8) || 'NOT_SET'}...`);
    
    if (!clientId) {
      console.error('REALTYNA_CLIENT_ID not set');
      return new Response('Configuration error: Client ID not set', { 
        status: 500, 
        headers: corsHeaders 
      });
    }
    
    // Generate state parameter for security
    const state = crypto.randomUUID();
    
    // Try multiple potential authorization endpoints and parameter combinations
    const authConfigs = [
      // Standard OAuth2 patterns
      {
        endpoint: "/oauth/authorize",
        params: {
          response_type: "code",
          client_id: clientId,
          redirect_uri: redirectUri,
          scope: "api:read api:write",
          state: state
        }
      },
      // Alternative endpoint
      {
        endpoint: "/authorize", 
        params: {
          response_type: "code",
          client_id: clientId,
          redirect_uri: redirectUri,
          scope: "api:read api:write",
          state: state
        }
      },
      // Different scope format
      {
        endpoint: "/oauth/authorize",
        params: {
          response_type: "code",
          client_id: clientId,
          redirect_uri: redirectUri,
          scope: "read write",
          state: state
        }
      },
      // Minimal parameters
      {
        endpoint: "/oauth/authorize",
        params: {
          response_type: "code",
          client_id: clientId,
          redirect_uri: redirectUri
        }
      },
      // OAuth2 endpoint variant
      {
        endpoint: "/oauth2/authorize",
        params: {
          response_type: "code",
          client_id: clientId,
          redirect_uri: redirectUri,
          scope: "api:read api:write",
          state: state
        }
      }
    ];
    
    // For now, try the first configuration (we can make this dynamic later)
    const config = authConfigs[0];
    const url = new URL(config.endpoint, base);
    
    // Add all parameters
    Object.entries(config.params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      }
    });
    
    console.log(`OAuth Authorization URL: ${url.toString()}`);
    console.log(`Using endpoint: ${config.endpoint}`);
    console.log(`Parameters: ${JSON.stringify(config.params, null, 2)}`);
    
    // Test the URL by making a HEAD request first
    try {
      const testRes = await fetch(url.toString(), { method: 'HEAD' });
      console.log(`URL test response: ${testRes.status}`);
      
      if (testRes.status === 404) {
        console.log('404 detected, trying alternative endpoint...');
        const altConfig = authConfigs[1]; // Try /authorize instead
        const altUrl = new URL(altConfig.endpoint, base);
        Object.entries(altConfig.params).forEach(([key, value]) => {
          if (value) {
            altUrl.searchParams.set(key, value);
          }
        });
        
        console.log(`Trying alternative URL: ${altUrl.toString()}`);
        
        return new Response(null, { 
          status: 302, 
          headers: { 
            ...corsHeaders,
            Location: altUrl.toString() 
          }
        });
      }
    } catch (testError) {
      console.log(`URL test failed (proceeding anyway): ${testError}`);
    }
    
    return new Response(null, { 
      status: 302, 
      headers: { 
        ...corsHeaders,
        Location: url.toString() 
      }
    });
  } catch (error) {
    console.error('Error in realtyna-connect:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});