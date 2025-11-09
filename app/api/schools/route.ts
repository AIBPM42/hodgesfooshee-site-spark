import { NextResponse } from "next/server";

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';


/**
 * Schools API Endpoint
 * Part of Smart Plan coverage requirements (CLAUDE.md:17)
 *
 * TODO: Integrate with actual school data provider
 * Options:
 * - GreatSchools API
 * - Niche.com API
 * - School District APIs
 * - Realtyna MLS (if school data is available)
 */

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const zipCode = searchParams.get("zip");
  const city = searchParams.get("city");
  const state = searchParams.get("state");

  if (!zipCode && !city) {
    return NextResponse.json(
      { error: "Missing required parameter: zip or city" },
      { status: 400 }
    );
  }

  // Placeholder response - Replace with actual school data integration
  const mockSchools = [
    {
      id: "1",
      name: "Example Elementary School",
      type: "elementary",
      rating: 8,
      grades: "K-5",
      distance: 0.5,
      address: "123 School St",
      city: city || "Nashville",
      state: state || "TN",
      zipCode: zipCode || "37201",
    },
    {
      id: "2",
      name: "Example Middle School",
      type: "middle",
      rating: 7,
      grades: "6-8",
      distance: 1.2,
      address: "456 Education Ave",
      city: city || "Nashville",
      state: state || "TN",
      zipCode: zipCode || "37201",
    },
    {
      id: "3",
      name: "Example High School",
      type: "high",
      rating: 9,
      grades: "9-12",
      distance: 2.0,
      address: "789 Learning Blvd",
      city: city || "Nashville",
      state: state || "TN",
      zipCode: zipCode || "37201",
    },
  ];

  return NextResponse.json({
    schools: mockSchools,
    query: { zipCode, city, state },
    note: "This is placeholder data. Integrate with GreatSchools API or similar provider.",
  });
}
