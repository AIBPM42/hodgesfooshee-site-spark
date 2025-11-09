"use client";
import { Frame } from "./ChartChrome";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Area, CartesianGrid } from "recharts";
import { useChartTheme } from "./useChartTheme";

type Pt = { day:number; actual?:number|null; predicted?:number|null; low?:number|null; high?:number|null };

export default function ConfidenceLine({ data }:{ data: Pt[] }) {
  const c = useChartTheme();
  return (
    <Frame title="Time to Contract" subtitle="Actual vs forecast (days)">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke={c.grid} />
            <XAxis dataKey="day" tick={{ fill: c.axis }} />
            <YAxis tick={{ fill: c.axis }} />
            <Area type="monotone" dataKey="high" stroke="transparent" fill={c.bandHi} />
            <Area type="monotone" dataKey="low"  stroke="transparent" fill={c.bandLo} />
            <Line type="monotone" dataKey="actual"    stroke="#3B82F6" dot={false} strokeWidth={2}/>
            <Line type="monotone" dataKey="predicted" stroke={c.primary} strokeDasharray="4 4" dot={false} strokeWidth={2}/>
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Frame>
  );
}
