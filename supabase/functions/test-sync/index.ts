import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from '../_shared/cors.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log("🔄 Starting test sync process...");
    
    // Step 1: Generate fresh OAuth token
    console.log("🔑 Generating fresh OAuth token...");
    const { data: tokenData, error: tokenError } = await supabase.functions.invoke('manage-oauth-tokens', {
      body: {}
    });
    
    if (tokenError) {
      console.error("❌ Token generation failed:", tokenError);
      throw new Error(`Token generation failed: ${tokenError.message}`);
    }
    
    console.log("✅ Fresh token generated:", {
      access_token: tokenData?.access_token ? `${tokenData.access_token.substring(0, 20)}...` : 'none',
      expires_at: tokenData?.expires_at
    });
    
    // Step 2: Check token status in database
    const { data: storedToken } = await supabase
      .from('oauth_tokens')
      .select('expires_at, scope, token_type')
      .eq('provider', 'realtyna')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
      
    console.log("💾 Stored token:", storedToken);
    
    // Step 3: Run sync_realtyna function
    console.log("🔄 Running sync_realtyna function...");
    const { data: syncData, error: syncError } = await supabase.functions.invoke('sync_realtyna', {
      body: {}
    });
    
    if (syncError) {
      console.error("❌ Sync failed:", syncError);
      throw new Error(`Sync failed: ${syncError.message}`);
    }
    
    console.log("✅ Sync completed:", syncData);
    
    // Step 4: Check results in database
    const { data: listingCount } = await supabase
      .from('mls_listings')
      .select('id', { count: 'exact', head: true });
      
    const { data: sampleListings } = await supabase
      .from('mls_listings')
      .select('listing_key, list_price, city, standard_status')
      .limit(5);
    
    console.log(`📊 Total listings in database: ${listingCount}`);
    console.log("📋 Sample listings:", sampleListings);
    
    const results = {
      success: true,
      token_generated: !!tokenData?.access_token,
      token_expires_at: tokenData?.expires_at,
      sync_response: syncData,
      database_count: listingCount,
      sample_listings: sampleListings,
      timestamp: new Date().toISOString()
    };
    
    return new Response(JSON.stringify(results, null, 2), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error("💥 Test sync failed:", error);
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