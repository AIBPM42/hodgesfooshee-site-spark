"use client";
import { Card, CardHeader, CardBody } from "@/lib/ui/card-fire";
import { weekVelocity } from "@/lib/mock/agentDash";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function WeekVelocity(){
  return (
    <Card>
      <CardHeader>Listings vs Pending Velocity<span className="ml-2 text-sm text-ui-sub dark:text-ui-dsub">WoW demand vs supply</span></CardHeader>
      <CardBody className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weekVelocity}>
            <XAxis dataKey="label" tick={{fontSize:12}} />
            <YAxis tick={{fontSize:12}} />
            <Tooltip />
            <Legend />
            <Bar dataKey="actives" name="Actives" fill="#F97316" />
            <Bar dataKey="pendings" name="Pendings" fill="#65A30D" />
          </BarChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}
