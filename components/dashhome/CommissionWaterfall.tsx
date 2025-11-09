"use client";
import ChartFrame from "./chartFrame";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { commissionWaterfall } from "@/lib/mock/dashHomeData";

const data = commissionWaterfall.map(d => ({
  week: d.week,
  weighted: Math.round(d.amount*d.probability),
  gross: d.amount
}));

export default function CommissionWaterfall(){
  const total = data.reduce((s,d)=> s + d.weighted, 0);
  return (
    <ChartFrame title={`Commission Outlook (next 4 wks • est. ${total.toLocaleString("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0})})`}>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="week" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="gross" name="Gross" opacity={0.3} />
            <Bar dataKey="weighted" name="Probability-Weighted" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  );
}
