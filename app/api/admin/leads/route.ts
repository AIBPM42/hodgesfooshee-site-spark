import { NextRequest, NextResponse } from 'next/server';
import { mockLeads } from '@/lib/mock/distressedLeads';

// GET /api/admin/leads - Get all leads (broker only)
export async function GET(request: NextRequest) {
  try {
    // TODO: Verify user is broker/admin via session
    // const session = await getSession();
    // if (!session || !['admin', 'super_admin', 'broker'].includes(session.user.role)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // TODO: Replace with real Supabase query
    // const { data: leads, error } = await supabase
    //   .from('distressed_leads')
    //   .select('*')
    //   .order('found_date', { ascending: false });

    // For now, return mock data
    return NextResponse.json({
      data: mockLeads,
      meta: {
        total: mockLeads.length,
        updated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching admin leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}
