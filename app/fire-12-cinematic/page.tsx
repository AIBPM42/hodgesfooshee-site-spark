// HODGES & FOOSHEE – FIRE 12 DASHBOARD (Next.js 14 • App Router)
// Premium, charts-only admin for Nashville/Middle TN (9 counties)
// Tech: Tailwind, next-themes, Recharts, Lucide • Cinematic Edition
// Glassphoria + brand colors + aurora background

"use client";
import { ModeToggle } from "@/components/mode-toggle";
import { Sparkline } from "@/components/sparkline";
import { Gauge } from "@/components/gauge";
import {
  snapshot30_60_90, pricingPower, inventorySeries, priceCutWeekly, domBuckets,
  microNeighborhoods, migrationSankey, offerIntensity, rentalByCounty,
  leaderboard, funnel, COUNTIES
} from "@/lib/mock";
import { useMemo, useState } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer,
  CartesianGrid, Area, AreaChart, PieChart, Pie, Cell, Treemap, FunnelChart, Funnel, LabelList, Sankey
} from "recharts";
import { Filter, Rocket } from "lucide-react";

// Composed chart helper for price cuts
function ComposedCuts({ data }:{ data:{week:string;rate:number;reduction:number}[] }){
  return(
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" className="grid-muted"/>
      <XAxis dataKey="week" stroke="#A9B1BC" tickLine={false} axisLine={false}/>
      <YAxis yAxisId="left" stroke="#A9B1BC" tickLine={false} axisLine={false} tickFormatter={(v)=>`${Math.round(v*100)}%`}/>
      <YAxis yAxisId="right" orientation="right" stroke="#A9B1BC" tickLine={false} axisLine={false}/>
      <RTooltip contentStyle={{background:'var(--bg-2)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12}}/>
      <defs>
        <linearGradient id="pcr" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C0392B" stopOpacity={0.95}/>
          <stop offset="100%" stopColor="#8B2A20" stopOpacity={0.85}/>
        </linearGradient>
      </defs>
      <Bar yAxisId="left" dataKey="rate" name="Price‑cut %" fill="url(#pcr)" radius={[12,12,8,8]} />
      <Line yAxisId="right" type="monotone" dataKey="reduction" name="Median $ cut" stroke="#7BB241" strokeWidth={2.5} dot={false}/>
    </BarChart>
  );
}

export default function Page(){
  const [county,setCounty]=useState<string>("Davidson");
  const [range,setRange]=useState<string>("90");
  const [tier,setTier]=useState<string>("all");

  const temperature = useMemo(()=>{
    // naive composite: MOS (weight 0.45), DOM (0.35), priceCutRate(0.20)
    const mos=3.9, dom=50, cut=0.28;
    const norm = (mos/6)*45 + (Math.min(dom,90)/90)*35 + (cut/0.35)*20;
    return Math.round(norm);
  },[county,range]);

  return(
    <main className="space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold drop-shadow-[0_0_6px_rgba(255,255,255,.22)]">Hodges Pro — Fire 12 Dashboard</h1>
          <p className="text-white/60">Nashville & Middle Tennessee • Cinematic Matte • Side Tabs</p>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle/>
          <button className="btn btn-accent flex items-center gap-2"><Rocket className="w-4 h-4"/>Celebrate</button>
        </div>
      </header>

      {/* Filters */}
      <div className="glass glow p-4 md:p-5">
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-white/70 text-sm">Filters</span>
          <select value={county} onChange={e=>setCounty(e.target.value)} className="bg-transparent border border-white/15 rounded-2xl px-3 py-2">
            {COUNTIES.map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={tier} onChange={e=>setTier(e.target.value)} className="bg-transparent border border-white/15 rounded-2xl px-3 py-2">
            <option value="all">All Price Tiers</option>
            <option value="lt400">&lt;$400k</option>
            <option value="400-700">$400–700k</option>
            <option value="700-1200">$700k–$1.2m</option>
            <option value="gt1200">&gt;$1.2m</option>
          </select>
          <select value={range} onChange={e=>setRange(e.target.value)} className="bg-transparent border border-white/15 rounded-2xl px-3 py-2">
            <option value="30">30d</option>
            <option value="60">60d</option>
            <option value="90">90d</option>
          </select>
          <button className="btn flex items-center gap-2"><Filter className="w-4 h-4"/>Clear</button>
        </div>
      </div>

      {/* Row 1 – Command Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass glass-emboss glow p-5">
          <div className="card-title">Market Temperature</div>
          <div className="mt-2 flex items-center justify-center"><Gauge value={temperature} label={`${county} • ${range}d`} /></div>
          <div className="mt-3 text-xs text-white/60 text-center">Composite of MOS, DOM, and Price‑Cut Rate</div>
        </div>

        <div className="glass glass-emboss glow p-5">
          <div className="card-title">30/60/90 Snapshot</div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {[
              { label:"Median Price", val:snapshot30_60_90.medianPrice.d30, delta:snapshot30_60_90.medianPrice.wow, fmt:(v:number)=>`$${v.toLocaleString()}` },
              { label:"DOM", val:snapshot30_60_90.dom.d30, delta:snapshot30_60_90.dom.wow, fmt:(v:number)=>`${v} days` },
              { label:"New Listings", val:snapshot30_60_90.newListings.d30, delta:snapshot30_60_90.newListings.wow, fmt:(v:number)=>v.toLocaleString() },
            ].map((k,i)=> (
              <div key={i} className="glass p-3">
                <div className="text-xs text-white/60">{k.label}</div>
                <div className="kpi-num">{k.fmt(k.val)}</div>
                <div className={`text-xs ${k.delta>=0?"text-emerald-400":"text-rose-400"}`}>{k.delta>0?"▲":"▼"} {Math.abs(k.delta).toFixed(1)}% WoW</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass glass-emboss glow p-5">
          <div className="card-title">Pricing Power (List → Sale)</div>
          <div className="h-48 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pricingPower} margin={{top:8,right:12,left:0,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" className="grid-muted"/>
                <XAxis dataKey="tier" stroke="#A9B1BC" tickLine={false} axisLine={false}/>
                <YAxis stroke="#A9B1BC" tickLine={false} axisLine={false}/>
                <RTooltip contentStyle={{background:'var(--bg-2)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12}}/>
                <defs>
                  <linearGradient id="pp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E87722" stopOpacity={0.95}/>
                    <stop offset="100%" stopColor="#6F4DA0" stopOpacity={0.85}/>
                  </linearGradient>
                </defs>
                <Bar dataKey="pct" name="% of List" radius={[12,12,8,8]} fill="url(#pp)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-xs text-white/60">Avg $ reduction: tier‑specific deltas</div>
        </div>
      </div>

      {/* Row 2 – Market Intelligence */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="glass p-5 xl:col-span-2">
          <div className="card-title">Inventory Pressure (18 mo)</div>
          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inventorySeries}>
                <CartesianGrid strokeDasharray="3 3" className="grid-muted"/>
                <XAxis dataKey="month" stroke="#A9B1BC" tickLine={false} axisLine={false}/>
                <YAxis yAxisId="left" stroke="#A9B1BC" tickLine={false} axisLine={false}/>
                <YAxis yAxisId="right" orientation="right" stroke="#A9B1BC" tickLine={false} axisLine={false}/>
                <RTooltip contentStyle={{background:'var(--bg-2)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12}}/>
                <defs>
                  <linearGradient id="nl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E87722" stopOpacity={0.95}/>
                    <stop offset="100%" stopColor="#C0392B" stopOpacity={0.85}/>
                  </linearGradient>
                </defs>
                <Bar yAxisId="left" dataKey="new" name="New Listings" fill="url(#nl)" radius={[12,12,8,8]} />
                <Line yAxisId="right" type="monotone" dataKey="active" name="Active Inventory" stroke="#6F4DA0" strokeWidth={2.5} dot={false}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass glass-emboss glow p-5">
          <div className="card-title">Price‑Cut Velocity (weekly)</div>
          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedCuts data={priceCutWeekly} />
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3 – Hyper‑Local */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="glass p-5 xl:col-span-2">
          <div className="card-title">Neighborhood Micro‑Trends (90d)</div>
          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <Treemap data={microNeighborhoods.map(m=>({ name:m.name, size:Math.abs(m.value)*1000, value:m.value }))} dataKey="size" stroke="#ffffff10" fill="#6F4DA0" />
            </ResponsiveContainer>
          </div>
          <div className="text-xs text-white/60 mt-2">Color intensity ~ appreciation; click segment → comps</div>
        </div>

        <div className="glass glass-emboss glow p-5">
          <div className="card-title">DOM Distribution</div>
          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={domBuckets}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)"/>
                <XAxis dataKey="range" stroke="#aaa" tickLine={false} axisLine={false}/>
                <YAxis stroke="#aaa" tickLine={false} axisLine={false}/>
                <RTooltip contentStyle={{background:'#0f1117',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12}}/>
                <defs>
                  <linearGradient id="dom" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7BB241" stopOpacity={0.95}/>
                    <stop offset="100%" stopColor="#3A7E1F" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
                <Bar dataKey="count" radius={[12,12,8,8]} fill="url(#dom)"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 4 – Deal Makers */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="glass glass-emboss glow p-5">
          <div className="card-title">Offer Intensity</div>
          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={offerIntensity} dataKey="pct" nameKey="bucket" cx="50%" cy="50%" outerRadius={90} innerRadius={40} paddingAngle={2} stroke="#ffffff18" strokeWidth={2}>
                  {offerIntensity.map((_,i)=>(<Cell key={i} fill={["#6F4DA0","#E87722","#7BB241","#C0392B"][i%4]} />))}
                </Pie>
                <RTooltip contentStyle={{background:'#0f1117',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12}}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass glass-emboss glow p-5">
          <div className="card-title">Buyer Migration (feeder → county)</div>
          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <Sankey data={migrationSankey} nodePadding={30} margin={{left:0,right:0,top:10,bottom:10}} link={{ stroke: "#ffffff33" }} node={{ fill: "#E87722" }} />
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass glass-emboss glow p-5">
          <div className="card-title">Investor Lens (yield)</div>
          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rentalByCounty}>
                <defs>
                  <linearGradient id="yld" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7BB241" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#7BB241" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)"/>
                <XAxis dataKey="county" stroke="#aaa" tickLine={false} axisLine={false}/>
                <YAxis stroke="#aaa" tickLine={false} axisLine={false}/>
                <RTooltip contentStyle={{background:'#0f1117',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12}}/>
                <Area type="monotone" dataKey="yield" stroke="#7BB241" strokeWidth={2} fill="url(#yld)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 5 – Performance & Pipeline */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="glass p-5 xl:col-span-2 overflow-auto">
          <div className="card-title">Agent Leaderboard</div>
          <table className="w-full text-sm mt-3">
            <thead className="bg-white/5">
              <tr>
                <th className="px-4 py-2 text-left">Agent</th>
                <th className="px-4 py-2 text-right">List→Sale %</th>
                <th className="px-4 py-2 text-right">DOM vs Mkt (days)</th>
                <th className="px-4 py-2 text-right">12‑mo Volume</th>
                <th className="px-4 py-2 text-right">Resp (min)</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((r,i)=> (
                <tr key={i} className="border-t border-white/10 hover:bg-white/5">
                  <td className="px-4 py-2">{r.agent}</td>
                  <td className="px-4 py-2 text-right">{r.ratio.toFixed(1)}%</td>
                  <td className="px-4 py-2 text-right">{r.domVsMkt}</td>
                  <td className="px-4 py-2 text-right">{r.volume}</td>
                  <td className="px-4 py-2 text-right">{r.resp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="glass glass-emboss glow p-5">
          <div className="card-title">Deal Pipeline</div>
          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Funnel dataKey="value" data={funnel} isAnimationActive>
                  <LabelList position="right" fill="#fff" stroke="none" dataKey="stage" />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <footer className="text-center text-white/50 text-[11px] tracking-wide mt-10">Hodges & Fooshee Realty • {new Date().getFullYear()} • Cinematic Edition</footer>
    </main>
  );
}
