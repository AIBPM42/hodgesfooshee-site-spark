"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

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
  onGo?: (params: Record<string,string>) => void;
  variant?: "full" | "compact";
  initial?: Partial<Record<"q"|"min_price"|"max_price"|"beds"|"baths"|"city"|"county"|"type"|"postalCode", string>>;
}) {
  const router = useRouter();
  const [smart, setSmart] = useState(initial.q || "");
  const [minPrice, setMinPrice] = useState(initial.min_price || "");
  const [maxPrice, setMaxPrice] = useState(initial.max_price || "");
  const [beds, setBeds] = useState(initial.beds || "");
  const [baths, setBaths] = useState(initial.baths || "");
  const [city, setCity] = useState(initial.city || "");
  const [county, setCounty] = useState(initial.county || "");
  const [type, setType] = useState(initial.type || "");
  const [postalCode, setPostalCode] = useState(initial.postalCode || "");
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
      type: type || parsed.type,
      postalCode: postalCode
    };
    Object.entries(vals).forEach(([k,v]) => { if (v) p[k] = v; });

    // Debug logging
    console.log("🔍 Search Parameters:", p);
    console.log("📝 Parsed from smart search:", parsed);

    // Use provided onGo or navigate internally
    if (onGo) {
      onGo(p);
    } else {
      const searchParams = new URLSearchParams(p);
      router.push(`/search/properties?${searchParams.toString()}`);
    }
  }

  return (
    <div className="rounded-2xl md:rounded-3xl animate-fade-in-up p-6 md:p-7 flex flex-col gap-5" style={{
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(18px)',
      WebkitBackdropFilter: 'blur(18px)',
      border: '1px solid rgba(255, 255, 255, 0.25)',
      boxShadow: '0 4px 25px rgba(0,0,0,0.25), 0 8px 25px rgba(255, 255, 255, 0.1)',
    }}>
      {/* Row 1: Main search input */}
      <label htmlFor="smart-search" className="sr-only">Smart property search</label>
      <input
        id="smart-search"
        value={smart}
        onChange={e=>setSmart(e.target.value)}
        onKeyDown={(e)=>{ if(e.key==='Enter') go(); }}
        placeholder="Try: Franklin 3bd 2ba"
        data-full-placeholder="Try: Franklin 3bd 2ba · $400k–$800k · house"
        className="glass-input w-full rounded-xl px-4 py-3 focus:outline-none transition-all [&:placeholder-shown]:md:placeholder:content-[attr(data-full-placeholder)]"
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          color: '#fff',
          border: 'none',
          fontSize: '1rem',
          fontWeight: 500
        }}
        aria-label="Search for properties by city, bedrooms, bathrooms, price, or property type"
      />

      {/* Row 2: Filters + Search Button */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-5">
        <div className="col-span-1">
          <label htmlFor="min-price" className="sr-only">Minimum Price</label>
          <input id="min-price" value={minPrice} onChange={e=>setMinPrice(e.target.value)} placeholder="Min $" className="glass-input w-full rounded-xl px-4 py-3 focus:outline-none transition-all" style={{background: 'rgba(255, 255, 255, 0.2)', color: '#fff', border: 'none', fontSize: '1rem', fontWeight: 500}} aria-label="Minimum price" />
        </div>
        <div className="col-span-1">
          <label htmlFor="max-price" className="sr-only">Maximum Price</label>
          <input id="max-price" value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} placeholder="Max $" className="glass-input w-full rounded-xl px-4 py-3 focus:outline-none transition-all" style={{background: 'rgba(255, 255, 255, 0.2)', color: '#fff', border: 'none', fontSize: '1rem', fontWeight: 500}} aria-label="Maximum price" />
        </div>
        <div className="col-span-1">
          <label htmlFor="beds" className="sr-only">Number of Bedrooms</label>
          <input id="beds" value={beds} onChange={e=>setBeds(e.target.value)} placeholder="Beds" className="glass-input w-full rounded-xl px-4 py-3 focus:outline-none transition-all" style={{background: 'rgba(255, 255, 255, 0.2)', color: '#fff', border: 'none', fontSize: '1rem', fontWeight: 500}} aria-label="Number of bedrooms" />
        </div>
        <div className="col-span-1">
          <label htmlFor="baths" className="sr-only">Number of Bathrooms</label>
          <input id="baths" value={baths} onChange={e=>setBaths(e.target.value)} placeholder="Baths" className="glass-input w-full rounded-xl px-4 py-3 focus:outline-none transition-all" style={{background: 'rgba(255, 255, 255, 0.2)', color: '#fff', border: 'none', fontSize: '1rem', fontWeight: 500}} aria-label="Number of bathrooms" />
        </div>
        <div className="col-span-1">
          <label htmlFor="city-county" className="sr-only">City or County</label>
          <input id="city-county" value={city} onChange={e=>setCity(e.target.value)} placeholder="City or County" className="glass-input w-full rounded-xl px-4 py-3 focus:outline-none transition-all" style={{background: 'rgba(255, 255, 255, 0.2)', color: '#fff', border: 'none', fontSize: '1rem', fontWeight: 500}} aria-label="City or county name" />
        </div>
        <button
          onClick={go}
          type="button"
          className="col-span-2 md:col-span-1 w-full rounded-xl font-semibold text-white py-3 focus-visible:ring-2 focus-visible:ring-[var(--brand-copper-300)] focus-visible:ring-offset-2 transition-all duration-250"
          style={{
            background: 'linear-gradient(90deg, #ff7a00, #ff4600)',
            boxShadow: '0 10px 28px rgba(231,106,60,.45)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 100, 0, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 28px rgba(231,106,60,.45)';
          }}
          aria-label="Search for properties with current filters"
        >
          Search Properties
        </button>
      </div>

      {/* Tags display - Readable badge pills */}
      {(parsed.city || parsed.beds || parsed.baths || parsed.min_price || parsed.max_price || parsed.type) && (
        <div className="flex flex-wrap items-center gap-2.5">
          {parsed.city && (
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/90 text-neutral-800 border border-white/80 shadow-sm text-sm">
              <span role="img" aria-label="city" className="text-neutral-600">🏙️</span> {parsed.city}
            </span>
          )}
          {parsed.beds && (
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/90 text-neutral-800 border border-white/80 shadow-sm text-sm">
              <span role="img" aria-label="bed" className="text-neutral-600">🛏️</span> {parsed.beds} bd
            </span>
          )}
          {parsed.baths && (
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/90 text-neutral-800 border border-white/80 shadow-sm text-sm">
              <span role="img" aria-label="bath" className="text-neutral-600">🛁</span> {parsed.baths} ba
            </span>
          )}
          {(parsed.min_price || parsed.max_price) && (
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/90 text-neutral-800 border border-white/80 shadow-sm text-sm">
              <span role="img" aria-label="money" className="text-neutral-600">💰</span>
              {parsed.min_price && `$${Number(parsed.min_price).toLocaleString()}`}
              {parsed.min_price && parsed.max_price && '–'}
              {parsed.max_price && `$${Number(parsed.max_price).toLocaleString()}`}
            </span>
          )}
          {parsed.type && (
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/90 text-neutral-800 border border-white/80 shadow-sm text-sm">
              <span role="img" aria-label="home" className="text-neutral-600">🏡</span> {parsed.type}
            </span>
          )}
        </div>
      )}

      {/* Advanced toggle */}
      <button onClick={()=>setAdvancedOpen(v=>!v)} className="text-[14px] text-white/75 underline underline-offset-4 hover:text-white self-start transition-colors">
        {advancedOpen ? "Hide Advanced" : "Advanced Filters"}
      </button>
      {advancedOpen && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input value={type} onChange={e=>setType(e.target.value)} placeholder="Property Type (e.g., Single Family, Condo)" className="glass-input rounded-xl px-4 py-3 focus:outline-none transition-all" style={{background: 'rgba(255, 255, 255, 0.2)', color: '#fff', border: 'none', fontSize: '1rem', fontWeight: 500}} aria-label="Property type" />
          <input value={county} onChange={e=>setCounty(e.target.value)} placeholder="County" className="glass-input rounded-xl px-4 py-3 focus:outline-none transition-all" style={{background: 'rgba(255, 255, 255, 0.2)', color: '#fff', border: 'none', fontSize: '1rem', fontWeight: 500}} aria-label="County" />
          <input value={postalCode} onChange={e=>setPostalCode(e.target.value)} placeholder="ZIP Code" className="glass-input rounded-xl px-4 py-3 focus:outline-none transition-all" style={{background: 'rgba(255, 255, 255, 0.2)', color: '#fff', border: 'none', fontSize: '1rem', fontWeight: 500}} aria-label="ZIP code" />
        </div>
      )}

      {/* Enhanced search tip */}
      {smart && !parsed.city && !parsed.beds && !parsed.baths && !parsed.min_price && !parsed.type && (
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
          <p className="text-sm text-neutral-700 font-medium">
            💡 <strong>Search tip:</strong> Try "Nashville 3 bed 2 bath 400k-800k house" or use the individual fields above.
          </p>
        </div>
      )}
    </div>
  );
}
