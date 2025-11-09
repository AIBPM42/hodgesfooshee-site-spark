export default function TodayStrip() {
  return (
    <div className="flex flex-wrap gap-3 items-center rounded-[14px] px-4 py-3 border"
         style={{background:"var(--grad-today)", borderColor:"var(--border)"}}>
      <span className="text-sm font-semibold" style={{color:"var(--ink)"}}>Today</span>
      <span className="text-sm" style={{color:"var(--ink)"}}>3 hot leads</span>
      <span className="text-sm" style={{color:"var(--ink)"}}>2 price cuts</span>
      <span className="text-sm" style={{color:"var(--ink)"}}>$2.38M pipeline</span>
    </div>
  );
}
