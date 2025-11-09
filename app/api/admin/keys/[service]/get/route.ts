import { NextRequest, NextResponse } from 'next/server';
import { getMaskedKey, type ServiceName } from '@/lib/safeKeys';

/**
 * GET /api/admin/keys/[service]/get
 * Returns the masked API key for display in admin UI
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { service: string } }
) {
  try {
    const service = params.service as ServiceName;

    // Validate service name
    if (!['manus', 'perplexity', 'openai'].includes(service)) {
      return NextResponse.json(
        { error: 'Invalid service name' },
        { status: 400 }
      );
    }

    const maskedKey = await getMaskedKey(service);

    return NextResponse.json({
      service,
      maskedKey,
      hasKey: !!maskedKey,
    });
  } catch (error: any) {
    console.error('[API] Error fetching masked key:', error);
    return NextResponse.json(
      { error: 'Failed to fetch API key' },
      { status: 500 }
    );
  }
}
