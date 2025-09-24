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
    .gte("beds", beds)
    .gte("baths", baths)
    .in("status", ["Active","ComingSoon"])
    .order("updated_at", { ascending: false });

  if (county) query = query.eq("county", county);
  if (city) query = query.eq("city", city);
  if (type) query = query.eq("property_type", type);

  if (q) {
    query = query.or(`city.ilike.%${q}%,county.ilike.%${q}%,property_type.ilike.%${q}%,address.ilike.%${q}%`);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await query.range(from, to);
  if (error) return new Response(error.message, { status: 400 });

  return new Response(JSON.stringify({ items: data, page, pageSize, count }), { 
    headers: { 
      "content-type": "application/json",
      ...corsHeaders
    } 
  });
});