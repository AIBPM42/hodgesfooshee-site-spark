"use client";
import { Card, CardHeader, CardBody } from "@/lib/ui/card";
import { clsx } from "clsx";

export function Frame({
  title, subtitle, right, children,
}: { title: string; subtitle?: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <div className="text-[15px]" style={{ color: "var(--ink)" }}>{title}</div>
            {subtitle && <div className="text-[12px]" style={{ color: "var(--sub)" }}>{subtitle}</div>}
          </div>
          {right}
        </div>
      </CardHeader>
      <CardBody className="pt-2">{children}</CardBody>
    </Card>
  );
}

export function LegendBadge({ tone = "neutral", children }:{
  tone?: "positive"|"negative"|"neutral"|"highlight"; children: React.ReactNode;
}) {
  const toneMap: Record<string, {bg:string; bd:string; fg:string}> = {
    positive: { bg:"rgba(120,184,75,.12)", bd:"rgba(120,184,75,.32)", fg:"#78B84B" },
    negative: { bg:"rgba(255,82,82,.12)",  bd:"rgba(255,82,82,.28)",  fg:"#FF5252" },
    highlight:{ bg:"rgba(255,126,10,.12)", bd:"rgba(255,126,10,.34)", fg:"#FF7E0A" },
    neutral:  { bg:"color-mix(in oklab, var(--muted) 82%, transparent)", bd:"var(--border)", fg:"var(--sub)" },
  };
  const t = toneMap[tone];
  return (
    <span className={clsx("inline-flex items-center gap-1 px-2 py-[2px] rounded-[10px] border text-[11px]")}
          style={{ background:t.bg, borderColor:t.bd, color:t.fg }}>
      {children}
    </span>
  );
}

/** Simple tooltip shell to keep everything on-brand */
export function TooltipShell({ title, lines }:{
  title?: string; lines: Array<{label:string; value:string}>;
}) {
  return (
    <div className="rounded-[10px] border backdrop-blur-md p-2"
         style={{ background:"color-mix(in oklab, var(--surface) 85%, transparent)", borderColor:"var(--border)" }}>
      {title && <div className="text-[12px] font-medium mb-1" style={{ color:"var(--ink)" }}>{title}</div>}
      <div className="space-y-0.5">
        {lines.map((l,i)=>(
          <div key={i} className="text-[12px] flex justify-between gap-6">
            <span style={{ color:"var(--sub)" }}>{l.label}</span>
            <span style={{ color:"var(--ink)" }}>{l.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Format helpers */
export const fmtUSD0 = (n:number)=> n.toLocaleString("en-US",{ style:"currency", currency:"USD", maximumFractionDigits:0 });
export const pct0 = (n:number)=> `${Math.round(n*100)}%`;
export const pct1 = (n:number)=> `${(n*100).toFixed(1)}%`;
