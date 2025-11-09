"use client";
import { kpis } from "@/lib/mock/dashHomeData";
import { TrendingUp, Timer, CircleDollarSign, Briefcase } from "lucide-react";

const fmtUSD = (n:number)=> n.toLocaleString("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0});

function Chip({children}:{children:React.ReactNode}){
  return (
    <span className="inline-flex items-center gap-1 px-2 py-[2px] rounded-[10px] border text-[11px]"
          style={{background:"color-mix(in oklab, var(--muted) 80%, transparent)", borderColor:"var(--border)", color:"var(--sub)"}}>
      {children}
    </span>
  );
}

function Kpi({ icon:Icon, label, value, sub }:{
  icon:any; label:string; value:string; sub?:string;
}){
  return (
    <div className="flex items-center justify-between rounded-[14px] border p-4"
         style={{background:"color-mix(in oklab, var(--surface) 94%, transparent)",
                 borderColor:"var(--border)", boxShadow:"var(--shadow-card)"}}>
      <div className="flex items-center gap-3">
        <div className="rounded-[12px] p-2 border"
             style={{background:"var(--muted)", borderColor:"var(--border)"}}>
          <Icon size={18}/>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <div className="text-[11px] uppercase tracking-wide" style={{color:"var(--sub)"}}>{label}</div>
            {sub && <Chip>{sub}</Chip>}
          </div>
          <div className="text-[22px] font-semibold" style={{color:"var(--ink)"}}>{value}</div>
        </div>
      </div>
      {/* logo gradient meter */}
      <div className="hidden md:block h-2 w-24 rounded-[999px]"
           style={{background:"linear-gradient(90deg, var(--brand-plum), var(--brand-orange), var(--brand-gold))", opacity:.28}}/>
    </div>
  );
}

export default function KpiRow(){
  return (
    <div className="grid md:grid-cols-4 gap-4">
      <Kpi icon={CircleDollarSign} label="Pipeline Value" value={fmtUSD(kpis.pipelineValue)} sub="weighted 30d"/>
      <Kpi icon={Briefcase}       label="Active Deals"   value={String(kpis.activeDeals)} sub="open opps"/>
      <Kpi icon={Timer}           label="Avg DOM"        value={`${kpis.avgDom} days`} sub="rolling 30d"/>
      <Kpi icon={TrendingUp}      label="Absorption"     value={`${Math.round(kpis.absorptionRate*100)}%`} sub="by segment"/>
    </div>
  );
}
