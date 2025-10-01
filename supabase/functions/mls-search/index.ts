import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { getRealtynaToken, getRealtynaHeaders } from "../_shared/realtyna-auth.ts";

const RESO_BASE = "https://api.realtyfeed.com/reso/odata";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const rid = crypto.randomUUID();
  console.log(`[${rid}] MLS Property Search started`);

  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    // Get auth token
    const token = await getRealtynaToken();
    const headers = getRealtynaHeaders(token);

    // Build OData filter
    const filters: string[] = [];
    
    const city = searchParams.get("city");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const bedrooms = searchParams.get("bedrooms");
    const bathrooms = searchParams.get("bathrooms");
    const minSqft = searchParams.get("minSqft");
    const status = searchParams.get("status") || "Active";
    const modifiedSince = searchParams.get("modifiedSince");

    if (city) filters.push(`City eq '${city}'`);
    if (minPrice) filters.push(`ListPrice ge ${minPrice}`);
    if (maxPrice) filters.push(`ListPrice le ${maxPrice}`);
    if (bedrooms) filters.push(`BedroomsTotal ge ${bedrooms}`);
    if (bathrooms) filters.push(`BathroomsTotalInteger ge ${bathrooms}`);
    if (minSqft) filters.push(`LivingArea ge ${minSqft}`);
    filters.push(`StandardStatus eq '${status}'`);
    if (modifiedSince) filters.push(`ModificationTimestamp ge ${modifiedSince}`);

    const filterStr = filters.join(" and ");
    const top = searchParams.get("limit") || searchParams.get("$top") || "50";
    const skip = searchParams.get("$skip") || "0";
    const orderby = searchParams.get("orderby") || searchParams.get("$orderby") || "ModificationTimestamp desc";

    const queryParams = new URLSearchParams({
      "$filter": filterStr,
      "$top": top,
      "$skip": skip,
      "$orderby": orderby,
      "$count": "true",
      "$select": "ListingKey,ListingId,ListPrice,City,StandardStatus,BedroomsTotal,BathroomsTotalInteger,LivingArea,ModificationTimestamp,Media"
    });

    const apiUrl = `${RESO_BASE}/Property?${queryParams}`;
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
    console.log(`[${rid}] Success: ${data.value?.length || 0} properties`);

    return new Response(JSON.stringify({
      properties: data.value || [],
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
