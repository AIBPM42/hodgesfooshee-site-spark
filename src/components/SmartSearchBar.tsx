import { useMemo, useState } from "react";

function toNumber(v: string) {
  if (!v) return "";
  const s = v.trim().toLowerCase().replace(/[\$,]/g, "");
  if (/^\d+(\.\d+)?k$/.test(s)) return String(Math.round(parseFloat(s) * 1000));
  if (/^\d+(\.\d+)?m$/.test(s)) return String(Math.round(parseFloat(s) * 1000000));
  if (/^\d+$/.test(s)) return s;
  return "";
}

function parseSmart(input: string) {
  const tokens = input.toLowerCase().split(/\s+/).filter(Boolean);
  let city = "", county = "", type = "", beds = "", baths = "", min_price = "", max_price = "";
  const typeWords = ["house","condo","townhome","townhouse","land","multifamily","sfh","duplex"];
  for (const t of tokens) {
    if (/^\d+bd$/.test(t) || /^\d+bds$/.test(t) || /^\d+bed/.test(t)) beds = t.replace(/\D/g, "");
    else if (/^\d+ba$/.test(t) || /^\d+bath/.test(t)) baths = t.replace(/\D/g, "");
    else if (/^\d+k$/.test(t) || /^\d+m$/.test(t) || /^\d{3,}$/.test(t)) {
      const n = toNumber(t);
      if (!min_price) min_price = n; else max_price = n;
    } else if (typeWords.includes(t)) {
      type = t === "sfh" ? "Single Family" : t.charAt(0).toUpperCase() + t.slice(1);
    } else if (!city) city = t.charAt(0).toUpperCase() + t.slice(1);
    else if (!county) county = t.charAt(0).toUpperCase() + t.slice(1);
  }
  if (min_price && max_price && Number(min_price) > Number(max_price)) [min_price, max_price] = [max_price, min_price];
  return { city, county, type, beds, baths, min_price, max_price };
}

export default function SmartSearchBar({
  onGo,
  variant = "full",
  initial = {}
}: {
  onGo: (params: Record<string,string>) => void;
  variant?: "full" | "compact";
  initial?: Partial<Record<"q"|"min_price"|"max_price"|"beds"|"baths"|"city"|"county"|"type", string>>;
}) {
  const [smart, setSmart] = useState(initial.q || "");
  const [minPrice, setMinPrice] = useState(initial.min_price || "");
  const [maxPrice, setMaxPrice] = useState(initial.max_price || "");
  const [beds, setBeds] = useState(initial.beds || "");
  const [baths, setBaths] = useState(initial.baths || "");
  const [city, setCity] = useState(initial.city || "");
  const [county, setCounty] = useState(initial.county || "");
  const [type, setType] = useState(initial.type || "");
  const [advancedOpen, setAdvancedOpen] = useState(variant === "full" ? false : true);

  const parsed = useMemo(() => parseSmart(smart), [smart]);

  function go() {
    const p: Record<string,string> = {};
    const vals = {
      q: smart,
      min_price: toNumber(minPrice) || parsed.min_price,
      max_price: toNumber(maxPrice) || parsed.max_price,
      beds: beds || parsed.beds,
      baths: baths || parsed.baths,
      city: city || parsed.city,
      county: county || parsed.county,
      type: type || parsed.type
    };
    Object.entries(vals).forEach(([k,v]) => { if (v) p[k] = v; });
    onGo(p);
  }

  return (
    <div className={`w-full rounded-3xl backdrop-blur-xl shadow-2xl p-4 md:p-6 border
      ${variant === "compact" ? "bg-white/80 border-gray-200" : "bg-white/20 border-white/20"}`}>
      <div className="flex flex-col gap-3">
        <input
          value={smart}
          onChange={e=>setSmart(e.target.value)}
          placeholder="Try: Franklin 3bd 2ba 400k-800k house"
          className={`w-full rounded-2xl px-4 py-3 outline-none ${variant==='compact' ? 'bg-white' : 'bg-white/70 focus:bg-white'}`}
        />
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <input value={minPrice} onChange={e=>setMinPrice(e.target.value)} placeholder="Min $" className="rounded-xl px-3 py-2 bg-white/70 focus:bg-white outline-none" />
          <input value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} placeholder="Max $" className="rounded-xl px-3 py-2 bg-white/70 focus:bg-white outline-none" />
          <input value={beds} onChange={e=>setBeds(e.target.value)} placeholder="Beds" className="rounded-xl px-3 py-2 bg-white/70 focus:bg-white outline-none" />
          <input value={baths} onChange={e=>setBaths(e.target.value)} placeholder="Baths" className="rounded-xl px-3 py-2 bg-white/70 focus:bg-white outline-none" />
          <input value={city} onChange={e=>setCity(e.target.value)} placeholder="City" className="rounded-xl px-3 py-2 bg-white/70 focus:bg-white outline-none" />
          <input value={county} onChange={e=>setCounty(e.target.value)} placeholder="County" className="rounded-xl px-3 py-2 bg-white/70 focus:bg-white outline-none" />
        </div>

        <button onClick={()=>setAdvancedOpen(v=>!v)} className="text-sm underline self-start">
          {advancedOpen ? "Hide Advanced" : "Advanced Filters"}
        </button>
        {advancedOpen && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input value={type} onChange={e=>setType(e.target.value)} placeholder="Property Type (e.g., Single Family, Condo)" className="rounded-xl px-3 py-2 bg-white/70 focus:bg-white outline-none" />
          </div>
        )}

        <div className="flex items-center gap-3">
          <button onClick={go} className="px-5 py-3 rounded-2xl bg-orange-500 text-white font-semibold">Search Properties</button>
          <div className="text-xs opacity-80">
            Parsed: {parsed.city || "-"} {parsed.county || "-"} {parsed.beds ? `${parsed.beds}bd` : "-"} {parsed.baths ? `${parsed.baths}ba` : "-"} {parsed.min_price || "-"} {parsed.max_price ? `– ${parsed.max_price}`:""}
          </div>
        </div>
      </div>
    </div>
  );
}