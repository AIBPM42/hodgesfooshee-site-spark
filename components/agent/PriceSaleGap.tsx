"use client";
import { Card, CardHeader, CardBody } from "@/lib/ui/card-fire";
import { priceSaleGap } from "@/lib/mock/agentDash";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

export default function PriceSaleGap(){
  return (
    <Card>
      <CardHeader>Price → Sale Gap<span className="ml-2 text-sm text-ui-sub dark:text-ui-dsub">Median % last 30d</span></CardHeader>
      <CardBody className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={priceSaleGap} layout="vertical" margin={{left:40}}>
            <XAxis type="number" domain={[-6,6]} tick={{fontSize:12}} />
            <YAxis type="category" dataKey="seg" tick={{fontSize:12}} width={140}/>
            <Tooltip />
            <ReferenceLine x={0} stroke="#9CA3AF" />
            <Bar dataKey="gap" fill="#F97316" />
          </BarChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}
