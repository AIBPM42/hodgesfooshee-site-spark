import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';


export async function GET(req: NextRequest) {
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

    const role = (user.app_metadata as any)?.role || 'agent';

    if (role === 'owner' || role === 'broker') {
      const { data: runs, error: rerr } = await supabaseAdmin
        .from('image_edit_runs')
        .select('id,user_id,prompt,options,total,created_at')
        .order('created_at', { ascending: false })
        .limit(50);
      if (rerr) throw rerr;
      return NextResponse.json({ ok:true, scope:'all', runs });
    } else {
      const { data: runs, error: rerr } = await supabaseAdmin
        .from('image_edit_runs')
        .select('id,user_id,prompt,options,total,created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);
      if (rerr) throw rerr;
      return NextResponse.json({ ok:true, scope:'own', runs });
    }
  } catch (e:any) {
    return NextResponse.json({ ok:false, error: e?.message || 'Server error' }, { status: 500 });
  }
}
