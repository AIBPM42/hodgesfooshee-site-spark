"use client";
import Image from "next/image";

type Props = {
  county?: string;
  tag?: string;            // headline
  lat?: number;
  lng?: number;
  bg?: string;             // /counties/davidson-county-hero.jpg
  updatedAt?: string;      // e.g., "Nov 6"
};

export default function HeroSignatureBottom({
  county = "Davidson County",
  tag = "Davidson County Market Intelligence",
  lat = 36.1627,
  lng = -86.7816,
  bg = "/counties/davidson-county-hero.jpg",
  updatedAt = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
}: Props) {
  return (
    <section className="relative">
      {/* ambient glow */}
      <div className="pointer-events-none absolute -top-6 left-1/2 h-12 w-[70%] -translate-x-1/2 rounded-full bg-orange-200/20 blur-3xl" />

      <figure
        className="relative shadow-[0_30px_60px_-20px_rgba(0,0,0,0.35)] ring-1 ring-white/40 bg-white/70 backdrop-blur-md overflow-hidden rounded-[28px]"
      >
        {/* brand accent line */}
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 z-20" />

        <div className="relative h-[54vh] min-h-[420px] max-h-[680px]">
          <Image
            src={bg}
            alt={`${county} market hero — ${lat} N, ${lng} W`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1200px"
            className="object-cover"
          />

          {/* subtle cinematic grade (not foggy) */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(3,7,18,0.06),rgba(3,7,18,0.16))]" />
          <div className="pointer-events-none absolute inset-0 [box-shadow:inset_0_0_120px_22px_rgba(0,0,0,0.26)]" />

          {/* headline on ultra-light glass */}
          <div className="absolute left-1/2 top-[46%] w-[92%] max-w-4xl -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="mx-auto rounded-2xl bg-black/14 ring-1 ring-white/10 shadow-[0_18px_38px_-12px_rgba(0,0,0,0.38)]">
              <h1 className="px-6 py-5 text-center text-[40px] md:text-6xl font-extrabold leading-tight tracking-tight text-white drop-shadow-[0_5px_12px_rgba(0,0,0,0.45)]">
                {tag}
              </h1>
            </div>
          </div>
        </div>

        <figcaption className="sr-only">
          {county} Market Intelligence. Powered by AI. Coordinates {lat}° N, {lng}° W. Updated {updatedAt}.
        </figcaption>
      </figure>

      {/* Meta bar — BELOW the image */}
      <div className="mt-3">
        <div className="mx-auto mb-2 h-px w-[88%] bg-gradient-to-r from-transparent via-slate-300/50 to-transparent" />
        <div className="flex flex-wrap items-center justify-center gap-2">
          <MetaChip>{county}</MetaChip>
          <MetaChip>
            Powered by <span className="font-semibold text-amber-700">AI</span> · Real-Time Market Intelligence
          </MetaChip>
          <MetaChip>Updated {updatedAt}</MetaChip>
        </div>
      </div>
    </section>
  );
}

function MetaChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 backdrop-blur-sm border border-white/70 shadow-sm text-[13px] text-slate-800">
      {children}
    </span>
  );
}
