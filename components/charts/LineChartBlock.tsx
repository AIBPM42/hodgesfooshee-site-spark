"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type LineChartBlockProps = {
  title: string;
  data: { month: string; value: number }[];
  dataKey?: string;
  color?: string;
};

export function LineChartBlock({
  title,
  data,
  dataKey = "value",
  color = "#E76A3C",
}: LineChartBlockProps) {
  return (
    <div className="rounded-3xl bg-[#FBF3E7] border border-black/5 shadow-elev-1 p-6">
      <h3 className="text-xl font-semibold text-neutral-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#00000010" />
          <XAxis
            dataKey="month"
            tick={{ fill: "#78716c", fontSize: 12 }}
            stroke="#00000020"
          />
          <YAxis
            tick={{ fill: "#78716c", fontSize: 12 }}
            stroke="#00000020"
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FBF3E7",
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: "12px",
              boxShadow: "0 6px 18px -6px rgba(20,20,20,.15)",
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, "Median Price"]}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={3}
            dot={{ fill: color, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
