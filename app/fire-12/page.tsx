"use client";
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

export default function Page(){
  const [county,setCounty]=useState<string>("Davidson");
  const [range,setRange]=useState<string>("90");
  const [tier,setTier]=useState<string>("all");

  const temperature = useMemo(()=>{
    const mos=3.9, dom=50, cut=0.28;
    const norm = (mos/6)*45 + (Math.min(dom,90)/90)*35 + (cut/0.35)*20;
    return Math.round(norm);
  },[county,range]);

  return(
    <main className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-gradient-to-br from-hodges-orange via-hodges-purple to-hodges-green p-[2px]">
            <div className="w-12 h-12 rounded-xl" style={{backgroundColor:'var(--bg-2)'}}/>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold" style={{color:'var(--tx-1)'}}>Fire 12 Dashboard</h1>
            <p className="text-sm opacity-60">Nashville & Middle Tennessee</p>
          </div>
        </div>
        <button className="glass px-4 py-2 rounded-2xl flex items-center gap-2 hover:bg-white/5 transition">
          <Rocket className="w-4 h-4"/>
          <span>Celebrate</span>
        </button>
      </div>

      {/* Filters */}
      <div className="glass p-4 md:p-5">
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-sm opacity-70">Filters</span>
          <select value={county} onChange={e=>setCounty(e.target.value)}
            className="border border-white/10 rounded-xl px-3 py-2 text-sm" style={{backgroundColor:'var(--bg-3)',color:'var(--tx-1)'}}>
            {COUNTIES.map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={tier} onChange={e=>setTier(e.target.value)}
            className="border border-white/10 rounded-xl px-3 py-2 text-sm" style={{backgroundColor:'var(--bg-3)',color:'var(--tx-1)'}}>
            <option value="all">All Price Tiers</option>
            <option value="lt400">&lt;$400k</option>
            <option value="400-700">$400–700k</option>
            <option value="700-1200">$700k–$1.2m</option>
            <option value="gt1200">&gt;$1.2m</option>
          </select>
          <select value={range} onChange={e=>setRange(e.target.value)}
            className="border border-white/10 rounded-xl px-3 py-2 text-sm" style={{backgroundColor:'var(--bg-3)',color:'var(--tx-1)'}}>
            <option value="30">30d</option>
            <option value="60">60d</option>
            <option value="90">90d</option>
          </select>
          <button className="px-3 py-2 rounded-xl border border-white/10 hover:bg-white/5 flex items-center gap-2 transition text-sm">
            <Filter className="w-4 h-4"/>Clear
          </button>
        </div>
      </div>

      {/* Market Temperature */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="glass glow p-5">
          <div className="card-title">Market Temperature</div>
          <div className="mt-2 flex items-center justify-center">
            <Gauge value={temperature} label={`${county} • ${range}d`} />
          </div>
          <div className="mt-3 text-xs opacity-60 text-center">Composite: MOS, DOM, Price‑Cut Rate</div>
        </div>

        <div className="glass glow p-5 lg:col-span-2">
          <div className="card-title">30/60/90 Snapshot</div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <div className="text-xs opacity-60">Median Price</div>
              <div className="kpi-num text-hodges-orange">${(snapshot30_60_90.medianPrice.d90/1000).toFixed(0)}k</div>
              <div className="text-xs text-hodges-crimson">{snapshot30_60_90.medianPrice.wow}% WoW</div>
            </div>
            <div>
              <div className="text-xs opacity-60">Days on Market</div>
              <div className="kpi-num text-hodges-purple">{snapshot30_60_90.dom.d90}</div>
              <div className="text-xs text-hodges-crimson">{snapshot30_60_90.dom.wow}% WoW</div>
            </div>
            <div>
              <div className="text-xs opacity-60">New Listings</div>
              <div className="kpi-num text-hodges-green">{snapshot30_60_90.newListings.d90}</div>
              <div className="text-xs text-hodges-crimson">{snapshot30_60_90.newListings.wow}% WoW</div>
            </div>
          </div>
          <div className="mt-4">
            <Sparkline points={[snapshot30_60_90.medianPrice.d30,snapshot30_60_90.medianPrice.d60,snapshot30_60_90.medianPrice.d90]} />
          </div>
        </div>
      </div>

      {/* Pricing Power */}
      <div className="glass glow p-5">
        <div className="card-title">Pricing Power by Tier</div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={pricingPower} margin={{top:20,right:20,left:0,bottom:20}}>
            <defs>
              <linearGradient id="pp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E87722" stopOpacity={0.95}/>
                <stop offset="100%" stopColor="#6F4DA0" stopOpacity={0.85}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="grid-muted"/>
            <XAxis dataKey="tier" className="axis-muted" style={{fontSize:'12px',fill:'var(--tx-1)',opacity:0.7}}/>
            <YAxis className="axis-muted" style={{fontSize:'12px',fill:'var(--tx-1)',opacity:0.7}}/>
            <RTooltip contentStyle={{background:'var(--bg-2)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'12px',color:'var(--tx-1)'}}/>
            <Bar dataKey="pct" fill="url(#pp)" radius={[8,8,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Inventory Pressure */}
      <div className="glass glow p-5">
        <div className="card-title">Inventory Pressure (18 Months)</div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={inventorySeries} margin={{top:10,right:20,left:0,bottom:10}}>
            <CartesianGrid strokeDasharray="3 3" className="grid-muted"/>
            <XAxis dataKey="month" style={{fontSize:'11px',fill:'var(--tx-1)',opacity:0.6}}/>
            <YAxis style={{fontSize:'11px',fill:'var(--tx-1)',opacity:0.6}}/>
            <RTooltip contentStyle={{background:'var(--bg-2)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'12px',color:'var(--tx-1)'}}/>
            <Area type="monotone" dataKey="active" stroke="#E87722" fill="#E87722" fillOpacity={0.2} strokeWidth={2}/>
            <Area type="monotone" dataKey="new" stroke="#7BB241" fill="#7BB241" fillOpacity={0.2} strokeWidth={2}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Price-Cut Velocity & DOM Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass p-5">
          <div className="card-title">Price‑Cut Velocity</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={priceCutWeekly} margin={{top:10,right:10,left:0,bottom:10}}>
              <CartesianGrid strokeDasharray="3 3" className="grid-muted"/>
              <XAxis dataKey="week" style={{fontSize:'11px',fill:'var(--tx-1)',opacity:0.6}}/>
              <YAxis style={{fontSize:'11px',fill:'var(--tx-1)',opacity:0.6}}/>
              <RTooltip contentStyle={{background:'var(--bg-2)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'12px',color:'var(--tx-1)'}}/>
              <Line type="monotone" dataKey="rate" stroke="#C0392B" strokeWidth={3} dot={{r:4}}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass p-5">
          <div className="card-title">DOM Distribution</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={domBuckets} margin={{top:10,right:10,left:0,bottom:10}}>
              <defs>
                <linearGradient id="dom" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7BB241" stopOpacity={0.95}/>
                  <stop offset="100%" stopColor="#3A7E1F" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="grid-muted"/>
              <XAxis dataKey="range" style={{fontSize:'10px',fill:'var(--tx-1)',opacity:0.6}}/>
              <YAxis style={{fontSize:'10px',fill:'var(--tx-1)',opacity:0.6}}/>
              <RTooltip contentStyle={{background:'var(--bg-2)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'12px',color:'var(--tx-1)'}}/>
              <Bar dataKey="count" fill="url(#dom)" radius={[6,6,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Offer Intensity */}
      <div className="glass p-5">
        <div className="card-title">Offer Intensity</div>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={offerIntensity} dataKey="pct" nameKey="bucket" cx="50%" cy="50%" outerRadius={90} label>
              {offerIntensity.map((e,i)=> <Cell key={i} fill={['#E87722','#6F4DA0','#7BB241','#C0392B'][i%4]}/>)}
            </Pie>
            <RTooltip contentStyle={{background:'var(--bg-2)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'12px',color:'var(--tx-1)'}}/>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Buyer Migration Sankey */}
      <div className="glass p-5">
        <div className="card-title">Buyer Migration (Top 3 Cities → Counties)</div>
        <ResponsiveContainer width="100%" height={300}>
          <Sankey
            data={migrationSankey}
            node={{fill:'#E87722',fillOpacity:0.9}}
            link={{stroke:'#6F4DA0',strokeOpacity:0.3}}
          />
        </ResponsiveContainer>
      </div>

      {/* Investor Lens */}
      <div className="glass p-5">
        <div className="card-title">Investor Lens – Rental by County</div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={rentalByCounty} margin={{top:10,right:10,left:0,bottom:10}}>
            <CartesianGrid strokeDasharray="3 3" className="grid-muted"/>
            <XAxis dataKey="county" style={{fontSize:'10px',fill:'var(--tx-1)',opacity:0.6}}/>
            <YAxis style={{fontSize:'10px',fill:'var(--tx-1)',opacity:0.6}}/>
            <RTooltip contentStyle={{background:'var(--bg-2)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'12px',color:'var(--tx-1)'}}/>
            <Bar dataKey="medianRent" fill="#6F4DA0" radius={[6,6,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Agent Leaderboard */}
      <div className="glass p-5">
        <div className="card-title">Agent Leaderboard</div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 opacity-60">Agent</th>
                <th className="text-right py-2 opacity-60">List/Sale %</th>
                <th className="text-right py-2 opacity-60">DOM vs Mkt</th>
                <th className="text-right py-2 opacity-60">Volume</th>
                <th className="text-right py-2 opacity-60">Resp. (min)</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((a,i)=> (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="py-3 font-medium">{a.agent}</td>
                  <td className="text-right text-hodges-green">{a.ratio}%</td>
                  <td className="text-right text-hodges-orange">{a.domVsMkt}</td>
                  <td className="text-right">{a.volume}</td>
                  <td className="text-right opacity-60">{a.resp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deal Pipeline Funnel */}
      <div className="glass p-5">
        <div className="card-title">Deal Pipeline</div>
        <ResponsiveContainer width="100%" height={320}>
          <FunnelChart>
            <Funnel dataKey="value" data={funnel} isAnimationActive>
              {funnel.map((e,i)=> <Cell key={i} fill={['#E87722','#6F4DA0','#7BB241'][i%3]}/>)}
              <LabelList position="right" fill="var(--tx-1)" stroke="none" dataKey="stage" style={{fontSize:'13px'}}/>
            </Funnel>
            <RTooltip contentStyle={{background:'var(--bg-2)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'12px',color:'var(--tx-1)'}}/>
          </FunnelChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}
