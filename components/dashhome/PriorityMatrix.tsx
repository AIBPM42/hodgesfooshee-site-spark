"use client";
import { useEffect, useState } from "react";
import ChartFrame from "./chartFrame";
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, ZAxis } from "recharts";
import { priorityMatrix as seed } from "@/lib/mock/dashHomeData";

export default function PriorityMatrix(){
  const [data, setData] = useState<typeof seed>([]);

  useEffect(() => {
    setData(seed);
  }, []);

  return (
    <ChartFrame title="Priority (Impact × Urgency)">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <XAxis type="number" dataKey="impact" name="Impact" domain={[0,100]} />
            <YAxis type="number" dataKey="urgency" name="Urgency" domain={[0,100]} />
            <ZAxis type="number" range={[60, 200]} dataKey="id" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter data={data} fill="var(--brand-orange)" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  );
}
