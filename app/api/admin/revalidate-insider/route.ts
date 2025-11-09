import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';
import { revalidateTag } from 'next/cache';

/**
 * POST /api/admin/revalidate-insider
 * Manually revalidates the Insider Access listings cache
 */
export async function POST(request: NextRequest) {
  try {
    // Revalidate the insider-access tag
    revalidateTag('insider-access');

    return NextResponse.json({
      success: true,
      message: 'Insider Access listings cache revalidated',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[API] Error revalidating insider cache:', error);
    return NextResponse.json(
      { error: 'Failed to revalidate cache' },
      { status: 500 }
    );
  }
}
