import { NextRequest, NextResponse } from 'next/server';
import { mockAdminStats, mockAgentStats } from '@/lib/mock/distressedLeads';

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';

// GET /api/leads/stats - Get dashboard stats (role-specific)
export async function GET(request: NextRequest) {
  try {
    // TODO: Get user role from session
    // const session = await getSession();
    // const role = session?.user?.role;

    // For now, return admin stats (check query param for testing)
    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get('role') || 'admin';

    if (role === 'agent') {
      // TODO: Calculate real agent stats from Supabase
      // const userId = session.user.id;
      // const { data: myLeads } = await supabase
      //   .from('distressed_leads')
      //   .select('*')
      //   .eq('assigned_to', userId);
      //
      // Calculate stats from myLeads...

      return NextResponse.json({
        data: mockAgentStats,
        role: 'agent',
      });
    }

    // Admin/Broker stats
    // TODO: Calculate real admin stats from Supabase
    // const { data: allLeads } = await supabase
    //   .from('distressed_leads')
    //   .select('*');
    //
    // Calculate stats from all Leads...

    return NextResponse.json({
      data: mockAdminStats,
      role: 'admin',
    });
  } catch (error) {
    console.error('Error fetching lead stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
