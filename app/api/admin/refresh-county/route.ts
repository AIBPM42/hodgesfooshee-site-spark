import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';
import { revalidateTag } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import { generateCountyNarrative } from '@/lib/perplexity/updateCounty';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

/**
 * POST /api/admin/refresh-county
 * Regenerates narrative using Perplexity AI and revalidates cache
 * Body: { slug: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json(
        { error: 'County slug is required' },
        { status: 400 }
      );
    }

    // Fetch county
    const { data: county, error: fetchError } = await supabaseAdmin
      .from('counties')
      .select('*')
      .eq('slug', slug)
      .single();

    if (fetchError || !county) {
      return NextResponse.json(
        { error: 'County not found' },
        { status: 404 }
      );
    }

    // Generate new narrative with Perplexity
    const narrative = await generateCountyNarrative(county.name);

    // Update county with new narrative
    const { error: updateError } = await supabaseAdmin
      .from('counties')
      .update({
        narrative,
        narrative_updated_at: new Date().toISOString(),
      })
      .eq('slug', slug);

    if (updateError) {
      throw updateError;
    }

    // Revalidate cache
    revalidateTag(`county-${slug}`);

    return NextResponse.json({
      success: true,
      message: `County narrative refreshed for ${county.name}`,
      narrative_preview: narrative.substring(0, 150) + '...',
      updated_at: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[API] Error refreshing county:', error);
    return NextResponse.json(
      { error: 'Failed to refresh county' },
      { status: 500 }
    );
  }
}
