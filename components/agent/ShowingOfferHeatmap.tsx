import { Card, CardHeader, CardBody } from "@/lib/ui/card-fire";
import { showToOffer } from "@/lib/mock/agentDash";

const cell = (v:number)=>{
  // 7–18% mapped to green→orange
  const t = (v-7)/11; // 0..1
  const g = Math.round(160 + (1-t)*60);
  const r = Math.round(240 - t*100);
  return `rgb(${r},${g},120)`;
};

export default function ShowingOfferHeatmap(){
  return (
    <Card>
      <CardHeader>Showing → Offer Conversion<span className="ml-2 text-sm text-ui-sub dark:text-ui-dsub">last 4 weeks</span></CardHeader>
      <CardBody>
        <div className="grid grid-cols-7 gap-1">
          {showToOffer.flat().map((v,i)=>(
            <div key={i} className="h-7 rounded" style={{backgroundColor:cell(v)}} title={`${v}%`} />
          ))}
        </div>
        <div className="mt-2 text-xs text-ui-sub dark:text-ui-dsub">Darker = higher offer rate.</div>
      </CardBody>
    </Card>
  );
}
