"use client";
import { Card, CardHeader, CardBody } from "@/lib/ui/card-fire";
import { zipMomentum } from "@/lib/mock/agentDash";
import { LineChart, Line, ResponsiveContainer } from "recharts";

export default function ZipMomentum(){
  return (
    <Card>
      <CardHeader>Micro-Market Momentum<span className="ml-2 text-sm text-ui-sub dark:text-ui-dsub">ZIP trends (30d)</span></CardHeader>
      <CardBody className="grid md:grid-cols-6 gap-3">
        {zipMomentum.map(z=>(
          <div key={z.zip} className="rounded-xl border border-ui-border dark:border-ui-dborder p-3 bg-ui-light/70 dark:bg-ui-dark2">
            <div className="flex items-baseline justify-between">
              <div className="text-sm font-medium">{z.zip}</div>
              <div className={`text-xs ${z.change>=0?"text-emerald-600 dark:text-emerald-300":"text-red-600 dark:text-red-300"}`}>
                {z.change>=0? "▲":"▼"} {(z.change*100).toFixed(1)}%
              </div>
            </div>
            <div className="h-16">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={z.series.map((v,i)=>({i,v}))}>
                  <Line dataKey="v" stroke="#7C3AED" dot={false} strokeWidth={2}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
