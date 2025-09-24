import { useEffect, useMemo, useState } from "react";

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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Live MLS Listings</h1>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-4">
        <input placeholder="Search city/county/type" value={q} onChange={e=>setQ(e.target.value)} className="border rounded px-3 py-2" />
        <input placeholder="Min $" value={minPrice} onChange={e=>setMinPrice(e.target.value)} className="border rounded px-3 py-2" />
        <input placeholder="Max $" value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} className="border rounded px-3 py-2" />
        <input placeholder="Beds" value={beds} onChange={e=>setBeds(e.target.value)} className="border rounded px-3 py-2" />
        <input placeholder="Baths" value={baths} onChange={e=>setBaths(e.target.value)} className="border rounded px-3 py-2" />
        <input placeholder="County" value={county} onChange={e=>setCounty(e.target.value)} className="border rounded px-3 py-2" />
        <div className="col-span-2 md:col-span-1">
          <input placeholder="City" value={city} onChange={e=>setCity(e.target.value)} className="border rounded px-3 py-2 w-full" />
        </div>
        <div className="col-span-2 md:col-span-1">
          <input placeholder="Type" value={type} onChange={e=>setType(e.target.value)} className="border rounded px-3 py-2 w-full" />
        </div>
      </div>

      {err && <div className="text-red-600 mb-3">{err}</div>}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: pageSize }).map((_,i)=>(
            <div key={i} className="rounded-2xl bg-gray-100 animate-pulse h-64" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-gray-600">No listings match your filters.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(l => {
              const photo = l.photos?.[0];
              return (
                <div key={l.id} className="rounded-2xl overflow-hidden bg-white shadow">
                  <div className="h-40 bg-gray-200">{photo ? <img src={photo} alt="" className="w-full h-40 object-cover" /> : null}</div>
                  <div className="p-3">
                    <div className="text-lg font-semibold">${(l.price||0).toLocaleString()}</div>
                    <div className="text-sm text-gray-700">{l.beds} bd • {l.baths} ba • {l.sqft?.toLocaleString?.() || "-"} sqft</div>
                    <div className="text-sm text-gray-600">{l.city || ""}{l.city && ", "}{l.county || ""}</div>
                    <div className="mt-2">
                      <a href={`/listing/${l.mls_id}`} className="text-blue-600 underline">View</a>
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