import { Card, CardHeader, CardBody } from "@/lib/ui/card-fire";
import { marketSummary } from "@/lib/mock/agentDash";

export default function MarketSummary(){
  return (
    <Card>
      <CardHeader>AI Market Summary</CardHeader>
      <CardBody>
        <p className="text-sm leading-6 text-ui-sub dark:text-ui-dsub">{marketSummary}</p>
        <div className="text-xs text-ui-sub dark:text-ui-dsub mt-2">Provider: OpenAI • Updated: just now</div>
      </CardBody>
    </Card>
  );
}
