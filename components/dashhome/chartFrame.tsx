"use client";
import { Card, CardHeader, CardBody } from "@/lib/ui/card";

export default function ChartFrame({ title, subtitle, children }:{
  title: string; subtitle?: string; children: React.ReactNode;
}){
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-baseline justify-between">
          <span className="text-[15px] leading-none">{title}</span>
          {subtitle && <span className="text-[12px]" style={{color:"var(--sub)"}}>{subtitle}</span>}
        </div>
      </CardHeader>
      <CardBody className="pt-2">{children}</CardBody>
    </Card>
  );
}
