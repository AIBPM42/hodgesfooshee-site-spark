import type { County } from "@/lib/types/county";
import { LineChartBlock } from "@/components/charts/LineChartBlock";
import { BarChartBlock } from "@/components/charts/BarChartBlock";
import { DonutChartBlock } from "@/components/charts/DonutChartBlock";

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-[var(--hf-porcelain)] p-5 shadow-elev-1 hover:shadow-elev-2 transition-all duration-300">
      <h3 className="mb-4 text-lg font-extrabold text-neutral-900">{title}</h3>
      <div className="rounded-xl bg-white p-3">{children}</div>
    </div>
  );
}

export function CountyCharts({ county }: { county: County }) {
  // Transform data for charts
  const trendData = county.trend.months.map((month, idx) => ({
    month,
    value: county.trend.median_prices[idx],
  }));

  return (
    <section className="mb-14">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Price Trend */}
        <ChartCard title="12-Month Price Trend">
          <LineChartBlock title="" data={trendData} />
        </ChartCard>

        {/* Price Tier Distribution */}
        <ChartCard title="Price Tier Distribution">
          <BarChartBlock title="" data={county.inventory.price_tiers} />
        </ChartCard>

        {/* Property Types */}
        <ChartCard title="Property Types">
          <DonutChartBlock title="" data={county.inventory.property_types} />
        </ChartCard>
      </div>
    </section>
  );
}
