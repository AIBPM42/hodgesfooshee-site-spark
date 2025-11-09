"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type BarChartBlockProps = {
  title: string;
  data: { range: string; count: number }[];
  dataKey?: string;
  color?: string;
};

export function BarChartBlock({
  title,
  data,
  dataKey = "count",
  color = "#E76A3C",
}: BarChartBlockProps) {
  return (
    <div className="rounded-3xl bg-[#FBF3E7] border border-black/5 shadow-elev-1 p-6">
      <h3 className="text-xl font-semibold text-neutral-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#00000010" />
          <XAxis
            dataKey="range"
            tick={{ fill: "#78716c", fontSize: 11 }}
            stroke="#00000020"
            angle={-20}
            textAnchor="end"
            height={60}
          />
          <YAxis
            tick={{ fill: "#78716c", fontSize: 12 }}
            stroke="#00000020"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FBF3E7",
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: "12px",
              boxShadow: "0 6px 18px -6px rgba(20,20,20,.15)",
            }}
            formatter={(value: number) => [`${value} listings`, "Count"]}
          />
          <Bar dataKey={dataKey} fill={color} radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
