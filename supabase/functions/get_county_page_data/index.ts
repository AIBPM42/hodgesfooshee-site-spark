import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { corsHeaders } from "../_shared/cors.ts";

const DAVIDSON_DEMO_DATA = {
  "meta": {
    "slug": "davidson-county",
    "name": "Davidson County",
    "state": "Tennessee",
    "heroImage": "https://images.unsplash.com/photo-1565026527164-d4f5a3b6b6b9?q=80&w=1600&fit=crop",
    "lastUpdatedISO": "2025-09-28T14:05:00Z",
    "mode": "demo"
  },
  "kpis": {
    "medianPrice": 425000,
    "priceChangeYoY": 3.9,
    "daysOnMarket": 21,
    "newListings7d": 342,
    "priceCuts7d": 156,
    "inventoryActive": 9054,
    "monthsOfSupply": 2.3,
    "avgPpsf": 289
  },
  "trends": {
    "newVsSold8w": [
      { "week": "2025-W34", "new": 292, "sold": 268 },
      { "week": "2025-W35", "new": 318, "sold": 281 },
      { "week": "2025-W36", "new": 276, "sold": 261 },
      { "week": "2025-W37", "new": 341, "sold": 298 },
      { "week": "2025-W38", "new": 322, "sold": 304 },
      { "week": "2025-W39", "new": 295, "sold": 279 },
      { "week": "2025-W40", "new": 337, "sold": 308 },
      { "week": "2025-W41", "new": 349, "sold": 317 }
    ],
    "dom30d": [
      { "date": "2025-09-08", "days": 26 },
      { "date": "2025-09-12", "days": 28 },
      { "date": "2025-09-16", "days": 27 },
      { "date": "2025-09-20", "days": 24 },
      { "date": "2025-09-24", "days": 22 },
      { "date": "2025-09-28", "days": 21 },
      { "date": "2025-10-01", "days": 21 }
    ],
    "pricePerSqftByCity": [
      { "city": "Nashville", "ppsf": 321 },
      { "city": "Belle Meade", "ppsf": 498 },
      { "city": "Oak Hill", "ppsf": 402 },
      { "city": "Goodlettsville", "ppsf": 232 },
      { "city": "Madison", "ppsf": 205 },
      { "city": "Antioch", "ppsf": 198 }
    ],
    "inventoryByPriceBand": [
      { "band": "<$300k", "active": 1780 },
      { "band": "$300k-$499k", "active": 3240 },
      { "band": "$500k-$799k", "active": 2560 },
      { "band": "$800k-$1.2m", "active": 980 },
      { "band": "$1.2m+", "active": 494 }
    ]
  },
  "insights": {
    "hotCitiesWow": [
      { "city": "Mt Juliet", "pct": 12.4 },
      { "city": "Spring Hill", "pct": 8.7 },
      { "city": "Gallatin", "pct": 6.3 },
      { "city": "Lebanon", "pct": 5.2 },
      { "city": "Hendersonville", "pct": 3.8 }
    ],
    "biggestPriceCuts": [
      { "address": "1234 Oak Lane", "city": "Brentwood", "amount": 85000 },
      { "address": "5678 Maple Dr", "city": "Franklin", "amount": 72000 },
      { "address": "9012 Pine St", "city": "Nashville", "amount": 65000 },
      { "address": "3456 Cedar Ave", "city": "Franklin", "amount": 58000 },
      { "address": "7890 Birch Ct", "city": "Brentwood", "amount": 52000 }
    ],
    "affordabilityIndex": {
      "value": 0.92,
      "trend": "down",
      "note": "Ownership affordability slipped versus last quarter due to rate volatility; builder incentives offset in some submarkets."
    },
    "rentVsBuy": {
      "rentIdx": 0.88,
      "buyIdx": 1.05,
      "note": "Buying becomes favorable at ≥ 5-year horizon in Antioch/Madison; renting remains cheaper inside urban core under 3 years."
    },
    "migrationFlow": {
      "inboundTop": ["Chicago, IL", "Los Angeles, CA", "Atlanta, GA", "New York, NY"],
      "outboundTop": ["Memphis, TN", "Knoxville, TN"]
    }
  },
  "ai": {
    "summary": "Inventory in Davidson County is rebuilding but remains below long-term norms, keeping prices resilient. New listings outpace sales 6 of the past 8 weeks, and DOM compressed to ~21 days, signaling competitive but rational conditions. Sub-$500k inventory is the velocity band; luxury above $1.2m moves selectively, often when priced with recent comp precision.",
    "buyerTips": [
      "Get rate buydown quotes from 2 lenders; many builders offer 2-1 or 3-2-1 incentives.",
      "Target homes with 21+ days on market for price flexibility; aim for 2–3% seller credits.",
      "In the $350k–$500k range, pre-underwrite to win without overbidding; escalation clauses still work in Green Hills & 12 South."
    ],
    "sellerPlaybook": [
      "Price to last 30-day comps, not 90-day; velocity bands shifted.",
      "Front-load photography + 3D + pre-inspection; listings with media kits cut DOM by ~18%.",
      "If no offers by Day 10, execute a single decisive price move (1.5–2.0%), not drips."
    ],
    "agentTakeaways": [
      "Lead with payment math: buydowns beat small price cuts at current rates.",
      "Neighborhood micro-trends matter; PPSF diverges 25–40% across sub-markets.",
      "Work your 'stale at 21+ DOM' list; highest conversion sits there."
    ],
    "faq": [
      { "q": "Is now a good time to buy in Davidson County?", "a": "If your horizon is 5+ years, yes—inventory is improving and sellers are offering credits. Under 3 years, weigh rent vs. buy carefully in the urban core." },
      { "q": "What price bands move fastest?", "a": "Sub-$500k is the velocity band county-wide. $800k–$1.2m is healthy in Green Hills/Belle Meade with precise pricing." },
      { "q": "Are there still multiple offers?", "a": "Yes, selectively—especially well-priced homes in turnkey condition. Pre-underwriting and flexible close dates help." }
    ],
    "citations": [
      { "title": "Metro Nashville Housing Report (latest)", "url": "https://example.org/metro-nashville-housing" },
      { "title": "BLS Nashville MSA Employment", "url": "https://www.bls.gov/regions/southeast/nashville.htm" },
      { "title": "Freddie Mac PMMS Rates", "url": "https://www.freddiemac.com/pmms" }
    ],
    "disclaimers": [
      "Figures above are illustrative demo values and not investment advice.",
      "Always verify local HOA, zoning, floodplain, and school zoning changes."
    ]
  },
  "seo": {
    "title": "Davidson County Real Estate Market • Trends, Prices & Insights (Updated)",
    "description": "Live market stats for Davidson County, TN: median price $425k, DOM 21, active inventory 9,054. See neighborhood PPSF, price bands, migration, and agent playbooks.",
    "canonical": "https://www.hodgesfooshee.com/market/davidson-county",
    "speakable": [
      "Median home price in Davidson County is four hundred twenty-five thousand dollars.",
      "Average days on market is about twenty-one days."
    ],
    "breadcrumb": [
      { "name": "Home", "url": "/" },
      { "name": "Market Intelligence", "url": "/market" },
      { "name": "Davidson County", "url": "/market/davidson-county" }
    ]
  },
  "ctas": {
    "viewListingsUrl": "/search?county=davidson-county",
    "scheduleConsultUrl": "/contact?reason=market-consult&area=davidson",
    "downloadReportUrl": "/reports/davidson-county.pdf"
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { slug } = await req.json();
    
    if (!slug) {
      return new Response(
        JSON.stringify({ ok: false, where: 'get_county_page_data', code: 'MISSING_SLUG', msg: 'County slug is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
      if (slug === 'davidson-county') {
        return new Response(
          JSON.stringify({ ok: true, data: DAVIDSON_DEMO_DATA }),
          { 
            status: 200, 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json',
              'Cache-Control': 'public, max-age=600, s-maxage=900'
            } 
          }
        );
      }
      return new Response(
        JSON.stringify({ ok: false, where: 'get_county_page_data', code: 'NOT_FOUND', msg: `County ${slug} not found` }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const [priceBands, cityStats, trends, aiInsights] = await Promise.all([
      supabase.from('county_price_bands').select('*').eq('county_slug', slug),
      supabase.from('city_stats').select('*').eq('county_slug', slug).order('avg_ppsf', { ascending: false }).limit(6),
      supabase.from('county_trends').select('*').eq('county_slug', slug),
      supabase.from('ai_county_insights').select('*').eq('county_slug', slug).single()
    ]);

    const pageData = {
      meta: {
        slug: stats.county_slug,
        name: stats.county_name,
        state: stats.state,
        heroImage: stats.hero_image_url,
        lastUpdatedISO: stats.updated_at,
        mode: 'live'
      },
      kpis: {
        medianPrice: stats.median_price || 0,
        priceChangeYoY: stats.price_change_yoy || 0,
        daysOnMarket: stats.days_on_market || 0,
        newListings7d: stats.new_listings_7d || 0,
        priceCuts7d: stats.price_cuts_7d || 0,
        inventoryActive: stats.inventory_active || 0,
        monthsOfSupply: stats.months_of_supply || 0,
        avgPpsf: stats.avg_ppsf || 0
      },
      trends: {
        newVsSold8w: trends.data?.filter(t => t.trend_type === 'new_vs_sold').map(t => t.value) || [],
        dom30d: trends.data?.filter(t => t.trend_type === 'dom').map(t => t.value) || [],
        pricePerSqftByCity: cityStats.data?.map(c => ({ city: c.city, ppsf: c.avg_ppsf })) || [],
        inventoryByPriceBand: priceBands.data?.map(p => ({ band: p.band, active: p.active_count })) || []
      },
      insights: aiInsights.data ? {
        hotCitiesWow: aiInsights.data.hot_cities_wow || [],
        biggestPriceCuts: aiInsights.data.biggest_price_cuts || [],
        affordabilityIndex: aiInsights.data.affordability || { value: 0, trend: 'flat', note: '' },
        rentVsBuy: aiInsights.data.rent_vs_buy || { rentIdx: 0, buyIdx: 0, note: '' },
        migrationFlow: aiInsights.data.migration_flow || { inboundTop: [], outboundTop: [] }
      } : {
        hotCitiesWow: [],
        biggestPriceCuts: [],
        affordabilityIndex: { value: 0, trend: 'flat', note: '' },
        rentVsBuy: { rentIdx: 0, buyIdx: 0, note: '' },
        migrationFlow: { inboundTop: [], outboundTop: [] }
      },
      ai: aiInsights.data ? {
        summary: aiInsights.data.summary || '',
        buyerTips: aiInsights.data.buyer_tips || [],
        sellerPlaybook: aiInsights.data.seller_playbook || [],
        agentTakeaways: aiInsights.data.agent_takeaways || [],
        faq: aiInsights.data.faq || [],
        citations: aiInsights.data.citations || [],
        disclaimers: aiInsights.data.disclaimers || []
      } : {
        summary: '',
        buyerTips: [],
        sellerPlaybook: [],
        agentTakeaways: [],
        faq: [],
        citations: [],
        disclaimers: []
      },
      seo: {
        title: `${stats.county_name} Real Estate Market • Trends, Prices & Insights`,
        description: `Live market stats for ${stats.county_name}, TN: median price $${stats.median_price?.toLocaleString()}, DOM ${stats.days_on_market}, active inventory ${stats.inventory_active?.toLocaleString()}.`,
        canonical: `https://www.hodgesfooshee.com/market/${slug}`,
        speakable: [
          `Median home price in ${stats.county_name} is ${stats.median_price?.toLocaleString()} dollars.`,
          `Average days on market is about ${stats.days_on_market} days.`
        ],
        breadcrumb: [
          { name: "Home", url: "/" },
          { name: "Market Intelligence", url: "/market" },
          { name: stats.county_name, url: `/market/${slug}` }
        ]
      },
      ctas: {
        viewListingsUrl: `/search?county=${slug}`,
        scheduleConsultUrl: `/contact?reason=market-consult&area=${slug}`,
        downloadReportUrl: `/reports/${slug}.pdf`
      }
    };

    return new Response(
      JSON.stringify({ ok: true, data: pageData }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=600, s-maxage=900'
        } 
      }
    );

  } catch (error) {
    console.error('[get_county_page_data] Error:', error);
    return new Response(
      JSON.stringify({ ok: false, where: 'get_county_page_data', code: 'INTERNAL_ERROR', msg: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
