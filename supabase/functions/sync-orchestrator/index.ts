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
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const results = {
      step: '',
      success: false,
      errors: [] as string[],
      data: {} as Record<string, any>
    };

    // Step 1: Refresh OAuth Token
    console.log('Step 1: Refreshing OAuth token...');
    results.step = 'token_refresh';
    
    const { data: tokenData, error: tokenError } = await supabase.functions.invoke('manage-oauth-tokens', {
      body: {}
    });
    
    if (tokenError) {
      console.error('Token refresh failed:', tokenError);
      results.errors.push(`Token refresh failed: ${tokenError.message}`);
      return new Response(JSON.stringify(results), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    results.data.token = tokenData;
    console.log('Token refreshed successfully');

    // Step 2: Run sync functions in order
    const syncFunctions = [
      'sync_members',
      'sync_offices', 
      'sync_realtyna',
      'sync_openhouses',
      'sync_postalcodes'
    ];

    for (const funcName of syncFunctions) {
      console.log(`Step 2.${syncFunctions.indexOf(funcName) + 1}: Running ${funcName}...`);
      results.step = funcName;
      
      const { data: syncData, error: syncError } = await supabase.functions.invoke(funcName, {
        body: {}
      });
      
      if (syncError) {
        console.error(`${funcName} failed:`, syncError);
        results.errors.push(`${funcName} failed: ${syncError.message}`);
        // Continue with other syncs even if one fails
      } else {
        console.log(`${funcName} completed successfully`);
        results.data[funcName] = syncData;
      }
      
      // Small delay between syncs to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Step 3: Verify data counts
    console.log('Step 3: Verifying data counts...');
    results.step = 'verification';
    
    const { data: counts, error: countError } = await supabase
      .rpc('get_sync_counts')
      .single();
    
    if (!countError && counts) {
      results.data.counts = counts;
    }

    // Final result
    results.success = results.errors.length === 0;
    results.step = 'completed';
    
    console.log('Sync orchestration completed', results);
    
    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Orchestrator error:', error);
    return new Response(JSON.stringify({
      step: 'error',
      success: false,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
      data: {}
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});