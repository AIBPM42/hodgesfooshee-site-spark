'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [beds, setBeds] = useState('');
  const [baths, setBaths] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (beds) params.set('beds', beds);
    if (baths) params.set('baths', baths);
    if (city) params.set('city', city);
    if (postalCode) params.set('postalCode', postalCode);

    router.push(`/search/properties?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section
      aria-label="Property search"
      className="mx-auto max-w-[1100px] px-6 lg:px-8"
    >
      <div className="card -mt-12 lg:-mt-16 p-4 lg:p-5">
        <div className="flex items-center gap-3 rounded-xl border border-[--border] bg-white/85 backdrop-blur px-4 py-3 shadow-sm">
          <span className="text-[--sub]">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="m21 21-4.35-4.35"></path><circle cx="10.5" cy="10.5" r="7.5"></circle>
            </svg>
          </span>
          <input
            id="q"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(e.target.value.length > 1); }}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            onKeyDown={handleKeyDown}
            placeholder="Try: Franklin 3bd 2ba"
            className="w-full bg-transparent placeholder:text-zinc-400 focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 font-medium shadow-[0_8px_24px_rgba(249,115,22,.25)] hover:brightness-105 transition-all"
          >
            Search Properties
          </button>
        </div>

        {/* Typeahead suggestions */}
        {open && (
          <div
            role="listbox"
            className="mt-2 overflow-hidden rounded-2xl border bg-white/95 shadow-xl backdrop-blur border-[--border]"
          >
            {[
              "Franklin 4bd near Harlinsdale",
              "Brentwood $1.0M–$1.5M 5bd",
              "12 South condo 2bd < $700k",
              "Green Hills townhome 3bd",
              "Williamson County pool house"
            ].map((s, i) => (
              <button
                key={i}
                role="option"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => { setQuery(s); setOpen(false); }}
                className="flex w-full items-center justify-between px-4 py-2 text-left hover:bg-neutral-50 transition-colors"
              >
                <span className="text-[15px]">{s}</span>
                <span className="text-xs text-neutral-500">↩︎</span>
              </button>
            ))}
          </div>
        )}

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 border-t px-0 py-3 text-sm text-neutral-700 border-[--border] mt-3">
          <Pill label="Min $" value={minPrice} onChange={setMinPrice} placeholder="300k" />
          <Pill label="Max $" value={maxPrice} onChange={setMaxPrice} placeholder="900k" />
          <Pill label="Beds" value={beds} onChange={setBeds} placeholder="3+" />
          <Pill label="Baths" value={baths} onChange={setBaths} placeholder="2+" />
          <Pill label="City/County" value={city} onChange={setCity} placeholder="Franklin" />
          <Pill label="ZIP" value={postalCode} onChange={setPostalCode} placeholder="37027" />
        </div>
      </div>
    </section>
  );
}

function Pill({
  label,
  value,
  onChange,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="relative">
      {editing ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setEditing(false)}
          onKeyDown={(e) => { if (e.key === 'Enter') setEditing(false); }}
          placeholder={placeholder}
          autoFocus
          className="w-20 rounded-full border px-3 py-1.5 text-[13px] bg-white shadow-sm border-[--border] focus:outline-none focus:ring-1 focus:ring-orange-500/50"
        />
      ) : (
        <button
          className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 bg-white/80 text-[13px] shadow-sm border-[--border] hover:bg-white transition-colors"
          type="button"
          onClick={() => setEditing(true)}
        >
          <span className="text-neutral-500">{label}</span>
          <span className="font-medium">{value || placeholder}</span>
        </button>
      )}
    </div>
  );
}
