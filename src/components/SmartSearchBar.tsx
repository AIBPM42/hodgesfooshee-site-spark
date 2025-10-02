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
  const typeWords = ["house","condo","townhome","townhouse","land","multifamily","sfh","duplex","residential","single"];
  
  // Handle price ranges like "400k-800k"
  const priceRangeMatch = input.match(/(\d+(?:\.\d+)?[km]?)\s*-\s*(\d+(?:\.\d+)?[km]?)/i);
  if (priceRangeMatch) {
    min_price = toNumber(priceRangeMatch[1]);
    max_price = toNumber(priceRangeMatch[2]);
  }
  
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    const nextToken = tokens[i + 1];
    
    // Handle "3 bed", "2 bath", "3 bedroom", "2 bathroom"
    if (/^\d+$/.test(t) && nextToken) {
      if (/^(bed|bedroom|bd|bds)s?$/i.test(nextToken)) {
        beds = t;
        i++; // skip next token since we consumed it
        continue;
      }
      if (/^(bath|bathroom|ba)s?$/i.test(nextToken)) {
        baths = t;
        i++; // skip next token since we consumed it
        continue;
      }
    }
    
    // Handle compact forms like "3bd", "2ba"
    if (/^\d+bd$/.test(t) || /^\d+bds$/.test(t) || /^\d+bed/.test(t)) beds = t.replace(/\D/g, "");
    else if (/^\d+ba$/.test(t) || /^\d+bath/.test(t)) baths = t.replace(/\D/g, "");
    // Handle standalone prices (only if we haven't found a range)
    else if (!min_price && !max_price && (/^\d+k$/.test(t) || /^\d+m$/.test(t) || /^\d{3,}$/.test(t))) {
      const n = toNumber(t);
      if (!min_price) min_price = n; else max_price = n;
    } else if (typeWords.includes(t)) {
      // Enhanced property type mapping
      if (t === "sfh" || t === "single") type = "Single Family";
      else if (t === "house" || t === "residential") type = "Residential";
      else type = t.charAt(0).toUpperCase() + t.slice(1);
    } else if (!city && !/^\d/.test(t) && !typeWords.includes(t)) {
      // Only assign to city if it's not a number or type word
      city = t.charAt(0).toUpperCase() + t.slice(1);
    } else if (!county && !/^\d/.test(t) && !typeWords.includes(t) && city) {
      // Only assign to county if we already have a city
      county = t.charAt(0).toUpperCase() + t.slice(1);
    }
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
    
    // Debug logging
    console.log("🔍 Search Parameters:", p);
    console.log("📝 Parsed from smart search:", parsed);
    
    onGo(p);
  }

  return (
    <div className="w-full rounded-3xl border border-white/20 bg-white/8 backdrop-blur-xl p-6 md:p-8 shadow-glass">
      <div className="flex flex-col gap-4">
        {/* main free-text with premium styling */}
        <input
          value={smart}
          onChange={e=>setSmart(e.target.value)}
          onKeyDown={(e)=>{ if(e.key==='Enter') go(); }}
          placeholder="Try: Franklin 3bd 2ba 400k-800k house"
          className="w-full rounded-2xl px-5 py-4 bg-white/95 text-gray-900 placeholder-gray-500 border border-gray-300 focus:border-hf-orange focus:ring-2 focus:ring-hf-orange/20 focus:outline-none text-base transition-all"
        />

        {/* structured row with better spacing */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <input value={minPrice} onChange={e=>setMinPrice(e.target.value)} placeholder="Min $" className="rounded-xl px-4 py-3 bg-white/90 text-gray-900 placeholder-gray-500 border border-gray-300 focus:border-hf-orange focus:ring-1 focus:ring-hf-orange/20 focus:outline-none transition-all" />
          <input value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} placeholder="Max $" className="rounded-xl px-4 py-3 bg-white/90 text-gray-900 placeholder-gray-500 border border-gray-300 focus:border-hf-orange focus:ring-1 focus:ring-hf-orange/20 focus:outline-none transition-all" />
          <input value={beds} onChange={e=>setBeds(e.target.value)} placeholder="Beds" className="rounded-xl px-4 py-3 bg-white/90 text-gray-900 placeholder-gray-500 border border-gray-300 focus:border-hf-orange focus:ring-1 focus:ring-hf-orange/20 focus:outline-none transition-all" />
          <input value={baths} onChange={e=>setBaths(e.target.value)} placeholder="Baths" className="rounded-xl px-4 py-3 bg-white/90 text-gray-900 placeholder-gray-500 border border-gray-300 focus:border-hf-orange focus:ring-1 focus:ring-hf-orange/20 focus:outline-none transition-all" />
          <input value={city} onChange={e=>setCity(e.target.value)} placeholder="City" className="rounded-xl px-4 py-3 bg-white/90 text-gray-900 placeholder-gray-500 border border-gray-300 focus:border-hf-orange focus:ring-1 focus:ring-hf-orange/20 focus:outline-none transition-all" />
          <input value={county} onChange={e=>setCounty(e.target.value)} placeholder="County" className="rounded-xl px-4 py-3 bg-white/90 text-gray-900 placeholder-gray-500 border border-gray-300 focus:border-hf-orange focus:ring-1 focus:ring-hf-orange/20 focus:outline-none transition-all" />
        </div>

        {/* advanced toggle with premium styling */}
        <button onClick={()=>setAdvancedOpen(v=>!v)} className="text-sm font-medium underline self-start text-white/90 hover:text-white transition-colors">
          {advancedOpen ? "Hide Advanced" : "Advanced Filters"}
        </button>
        {advancedOpen && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input value={type} onChange={e=>setType(e.target.value)} placeholder="Property Type (e.g., Single Family, Condo)" className="rounded-xl px-4 py-3 bg-white/90 text-gray-900 placeholder-gray-500 border border-gray-300 focus:border-hf-orange focus:ring-1 focus:ring-hf-orange/20 focus:outline-none transition-all" />
          </div>
        )}

        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mt-2">
          <button
            onClick={go}
            className="btn-premium px-8 py-4 rounded-full font-semibold text-base shadow-lg hover:shadow-xl transition-all"
          >
            Search Properties
          </button>
          <div className="text-sm text-white/80 font-medium">
            {parsed.city && `🏙️ ${parsed.city}`} 
            {parsed.beds && ` • 🛏️ ${parsed.beds} bd`} 
            {parsed.baths && ` • 🚿 ${parsed.baths} ba`} 
            {parsed.min_price && ` • 💰 $${Number(parsed.min_price).toLocaleString()}+`}
            {parsed.max_price && ` – $${Number(parsed.max_price).toLocaleString()}`}
            {parsed.type && ` • 🏠 ${parsed.type}`}
          </div>
        </div>
        
        {/* Enhanced search tip */}
        {smart && !parsed.city && !parsed.beds && !parsed.baths && !parsed.min_price && !parsed.type && (
          <div className="mt-2 p-4 bg-hf-orange/10 border border-hf-orange/30 rounded-xl backdrop-blur-sm">
            <p className="text-sm text-white font-medium">
              💡 <strong>Search tip:</strong> Try "Nashville 3 bed 2 bath 400k-800k house" or use the individual fields above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}