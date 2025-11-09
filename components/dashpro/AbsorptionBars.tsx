"use client";
import { Frame, LegendBadge } from "./ChartChrome";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { useChartTheme } from "./useChartTheme";

type Row = { label:string; demand:number }; // 0..1

export default function AbsorptionBars({ rows }:{ rows: Row[] }) {
  const c = useChartTheme();
  const data = rows.map(r=>({ ...r, pct: Math.round(r.demand*100) }));
  return (
    <Frame
      title="Demand Index by Segment"
      subtitle="Absorption rate (0–100)"
      right={<LegendBadge tone="positive">Higher = sells faster</LegendBadge>}
    >
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid stroke={c.grid} />
            <XAxis type="number" tick={{ fill: c.axis }} domain={[0,100]} />
            <YAxis dataKey="label" type="category" tick={{ fill: c.axis }} width={120} />
            <Bar dataKey="pct" fill={c.success} radius={[0,8,8,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Frame>
  );
}
