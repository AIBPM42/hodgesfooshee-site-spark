"use client";
import { Frame } from "./ChartChrome";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, ReferenceLine, CartesianGrid, LabelList } from "recharts";
import { useChartTheme } from "./useChartTheme";

// rows: { segment: "SFH $400–600K", gap: -0.012 }  // -1.2% under list
export default function PriceToSaleBullet({ rows }:{ rows: Array<{segment:string; gap:number}> }) {
  const c = useChartTheme();
  const data = rows.map(r => ({
    ...r,
    pct: +(r.gap*100).toFixed(1),
    fill: r.gap >= 0 ? c.success : "#FF5252"
  }));

  return (
    <Frame title="Price → Sale Gap" subtitle="Median % over/under list (last 30d)">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{left: 20, right: 40}}>
            <CartesianGrid stroke={c.grid} />
            <XAxis type="number" domain={[-6,6]} tick={{ fill: c.axis, fontSize: 12 }} />
            <YAxis dataKey="segment" type="category" width={140} tick={{ fill: c.axis, fontSize: 12 }} />
            <ReferenceLine x={0} stroke={c.axis} strokeWidth={2} />
            <Bar dataKey="pct" radius={[0,8,8,0]} minPointSize={2}>
              {data.map((entry, index) => (
                <Bar key={`bar-${index}`} dataKey="pct" fill={entry.fill} />
              ))}
              <LabelList dataKey="pct" position="right" formatter={(v: number)=> `${v > 0 ? '+' : ''}${v}%`} fill={c.axis} fontSize={11} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Frame>
  );
}
