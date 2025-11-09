"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { city: "Los Angeles", davidson: 15, williamson: 42, rutherford: 18 },
  { city: "Atlanta", davidson: 28, williamson: 25, rutherford: 22 },
  { city: "Chicago", davidson: 32, williamson: 18, rutherford: 24 },
];

export default function FeederBars() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
        <XAxis
          dataKey="city"
          tick={{ fill: "currentColor", opacity: 0.6, fontSize: 11 }}
          axisLine={{ stroke: "currentColor", opacity: 0.2 }}
        />
        <YAxis
          tick={{ fill: "currentColor", opacity: 0.6, fontSize: 11 }}
          axisLine={{ stroke: "currentColor", opacity: 0.2 }}
          label={{ value: "% of buyers", angle: -90, position: "insideLeft", style: { fontSize: 11, opacity: 0.6 } }}
        />
        <RTooltip
          contentStyle={{
            backgroundColor: "var(--tooltip-bg)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
          }}
        />
        <Legend wrapperStyle={{ fontSize: "12px" }} />
        <Bar dataKey="davidson" stackId="a" fill="#E87722" name="Davidson" radius={[0, 0, 0, 0]} />
        <Bar dataKey="williamson" stackId="a" fill="#6F4DA0" name="Williamson" radius={[0, 0, 0, 0]} />
        <Bar dataKey="rutherford" stackId="a" fill="#7BB241" name="Rutherford" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
