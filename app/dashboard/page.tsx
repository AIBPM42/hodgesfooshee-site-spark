'use client';

import PremiumCard from '@/components/ui/PremiumCard';
import { KpiTile } from '@/components/ui/KpiTile';
import Link from 'next/link';
import { useVelocity, usePriceGap, useTTC, useZipIntel } from '@/lib/hooks';
import {
  ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip,
  LineChart, Line
} from 'recharts';
import { useMemo } from 'react';

export default function DashboardHome() {
  const { data: velocity } = useVelocity();
  const { data: pricegap } = usePriceGap();
  const { data: ttc } = useTTC();

  const zips = ['37215','37064','37027','37212','37128','37067'];
  const zipHooks = zips.map((z) => useZipIntel(z));
  const zipCards = useMemo(() => zipHooks.map(h => h.data).filter(Boolean).slice(0,6), [zipHooks]);

  const updatedAt = velocity?.updated.updated || pricegap?.updated.updated || ttc?.updated.updated;

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-[34px] font-extrabold tracking-tight text-[var(--text-strong)]">Hodges & Fooshee — Market Snapshot</h1>
          <p className="mt-1 text-[15px] text-[var(--text-muted)]">Quick read on the market. Click any tile for deep-dive.</p>
        </div>
        {updatedAt && (
          <div className="flex items-center gap-2">
            <UpdatedPill iso={updatedAt} />
          </div>
        )}
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiTile
          label="Actives (7d)"
          value={velocity ? velocity.kpis.actives.toLocaleString() : '—'}
          hint="All counties"
          badge={velocity ? `${(velocity.kpis.convRate*100).toFixed(1)}% conv` : undefined}
          strong
        />
        <KpiTile
          label="Pendings (7d)"
          value={velocity ? velocity.kpis.pendings.toLocaleString() : '—'}
          hint={velocity?.comps?.aboveFiveYrAvgPct ? `+${velocity.comps.aboveFiveYrAvgPct}% vs 5y` : 'All counties'}
          badge={velocity?.comps?.aboveFiveYrAvgPct ? `+${velocity.comps.aboveFiveYrAvgPct}%` : undefined}
          strong
        />
        <KpiTile
          label="Median TTC"
          value={ttc ? `${ttc.kpis.median} days` : '—'}
          hint={`Target ${ttc?.kpis.target ?? 21}d`}
          badge={ttc ? ttc.kpis.stance : undefined}
          strong
        />
        <KpiTile
          label="Pricing Pressure"
          value={pricegap ? balanceLabel(pricegap) : '—'}
          hint="Price → Sale gap mix"
          badge={pricegap ? headlineGap(pricegap) : undefined}
          strong
        />
      </div>

      {/* Mini charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PremiumCard
          title="Listings vs Pending (mini)"
          subtitle="WoW signal"
          right={<Link href="/dashboard/market/velocity" className="underline hover:text-brand-600 transition-colors">Details →</Link>}
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={velocity?.series ?? []} margin={{ left: 8, right: 8, top: 6 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="active" radius={[6,6,0,0]} fill="var(--chart-accent)" name="Actives"/>
                <Bar dataKey="pending" radius={[6,6,0,0]} fill="var(--chart-line)" name="Pendings"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PremiumCard>

        <PremiumCard
          title="Time to Contract (mini)"
          subtitle="30-day actuals"
          right={<Link href="/dashboard/market/time-to-contract" className="underline hover:text-brand-600 transition-colors">Timing details →</Link>}
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ttc?.series ?? []} margin={{ left: 8, right: 8, top: 6 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="ttc" stroke="var(--chart-accent)" strokeWidth={3} dot={false}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </PremiumCard>
      </div>

      {/* County pulse + preview gap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PremiumCard title="County Pulse (7d)" subtitle="New • Pending • Price • DOM">
          <CountyPulseCompact />
          <div className="hr my-3"></div>
          <Link href="/dashboard/geography" className="underline hover:text-brand-600 transition-colors">details →</Link>
        </PremiumCard>

        <PremiumCard
          title="Price → Sale Gap (preview)"
          subtitle="By segment"
          right={<Link href="/dashboard/segments/pricing" className="underline hover:text-brand-600 transition-colors">Pricing details →</Link>}
        >
          <div className="space-y-3">
            {(pricegap?.bySegment ?? []).slice(0,5).map((s) => (
              <div key={s.segment} className="flex items-center gap-3">
                <div className="w-40 shrink-0 text-sm text-muted truncate" title={s.segment}>{s.segment}</div>
                <div className="flex-1 relative h-3">
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 dark:bg-gray-700" />
                  <div
                    className={`absolute h-full rounded-full ${s.gapPct>=0 ? 'bg-orange-500' : 'bg-lime-400'}`}
                    style={{
                      width: `${Math.min(Math.abs(s.gapPct),6)/6*50}%`,
                      left: s.gapPct>=0 ? '50%' : `calc(50% - ${Math.min(Math.abs(s.gapPct),6)/6*50}%)`
                    }}
                  />
                </div>
                <div className="w-12 text-right text-sm text-2">{s.gapPct>0?`+${s.gapPct}%`:`${s.gapPct}%`}</div>
              </div>
            ))}
          </div>
        </PremiumCard>
      </div>

      {/* ZIP Movers */}
      <div>
        <PremiumCard title="ZIP Movers" subtitle="Top six micro-markets right now">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {zipCards.map((z: any) => (
              <Link
                key={z.zip}
                href={`/dashboard/market/zip/${z.zip}`}
                className="card-matte !p-3 hover:scale-105 transition-transform"
              >
                <div className="flex items-baseline justify-between mb-2">
                  <div className="font-medium text-1">{z.zip}</div>
                  <div className="text-xs text-muted">{z.kpis?.dom ? `${z.kpis.dom}d` : ''}</div>
                </div>
                <div className="h-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={(z.trend ?? []).map((p:any, i:number)=>({i, v:p.price}))}>
                      <Line type="monotone" dataKey="v" stroke="var(--chart-line)" strokeWidth={2} dot={false}/>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                {z.ai?.hotBands && <div className="mt-2 text-xs text-muted truncate" title={z.ai.hotBands}>Hot: {z.ai.hotBands}</div>}
              </Link>
            ))}
          </div>
          <div className="hr my-3"></div>
          <Link href="/dashboard/market/zip" className="underline hover:text-brand-600 transition-colors">ZIP directory →</Link>
        </PremiumCard>
      </div>
    </div>
  );
}

