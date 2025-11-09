import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check owner role
    const { data: prof } = await supabase
      .from('profiles')
      .select('role, email')
      .eq('user_id', user.id)
      .single();

    const isOwner = prof?.role === 'owner';
    if (!isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get start of current month
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

    // Fetch runs this month
    const { data: sum } = await supabase
      .from('image_edit_runs')
      .select('images_out, storage_bytes')
      .gte('created_at', monthStart);

    const totalRuns = sum?.length ?? 0;
    const totalImages = sum?.reduce((a, r) => a + (r.images_out ?? 0), 0) ?? 0;
    const totalBytes = sum?.reduce((a, r) => a + (Number(r.storage_bytes) || 0), 0) ?? 0;

    // Get top 5 agents by edits
    const { data: topRaw, error: topError } = await supabase.rpc('top_edit_agents_this_month');

    if (topError) {
      console.error('Error fetching top agents:', topError);
    }

    return NextResponse.json({
      summary: [
        { label: 'Runs', value: totalRuns },
        { label: 'Edited images', value: totalImages },
        { label: 'Storage (MB)', value: Math.round(totalBytes / (1024 * 1024)) },
      ],
      top: topRaw ?? [],
    });
  } catch (error: any) {
    console.error('Usage summary API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
