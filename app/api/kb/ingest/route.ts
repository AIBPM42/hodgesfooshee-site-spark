import { NextResponse } from 'next/server';

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';


export async function POST(req: Request) {
  try {
    const { files } = await req.json() as {
      files: Array<{
        name: string;
        url: string;
        size: number;
        mime: string;
        userId?: string | null;
      }>;
    };

    if (!Array.isArray(files) || files.length === 0) {
      return NextResponse.json({ ok: false, error: 'No files' }, { status: 400 });
    }

    // Check for N8N_EMBED_WEBHOOK_URL
    const n8nUrl = process.env.N8N_EMBED_WEBHOOK_URL;
    if (!n8nUrl) {
      console.error('❌ N8N_EMBED_WEBHOOK_URL is not configured');
      return NextResponse.json(
        { ok: false, error: 'Server misconfigured: N8N_EMBED_WEBHOOK_URL not found' },
        { status: 500 }
      );
    }

    console.log(`🚀 Forwarding ${files.length} files to n8n for embedding`);

    // Forward to n8n (kept server-side)
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add webhook secret if configured
    if (process.env.N8N_EMBED_WEBHOOK_SECRET) {
      headers['X-Webhook-Secret'] = process.env.N8N_EMBED_WEBHOOK_SECRET;
    }

    const r = await fetch(n8nUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ files })
    });

    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      console.error(`❌ n8n webhook returned ${r.status}: ${r.statusText}`, data);
      return NextResponse.json({ ok: false, error: data?.error || `n8n failed: ${r.status}` }, { status: 500 });
    }

    console.log('✅ n8n webhook success');
    return NextResponse.json({ ok: true, data });
  } catch (e:any) {
    console.error('💥 Unexpected error in /api/kb/ingest:', e);
    return NextResponse.json({ ok: false, error: e?.message || 'Server error' }, { status: 500 });
  }
}