function CountyPulseCompact() {
  const rows = [
    { county:'Davidson',   new: 188, pending: 154, price: 525, dom: 21 },
    { county:'Williamson', new: 132, pending: 118, price: 730, dom: 18 },
    { county:'Rutherford', new: 109, pending: 97,  price: 420, dom: 22 },
    { county:'Sumner',     new: 76,  pending: 61,  price: 395, dom: 24 },
    { county:'Wilson',     new: 81,  pending: 69,  price: 410, dom: 23 },
  ];
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {rows.map((c)=>(
        <div key={c.county} className="py-3 grid grid-cols-12 items-center gap-2">
          <div className="col-span-5 sm:col-span-3 font-medium truncate text-1">{c.county}</div>
          <div className="col-span-7 sm:col-span-9 grid grid-cols-4 sm:grid-cols-5 gap-2 text-sm">
            <span className="text-muted">New <b className="text-1">{c.new}</b></span>
            <span className="text-muted">Pending <b className="text-1">{c.pending}</b></span>
            <span className="text-muted">Price <b className="text-1">${c.price}K</b></span>
            <span className="hidden sm:inline text-muted">DOM <b className="text-1">{c.dom}</b></span>
            <Link href={`/dashboard/market/county/${encodeURIComponent(c.county.toLowerCase())}`} className="hover:text-orange-500 transition-colors text-right text-2">details →</Link>
          </div>
        </div>
      ))}
    </div>
  );
}

function UpdatedPill({ iso }: { iso: string }) {
  const t = new Date(iso);
  return (
    <span className="pill flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
      </span>
      <span>Updated {t.toLocaleString()}</span>
    </span>
  );
}

function balanceLabel(pg: any) {
  const pos = (pg?.bySegment ?? []).filter((s:any)=>s.gapPct>=0).length;
  const total = (pg?.bySegment ?? []).length || 1;
  return pos/total >= 0.5 ? 'Seller-leaning' : 'Buyer-leaning';
}

function headlineGap(pg:any){
  const first = (pg?.bySegment ?? [])[0];
  return first ? `${first.gapPct>0?'+':''}${first.gapPct}%` : '—';
}
