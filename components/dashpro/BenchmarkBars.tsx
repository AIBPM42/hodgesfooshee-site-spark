"use client";
import { Frame } from "./ChartChrome";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { useChartTheme } from "./useChartTheme";

type Row = { metric:string; you:number; market:number };

export default function BenchmarkBars({ data }:{ data: Row[] }) {
  const c = useChartTheme();
  return (
    <Frame title="Competitive Intelligence" subtitle="You vs Market">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke={c.grid}/>
            <XAxis dataKey="metric" tick={{ fontSize: 12, fill: c.axis }} />
            <YAxis tick={{ fontSize: 12, fill: c.axis }} domain={[0, 100]} />
            <Legend />
            <Bar dataKey="you"    name="You"    fill={c.primary} radius={[8,8,0,0]} />
            <Bar dataKey="market" name="Market" fill={c.neutral} radius={[8,8,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Frame>
  );
}
