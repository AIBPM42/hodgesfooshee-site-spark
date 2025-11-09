import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';
import { testApiKey, type ServiceName } from '@/lib/safeKeys';

/**
 * POST /api/admin/keys/[service]/test
 * Tests an API key (either stored or provided)
 * Body (optional): { keyValue?: string }
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

    const body = await request.json().catch(() => ({}));
    const { keyValue } = body;

    // Test the key (either provided or from storage)
    const result = await testApiKey(service, keyValue);

    return NextResponse.json({
      service,
      success: result.success,
      message: result.message,
    });
  } catch (error: any) {
    console.error('[API] Error testing key:', error);
    return NextResponse.json(
      {
        success: false,
        message: `Test failed: ${error.message}`,
      },
      { status: 500 }
    );
  }
}
