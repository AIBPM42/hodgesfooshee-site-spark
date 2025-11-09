import type { County } from "@/lib/types/county";

export function CountyHero({ county }: { county: County }) {
  const updatedHuman = county.updated_at
    ? new Date(county.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : 'Recently';

  return (
    <section className="relative isolate">
      <div className="relative aspect-[16/6] w-full overflow-hidden rounded-b-[28px]">
        <img
          src="/images/hero-nashville.jpg"
          alt={`${county.name} landmark`}
          className="h-full w-full object-cover"
        />
        {/* Subtle top-to-bottom readability fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/[.22] via-black/[.10] to-transparent" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="-mt-16 sm:-mt-20 lg:-mt-24 max-w-5xl">
          <div className="rounded-[20px] bg-white/95 backdrop-blur-sm shadow-elev-3 p-6 sm:p-8">
            <div className="mb-3 flex items-center gap-3">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium text-neutral-600">
                {county.name} • Updated {updatedHuman}
              </span>
            </div>
            <h1 className="leading-tight text-[clamp(28px,5vw,48px)] font-extrabold tracking-tight text-neutral-900">
              {county.hero_tagline || `${county.name} Real Estate Market Intelligence`}
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
