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

  const rid = crypto.randomUUID();
  
  try {
    console.log(`[${rid}] Starting Client Credentials auth flow...`);
    
    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!, 
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const client_id = Deno.env.get("REALTYNA_CLIENT_ID");
    const client_secret = Deno.env.get("REALTYNA_CLIENT_SECRET");
    
    if (!client_id || !client_secret) {
      console.error(`[${rid}] Missing client credentials`);
      return new Response(JSON.stringify({
        error: "Missing client credentials in environment"
      }), { 
        status: 500, 
        headers: { ...corsHeaders, 'content-type': 'application/json' }
      });
    }

    console.log(`[${rid}] Using client_id: ${client_id.substring(0, 8)}...`);
    
    // Client Credentials flow per Realtyna docs
    const authUrl = "https://api.realtyfeed.com/v1/auth/token";
    
    const authRes = await fetch(authUrl, {
      method: "POST",
      headers: { 
        "Content-Type": "application/x-www-form-urlencoded", 
        "Accept": "application/json" 
      },
      body: new URLSearchParams({ 
        client_id, 
        client_secret 
      })
    });

    if (!authRes.ok) {
      const errorText = await authRes.text();
      console.error(`[${rid}] Auth failed ${authRes.status}: ${errorText}`);
      
      return new Response(JSON.stringify({
        error: `Authentication failed: ${authRes.status}`,
        details: errorText,
        message: "Verify your Realtyna client credentials and account status"
      }), { 
        status: authRes.status, 
        headers: { ...corsHeaders, 'content-type': 'application/json' }
      });
    }

    const tokenData = await authRes.json();
    console.log(`[${rid}] Token received, expires in: ${tokenData.expires_in} seconds`);
    
    const expires_at = new Date(Date.now() + (tokenData.expires_in || 3600) * 1000).toISOString();

    // Clear old tokens first
    await sb.from("realtyna_tokens")
      .delete()
      .eq("principal_type", "app");

    // Store new token
    const { error: insertError } = await sb.from("realtyna_tokens").insert({
      principal_type: "app",
      access_token: tokenData.access_token,
      token_type: tokenData.token_type || "Bearer",
      scope: "client_credentials", // informational
      expires_at
    });

    if (insertError) {
      console.error(`[${rid}] Failed to store token:`, insertError);
      return new Response(JSON.stringify({
        error: "Failed to store token",
        details: insertError.message
      }), { 
        status: 500, 
        headers: { ...corsHeaders, 'content-type': 'application/json' }
      });
    }

    console.log(`[${rid}] Token stored successfully`);
    
    return new Response(JSON.stringify({ 
      success: true, 
      expires_at,
      token_type: tokenData.token_type || "Bearer",
      message: "Successfully authenticated with Realtyna using Client Credentials flow"
    }), { 
      headers: { ...corsHeaders, 'content-type': 'application/json' }
    });

  } catch (error) {
    console.error(`[${rid}] Unexpected error:`, error);
    return new Response(JSON.stringify({
      error: "Unexpected error during authentication",
      details: error instanceof Error ? error.message : 'Unknown error'
    }), { 
      status: 500, 
      headers: { ...corsHeaders, 'content-type': 'application/json' }
    });
  }
});