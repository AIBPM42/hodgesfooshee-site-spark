'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseBrowser';

function prettyBytes(n:number){ if(!n) return '0 B'; const u=['B','KB','MB','GB','TB']; let i=0,v=n; while(v>=1024&&i<u.length-1){v/=1024;i++;} return `${v.toFixed(1)} ${u[i]}`; }

export default function AdminUsageWidget(){
  const [data,setData]=useState<any>(null);
  const [loading,setLoading]=useState(true);
  const [forbidden,setForbidden]=useState(false);

  useEffect(()=>{(async()=>{
    const { data:{ session } } = await supabase.auth.getSession();
    if(!session?.access_token){ setLoading(false); return; }
    const res = await fetch('/api/admin/image-usage/summary',{ headers:{ Authorization:`Bearer ${session.access_token}` }});
    const j = await res.json();
    if (!j.ok && res.status===403){ setForbidden(true); setLoading(false); return; }
    if (j.ok) setData(j);
    setLoading(false);
  })();},[]);

  if (loading) return <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/70">Loading usage…</div>;
  if (forbidden) return null;
  if (!data) return <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/70">No data.</div>;

  const { totals, topAgents, recent } = data;
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-4 text-lg font-semibold">Image Studio — Usage Monitor</div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs text-white/60">Storage Used</div>
          <div className="mt-1 text-2xl font-semibold">{prettyBytes(totals.totalStorageBytes)}</div>
          <div className="text-xs text-white/50">{totals.totalImages} images</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs text-white/60">Runs this month</div>
          <div className="mt-1 text-2xl font-semibold">{totals.runsThisMonth}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs text-white/60">Top Agents (by edits)</div>
          <div className="mt-2 space-y-1 text-sm">
            {topAgents.length===0 ? <div className="text-white/60">No data yet.</div> :
              topAgents.map((t:any)=>(
                <div key={t.user_id} className="flex items-center justify-between">
                  <span className="truncate" title={t.user_id}>{t.user_id.slice(0,8)}…</span>
                  <span className="text-white/80">{t.edited_count}</span>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 text-sm text-white/70">Recent Edits</div>
        {recent?.length ? (
          <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
            {recent.map((u:string,i:number)=>(
              <img key={i} src={u} className="aspect-square w-full rounded-lg border border-white/10 object-cover"/>
            ))}
          </div>
        ) : <div className="text-sm text-white/60">No recent edits.</div>}
      </div>
    </div>
  );
}
