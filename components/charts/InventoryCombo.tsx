"use client";
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { month: "Apr '24", active: 3200, new: 420 },
  { month: "May", active: 3100, new: 450 },
  { month: "Jun", active: 3050, new: 410 },
  { month: "Jul", active: 2980, new: 380 },
  { month: "Aug", active: 2850, new: 360 },
  { month: "Sep", active: 2750, new: 340 },
  { month: "Oct", active: 2680, new: 320 },
  { month: "Nov", active: 2600, new: 310 },
  { month: "Dec", active: 2550, new: 290 },
  { month: "Jan '25", active: 2500, new: 280 },
  { month: "Feb", active: 2450, new: 270 },
  { month: "Mar", active: 2420, new: 260 },
];

export default function InventoryCombo() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <ComposedChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
        <XAxis
          dataKey="month"
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
        <Legend wrapperStyle={{ fontSize: "12px" }} />
        <Area
          type="monotone"
          dataKey="active"
          stroke="#E87722"
          fill="#E87722"
          fillOpacity={0.2}
          strokeWidth={2}
          name="Active Listings"
        />
        <Line
          type="monotone"
          dataKey="new"
          stroke="#7BB241"
          strokeWidth={2}
          dot={{ r: 3 }}
          name="New Listings"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
