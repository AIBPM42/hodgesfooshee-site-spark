import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';
import { updateApiKey, type ServiceName } from '@/lib/safeKeys';

/**
 * POST /api/admin/keys/[service]/update
 * Saves or updates an API key for a service
 * Body: { keyValue: string }
 */
export async function POST(
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

    const body = await request.json();
    const { keyValue } = body;

    if (!keyValue || typeof keyValue !== 'string') {
      return NextResponse.json(
        { error: 'Invalid key value' },
        { status: 400 }
      );
    }

    const result = await updateApiKey(service, keyValue);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `${service} API key updated successfully`,
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to update key' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('[API] Error updating key:', error);
    return NextResponse.json(
      { error: 'Failed to update API key' },
      { status: 500 }
    );
  }
}
