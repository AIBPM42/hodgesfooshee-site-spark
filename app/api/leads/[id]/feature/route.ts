import { NextRequest, NextResponse } from 'next/server';

// POST /api/leads/[id]/feature - Broker features/unfeatures a lead
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { isFeatured } = body;

    if (typeof isFeatured !== 'boolean') {
      return NextResponse.json(
        { error: 'isFeatured must be a boolean' },
        { status: 400 }
      );
    }

    // TODO: Verify user is broker/admin
    // const session = await getSession();
    // if (!session || !['admin', 'super_admin', 'broker'].includes(session.user.role)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // TODO: Check if already have 3 featured leads (if featuring)
    // if (isFeatured) {
    //   const { count } = await supabase
    //     .from('distressed_leads')
    //     .select('*', { count: 'exact', head: true })
    //     .eq('is_featured', true);
    //
    //   if (count >= 3) {
    //     return NextResponse.json(
    //       { error: 'Maximum 3 leads can be featured at once' },
    //       { status: 400 }
    //     );
    //   }
    // }

    // TODO: Update lead in Supabase
    // const { data, error } = await supabase
    //   .from('distressed_leads')
    //   .update({
    //     is_featured: isFeatured,
    //     featured_date: isFeatured ? new Date().toISOString() : null,
    //     updated_at: new Date().toISOString(),
    //   })
    //   .eq('id', id)
    //   .select()
    //   .single();

    // For now, return success
    return NextResponse.json({
      success: true,
      message: isFeatured ? 'Lead featured successfully' : 'Lead unfeatured successfully',
      data: { id, is_featured: isFeatured },
    });
  } catch (error) {
    console.error('Error featuring lead:', error);
    return NextResponse.json(
      { error: 'Failed to feature lead' },
      { status: 500 }
    );
  }
}
