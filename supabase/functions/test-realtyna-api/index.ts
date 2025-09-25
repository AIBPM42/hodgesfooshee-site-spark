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
    console.log(`[${rid}] Testing Realtyna API connection...`);
    
    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!, 
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get active token
    const { data: token, error: tokenError } = await sb
      .from("oauth_tokens")
      .select("*")
      .eq("provider", "realtyna")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
      
    if (tokenError) {
      console.error(`[${rid}] Token error:`, tokenError);
      return new Response(JSON.stringify({ error: "Token fetch error", details: tokenError }), {
        status: 500,
        headers: { ...corsHeaders, 'content-type': 'application/json' }
      });
    }
      
    if (!token) {
      console.error(`[${rid}] No token found`);
      return new Response(JSON.stringify({ error: "No token available" }), {
        status: 500,
        headers: { ...corsHeaders, 'content-type': 'application/json' }
      });
    }

    console.log(`[${rid}] Token found, testing API call...`);
    
    // Simple API test - use same endpoint as working sync function
    const testUrl = "https://api.realtyfeed.com/api/v1/smart/listings?limit=1&status=Active";
    
    const headers = {
      'Authorization': `Bearer ${token.access_token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    console.log(`[${rid}] Making test request to: ${testUrl}`);
    console.log(`[${rid}] Token preview: ${token.access_token.substring(0, 20)}...`);

    const res = await fetch(testUrl, { headers });
    
    console.log(`[${rid}] Response status: ${res.status}`);
    console.log(`[${rid}] Response headers:`, Object.fromEntries(res.headers.entries()));

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[${rid}] API error: ${res.status} - ${errorText}`);
      
      return new Response(JSON.stringify({
        error: `API test failed: ${res.status}`,
        details: errorText,
        token_preview: token.access_token.substring(0, 20) + "...",
        request_url: testUrl
      }), {
        status: res.status,
        headers: { ...corsHeaders, 'content-type': 'application/json' }
      });
    }

    const data = await res.json();
    console.log(`[${rid}] API test successful`);

    return new Response(JSON.stringify({
      success: true,
      message: "API connection test successful",
      data_preview: data,
      token_expires: token.expires_at
    }), {
      headers: { ...corsHeaders, 'content-type': 'application/json' }
    });

  } catch (error) {
    console.error(`[${rid}] Test failed:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({
      error: "Test function failed",
      details: errorMessage
    }), {
      status: 500,
      headers: { ...corsHeaders, 'content-type': 'application/json' }
    });
  }
});