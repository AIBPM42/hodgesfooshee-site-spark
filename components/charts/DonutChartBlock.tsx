"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

type DonutChartBlockProps = {
  title: string;
  data: { type: string; percentage: number }[];
};

const COLORS = ["#E76A3C", "#F29A76", "#D85A2E", "#C14E28", "#A84324"];

export function DonutChartBlock({ title, data }: DonutChartBlockProps) {
  const chartData = data.map((item) => ({
    name: item.type,
    value: item.percentage,
  }));

  return (
    <div className="rounded-3xl bg-[#FBF3E7] border border-black/5 shadow-elev-1 p-6">
      <h3 className="text-xl font-semibold text-neutral-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#FBF3E7",
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: "12px",
              boxShadow: "0 6px 18px -6px rgba(20,20,20,.15)",
            }}
            formatter={(value: number) => [`${value}%`, "Percentage"]}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{ fontSize: "13px", color: "#44403c" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
