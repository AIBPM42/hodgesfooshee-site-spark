import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';


// POST /api/leads/[id]/claim - Broker claims a lead
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // TODO: Verify user is broker/admin
    // const session = await getSession();
    // if (!session || !['admin', 'super_admin', 'broker'].includes(session.user.role)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // TODO: Update lead in Supabase
    // const { data, error } = await supabase
    //   .from('distressed_leads')
    //   .update({
    //     status: 'claimed_by_broker',
    //     claimed_by: session.user.id,
    //     updated_at: new Date().toISOString(),
    //   })
    //   .eq('id', id)
    //   .select()
    //   .single();

    // For now, return success
    return NextResponse.json({
      success: true,
      message: 'Lead claimed successfully',
      data: { id, status: 'claimed_by_broker' },
    });
  } catch (error) {
    console.error('Error claiming lead:', error);
    return NextResponse.json(
      { error: 'Failed to claim lead' },
      { status: 500 }
    );
  }
}
