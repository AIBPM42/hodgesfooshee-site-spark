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

    const base = Deno.env.get("REALTYNA_BASE") || "https://api.realtyfeed.com";
    const clientId = Deno.env.get("REALTYNA_CLIENT_ID")!;
    const clientSecret = Deno.env.get("REALTYNA_CLIENT_SECRET")!;
    const redirectUri = `https://xhqwmtzawqfffepcqxwf.functions.supabase.co/realtyna-callback`;
    
    // {needs-verification} - Token endpoint (assuming standard OAuth pattern)
    const tokenEndpoint = `${base}/oauth/token`;
    
    console.log(`Exchanging code for token at: ${tokenEndpoint}`);
    
    const tokenRes = await fetch(tokenEndpoint, {
      method: "POST",
      headers: { 
        "content-type": "application/x-www-form-urlencoded",
        "accept": "application/json"
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri
      })
    });
    
    if (!tokenRes.ok) {
      const errorText = await tokenRes.text();
      console.error('Token exchange failed:', tokenRes.status, errorText);
      return new Response(`Token exchange failed: ${errorText}`, { 
        status: 502, 
        headers: corsHeaders 
      });
    }
    
    const tokenData = await tokenRes.json();
    console.log('Token exchange successful, storing token...');
    
    const expiresAt = new Date(Date.now() + (tokenData.expires_in ?? 3600) * 1000).toISOString();
    
    const { error: insertError } = await sb.from("realtyna_tokens").insert({
      principal_type: "app",
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token ?? null,
      scope: tokenData.scope ?? null,
      expires_at: expiresAt
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