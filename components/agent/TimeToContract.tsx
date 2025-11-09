"use client";
import { Card, CardHeader, CardBody } from "@/lib/ui/card-fire";
import { timeToContract } from "@/lib/mock/agentDash";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function TimeToContract(){
  return (
    <Card>
      <CardHeader>Time to Contract<span className="ml-2 text-sm text-ui-sub dark:text-ui-dsub">Actual (days)</span></CardHeader>
      <CardBody className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timeToContract}>
            <XAxis dataKey="day" tick={{fontSize:12}} />
            <YAxis tick={{fontSize:12}} />
            <Tooltip />
            <Line dataKey="actual" stroke="#F97316" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}
