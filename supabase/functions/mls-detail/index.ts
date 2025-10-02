import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { corsHeaders, createErrorResponse, createSuccessResponse } from "../_shared/cors.ts";
import { getRealtynaToken } from "../_shared/realtyna-auth.ts";
import { getRealtynaBaseUrl, getRealtynaHeaders, fetchWithRetry } from "../_shared/realtyna-client.ts";

serve(async (req) => {
  const rid = crypto.randomUUID().substring(0, 8);
  console.log(`[${rid}] mls-detail started`);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const listingKey = url.searchParams.get("listingKey");

    if (!listingKey) {
      return createErrorResponse(
        'edge.mls-detail',
        'MISSING_PARAM',
        'listingKey parameter is required',
        400
      );
    }

    // Get auth token
    let token: string;
    try {
      token = await getRealtynaToken();
    } catch (error: any) {
      console.error(`[${rid}] Token error:`, error);
      return createErrorResponse(
        'edge.mls-detail',
        'TOKEN_FAILED',
        error.message || 'Failed to obtain access token',
        500
      );
    }

    const headers = getRealtynaHeaders(token);
    const RESO_BASE = getRealtynaBaseUrl();

    const apiUrl = `${RESO_BASE}/Property?$filter=ListingKey eq '${listingKey}'&$top=1&$select=*`;
    console.log(`[${rid}] Fetching: ${apiUrl.substring(0, 150)}...`);

    const response = await fetchWithRetry(apiUrl, { headers }, 2);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[${rid}] API error ${response.status}:`, errorText.substring(0, 500));
      
      let code = 'API_ERROR';
      let msg = `Realtyna API returned ${response.status}`;
      
      if (response.status === 401) {
        code = 'TOKEN_EXPIRED';
        msg = 'Access token expired — refreshing, please try again';
      } else if (response.status === 404) {
        code = 'NOT_FOUND';
        msg = 'Property not found';
      }
      
      return createErrorResponse('edge.mls-detail', code, msg, response.status, {
        details: errorText.substring(0, 500)
      });
    }

    const data = await response.json();
    const property = data.value?.[0];

    if (!property) {
      return createErrorResponse('edge.mls-detail', 'NOT_FOUND', 'Property not found', 404);
    }

    console.log(`[${rid}] Success: property ${listingKey}`);

    return createSuccessResponse({
      property,
      source: "realtyna"
    });

  } catch (error: any) {
    console.error(`[${rid}] Error:`, error);
    
    if (error.message?.includes('ENV_MISSING')) {
      return createErrorResponse('edge.mls-detail', 'ENV_MISSING', error.message, 500);
    }
    
    return createErrorResponse(
      'edge.mls-detail',
      'DETAIL_FAILED',
      error.message || 'Unknown error fetching property details',
      500
    );
  }
});
