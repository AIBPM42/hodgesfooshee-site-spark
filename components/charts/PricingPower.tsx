"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer } from "recharts";

const data = [
  { tier: "<$400k", pct: 98.2 },
  { tier: "$400-700k", pct: 96.5 },
  { tier: "$700k-$1.2m", pct: 94.8 },
  { tier: ">$1.2m", pct: 92.1 },
];

export default function PricingPower() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
        <defs>
          <linearGradient id="pp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E87722" stopOpacity={0.95} />
            <stop offset="100%" stopColor="#6F4DA0" stopOpacity={0.85} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
        <XAxis
          dataKey="tier"
          tick={{ fill: "currentColor", opacity: 0.6, fontSize: 11 }}
          axisLine={{ stroke: "currentColor", opacity: 0.2 }}
        />
        <YAxis
          tick={{ fill: "currentColor", opacity: 0.6, fontSize: 11 }}
          axisLine={{ stroke: "currentColor", opacity: 0.2 }}
        />
        <RTooltip
          contentStyle={{
            backgroundColor: "var(--tooltip-bg)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
          }}
        />
        <Bar dataKey="pct" fill="url(#pp)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
