import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { County } from '@/lib/types/county';

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/counties/[slug]
 * Returns county data with ISR caching (1 hour revalidation)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { slug } = params;

    const { data, error } = await supabase
      .from('counties')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'County not found' },
        { status: 404 }
      );
    }

    const county: County = data as County;

    return NextResponse.json(county, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
      },
    });
  } catch (error: any) {
    console.error('[API] Error fetching county:', error);
    return NextResponse.json(
      { error: 'Failed to fetch county data' },
      { status: 500 }
    );
  }
}

// Enable ISR with revalidation tag
export const revalidate = 3600; // 1 hour
