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

    console.log(`[${rid}] Token found, testing multiple API endpoints...`);
    
    // Test multiple endpoints to determine access level
    const testEndpoints = [
      {
        name: "Regular API - Properties", 
        url: "https://api.realtyfeed.com/v1/properties?limit=1"
      },
      {
        name: "RESO OData - Property", 
        url: "https://api.realtyfeed.com/reso/odata/Property?$filter=StandardStatus eq 'Active'&$top=1"
      },
      {
        name: "RESO OData - Members", 
        url: "https://api.realtyfeed.com/reso/odata/Member?$top=1"
      },
      {
        name: "Regular API - Search", 
        url: "https://api.realtyfeed.com/v1/search?query=Nashville&limit=1"
      }
    ];
    
    const headers = {
      'Authorization': `Bearer ${token.access_token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    console.log(`[${rid}] Token preview: ${token.access_token.substring(0, 20)}...`);
    console.log(`[${rid}] Token scope: ${token.scope}`);

    const results = [];

    for (const endpoint of testEndpoints) {
      try {
        console.log(`[${rid}] Testing ${endpoint.name}: ${endpoint.url}`);
        
        const res = await fetch(endpoint.url, { headers });
        
        console.log(`[${rid}] ${endpoint.name} - Status: ${res.status}`);
        
        if (res.ok) {
          const data = await res.json();
          results.push({
            endpoint: endpoint.name,
            url: endpoint.url,
            status: res.status,
            success: true,
            data_preview: JSON.stringify(data).substring(0, 200) + "...",
            message: "Success"
          });
          console.log(`[${rid}] ${endpoint.name} - SUCCESS`);
          break; // If one works, we know the token is valid
        } else {
          const errorText = await res.text();
          results.push({
            endpoint: endpoint.name,
            url: endpoint.url,
            status: res.status,
            success: false,
            error: errorText.substring(0, 200) + "...",
            message: `Failed with ${res.status}`
          });
          console.log(`[${rid}] ${endpoint.name} - FAILED: ${res.status}`);
        }
      } catch (fetchError) {
        results.push({
          endpoint: endpoint.name,
          url: endpoint.url,
          status: 0,
          success: false,
          error: fetchError instanceof Error ? fetchError.message : 'Network error',
          message: "Network error"
        });
        console.log(`[${rid}] ${endpoint.name} - NETWORK ERROR:`, fetchError);
      }
    }

    const hasSuccess = results.some(r => r.success);
    
    return new Response(JSON.stringify({
      success: hasSuccess,
      message: hasSuccess ? "At least one API endpoint is accessible" : "All API endpoints failed - check account permissions",
      token_scope: token.scope,
      token_expires: token.expires_at,
      results: results,
      recommendation: hasSuccess 
        ? "Token works with some endpoints. Check RESO permissions with Realtyna support."
        : "Token authentication failed on all endpoints. Verify account status with Realtyna."
    }), {
      status: hasSuccess ? 200 : 403,
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