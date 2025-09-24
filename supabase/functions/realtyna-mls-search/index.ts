import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!);

  const qp = (k: string) => url.searchParams.get(k);
  const q = qp("q") || "";
  const min = parseInt(qp("min_price") || "0");
  const max = parseInt(qp("max_price") || "999999999");
  const beds = parseInt(qp("beds") || "0");
  const baths = parseFloat(qp("baths") || "0");
  const county = qp("county");
  const city = qp("city");
  const type = qp("type");
  const page = Math.max(1, parseInt(qp("page") || "1"));
  const pageSize = Math.min(50, Math.max(1, parseInt(qp("page_size") || "12")));

  let query = sb
    .from("mls_listings")
    .select("id, mls_id, status, price, property_type, beds, baths, sqft, address, city, county, state, zip, photos, updated_at", { count: "exact" })
    .gte("price", min)
    .lte("price", max)
    .in("status", ["Active","ComingSoon"])
    .order("updated_at", { ascending: false });

  // Make search much more forgiving - only filter if values are provided
  if (beds > 0) query = query.gte("beds", beds);
  if (baths > 0) query = query.gte("baths", baths);
  
  if (county) query = query.ilike("county", `%${county}%`);
  if (city) query = query.ilike("city", `%${city}%`);

  // Enhanced property type matching
  if (type) {
    // Map common property type synonyms to actual database values
    const typeMapping: Record<string, string[]> = {
      "Residential": ["house", "residential", "single family", "single-family", "sfh"],
      "Condo": ["condo", "condominium", "condos"],
      "Townhouse": ["townhouse", "townhome", "townhomes"],
      "Land": ["land", "lot", "vacant"],
      "Multi-Family": ["multifamily", "multi-family", "duplex", "apartment"]
    };
    
    let typeFilter = type;
    // Find if the input type matches any of our synonyms
    for (const [dbType, synonyms] of Object.entries(typeMapping)) {
      if (synonyms.some(synonym => synonym.toLowerCase() === type.toLowerCase())) {
        typeFilter = dbType;
        break;
      }
    }
    
    query = query.ilike("property_type", `%${typeFilter}%`);
  }

  if (q) {
    // Enhanced free-text search with property type synonyms
    const searchTerms = [
      `city.ilike.%${q}%`,
      `county.ilike.%${q}%`,
      `property_type.ilike.%${q}%`,
      `address.ilike.%${q}%`
    ];
    
    // Add property type synonym searches for common terms
    if (q.toLowerCase().includes('house') || q.toLowerCase().includes('residential')) {
      searchTerms.push(`property_type.ilike.%Residential%`);
    }
    if (q.toLowerCase().includes('condo')) {
      searchTerms.push(`property_type.ilike.%Condo%`);
    }
    
    query = query.or(searchTerms.join(','));
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  console.log("🔍 Database Query Parameters:", {
    min_price: min,
    max_price: max,
    beds,
    baths,
    county,
    city,
    type,
    free_search: q,
    page,
    pageSize
  });

  const { data, error, count } = await query.range(from, to);
  
  console.log("📊 Query Results:", {
    found: data?.length || 0,
    total: count,
    error: error?.message,
    sample: data?.[0] || null
  });

  if (error) {
    console.error("❌ Database Error:", error);
    return new Response(error.message, { status: 400, headers: corsHeaders });
  }

  return new Response(JSON.stringify({ items: data, page, pageSize, count }), { 
    headers: { 
      "content-type": "application/json",
      ...corsHeaders
    } 
  });
});