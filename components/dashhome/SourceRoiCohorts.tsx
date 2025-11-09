"use client";
import ChartFrame from "./chartFrame";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
import { sourceRoi } from "@/lib/mock/dashHomeData";

export default function SourceRoiCohorts(){
  const data = sourceRoi.map(s=>({
    source: s.source,
    roi: Math.round((s.gci / s.cost)*100)/100,
    cost: s.cost,
    gci: s.gci
  }));

  return (
    <ChartFrame title="Source ROI">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="source" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="roi" fill="#10b981" name="ROI Multiple"/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  );
}
