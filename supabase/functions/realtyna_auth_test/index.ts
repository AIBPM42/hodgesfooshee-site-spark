import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientId = Deno.env.get("MLS_CLIENT_ID");
    const clientSecret = Deno.env.get("MLS_CLIENT_SECRET");
    
    if (!clientId || !clientSecret) {
      return new Response(
        JSON.stringify({ 
          ok: false, 
          status: 500, 
          error: "Missing MLS_CLIENT_ID or MLS_CLIENT_SECRET environment variables" 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const tokenUrl = "https://api.realtyfeed.com/v1/auth/token";
    
    console.log("[realtyna_auth_test] Testing auth with token URL:", tokenUrl);

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json"
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
        scope: "api/read"
      })
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      console.error(`[realtyna_auth_test] Auth failed: ${response.status}`, responseText.substring(0, 300));
      return new Response(
        JSON.stringify({ 
          ok: false, 
          status: response.status, 
          error: responseText.substring(0, 300)
        }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const data = JSON.parse(responseText);
    const token = data.access_token;
    const tokenExcerpt = token ? `${token.substring(0, 20)}****` : 'N/A';

    console.log("[realtyna_auth_test] Auth successful, token excerpt:", tokenExcerpt);

    return new Response(
      JSON.stringify({ 
        ok: true, 
        status: 200, 
        token_excerpt: tokenExcerpt,
        expires_in: data.expires_in
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("[realtyna_auth_test] Error:", error);
    return new Response(
      JSON.stringify({ 
        ok: false, 
        status: 500, 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
