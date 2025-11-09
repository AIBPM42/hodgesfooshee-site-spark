import ChartFrame from "./chartFrame";
import { showingConversion as sc } from "@/lib/mock/dashHomeData";

function cellColor(v:number){
  const g=Math.round(80+v*160), r=Math.round(220 - v*120);
  return `rgb(${r},${g},120)`;
}

export default function ShowingConversionHeatmap(){
  return (
    <ChartFrame title="Showing → Offer Conversion (last 4 weeks)">
      <div className="grid grid-cols-7 gap-1">
        {sc.values.flat().map((v,i)=>(
          <div key={i} className="h-7 rounded" style={{backgroundColor: cellColor(v)}} title={`${Math.round(v*100)}%`} />
        ))}
      </div>
      <div className="text-xs text-zinc-500 mt-2">Darker = higher offer rate.</div>
    </ChartFrame>
  );
}
