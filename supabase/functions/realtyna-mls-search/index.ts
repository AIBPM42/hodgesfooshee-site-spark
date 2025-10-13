import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const qp = (k: string) => url.searchParams.get(k);

  const params = new URLSearchParams({
    city: qp("city") || "",
    county: qp("county") || "",
    minPrice: qp("min_price") || "0",
    maxPrice: qp("max_price") || "999999999",
    beds: qp("beds") || "0",
    baths: qp("baths") || "0",
    type: qp("type") || "",
    page: qp("page") || "1",
    page_size: qp("page_size") || "12",
    q: qp("q") || ""
  });

  const response = await fetch(`https://xhqwmtzawqfffepcqxwf.supabase.co/functions/v1/mls-search?${params}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": Deno.env.get("SUPABASE_ANON_KEY")!,
      "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")!}`
    }
  });

  const result = await response.json();

  if (!response.ok) {
    console.error("❌ Supabase Function Error:", result);
    return new Response(JSON.stringify(result), {
      status: response.status,
      headers: corsHeaders
    });
  }

  console.log("✅ Supabase Function Response:", {
    count: result.count,
    sample: result.items?.[0] || null
  });

  return new Response(JSON.stringify(result), {
    headers: {
      "content-type": "application/json",
      ...corsHeaders
    }
  });
});
