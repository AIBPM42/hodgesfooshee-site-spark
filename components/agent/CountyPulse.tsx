import { Card, CardHeader, CardBody } from "@/lib/ui/card-fire";
import { countyPulse } from "@/lib/mock/agentDash";

export default function CountyPulse(){
  return (
    <Card>
      <CardHeader>County Pulse<span className="ml-2 text-sm text-ui-sub dark:text-ui-dsub">7-day snapshot</span></CardHeader>
      <CardBody className="divide-y divide-ui-border dark:divide-ui-dborder">
        {countyPulse.map(c=>(
          <div key={c.county} className="py-3 flex items-center justify-between">
            <div className="w-40 font-medium">{c.county}</div>
            <div className="grid grid-cols-4 gap-6 text-sm">
              <div><div className="text-ui-sub dark:text-ui-dsub">New</div><div className="font-semibold text-brand-orange">{c.new}</div></div>
              <div><div className="text-ui-sub dark:text-ui-dsub">Pending</div><div className="font-semibold text-brand-green">{c.pending}</div></div>
              <div><div className="text-ui-sub dark:text-ui-dsub">Med Price</div><div className="font-semibold">${(c.medPrice/1000).toFixed(0)}K</div></div>
              <div><div className="text-ui-sub dark:text-ui-dsub">Med DOM</div><div className="font-semibold">{c.medDom}</div></div>
            </div>
            <div className={`px-2 py-1 rounded text-xs ${c.wow>=0 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"}`}>
              {c.wow>=0 ? `+${c.wow}%` : `${c.wow}%`}
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
