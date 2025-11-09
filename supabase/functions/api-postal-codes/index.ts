import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, createErrorResponse, createSuccessResponse } from "../_shared/cors.ts";

serve(async (req) => {
  const rid = crypto.randomUUID().substring(0, 8);
  console.log(`[${rid}] api-postal-codes started`);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SERVICE_KEY) {
      return createErrorResponse('edge.api-postal-codes', 'ENV_MISSING', 'Supabase credentials not configured', 500);
    }

    const sb = createClient(SUPABASE_URL, SERVICE_KEY);

    // Build query
    let query = sb.from("mls_postal_codes").select("*", { count: "exact" });

    const zip = searchParams.get("zip") || searchParams.get("postalCode");
    const city = searchParams.get("city");
    const state = searchParams.get("state");
    const county = searchParams.get("county");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    if (zip) query = query.eq("postal_code", zip);
    if (city) query = query.ilike("city", `%${city}%`);
    if (state) query = query.eq("state_or_province", state);
    if (county) query = query.ilike("county_or_parish", `%${county}%`);

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error(`[${rid}] Database error:`, error);
      return createErrorResponse('edge.api-postal-codes', 'DB_ERROR', error.message, 500);
    }

    console.log(`[${rid}] Success: ${data?.length || 0} postal codes`);

    return createSuccessResponse({
      postalCodes: data || [],
      total: count || 0,
      source: "supabase"
    });

  } catch (error: any) {
    console.error(`[${rid}] Error:`, error);
    return createErrorResponse(
      'edge.api-postal-codes',
      'QUERY_FAILED',
      error.message || 'Unknown error during postal code query',
      500
    );
  }
});
