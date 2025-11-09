export default function CountyHero({
  name,
  headline,
  imageUrl,
  updated
}: {
  name: string;
  headline: string;
  imageUrl?: string;
  updated?: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-neutral-900 mx-4 md:mx-6 mt-6 hero-fade">
      <div className="h-[50vh] md:h-[56vh] relative">
        <img
          src={imageUrl || "/images/hero-nashville.jpg"}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />

        <div className="absolute inset-x-0 bottom-0 p-6 md:p-12 z-20">
          <div className="inline-flex items-center gap-3 rounded-full bg-white/90 backdrop-blur-sm px-4 py-2 text-sm text-neutral-900 shadow-lg mb-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold">{name}</span>
            {updated && (
              <>
                <span className="text-neutral-400">•</span>
                <span className="text-neutral-600">Updated {updated}</span>
              </>
            )}
          </div>

          <h1 className="h1 font-extrabold text-white drop-shadow-2xl mb-4 max-w-4xl">
            {headline}
          </h1>

          <div className="h-1.5 w-28 rounded-full bg-gradient-to-r from-[var(--brand-copper)] to-[var(--brand-copper-600)] shadow-lg" />
        </div>
      </div>
    </section>
  );
}
