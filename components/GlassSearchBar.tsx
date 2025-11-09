"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GlassSearchBar({
  onSearch,
}: {
  onSearch?: (q: string) => void;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");

  const handleSearch = () => {
    if (onSearch) {
      onSearch(q);
    } else {
      router.push(`/search/properties?q=${encodeURIComponent(q)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl rounded-2xl bg-white/55 backdrop-blur-18 shadow-glass ring-1 ring-black/10 flex items-center gap-4 p-4">
      <svg
        className="h-6 w-6 text-slate-500 flex-shrink-0"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
          clipRule="evenodd"
        />
      </svg>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Try: Franklin 3bd 2ba $400k-$800k"
        className="flex-1 bg-transparent placeholder:text-slate-500 text-slate-900 focus:outline-none text-base py-1"
        aria-label="Search properties"
      />
      <button
        onClick={handleSearch}
        className="rounded-xl bg-brand-500 px-7 py-3 text-white font-medium hover:bg-brand-600 transition-colors shadow-sm whitespace-nowrap"
        aria-label="Search"
      >
        Search Properties
      </button>
    </div>
  );
}
