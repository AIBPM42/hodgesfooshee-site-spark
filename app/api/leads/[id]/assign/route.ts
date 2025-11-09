import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';


// POST /api/leads/[id]/assign - Broker assigns lead to agent
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { agentId } = body;

    if (!agentId) {
      return NextResponse.json(
        { error: 'Agent ID is required' },
        { status: 400 }
      );
    }

    // TODO: Verify user is broker/admin
    // const session = await getSession();
    // if (!session || !['admin', 'super_admin', 'broker'].includes(session.user.role)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // TODO: Update lead in Supabase
    // const { data, error } = await supabase
    //   .from('distressed_leads')
    //   .update({
    //     status: 'assigned_to_agent',
    //     assigned_to: agentId,
    //     assigned_date: new Date().toISOString(),
    //     updated_at: new Date().toISOString(),
    //   })
    //   .eq('id', id)
    //   .select()
    //   .single();

    // For now, return success
    return NextResponse.json({
      success: true,
      message: 'Lead assigned successfully',
      data: { id, status: 'assigned_to_agent', assigned_to: agentId },
    });
  } catch (error) {
    console.error('Error assigning lead:', error);
    return NextResponse.json(
      { error: 'Failed to assign lead' },
      { status: 500 }
    );
  }
}
