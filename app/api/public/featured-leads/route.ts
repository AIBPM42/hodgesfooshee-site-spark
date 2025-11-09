import { NextRequest, NextResponse } from 'next/server';
import { mockLeads } from '@/lib/mock/distressedLeads';

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';


// GET /api/public/featured-leads - Get featured leads for public homepage
export async function GET(request: NextRequest) {
  try {
    // TODO: Replace with real Supabase query
    // const { data: leads, error } = await supabase
    //   .from('distressed_leads')
    //   .select('address, city, zip, property_type, estimated_value, days_in_distress, property_images, is_featured')
    //   .eq('is_featured', true)
    //   .limit(3);

    // For now, filter mock data for featured leads
    const featuredLeads = mockLeads
      .filter(lead => lead.is_featured)
      .slice(0, 3)
      .map(lead => ({
        // Return limited fields for public
        id: lead.id,
        address: lead.address.split(' ').slice(-2).join(' '), // Street name only, no number
        city: lead.city,
        zip: lead.zip,
        property_type: lead.property_type,
        estimated_value: lead.estimated_value,
        days_in_distress: lead.days_in_distress,
        property_images: lead.property_images,
      }));

    return NextResponse.json({
      data: featuredLeads,
      meta: {
        total: featuredLeads.length,
        updated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching featured leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured leads' },
      { status: 500 }
    );
  }
}
