import { NextRequest, NextResponse } from 'next/server';
import { mockSettings } from '@/lib/mock/distressedLeads';

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';


// GET /api/lead-hunter/settings - Get Lead Hunter settings
export async function GET(request: NextRequest) {
  try {
    // TODO: Verify user is broker/admin
    // const session = await getSession();
    // if (!session || !['admin', 'super_admin', 'broker'].includes(session.user.role)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // TODO: Fetch from Supabase
    // const { data, error } = await supabase
    //   .from('lead_hunter_settings')
    //   .select('*')
    //   .limit(1)
    //   .single();

    return NextResponse.json({
      data: mockSettings,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PUT /api/lead-hunter/settings - Update Lead Hunter settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { frequency, run_time, target_counties, min_equity } = body;

    // TODO: Verify user is broker/admin
    // const session = await getSession();
    // if (!session || !['admin', 'super_admin', 'broker'].includes(session.user.role)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Validate inputs
    if (!frequency || !run_time || !target_counties || !min_equity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: Update in Supabase
    // const { data, error } = await supabase
    //   .from('lead_hunter_settings')
    //   .update({
    //     frequency,
    //     run_time,
    //     target_counties,
    //     min_equity,
    //     updated_at: new Date().toISOString(),
    //   })
    //   .eq('id', settingsId)
    //   .select()
    //   .single();

    // For now, return updated settings
    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      data: {
        ...mockSettings,
        frequency,
        run_time,
        target_counties,
        min_equity,
        updated_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
