import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { corsHeaders } from "../_shared/cors.ts";
import { aiEnv, validateAIKeys } from "../_shared/aiClients.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { slug } = await req.json();
    
    if (!slug) {
      return new Response(
        JSON.stringify({ ok: false, where: 'refresh_ai_county_insights', code: 'MISSING_SLUG', msg: 'County slug is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const keyCheck = validateAIKeys();
    if (!keyCheck.valid) {
      return new Response(
        JSON.stringify({ 
          ok: false, 
          where: 'refresh_ai_county_insights', 
          code: 'MISSING_API_KEYS', 
          msg: `Missing API keys: ${keyCheck.missing.join(', ')}` 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: stats } = await supabase
      .from('county_stats')
      .select('*')
      .eq('county_slug', slug)
      .single();

    if (!stats) {
      return new Response(
        JSON.stringify({ ok: false, where: 'refresh_ai_county_insights', code: 'NOT_FOUND', msg: `County ${slug} not found` }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[refresh_ai_county_insights] Generating insights for ${stats.county_name}`);

    // Placeholder AI orchestration - will be implemented with real APIs
    const mockSynthesis = {
      summary: `AI-generated market summary for ${stats.county_name} will be here.`,
      buyerTips: ["Placeholder tip 1", "Placeholder tip 2"],
      sellerPlaybook: ["Placeholder strategy 1", "Placeholder strategy 2"],
      agentTakeaways: ["Placeholder takeaway 1", "Placeholder takeaway 2"],
      faq: [
        { q: "Sample question?", a: "Sample answer." }
      ],
      disclaimers: ["This is placeholder AI content."],
      hotCities: [{ city: "Sample City", pct: 5.0 }],
      priceCuts: [],
      affordability: { value: 1.0, trend: "flat", note: "Placeholder" },
      rentVsBuy: { rentIdx: 1.0, buyIdx: 1.0, note: "Placeholder" },
      migration: { inboundTop: [], outboundTop: [] }
    };

    const { error: upsertError } = await supabase
      .from('ai_county_insights')
      .upsert({
        county_slug: slug,
        summary: mockSynthesis.summary,
        buyer_tips: mockSynthesis.buyerTips,
        seller_playbook: mockSynthesis.sellerPlaybook,
        agent_takeaways: mockSynthesis.agentTakeaways,
        faq: mockSynthesis.faq,
        citations: [
          { title: "Placeholder Source", url: "https://example.com" }
        ],
        disclaimers: mockSynthesis.disclaimers,
        hot_cities_wow: mockSynthesis.hotCities,
        biggest_price_cuts: mockSynthesis.priceCuts,
        affordability: mockSynthesis.affordability,
        rent_vs_buy: mockSynthesis.rentVsBuy,
        migration_flow: mockSynthesis.migration,
        provider_meta: {
          note: "Placeholder - Perplexity, Manus, and OpenAI integration pending"
        },
        generated_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      });

    if (upsertError) {
      console.error('[refresh_ai_county_insights] Upsert error:', upsertError);
      return new Response(
        JSON.stringify({ ok: false, where: 'refresh_ai_county_insights', code: 'UPSERT_FAILED', msg: upsertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        ok: true, 
        slug, 
        generated: true, 
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[refresh_ai_county_insights] Error:', error);
    return new Response(
      JSON.stringify({ ok: false, where: 'refresh_ai_county_insights', code: 'INTERNAL_ERROR', msg: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
