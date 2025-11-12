import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/admin/counties/update-schedule
 * Updates auto-refresh schedule for a county
 * Body: { slug: string, auto_refresh: boolean, refresh_frequency: string }
 */
export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { slug, auto_refresh, refresh_frequency } = await request.json();

    if (!slug) {
      return NextResponse.json(
        { error: 'County slug is required' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('counties')
      .update({
        auto_refresh,
        refresh_frequency,
      })
      .eq('slug', slug);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: `Schedule updated for ${slug}`,
    });
  } catch (error: any) {
    console.error('[API] Error updating schedule:', error);
    return NextResponse.json(
      { error: 'Failed to update schedule' },
      { status: 500 }
    );
  }
}
