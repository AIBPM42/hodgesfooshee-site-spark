import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { getRealtynaToken, getRealtynaHeaders } from "../_shared/realtyna-auth.ts";

const RESO_BASE = "https://api.realtyfeed.com/reso/odata";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const rid = crypto.randomUUID();
  console.log(`[${rid}] MLS Media Search started`);

  try {
    const url = new URL(req.url);
    const listingKey = url.searchParams.get("listingKey");

    if (!listingKey) {
      return new Response(JSON.stringify({ error: "listingKey required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const token = await getRealtynaToken();
    const headers = getRealtynaHeaders(token);

    const queryParams = new URLSearchParams({
      "$filter": `ResourceRecordKey eq '${listingKey}'`,
      "$orderby": "Order"
    });

    const apiUrl = `${RESO_BASE}/Media?${queryParams}`;
    console.log(`[${rid}] Fetching: ${apiUrl}`);

    const response = await fetch(apiUrl, { headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[${rid}] API error ${response.status}:`, errorText);
      return new Response(JSON.stringify({
        error: `Realtyna API error: ${response.status}`,
        details: errorText,
        source: "realtyna"
      }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const data = await response.json();
    console.log(`[${rid}] Success: ${data.value?.length || 0} media items`);

    return new Response(JSON.stringify({
      media: data.value || [],
      source: "realtyna"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error(`[${rid}] Error:`, error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : "Unknown error",
      source: "realtyna"
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
