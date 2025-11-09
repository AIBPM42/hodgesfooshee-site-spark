"use client";
import ChartFrame from "./chartFrame";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import { dealFunnel } from "@/lib/mock/dashHomeData";

const data = dealFunnel.map((d, i, arr) => ({
  ...d,
  conv: i===0?null:Math.round((d.count/arr[i-1].count)*100)
}));

export default function DealVelocityFunnel(){
  return (
    <ChartFrame title="Deal Velocity (Conversion by Stage)">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <XAxis dataKey="stage" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" radius={[8,8,0,0]}>
              <LabelList dataKey="conv" position="top" formatter={(v:any)=> v ? `${v}%` : ""} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  );
}
