"use client";
import { Frame, LegendBadge } from "./ChartChrome";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from "recharts";
import { useChartTheme } from "./useChartTheme";

type ZipRow = { zip:string; trend:Array<{x:number;y:number}>; delta:number };

export default function SparklineGrid({ items }:{ items: ZipRow[] }) {
  const c = useChartTheme();
  return (
    <Frame title="Micro-Market Momentum" subtitle="ZIP trends (30d)"
           right={<LegendBadge tone="neutral">Δ = 30d change</LegendBadge>}>
      <div className="grid md:grid-cols-5 gap-4">
        {items.map((z)=>(
          <div key={z.zip} className="rounded-[12px] border p-2"
               style={{ background:"color-mix(in oklab, var(--muted) 82%, transparent)", borderColor:"var(--border)" }}>
            <div className="flex items-center justify-between text-[12px] mb-1">
              <span style={{ color:"var(--ink)" }}>{z.zip}</span>
              <span style={{ color: z.delta>=0 ? "#78B84B" : "#FF5252" }}>
                {z.delta>=0 ? "▲" : "▼"} {(z.delta*100).toFixed(1)}%
              </span>
            </div>
            <div className="h-16">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={z.trend}>
                  <XAxis dataKey="x" hide />
                  <YAxis hide />
                  <Area type="monotone" dataKey="y" stroke={c.secondary} fill={c.secondary} fillOpacity={0.18} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}
