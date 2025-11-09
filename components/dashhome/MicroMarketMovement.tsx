"use client";
import ChartFrame from "./chartFrame";
import { microMarket } from "@/lib/mock/dashHomeData";

export default function MicroMarketMovement(){
  return (
    <ChartFrame title="Micro-Market Movement">
      <div className="space-y-2">
        {microMarket.map((m,i)=>(
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className="font-mono text-zinc-700 dark:text-zinc-300 w-16">{m.zip}</span>
            <div className="flex-1 grid grid-cols-3 gap-2 text-xs">
              <span className="text-zinc-600 dark:text-zinc-400">{m.invMonths.toFixed(1)} mo inv</span>
              <span className={m.priceTrend >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}>
                {m.priceTrend > 0 ? "+" : ""}{(m.priceTrend*100).toFixed(1)}%
              </span>
              <span className="text-zinc-600 dark:text-zinc-400">{m.volume} sales</span>
            </div>
          </div>
        ))}
      </div>
    </ChartFrame>
  );
}
