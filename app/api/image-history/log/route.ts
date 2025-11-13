import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';


async function fetchAsArrayBuffer(url: string) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Fetch failed ${r.status}`);
  const ab = await r.arrayBuffer();
  return Buffer.from(ab);
}

export async function POST(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ ok: false, error: 'Supabase configuration missing' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    const auth = req.headers.get('authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (!token) return NextResponse.json({ ok:false, error:'No auth token' }, { status: 401 });

    const { data: { user }, error: userErr } = await supabaseAdmin.auth.getUser(token);
    if (userErr || !user) return NextResponse.json({ ok:false, error:'Invalid user' }, { status: 401 });

    const { prompt, options, outputs } = await req.json() as {
      prompt: string;
      options: any;
      outputs: { name:string; size:number; url:string; status:string; error?:string }[];
    };

    const { data: runRows, error: runErr } = await (supabaseAdmin as any)
      .from('image_edit_runs')
      .insert([{ user_id: user.id, prompt, options, total: outputs.length }])
      .select('id').limit(1);
    if (runErr || !runRows?.[0]?.id) throw new Error(runErr?.message || 'Run insert failed');

    const runId = (runRows as any)[0].id as string;
    const assetsToInsert: any[] = [];

    for (const o of outputs) {
      let newUrl = '';
      let editedSize = 0;

      try {
        if (o.url && o.status === 'done') {
          const fileBuf = await fetchAsArrayBuffer(o.url);
          editedSize = fileBuf.length;
          const ext = (o.name.match(/\.[^.]+$/)?.[0] || '.jpg').toLowerCase();
          const fname = `${crypto.randomUUID()}${ext}`;
          const objectPath = `${user.id}/${runId}/${fname}`;

          const { error: upErr } = await supabaseAdmin
            .storage.from('image-edits')
            .upload(objectPath, fileBuf, { contentType: 'image/jpeg', upsert: false });
          if (upErr) throw upErr;

          const { data: pub } = supabaseAdmin.storage.from('image-edits').getPublicUrl(objectPath);
          newUrl = pub.publicUrl;
        }
      } catch (e:any) {
        newUrl = o.url || '';
      }

      assetsToInsert.push({
        run_id: runId,
        user_id: user.id,
        original_name: o.name,
        original_size: o.size,
        edited_url: newUrl,
        edited_size: editedSize,
        status: o.status,
        error: o.error ?? null
      });
    }

    const { error: assetsErr } = await (supabaseAdmin as any).from("image_edit_assets").insert(assetsToInsert);
    if (assetsErr) throw assetsErr;

    return NextResponse.json({ ok:true, runId, assets: assetsToInsert });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error: e?.message || 'Server error' }, { status: 500 });
  }
}
