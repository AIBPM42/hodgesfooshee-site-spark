import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { corsHeaders, createErrorResponse, createSuccessResponse } from "../_shared/cors.ts";

// Schools API using GreatSchools API or stub for now
// TODO: Integrate with GreatSchools API when credentials are available

serve(async (req) => {
  const rid = crypto.randomUUID().substring(0, 8);
  console.log(`[${rid}] api-schools started`);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const zip = searchParams.get("zip");
    const city = searchParams.get("city");
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const radius = parseInt(searchParams.get("radius") || "5"); // miles

    if (!zip && !city && (!lat || !lon)) {
      return createErrorResponse(
        'edge.api-schools',
        'MISSING_PARAM',
        'Provide zip, city, or lat/lon coordinates',
        400
      );
    }

    // TODO: Replace with actual GreatSchools API call
    // For now, return mock data structure
    const mockSchools = [
      {
        id: "school-1",
        name: "Example Elementary School",
        type: "elementary",
        rating: 8,
        distance: 1.2,
        address: "123 School St",
        city: city || "Nashville",
        state: "TN",
        zip: zip || "37201",
        grades: "K-5",
        enrollment: 450
      },
      {
        id: "school-2",
        name: "Example Middle School",
        type: "middle",
        rating: 7,
        distance: 2.1,
        address: "456 Education Ave",
        city: city || "Nashville",
        state: "TN",
        zip: zip || "37201",
        grades: "6-8",
        enrollment: 600
      },
      {
        id: "school-3",
        name: "Example High School",
        type: "high",
        rating: 9,
        distance: 3.5,
        address: "789 Learning Blvd",
        city: city || "Nashville",
        state: "TN",
        zip: zip || "37201",
        grades: "9-12",
        enrollment: 1200
      }
    ];

    console.log(`[${rid}] Success: ${mockSchools.length} schools (mock data)`);

    return createSuccessResponse({
      schools: mockSchools,
      total: mockSchools.length,
      source: "mock", // Change to "greatschools" when integrated
      note: "Mock data - integrate GreatSchools API for production"
    });

  } catch (error: any) {
    console.error(`[${rid}] Error:`, error);
    return createErrorResponse(
      'edge.api-schools',
      'QUERY_FAILED',
      error.message || 'Unknown error during schools query',
      500
    );
  }
});
