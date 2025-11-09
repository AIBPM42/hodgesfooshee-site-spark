import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { mapCountyToData } from "@/lib/mappers/countyMapper";
import type { County } from "@/lib/types/county";

export async function GET(
  _: Request,
  context: { params: { slug: string } }
) {
  try {
    const { slug } = context.params;

    // Fetch from Supabase
    const { data, error } = await supabase
      .from('counties')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      console.error('[County API] Error:', error);
      return NextResponse.json({ error: "County not found" }, { status: 404 });
    }

    // Transform to clean format
    const countyData = mapCountyToData(data as County);

    return NextResponse.json(countyData);
  } catch (err) {
    console.error('[County API] Exception:', err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Enable ISR
export const revalidate = 300; // 5 minutes
