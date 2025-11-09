export function Sparkline({ points, max }: { points:number[]; max?:number }){
  const m=max??Math.max(...points,1);
  const path=points.map((v,i)=>`${i===0?"M":"L"}${i*16} ${40-(v/m)*40}`).join(" ");
  return(
    <svg viewBox="0 0 100 40" className="w-24 h-10">
      <polyline points="0,40 100,40" className="stroke-white/10" strokeWidth={1} fill="none"/>
      <path d={path} className="stroke-white/70" strokeWidth={2} fill="none"/>
    </svg>
  );
}
