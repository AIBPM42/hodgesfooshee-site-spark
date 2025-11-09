import { Card, CardBody } from "@/lib/ui/card-fire";
import { kpis } from "@/lib/mock/agentDash";

const usd = (n:number)=> n.toLocaleString("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0});

function K({label, value, hint}:{label:string; value:string; hint?:string}){
  return (
    <div className="flex-1 min-w-[200px]">
      <Card>
        <CardBody>
          <div className="text-xs uppercase tracking-wide text-ui-sub dark:text-ui-dsub">{label}</div>
          <div className="mt-1 text-2xl font-semibold">{value}</div>
          {hint && <div className="text-xs text-ui-sub dark:text-ui-dsub mt-1">{hint}</div>}
        </CardBody>
      </Card>
    </div>
  );
}
export default function Kpis(){
  return (
    <div className="grid gap-3 md:grid-cols-4">
      <K label="Pipeline" value={usd(kpis.pipeline)} hint="weighted 30d"/>
      <K label="Active Deals" value={String(kpis.deals)} hint="open opps"/>
      <K label="Avg DOM" value={`${kpis.dom} days`} hint="rolling 30d"/>
      <K label="Absorption" value={`${Math.round(kpis.absorption*100)}%`} hint="by segment"/>
    </div>
  );
}
