"use client";

export default function ShowOfferHeatmap({ weeks }:{ weeks:number[][] }){
  const flat = weeks.flat();
  const color = (v:number)=>{
    const t = (v-7)/11; // 0..1
    const g = Math.round(160 + (1-t)*60);
    const r = Math.round(240 - t*100);
    return `rgb(${r},${g},120)`;
  };
  return (
    <div>
      <div className="grid grid-cols-7 gap-1">
        {flat.map((v,i)=> <div key={i} className="h-7 rounded" style={{ background: color(v) }} title={`${v}%`} />)}
      </div>
      <div className="text-xs text-[var(--sub)] mt-2">Darker = higher offer rate. Range 7–18%.</div>
    </div>
  );
}
