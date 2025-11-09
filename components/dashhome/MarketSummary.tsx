import ChartFrame from "./chartFrame";
import { marketSummaryMock } from "@/lib/mock/dashHomeData";

export default function MarketSummary(){
  return (
    <ChartFrame title="AI Market Summary">
      <div className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
        {marketSummaryMock}
      </div>
      <div className="mt-3 flex gap-2 text-xs text-zinc-500">
        <span>Provider:</span>
        <span className="font-semibold text-orange-600 dark:text-orange-400">OpenAI</span>
        <span className="mx-1">•</span>
        <span>Updated: just now</span>
      </div>
    </ChartFrame>
  );
}
