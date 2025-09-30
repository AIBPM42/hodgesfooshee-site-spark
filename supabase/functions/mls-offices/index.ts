import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { getRealtynaToken, getRealtynaHeaders } from "../_shared/realtyna-auth.ts";

const RESO_BASE = "https://api.realtyfeed.com/reso/odata";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const rid = crypto.randomUUID();
  console.log(`[${rid}] MLS Offices Search started`);

  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const token = await getRealtynaToken();
    const headers = getRealtynaHeaders(token);

    const filters: string[] = [];
    
    const name = searchParams.get("name");
    const city = searchParams.get("city");
    const status = searchParams.get("status") || "Active";

    if (name) filters.push(`contains(OfficeName,'${name}')`);
    if (city) filters.push(`OfficeCity eq '${city}'`);
    filters.push(`OfficeStatus eq '${status}'`);

    const filterStr = filters.join(" and ");
    const top = searchParams.get("$top") || "50";
    const skip = searchParams.get("$skip") || "0";

    const queryParams = new URLSearchParams({
      "$filter": filterStr,
      "$top": top,
      "$skip": skip,
      "$orderby": "OfficeName"
    });

    const apiUrl = `${RESO_BASE}/Office?${queryParams}`;
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
    console.log(`[${rid}] Success: ${data.value?.length || 0} offices`);

    return new Response(JSON.stringify({
      offices: data.value || [],
      total: data["@odata.count"] || data.value?.length || 0,
      nextLink: data["@odata.nextLink"],
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
