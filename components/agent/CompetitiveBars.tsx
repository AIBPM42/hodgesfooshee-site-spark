"use client";
import { Card, CardHeader, CardBody } from "@/lib/ui/card-fire";
import { competitive } from "@/lib/mock/agentDash";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function CompetitiveBars(){
  return (
    <Card>
      <CardHeader>Competitive Intelligence<span className="ml-2 text-sm text-ui-sub dark:text-ui-dsub">You vs Market</span></CardHeader>
      <CardBody className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={competitive}>
            <XAxis dataKey="metric" tick={{fontSize:12}} />
            <YAxis tick={{fontSize:12}} />
            <Tooltip />
            <Legend />
            <Bar dataKey="you" name="You" fill="#F97316" />
            <Bar dataKey="market" name="Market" fill="#9AA3AF" />
          </BarChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}
