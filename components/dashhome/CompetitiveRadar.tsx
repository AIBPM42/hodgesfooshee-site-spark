"use client";
import ChartFrame from "./chartFrame";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { competitiveRadar } from "@/lib/mock/dashHomeData";

export default function CompetitiveRadar(){
  return (
    <ChartFrame title="Competitive Intelligence">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={competitiveRadar}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar name="You" dataKey="you" stroke="#f97316" fill="#f97316" fillOpacity={0.4}/>
            <Radar name="Market" dataKey="market" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.2}/>
            <Legend />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  );
}
