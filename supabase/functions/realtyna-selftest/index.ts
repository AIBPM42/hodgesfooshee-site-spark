import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const rid = crypto.randomUUID();
  
  try {
    console.log(`[${rid}] Starting comprehensive Realtyna self-test...`);
    
    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!, 
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const testResults: any = {
      timestamp: new Date().toISOString(),
      request_id: rid,
      environment: {
        client_id_present: !!Deno.env.get("realtyna_client_id"),
        client_secret_present: !!Deno.env.get("realtyna_client_secret"),
        api_key_present: !!Deno.env.get("realtyna_api_key")
      },
      auth_test: {},
      api_endpoints: [],
      database_state: {},
      recommendations: []
    };

    // 1. Test Client Credentials auth
    try {
      const authRes = await fetch("https://api.realtyfeed.com/v1/auth/token", {
        method: "POST",
        headers: { 
          "Content-Type": "application/x-www-form-urlencoded", 
          "Accept": "application/json" 
        },
        body: new URLSearchParams({ 
          client_id: Deno.env.get("realtyna_client_id")!,
          client_secret: Deno.env.get("realtyna_client_secret")!
        })
      });

      if (authRes.ok) {
        const authData = await authRes.json();
        testResults.auth_test = {
          success: true,
          token_type: authData.token_type,
          expires_in: authData.expires_in,
          message: "Client Credentials auth successful"
        };
      } else {
        const errorText = await authRes.text();
        testResults.auth_test = {
          success: false,
          status: authRes.status,
          error: errorText,
          message: "Client Credentials auth failed"
        };
      }
    } catch (authError) {
      testResults.auth_test = {
        success: false,
        error: authError instanceof Error ? authError.message : 'Network error',
        message: "Auth request failed"
      };
    }

    // 2. Test current stored token
    const { data: currentToken } = await sb
      .from("realtyna_tokens")
      .select("*")
      .eq("principal_type", "app")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    testResults.database_state.current_token = currentToken ? {
      exists: true,
      expires_at: currentToken.expires_at,
      is_expired: new Date(currentToken.expires_at) < new Date(),
      scope: currentToken.scope,
      created_at: currentToken.created_at
    } : { exists: false };

    // 3. Test API endpoints if we have a valid token
    if (currentToken && new Date(currentToken.expires_at) > new Date()) {
      const endpoints = [
        {
          name: "RESO OData Property",
          url: "https://api.realtyfeed.com/reso/odata/Property?$top=1",
          expected: "OData property data"
        },
        {
          name: "RESO OData Member", 
          url: "https://api.realtyfeed.com/reso/odata/Member?$top=1",
          expected: "OData member data"
        },
        {
          name: "RESO OData Media",
          url: "https://api.realtyfeed.com/reso/odata/Media?$top=1", 
          expected: "OData media data"
        }
      ];

      const headers: Record<string, string> = {
        'Authorization': `Bearer ${currentToken.access_token}`,
        'Accept': 'application/json'
      };

      // Add API key if available
      if (Deno.env.get("realtyna_api_key")) {
        headers['x-api-key'] = Deno.env.get("realtyna_api_key")!;
      }

      for (const endpoint of endpoints) {
        try {
          const res = await fetch(endpoint.url, { headers });
          
          if (res.ok) {
            const data = await res.json();
            testResults.api_endpoints.push({
              name: endpoint.name,
              url: endpoint.url,
              success: true,
              status: res.status,
              data_structure: {
                has_value_array: Array.isArray(data.value),
                has_odata_context: !!data['@odata.context'],
                has_odata_nextlink: !!data['@odata.nextLink'],
                item_count: data.value?.length || 0
              },
              message: "Success"
            });
          } else {
            const errorText = await res.text();
            testResults.api_endpoints.push({
              name: endpoint.name,
              url: endpoint.url,
              success: false,
              status: res.status,
              error: errorText.substring(0, 200),
              message: `Failed with ${res.status}`
            });
          }
        } catch (endpointError) {
          testResults.api_endpoints.push({
            name: endpoint.name,
            url: endpoint.url,
            success: false,
            error: endpointError instanceof Error ? endpointError.message : 'Network error',
            message: "Network error"
          });
        }
      }
    }

    // 4. Check ingest state for errors
    const { data: ingestState } = await sb
      .from("ingest_state")
      .select("*")
      .eq("source", "realtyna_listings")
      .maybeSingle();

    testResults.database_state.ingest_state = ingestState;

    // 5. Generate recommendations
    if (!testResults.auth_test.success) {
      testResults.recommendations.push("Client Credentials authentication failed - verify client_id and client_secret with Realtyna support");
    }

    if (!currentToken || new Date(currentToken.expires_at) < new Date()) {
      testResults.recommendations.push("No valid token stored - run Client Credentials auth to get a fresh token");
    }

    const successfulEndpoints = testResults.api_endpoints.filter((e: any) => e.success);
    if (successfulEndpoints.length === 0 && currentToken) {
      testResults.recommendations.push("No API endpoints accessible - contact Realtyna to enable RESO Output for your account");
    }

    if (ingestState?.last_error) {
      testResults.recommendations.push(`Last sync error: ${ingestState.last_error} - check error details and retry`);
    }

    testResults.summary = {
      auth_working: testResults.auth_test.success,
      token_valid: !!currentToken && new Date(currentToken.expires_at) > new Date(),
      api_accessible: successfulEndpoints.length > 0,
      overall_status: testResults.auth_test.success && successfulEndpoints.length > 0 ? "healthy" : "needs_attention"
    };

    console.log(`[${rid}] Self-test complete: ${testResults.summary.overall_status}`);

    return new Response(JSON.stringify(testResults, null, 2), {
      headers: { ...corsHeaders, 'content-type': 'application/json' }
    });

  } catch (error) {
    console.error(`[${rid}] Self-test failed:`, error);
    return new Response(JSON.stringify({
      error: "Self-test failed",
      details: error instanceof Error ? error.message : 'Unknown error',
      request_id: rid
    }), { 
      status: 500, 
      headers: { ...corsHeaders, 'content-type': 'application/json' }
    });
  }
});