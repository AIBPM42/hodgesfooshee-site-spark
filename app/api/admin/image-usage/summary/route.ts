import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';
import { supabaseAdmin } from '@/lib/supabaseServer';

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (!token) return NextResponse.json({ ok:false, error:'No auth token' }, { status: 401 });

    const { data: { user }, error: userErr } = await supabaseAdmin.auth.getUser(token);
    if (userErr || !user) return NextResponse.json({ ok:false, error:'Invalid user' }, { status: 401 });

    const role = (user.app_metadata as any)?.role || 'agent';
    if (!(role === 'owner' || role === 'broker')) {
      return NextResponse.json({ ok:false, error:'Forbidden' }, { status: 403 });
    }

    // Sum edited_size
    const { data: allAssets, error: sErr } = await supabaseAdmin
      .from('image_edit_assets')
      .select('edited_size,status,user_id,edited_url,created_at');
    if (sErr) throw sErr;

    const totalStorageBytes = (allAssets || []).reduce((acc:any, r:any)=>acc+(r.edited_size||0),0);
    const totalImages = (allAssets || []).length;

    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
    const { data: runsMonth, error: rErr } = await supabaseAdmin
      .from('image_edit_runs').select('id,created_at').gte('created_at', monthStart);
    if (rErr) throw rErr;
    const runsThisMonth = runsMonth?.length ?? 0;

    const counts: Record<string, number> = {};
    (allAssets || []).forEach((r:any)=>{
      if (r.status==='done') counts[r.user_id]=(counts[r.user_id]||0)+1;
    });
    const topAgents = Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,5)
      .map(([user_id, edited_count])=>({ user_id, edited_count }));

    const recent = (allAssets || [])
      .filter((a:any)=>a.edited_url).sort((a:any,b:any)=>new Date(b.created_at).getTime()-new Date(a.created_at).getTime())
      .slice(0,12).map((a:any)=>a.edited_url);

    return NextResponse.json({
      ok:true,
      totals:{ totalImages, totalStorageBytes, runsThisMonth },
      topAgents, recent
    });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error: e?.message || 'Server error' }, { status: 500 });
  }
}
