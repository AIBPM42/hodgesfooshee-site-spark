import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { corsHeaders, createErrorResponse, createSuccessResponse } from "../_shared/cors.ts";
import { getRealtynaToken } from "../_shared/realtyna-auth.ts";
import { getRealtynaBaseUrl, getRealtynaHeaders, fetchWithRetry } from "../_shared/realtyna-client.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const rid = crypto.randomUUID();
  console.log(`[${rid}] MLS Members Search started`);

  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    // Check for mock member key lookup
    const memberKey = searchParams.get("memberKey");
    if (memberKey === "TEST-MOCK-001") {
      console.log(`[${rid}] Returning mock MLS member data for ${memberKey}`);
      return createSuccessResponse({
        members: [{
          MemberKey: "TEST-MOCK-001",
          MemberMlsId: "AGENT001",
          MemberFullName: "Jane Smith",
          MemberFirstName: "Jane",
          MemberLastName: "Smith",
          MemberEmail: "testagent@hodgesfooshee.com",
          MemberDirectPhone: "(615) 555-0100",
          MemberMobilePhone: "(615) 555-0100",
          MemberPhotoURL: "https://ui-avatars.com/api/?name=Jane+Smith&size=400&background=E87722&color=fff&bold=true",
          MemberStateLicense: "TN-12345-TEST",
          MemberDesignation: "ABR, GRI, CRS",
          MemberStatus: "Active",
          MemberType: "Agent",
          OfficeKey: "OFFICE-TEST-001",
          OfficeName: "Hodges & Fooshee Realty",
          OfficePhone: "(615) 555-0123",
          ModificationTimestamp: new Date().toISOString(),
          OriginalEntryTimestamp: new Date().toISOString()
        }],
        total: 1,
        source: "mock"
      });
    }

    const token = await getRealtynaToken();
    const headers = getRealtynaHeaders(token);
    const RESO_BASE = getRealtynaBaseUrl();

    const filters: string[] = [];

    const name = searchParams.get("name");
    const officeKey = searchParams.get("officeKey");
    const status = searchParams.get("status");

    if (name) filters.push(`contains(MemberFullName,'${name}')`);
    if (officeKey) filters.push(`OfficeKey eq '${officeKey}'`);
    if (status) filters.push(`MemberStatus eq '${status}'`);

    const top = searchParams.get("$top") || searchParams.get("limit") || "50";
    const skip = searchParams.get("$skip") || "0";

    const queryParams = new URLSearchParams({
      "$top": top,
      "$skip": skip,
    });

    if (filters.length > 0) {
      queryParams.set("$filter", filters.join(" and "));
    }

    const apiUrl = `${RESO_BASE}/Member?${queryParams}`;
    console.log(`[${rid}] Fetching: ${apiUrl}`);

    const response = await fetchWithRetry(apiUrl, { headers }, 2);

    if (!response.ok) {
      console.error(`[${rid}] API error ${response.status}`);
      return createErrorResponse('edge.mls-members', 'API_ERROR', `Realtyna API returned ${response.status}`, response.status);
    }

    const data = await response.json();
    console.log(`[${rid}] Success: ${data.value?.length || 0} members`);

    return createSuccessResponse({
      members: data.value || [],
      total: data["@odata.count"] || data.value?.length || 0,
      nextLink: data["@odata.nextLink"],
      source: "realtyna"
    });

  } catch (error: any) {
    console.error(`[${rid}] Error:`, error);
    return createErrorResponse(
      'edge.mls-members',
      'SEARCH_FAILED',
      error.message || 'Unknown error during member search',
      500
    );
  }
});
