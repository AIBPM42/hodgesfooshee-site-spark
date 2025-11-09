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

    // Forward to n8n (kept server-side)
    const r = await fetch(process.env.N8N_EMBED_WEBHOOK_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Secret': process.env.N8N_EMBED_WEBHOOK_SECRET!,
      },
      body: JSON.stringify({ files })
    });

    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      return NextResponse.json({ ok: false, error: data?.error || 'n8n failed' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, data });
  } catch (e:any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Server error' }, { status: 500 });
  }
}
