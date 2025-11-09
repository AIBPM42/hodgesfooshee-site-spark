"use client";
import { useEffect, useState } from "react";
import ChartFrame from "./chartFrame";
import { leadsCluster as seed } from "@/lib/mock/dashHomeData";

function color(score:number){
  return score>=85?'bg-red-500':score>=65?'bg-orange-500':score>=50?'bg-amber-500':'bg-zinc-400';
}

export default function LeadTemperatureCluster(){
  const [data, setData] = useState<typeof seed>([]);

  useEffect(() => {
    setData(seed);
  }, []);

  return (
    <ChartFrame title="Lead Temperature">
      <div className="grid grid-cols-9 gap-2">
        {data.map(l=>(
          <div key={l.id} className="relative flex items-center justify-center h-10">
            <div className={`w-8 h-8 rounded-full ${color(l.score)} ${l.recent?'ring-2 ring-emerald-400 animate-pulse':''}`}/>
          </div>
        ))}
      </div>
      <div className="text-xs text-zinc-500 mt-2">Pulsing = activity in last 24h. Color = score.</div>
    </ChartFrame>
  );
}
