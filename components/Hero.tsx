"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const params = new URLSearchParams({ q: searchQuery });
      router.push(`/search/properties?${params.toString()}`);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative -mt-10 md:-mt-14">
        <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_70px_rgba(0,0,0,0.25)]">
          <img
            src="/hodges-hero-bg.jpg"
            alt="Nashville luxury home"
            className="h-[58vh] md:h-[72vh] w-full object-cover"
          />
          {/* dark->light veil for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/20 to-transparent" />

          {/* centered title */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 md:px-10">
            <h1 className="mx-auto max-w-5xl text-center font-serif leading-tight text-white drop-shadow-sm text-4xl md:text-6xl">
              Your Source for{" "}
              <span className="bg-gradient-to-r from-[#FFA654] to-[#FF4E1C] bg-clip-text text-transparent">
                Nashville Real Estate
              </span>{" "}
              Excellence
            </h1>
            <p className="mt-4 text-center text-white/90 text-base md:text-lg drop-shadow-sm">
              Discover exceptional properties across Middle Tennessee with Nashville's most trusted real estate experts.
            </p>
          </div>

          {/* soft overlay for readability */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-transparent" />
          {/* bottom fade to page bg */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#F6F7F9]" />
        </div>
      </section>

      {/* Search Bar - Outside Hero, Floating Below */}
      <section className="relative z-50 -mt-10 mb-12">
        <div className="mx-auto w-[92%] max-w-5xl rounded-2xl bg-white
                        ring-1 ring-black/10
                        shadow-[0_14px_40px_-12px_rgba(0,0,0,0.25)]
                        px-5 py-5 flex items-center gap-3">
          <div className="flex flex-1 items-center gap-3 rounded-xl
                          bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
            <svg className="h-5 w-5 text-slate-500" viewBox="0 0 24 24" fill="none">
              <path d="M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              className="flex-1 bg-transparent placeholder-slate-500 text-slate-800
                         focus:outline-none text-base md:text-lg"
              placeholder="Try: Franklin 3bd 2ba $400k–$800k"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          <button
            onClick={handleSearch}
            className="rounded-xl px-6 py-3 font-semibold text-white
                       bg-gradient-to-r from-[#FF7A32] to-[#FF4E1C]
                       shadow-[0_8px_18px_rgba(255,115,72,0.35)]
                       hover:shadow-[0_10px_22px_rgba(255,115,72,0.45)]
                       transition-transform hover:-translate-y-0.5 active:translate-y-0">
            Search Properties
          </button>
        </div>
      </section>
    </>
  );
}
