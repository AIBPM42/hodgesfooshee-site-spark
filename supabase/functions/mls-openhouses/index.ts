import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { getRealtynaToken } from "../_shared/realtyna-auth.ts";
import { getRealtynaBaseUrl, getRealtynaHeaders, fetchWithRetry } from "../_shared/realtyna-client.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const rid = crypto.randomUUID();
  console.log(`[${rid}] MLS Open Houses Search started`);

  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const token = await getRealtynaToken();
    const headers = getRealtynaHeaders(token);
    const RESO_BASE = getRealtynaBaseUrl();

    const filters: string[] = [];
    
    // Accept both 'start'/'end' and 'fromDate'/'toDate' for flexibility
    const fromDate = searchParams.get("start") || searchParams.get("fromDate") || new Date().toISOString().split("T")[0];
    const toDate = searchParams.get("end") || searchParams.get("toDate");
    const city = searchParams.get("city");

    filters.push(`OpenHouseDate ge ${fromDate}`);
    if (toDate) filters.push(`OpenHouseDate le ${toDate}`);
    if (city) filters.push(`contains(City,'${city}')`);

    const filterStr = filters.join(" and ");
    const top = searchParams.get("limit") || searchParams.get("$top") || "50";

    const queryParams = new URLSearchParams({
      "$filter": filterStr,
      "$top": top,
      "$orderby": "OpenHouseDate,OpenHouseStartTime"
    });

    const apiUrl = `${RESO_BASE}/OpenHouse?${queryParams}`;
    console.log(`[${rid}] Fetching: ${apiUrl}`);

    const response = await fetchWithRetry(apiUrl, { headers }, 2);

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
    console.log(`[${rid}] Success: ${data.value?.length || 0} open houses`);

    return new Response(JSON.stringify({
      openHouses: data.value || [],
      total: data["@odata.count"] || data.value?.length || 0,
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
