"use client";
import Image from "next/image";

export default function HeroCinematic({
  county = "Davidson County",
  tag = "The Heart of Music City – Where Culture Meets Opportunity",
  lat = 36.1627,
  lng = -86.7816,
  bg = "/counties/davidson-county-hero.jpg",
}: {
  county?: string;
  tag?: string;
  lat?: number;
  lng?: number;
  bg?: string;
}) {
  return (
    <section className="relative">
      {/* ambient line + soft glow */}
      <div className="pointer-events-none absolute -top-6 left-1/2 h-12 w-[68%] -translate-x-1/2 rounded-full bg-orange-200/15 blur-3xl" />

      <figure className="relative overflow-hidden rounded-[28px] shadow-xl ring-1 ring-white/40 bg-white/70 backdrop-blur-md">
        {/* top accent line */}
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 z-20" />

        {/* image with refined feather mask */}
        <div className="relative h-[54vh] min-h-[420px] max-h-[680px] rounded-[28px] overflow-hidden">
          <div className="absolute inset-0 rounded-[28px] overflow-hidden">
            <Image
              src={bg}
              alt={`${county} market hero — ${lat} N, ${lng} W`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1200px"
              className="
                object-cover
                [mask-image:radial-gradient(115%_115%_at_50%_45%,black_72%,rgba(0,0,0,0.6)_88%,transparent_100%)]
                [-webkit-mask-image:radial-gradient(115%_115%_at_50%_45%,black_72%,rgba(0,0,0,0.6)_88%,transparent_100%)]
              "
            />
            {/* subtle color grade + light vignette (less fog) */}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,7,18,0.08),rgba(3,7,18,0.18))]" />
            <div className="absolute inset-0 [box-shadow:inset_0_0_120px_20px_rgba(0,0,0,0.28)]" />
            {/* bottom dissolve into page bg - shorter but stronger */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent via-[#f8f6f3]/60 to-[#f8f6f3]" />
          </div>

          {/* chips (lighter glass) */}
          <div className="absolute left-6 right-6 top-6 flex flex-wrap items-center gap-2 text-[13px] z-20">
            <Chip label={county} />
            <Chip
              label={
                <>
                  Powered by <span className="font-semibold text-amber-700">AI</span> · Real-Time Market Intelligence
                </>
              }
            />
          </div>

          {/* title glass: lighter, crisper, more see-through */}
          <div className="absolute left-1/2 top-1/2 w-[92%] max-w-4xl -translate-x-1/2 -translate-y-1/2 z-20">
            <div
              className="
                mx-auto rounded-2xl
                bg-black/22
                ring-1 ring-white/15
                shadow-[0_18px_40px_-14px_rgba(0,0,0,0.45)]
              "
            >
              {/* subtle top reflection (thin) */}
              <div className="h-[2px] w-full rounded-t-2xl bg-white/10" />
              <h1 className="px-6 py-5 text-center text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-white drop-shadow-[0_6px_14px_rgba(0,0,0,0.5)]">
                {tag}
              </h1>
            </div>
          </div>

          {/* removed metric pills — no duplication */}
        </div>

        <figcaption className="sr-only">
          {county} Market Intelligence. Powered by AI. Coordinates {lat}° N, {lng}° W.
        </figcaption>
      </figure>
    </section>
  );
}

function Chip({ label }: { label: React.ReactNode }) {
  return (
    <span
      className="
        inline-flex items-center gap-2
        rounded-full
        bg-white/70
        px-3 py-1.5
        backdrop-blur-[2px]
        border border-white/60
        shadow-sm
        text-[13px] text-slate-800
      "
    >
      {label}
    </span>
  );
}
