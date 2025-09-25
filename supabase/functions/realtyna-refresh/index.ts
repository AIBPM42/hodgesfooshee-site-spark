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
    
    console.log('Checking for app tokens to refresh...');
    
    const { data: tok, error: fetchError } = await sb
      .from("oauth_tokens")
      .select("*")
      .eq("provider", "realtyna")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (fetchError) {
      console.error('Error fetching token:', fetchError);
      return new Response(JSON.stringify({ error: fetchError.message }), { 
        status: 500, 
        headers: { ...corsHeaders, "content-type": "application/json" }
      });
    }
    
    if (!tok) {
      console.log('No app token found');
      return new Response("No app token found", { 
        status: 500, 
        headers: corsHeaders 
      });
    }

    const timeLeft = new Date(tok.expires_at).getTime() - Date.now();
    const minutesLeft = Math.floor(timeLeft / (60 * 1000));
    
    console.log(`Token expires in ${minutesLeft} minutes`);
    
    if (timeLeft > 5 * 60 * 1000) {
      return new Response(JSON.stringify({ 
        refreshed: false, 
        minutes_until_expiry: minutesLeft 
      }), { 
        headers: { ...corsHeaders, "content-type": "application/json" }
      });
    }

    if (!tok.refresh_token) {
      console.error('No refresh token available');
      return new Response(JSON.stringify({ 
        error: "No refresh token available",
        refreshed: false 
      }), { 
        status: 400, 
        headers: { ...corsHeaders, "content-type": "application/json" }
      });
    }

    const base = Deno.env.get("realtyna_base") || "https://api.realtyfeed.com";
    // {needs-verification} - Using same token endpoint as callback function
    const tokenEndpoint = `${base}/oauth/token`;
    
    console.log(`Refreshing token at: ${tokenEndpoint}`);
    
    const refreshResponse = await fetch(tokenEndpoint, {
      method: "POST",
      headers: { 
        "content-type": "application/x-www-form-urlencoded",
        "accept": "application/json"
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: tok.refresh_token,
        client_id: Deno.env.get("realtyna_client_id")!,
        client_secret: Deno.env.get("realtyna_client_secret")!
      })
    });
    
    if (!refreshResponse.ok) {
      const errorText = await refreshResponse.text();
      console.error('Token refresh failed:', refreshResponse.status, errorText);
      return new Response(JSON.stringify({ 
        error: `Token refresh failed: ${errorText}`,
        refreshed: false 
      }), { 
        status: 502, 
        headers: { ...corsHeaders, "content-type": "application/json" }
      });
    }
    
    const refreshData = await refreshResponse.json();
    console.log('Token refresh successful, updating database...');
    
    const expiresAt = new Date(Date.now() + (refreshData.expires_in ?? 3600) * 1000).toISOString();
    
    const { error: updateError } = await sb
      .from("oauth_tokens")
      .update({
        access_token: refreshData.access_token,
        refresh_token: refreshData.refresh_token ?? tok.refresh_token,
        scope: refreshData.scope ?? tok.scope,
        expires_at: expiresAt,
        updated_at: new Date().toISOString()
      })
      .eq("id", tok.id);
    
    if (updateError) {
      console.error('Error updating token:', updateError);
      return new Response(JSON.stringify({ 
        error: updateError.message,
        refreshed: false 
      }), { 
        status: 500, 
        headers: { ...corsHeaders, "content-type": "application/json" }
      });
    }
    
    console.log('Token refreshed and updated successfully');
    
    return new Response(JSON.stringify({ 
      refreshed: true,
      expires_at: expiresAt 
    }), { 
      headers: { ...corsHeaders, "content-type": "application/json" }
    });
    
  } catch (error) {
    console.error('Error in realtyna-refresh:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ 
      error: errorMessage,
      refreshed: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});