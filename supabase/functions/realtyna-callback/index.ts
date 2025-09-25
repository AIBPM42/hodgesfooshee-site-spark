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

  try {
    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!, 
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");
    
    if (error) {
      console.error('OAuth error:', error);
      return new Response(`OAuth error: ${error}`, { status: 400, headers: corsHeaders });
    }
    
    if (!code) {
      return new Response("Missing authorization code", { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    const base = Deno.env.get("realtyna_base") || "https://api.realtyfeed.com";
    const clientId = Deno.env.get("realtyna_client_id")!;
    const clientSecret = Deno.env.get("realtyna_client_secret")!;
    const redirectUri = `https://xhqwmtzawqfffepcqxwf.functions.supabase.co/realtyna-callback`;
    
    console.log(`OAuth callback - Base: ${base}, ClientID: ${clientId?.substring(0, 8)}..., Code: ${code?.substring(0, 10)}...`);
    
    // Try multiple potential token endpoints
    const tokenEndpoints = [
      `${base}/oauth/token`,
      `${base}/token`,
      `${base}/oauth2/token`,
      `${base}/auth/token`
    ];
    
    let tokenRes: Response | null = null;
    let lastError = '';
    
    for (const tokenEndpoint of tokenEndpoints) {
      console.log(`Attempting token exchange at: ${tokenEndpoint}`);
      
      // Try with Basic Auth (common OAuth pattern)
      const basicAuth = btoa(`${clientId}:${clientSecret}`);
      
      const requestBody = new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri
      });
      
      console.log(`Request body: ${requestBody.toString()}`);
      
      try {
        tokenRes = await fetch(tokenEndpoint, {
          method: "POST",
          headers: { 
            "content-type": "application/x-www-form-urlencoded",
            "accept": "application/json",
            "authorization": `Basic ${basicAuth}`
          },
          body: requestBody
        });
        
        console.log(`Response status: ${tokenRes.status}`);
        
        if (tokenRes.ok) {
          console.log(`Success with endpoint: ${tokenEndpoint}`);
          break;
        } else {
          const errorText = await tokenRes.text();
          console.log(`Failed with ${tokenEndpoint}: ${tokenRes.status} - ${errorText}`);
          lastError = errorText;
          
          // If this failed, try with client credentials in body instead
          if (tokenRes.status === 401 || tokenRes.status === 400) {
            console.log(`Retrying ${tokenEndpoint} with client credentials in body...`);
            
            const bodyWithCredentials = new URLSearchParams({
              grant_type: "authorization_code",
              code,
              client_id: clientId,
              client_secret: clientSecret,
              redirect_uri: redirectUri
            });
            
            tokenRes = await fetch(tokenEndpoint, {
              method: "POST",
              headers: { 
                "content-type": "application/x-www-form-urlencoded",
                "accept": "application/json"
              },
              body: bodyWithCredentials
            });
            
            console.log(`Retry response status: ${tokenRes.status}`);
            
            if (tokenRes.ok) {
              console.log(`Success with credentials in body: ${tokenEndpoint}`);
              break;
            } else {
              const retryError = await tokenRes.text();
              console.log(`Retry failed: ${tokenRes.status} - ${retryError}`);
              lastError = retryError;
            }
          }
        }
        
        tokenRes = null; // Reset for next iteration
      } catch (fetchError) {
        console.error(`Network error with ${tokenEndpoint}:`, fetchError);
        lastError = fetchError instanceof Error ? fetchError.message : 'Network error';
      }
    }
    
    if (!tokenRes || !tokenRes.ok) {
      console.error('All token endpoints failed. Last error:', lastError);
      return new Response(`Token exchange failed: ${lastError || 'All endpoints failed'}`, { 
        status: 502, 
        headers: corsHeaders 
      });
    }
    
    const tokenData = await tokenRes.json();
    console.log('Token exchange successful, storing token...');
    
    const expiresAt = new Date(Date.now() + (tokenData.expires_in ?? 3600) * 1000).toISOString();
    
    const { error: insertError } = await sb.from("oauth_tokens").insert({
      provider: "realtyna",
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token ?? null,
      scope: tokenData.scope ?? null,
      expires_at: expiresAt,
      token_type: "bearer"
    });
    
    if (insertError) {
      console.error('Error storing token:', insertError);
      return new Response(`Error storing token: ${insertError.message}`, { 
        status: 500, 
        headers: corsHeaders 
      });
    }
    
    console.log('Token stored successfully');
    
    return new Response("Successfully connected to Realtyna! You can close this window.", { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
    });
    
  } catch (error) {
    console.error('Error in realtyna-callback:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});