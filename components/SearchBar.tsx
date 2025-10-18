"use client";
import { useState } from "react";

type SearchBarProps = {
  query?: string;
  onQueryChange?: (q: string) => void;
  onSubmit?: () => void;
};

export default function SearchBar({ query: initialQuery = "", onQueryChange, onSubmit }: SearchBarProps) {
  const [q, setQ] = useState(initialQuery);

  const handleQueryChange = (newQ: string) => {
    setQ(newQ);
    onQueryChange?.(newQ);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
        <input
          value={q}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Try: Franklin 3bd 2ba · $400k–$800k · house"
          className="w-full rounded-2xl border border-white/60 bg-white/70 px-4 py-3 focus-plum"
        />
        <button
          type="submit"
          className="rounded-2xl bg-copper-sweep text-white px-6 py-3 shadow-[0_14px_35px_rgba(242,87,45,.35)] hover:brightness-105"
        >
          Search Properties
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <input
          type="text"
          placeholder="Min $"
          className="rounded-2xl border border-white/60 bg-white/70 px-4 py-2 focus-plum"
        />
        <input
          type="text"
          placeholder="Max $"
          className="rounded-2xl border border-white/60 bg-white/70 px-4 py-2 focus-plum"
        />
        <input
          type="text"
          placeholder="Beds"
          className="rounded-2xl border border-white/60 bg-white/70 px-4 py-2 focus-plum"
        />
        <input
          type="text"
          placeholder="Baths"
          className="rounded-2xl border border-white/60 bg-white/70 px-4 py-2 focus-plum"
        />
        <input
          type="text"
          placeholder="City or County"
          className="rounded-2xl border border-white/60 bg-white/70 px-4 py-2 focus-plum col-span-2 md:col-span-1"
        />
      </div>
    </form>
  );
}
