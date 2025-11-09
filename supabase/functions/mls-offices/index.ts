import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { corsHeaders, createErrorResponse, createSuccessResponse } from "../_shared/cors.ts";
import { getRealtynaToken } from "../_shared/realtyna-auth.ts";
import { getRealtynaBaseUrl, getRealtynaHeaders, fetchWithRetry } from "../_shared/realtyna-client.ts";

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
    const RESO_BASE = getRealtynaBaseUrl();

    const filters: string[] = [];

    const name = searchParams.get("name");
    const city = searchParams.get("city");
    const status = searchParams.get("status");

    if (name) filters.push(`contains(OfficeName,'${name}')`);
    if (city) filters.push(`OfficeCity eq '${city}'`);
    if (status) filters.push(`OfficeStatus eq '${status}'`);

    const top = searchParams.get("$top") || searchParams.get("limit") || "50";
    const skip = searchParams.get("$skip") || "0";

    const queryParams = new URLSearchParams({
      "$top": top,
      "$skip": skip,
    });

    if (filters.length > 0) {
      queryParams.set("$filter", filters.join(" and "));
    }

    const apiUrl = `${RESO_BASE}/Office?${queryParams}`;
    console.log(`[${rid}] Fetching: ${apiUrl}`);

    const response = await fetchWithRetry(apiUrl, { headers }, 2);

    if (!response.ok) {
      console.error(`[${rid}] API error ${response.status}`);
      return createErrorResponse('edge.mls-offices', 'API_ERROR', `Realtyna API returned ${response.status}`, response.status);
    }

    const data = await response.json();
    console.log(`[${rid}] Success: ${data.value?.length || 0} offices`);

    return createSuccessResponse({
      offices: data.value || [],
      total: data["@odata.count"] || data.value?.length || 0,
      nextLink: data["@odata.nextLink"],
      source: "realtyna"
    });

  } catch (error: any) {
    console.error(`[${rid}] Error:`, error);
    return createErrorResponse(
      'edge.mls-offices',
      'SEARCH_FAILED',
      error.message || 'Unknown error during office search',
      500
    );
  }
});
