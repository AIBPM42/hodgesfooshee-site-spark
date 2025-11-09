"use client";
import ChartFrame from "./chartFrame";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area } from "recharts";
import { domPrediction } from "@/lib/mock/dashHomeData";

export default function DomPredictionCurves(){
  return (
    <ChartFrame title="DOM Prediction">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={domPrediction}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="high" stroke="transparent" fill="#fde68a" />
            <Area type="monotone" dataKey="low" stroke="transparent" fill="#fef9c3" />
            <Line type="monotone" dataKey="actual" stroke="#0ea5e9" dot={false}/>
            <Line type="monotone" dataKey="predicted" stroke="#f97316" strokeDasharray="4 4" dot={false}/>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  );
}
