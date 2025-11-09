import type { County } from "@/lib/types/county";

const tiles = [
  { label: 'Population Growth', valueKey: 'population_growth' as const },
  { label: 'Median Price', valueKey: 'median_price' as const },
  { label: 'Days on Market', valueKey: 'days_on_market' as const },
  { label: 'Price Trend', valueKey: 'price_trend' as const },
];

export function CountyKPIs({ county }: { county: County }) {
  return (
    <section className="mt-6 mb-12">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t) => {
          const val = county.kpis[t.valueKey];
          return (
            <div key={t.valueKey} className="rounded-2xl bg-white p-5 shadow-elev-2 hover:shadow-elev-3 transition-all duration-300">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                {t.label}
              </p>
              <p className="text-[28px] font-extrabold text-neutral-900">{val}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
