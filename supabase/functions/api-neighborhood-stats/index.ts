import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { corsHeaders, createErrorResponse, createSuccessResponse } from "../_shared/cors.ts";
import { getRealtynaToken } from "../_shared/realtyna-auth.ts";
import { getRealtynaBaseUrl, getRealtynaHeaders, fetchWithRetry } from "../_shared/realtyna-client.ts";

// Neighborhood statistics widget - aggregates MLS property data for an area

serve(async (req) => {
  const rid = crypto.randomUUID().substring(0, 8);
  console.log(`[${rid}] api-neighborhood-stats started`);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const city = searchParams.get("city");
    const zip = searchParams.get("zip");
    const county = searchParams.get("county");

    if (!city && !zip && !county) {
      return createErrorResponse(
        'edge.api-neighborhood-stats',
        'MISSING_PARAM',
        'Provide city, zip, or county parameter',
        400
      );
    }

    const token = await getRealtynaToken();
    const headers = getRealtynaHeaders(token);
    const RESO_BASE = getRealtynaBaseUrl();

    // Build filter for area
    const filters: string[] = [];
    if (city) filters.push(`City eq '${city}'`);
    if (zip) filters.push(`PostalCode eq '${zip}'`);
    if (county) filters.push(`CountyOrParish eq '${county}'`);
    filters.push(`StandardStatus eq 'Active'`);

    const filterStr = filters.join(" and ");

    // Get property data for stats
    const queryParams = new URLSearchParams({
      "$filter": filterStr,
      "$top": "1000", // Sample size for stats
      "$select": "ListPrice,BedroomsTotal,BathroomsTotalInteger,LivingArea,YearBuilt,DaysOnMarket"
    });

    const apiUrl = `${RESO_BASE}/Property?${queryParams}`;
    console.log(`[${rid}] Fetching: ${apiUrl.substring(0, 150)}...`);

    const response = await fetchWithRetry(apiUrl, { headers }, 2);

    if (!response.ok) {
      console.error(`[${rid}] API error ${response.status}`);
      return createErrorResponse('edge.api-neighborhood-stats', 'API_ERROR', `Realtyna API returned ${response.status}`, response.status);
    }

    const data = await response.json();
    const properties = data.value || [];

    if (properties.length === 0) {
      return createSuccessResponse({
        stats: null,
        message: "No properties found for this area",
        source: "realtyna"
      });
    }

    // Calculate statistics
    const prices = properties.map((p: any) => p.ListPrice).filter(Boolean);
    const sqft = properties.map((p: any) => p.LivingArea).filter(Boolean);
    const dom = properties.map((p: any) => p.DaysOnMarket).filter(Boolean);

    const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
    const median = (arr: number[]) => {
      const sorted = [...arr].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    };

    const stats = {
      totalListings: properties.length,
      priceStats: {
        average: Math.round(avg(prices)),
        median: Math.round(median(prices)),
        min: Math.min(...prices),
        max: Math.max(...prices)
      },
      sqftStats: sqft.length > 0 ? {
        average: Math.round(avg(sqft)),
        median: Math.round(median(sqft))
      } : null,
      marketStats: dom.length > 0 ? {
        avgDaysOnMarket: Math.round(avg(dom)),
        medianDaysOnMarket: Math.round(median(dom))
      } : null,
      location: { city, zip, county }
    };

    console.log(`[${rid}] Success: stats for ${properties.length} properties`);

    return createSuccessResponse({
      stats,
      sampleSize: properties.length,
      source: "realtyna"
    });

  } catch (error: any) {
    console.error(`[${rid}] Error:`, error);
    return createErrorResponse(
      'edge.api-neighborhood-stats',
      'STATS_FAILED',
      error.message || 'Unknown error calculating neighborhood stats',
      500
    );
  }
});
