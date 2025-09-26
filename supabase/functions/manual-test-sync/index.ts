import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from '../_shared/cors.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const BASE = Deno.env.get("RF_BASE")!;
const API_KEY = Deno.env.get("REALTY_API_KEY")!;
const CLIENT_ID = Deno.env.get("MLS_CLIENT_ID")!;
const CLIENT_SECRET = Deno.env.get("MLS_CLIENT_SECRET")!;
const SCOPE = "api/read";

async function getToken(): Promise<string> {
  console.log("🔑 Getting fresh token...");
  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: "client_credentials",
    scope: SCOPE,
  });

  const res = await fetch(`${BASE}/v1/auth/token`, {
    method: "POST",
    headers: {
      "x-api-key": API_KEY,
      "Accept": "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  
  console.log(`Token response status: ${res.status}`);
  if (!res.ok) {
    const errorText = await res.text();
    console.error(`Token error: ${res.status} - ${errorText}`);
    throw new Error(`token ${res.status}: ${errorText}`);
  }
  
  const json = await res.json();
  console.log("✅ Token received, storing in database...");
  
  // Store token in database
  const expiresAt = new Date(Date.now() + (3600 * 1000)); // 1 hour from now
  await supabase.from('oauth_tokens').upsert({
    provider: 'realtyna',
    access_token: json.access_token,
    token_type: 'Bearer',
    scope: SCOPE,
    expires_at: expiresAt.toISOString()
  });
  
  return json.access_token as string;
}

async function testAPICall(token: string) {
  console.log("🔍 Testing API call...");
  const headers = {
    "x-api-key": API_KEY,
    "Accept": "application/json",
    "Authorization": `Bearer ${token}`,
  };

  // Test with simple query first
  const testUrl = `${BASE}/reso/odata/Property?$top=5&$select=*&$orderby=ModificationTimestamp desc`;
  console.log("Test URL:", testUrl);
  
  const res = await fetch(testUrl, { headers });
  console.log(`API Response Status: ${res.status}`);
  
  const responseText = await res.text();
  console.log(`Response body length: ${responseText.length}`);
  
  if (!res.ok) {
    console.error("API Error:", responseText);
    return { success: false, status: res.status, error: responseText };
  }
  
  let json;
  try {
    json = JSON.parse(responseText);
  } catch (e) {
    console.error("JSON Parse Error:", e);
    return { success: false, error: "Invalid JSON response" };
  }
  
  const items = json.value ?? [];
  console.log(`Found ${items.length} items`);
  console.log("Response structure keys:", Object.keys(json));
  
  if (items.length > 0) {
    console.log("First item keys:", Object.keys(items[0]));
    console.log("Sample ListingKey:", items[0].ListingKey);
  }
  
  return { success: true, items_count: items.length, sample_data: items.slice(0, 2) };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log("🚀 Manual sync test starting...");
    
    // Step 1: Get fresh token
    const token = await getToken();
    console.log(`✅ Token obtained: ${token.substring(0, 20)}...`);
    
    // Step 2: Test API call
    const apiResult = await testAPICall(token);
    console.log("📊 API Test Result:", apiResult);
    
    // Step 3: Check database
    const { data: listingCount } = await supabase
      .from('mls_listings')
      .select('id', { count: 'exact', head: true });
    
    const { data: tokenStatus } = await supabase
      .from('oauth_tokens')
      .select('expires_at, scope')
      .eq('provider', 'realtyna')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    const results = {
      success: true,
      token_valid: true,
      token_scope: tokenStatus?.scope,
      token_expires: tokenStatus?.expires_at,
      api_test: apiResult,
      database_listings: listingCount,
      timestamp: new Date().toISOString()
    };
    
    console.log("🎉 Test completed successfully:", results);
    
    return new Response(JSON.stringify(results, null, 2), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error("💥 Manual test failed:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});