import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

type Media = { url: string; order_index: number };
type Address = { street?: string; city?: string; county?: string; state?: string; postal_code?: string };
type Listing = {
  id: string; mls_id: string; status: string; price: number; property_type: string;
  beds: number; baths: number; sqft: number; updated_at: string;
  address?: string; city?: string; county?: string; state?: string; zip?: string; photos?: string[];
};

function useQueryParams() {
  const sp = new URLSearchParams(window.location.search);
  const get = (k: string, fallback = "") => sp.get(k) || fallback;
  const setMany = (obj: Record<string, string | number | undefined>) => {
    const next = new URLSearchParams(window.location.search);
    Object.entries(obj).forEach(([k,v]) => {
      if (v === undefined || v === "" || v === null) next.delete(k);
      else next.set(k, String(v));
    });
    const s = next.toString();
    const url = `${window.location.pathname}${s ? "?" + s : ""}`;
    window.history.replaceState({}, "", url);
  };
  return { get, setMany };
}

export default function MLS() {
  const navigate = useNavigate();
  const qp = useQueryParams();
  const [q, setQ] = useState(qp.get("q"));
  const [minPrice, setMinPrice] = useState(qp.get("min_price",""));
  const [maxPrice, setMaxPrice] = useState(qp.get("max_price",""));
  const [beds, setBeds] = useState(qp.get("beds",""));
  const [baths, setBaths] = useState(qp.get("baths",""));
  const [county, setCounty] = useState(qp.get("county",""));
  const [city, setCity] = useState(qp.get("city",""));
  const [type, setType] = useState(qp.get("type",""));
  const [page, setPage] = useState(parseInt(qp.get("page","1") || "1"));

  const [items, setItems] = useState<Listing[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const pageSize = 12;

  const params = useMemo(() => {
    const p: Record<string,string> = { page: String(page), page_size: String(pageSize) };
    if (q) p.q = q;
    if (minPrice) p.min_price = minPrice;
    if (maxPrice) p.max_price = maxPrice;
    if (beds) p.beds = beds;
    if (baths) p.baths = baths;
    if (county) p.county = county;
    if (city) p.city = city;
    if (type) p.type = type;
    return p;
  }, [q,minPrice,maxPrice,beds,baths,county,city,type,page]);

  async function load() {
    setLoading(true); setErr("");
    try {
      qp.setMany(params);
      const qs = new URLSearchParams(params).toString();
      const res = await fetch(`https://xhqwmtzawqfffepcqxwf.functions.supabase.co/realtyna-mls-search?${qs}`);
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      setItems(json.items || []);
      setCount(json.count || 0);
    } catch (e: any) {
      setErr(e.message || "Failed to load listings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [q,minPrice,maxPrice,beds,baths,county,city,type,page]);

  const totalPages = Math.max(1, Math.ceil((count || 0) / pageSize));

  const clearFilters = () => {
    setQ(""); setMinPrice(""); setMaxPrice(""); setBeds(""); setBaths(""); setCounty(""); setCity(""); setType("");
    setPage(1);
  };

  const hasActiveFilters = q || minPrice || maxPrice || beds || baths || county || city || type;

  return (
    <div className="mls-search p-6 max-w-7xl mx-auto">
      {/* Custom styling to override input colors */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .mls-search input, .mls-search select {
            background: hsl(var(--background)) !important;
            color: hsl(var(--foreground)) !important;
            border: 1px solid hsl(var(--border)) !important;
          }
          .mls-search input:focus, .mls-search select:focus {
            outline: 2px solid hsl(var(--ring)) !important;
            outline-offset: 2px !important;
          }
        `
      }} />
      {/* Breadcrumb Navigation */}
      <div className="mb-4">
        <button 
          onClick={() => navigate("/")} 
          className="text-primary hover:text-primary/80 text-sm"
        >
          Home
        </button>
        <span className="text-muted-foreground mx-2">•</span>
        <span className="text-sm text-muted-foreground">MLS Search</span>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Live MLS Listings</h1>
        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters} size="sm">
            Clear All Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-4">
        <input placeholder="Search city/county/type" value={q} onChange={e=>setQ(e.target.value)} className="border border-border rounded px-3 py-2 bg-background text-foreground" />
        <input placeholder="Min $" value={minPrice} onChange={e=>setMinPrice(e.target.value)} className="border border-border rounded px-3 py-2 bg-background text-foreground" />
        <input placeholder="Max $" value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} className="border border-border rounded px-3 py-2 bg-background text-foreground" />
        <input placeholder="Beds" value={beds} onChange={e=>setBeds(e.target.value)} className="border border-border rounded px-3 py-2 bg-background text-foreground" />
        <input placeholder="Baths" value={baths} onChange={e=>setBaths(e.target.value)} className="border border-border rounded px-3 py-2 bg-background text-foreground" />
        <input placeholder="County" value={county} onChange={e=>setCounty(e.target.value)} className="border border-border rounded px-3 py-2 bg-background text-foreground" />
        <div className="col-span-2 md:col-span-1">
          <input placeholder="City" value={city} onChange={e=>setCity(e.target.value)} className="border border-border rounded px-3 py-2 w-full bg-background text-foreground" />
        </div>
        <div className="col-span-2 md:col-span-1">
          <input placeholder="Type" value={type} onChange={e=>setType(e.target.value)} className="border border-border rounded px-3 py-2 w-full bg-background text-foreground" />
        </div>
      </div>

      {/* Helper text to avoid confusion */}
      <div className="mb-4 p-3 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          💡 <strong>Tip:</strong> You can search in the first field OR use individual filters below. 
          For "nashville 3 bed 2 bath", put "3" in Beds field and "Nashville" in City field.
        </p>
      </div>

      {err && <div className="text-red-600 mb-3">{err}</div>}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: pageSize }).map((_,i)=>(
            <div key={i} className="rounded-2xl bg-gray-100 animate-pulse h-64" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 space-y-6">
          <div className="text-lg font-medium text-muted-foreground">No listings found</div>
          <div className="text-sm text-muted-foreground max-w-md mx-auto">
            We couldn't find any listings matching your current filters. Try adjusting your search criteria or browse all available properties.
          </div>
          
          {/* Debug info - show active filters */}
          {hasActiveFilters && (
            <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg max-w-md mx-auto">
              <div className="font-medium mb-1">Current filters:</div>
              {q && <div>Search: "{q}"</div>}
              {city && <div>City: "{city}"</div>}
              {county && <div>County: "{county}"</div>}
              {minPrice && <div>Min Price: ${minPrice}</div>}
              {maxPrice && <div>Max Price: ${maxPrice}</div>}
              {beds && <div>Beds: {beds}+</div>}
              {baths && <div>Baths: {baths}+</div>}
              {type && <div>Type: "{type}"</div>}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate("/")} variant="default">
              Back to Home
            </Button>
            <Button onClick={() => navigate("/")} variant="outline">
              Browse Market Insights
            </Button>
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground">
            Try searching for "Nashville", "Davidson", or "Williamson" to see available listings.
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(l => {
              const photo = l.photos?.[0];
              return (
                <div key={l.id} className="rounded-2xl overflow-hidden bg-white shadow-md border border-border">
                  <div className="h-40 bg-gray-200">{photo ? <img src={photo} alt="" className="w-full h-40 object-cover" /> : null}</div>
                  <div className="p-4">
                    <div className="text-xl font-bold text-foreground mb-2">${(l.price||0).toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground mb-1">{l.beds} bd • {l.baths} ba • {l.sqft?.toLocaleString?.() || "-"} sqft</div>
                    <div className="text-sm text-muted-foreground mb-3">{l.city || ""}{l.city && ", "}{l.county || ""}</div>
                    <div className="mt-2">
                      <a href={`/property/${l.mls_id}`} className="text-primary hover:text-primary/80 font-medium underline">View Details</a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">Page {page} of {totalPages} • {count} results</div>
            <div className="space-x-2">
              <button className="px-3 py-2 rounded border" disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))}>Prev</button>
              <button className="px-3 py-2 rounded border" disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>Next</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}