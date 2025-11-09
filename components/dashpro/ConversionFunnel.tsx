"use client";
import { Frame } from "./ChartChrome";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LabelList, CartesianGrid } from "recharts";
import { useChartTheme } from "./useChartTheme";

type Stage = { stage:string; count:number };

export default function ConversionFunnel({ data }:{ data: Stage[] }) {
  const c = useChartTheme();
  const withConv = data.map((d, i, arr) => ({ ...d, conv: i===0 ? null : Math.round((d.count/arr[i-1].count)*100) }));
  return (
    <Frame title="Deal Velocity" subtitle="Stage conversion rates">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={withConv} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke={c.grid}/>
            <XAxis dataKey="stage" tick={{ fontSize: 12, fill: c.axis }} />
            <YAxis tick={{ fontSize: 12, fill: c.axis }} />
            <Bar dataKey="count" fill={c.primary} radius={[10,10,0,0]}>
              <LabelList dataKey="conv" position="top" formatter={(v)=> v ? `${v}%` : ""} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Frame>
  );
}
