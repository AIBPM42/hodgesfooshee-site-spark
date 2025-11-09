"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer } from "recharts";

const data = [
  { range: "0-7d", count: 180 },
  { range: "8-14d", count: 320 },
  { range: "15-30d", count: 580 },
  { range: "31-60d", count: 420 },
  { range: "61-90d", count: 280 },
  { range: ">90d", count: 220 },
];

export default function DomHist() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
        <defs>
          <linearGradient id="dom" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7BB241" stopOpacity={0.95} />
            <stop offset="100%" stopColor="#3A7E1F" stopOpacity={0.8} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
        <XAxis
          dataKey="range"
          tick={{ fill: "currentColor", opacity: 0.6, fontSize: 10 }}
          axisLine={{ stroke: "currentColor", opacity: 0.2 }}
        />
        <YAxis
          tick={{ fill: "currentColor", opacity: 0.6, fontSize: 10 }}
          axisLine={{ stroke: "currentColor", opacity: 0.2 }}
        />
        <RTooltip
          contentStyle={{
            backgroundColor: "var(--tooltip-bg)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
          }}
        />
        <Bar dataKey="count" fill="url(#dom)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
