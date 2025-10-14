import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { corsHeaders, createErrorResponse, createSuccessResponse } from "../_shared/cors.ts";
import { getRealtynaToken } from "../_shared/realtyna-auth.ts";
import { getRealtynaBaseUrl, getRealtynaHeaders, fetchWithRetry } from "../_shared/realtyna-client.ts";
serve(async (req)=>{
  const rid = crypto.randomUUID().substring(0, 8);
  console.log(`[${rid}] mls-search started`);
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    // Get auth token
    let token;
    try {
      token = await getRealtynaToken();
    } catch (error) {
      console.error(`[${rid}] Token error:`, error);
      return createErrorResponse('edge.mls-search', 'TOKEN_FAILED', error.message || 'Failed to obtain access token', 500);
    }
    const headers = getRealtynaHeaders(token);
    const RESO_BASE = getRealtynaBaseUrl();
    // Build OData filter
    const filters = [];
    const city = searchParams.get("city");
    const county = searchParams.get("county");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const bedrooms = searchParams.get("bedrooms") || searchParams.get("beds");
    const bathrooms = searchParams.get("bathrooms") || searchParams.get("baths");
    const minSqft = searchParams.get("minSqft");
    const status = searchParams.get("status") || "Active";
    const modifiedSince = searchParams.get("modifiedSince");
    if (city) filters.push(`City eq '${city}'`);
    if (county) filters.push(`CountyOrParish eq '${county}'`);
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
    console.log(`[${rid}] Fetching: ${apiUrl.substring(0, 150)}...`);
    const response = await fetchWithRetry(apiUrl, {
      headers
    }, 2);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[${rid}] API error ${response.status}:`, errorText.substring(0, 500));
      let code = 'API_ERROR';
      let msg = `Realtyna API returned ${response.status}`;
      if (response.status === 401) {
        code = 'TOKEN_EXPIRED';
        msg = 'Access token expired — refreshing, please try again';
      } else if (response.status === 403) {
        code = 'FORBIDDEN';
        msg = 'API key or permissions issue';
      } else if (response.status === 429) {
        code = 'RATE_LIMITED';
        msg = 'Throttled — retry in 30s';
      } else if (response.status >= 500) {
        code = 'UPSTREAM_ERROR';
        msg = 'Realtyna service unavailable';
      }
      return createErrorResponse('edge.mls-search', code, msg, response.status, {
        details: errorText.substring(0, 500)
      });
    }
    const data = await response.json();
    console.log(`[${rid}] Success: ${data.value?.length || 0} properties`);
    return createSuccessResponse({
      properties: data.value || [],
      total: data["@odata.count"] || data.value?.length || 0,
      nextLink: data["@odata.nextLink"],
      source: "realtyna"
    });
  } catch (error) {
    console.error(`[${rid}] Error:`, error);
    if (error.message?.includes('ENV_MISSING')) {
      return createErrorResponse('edge.mls-search', 'ENV_MISSING', error.message, 500);
    }
    return createErrorResponse('edge.mls-search', 'SEARCH_FAILED', error.message || 'Unknown error during search', 500);
  }
});
