import { brand } from "@/lib/brand";
import type { CountyData } from "@/lib/mappers/countyMapper";
import { mapCountyToData } from "@/lib/mappers/countyMapper";
import type { County } from "@/lib/types/county";
import SeoJsonLd from "@/components/county/production/SeoJsonLd";
import InventoryVsDemandChart from "@/components/charts/InventoryVsDemandChart";
import DaysOnMarketChart from "@/components/charts/DaysOnMarketChart";
import ListToSaleRatioChart from "@/components/charts/ListToSaleRatioChart";
import InfoSection from "@/components/InfoSection";
import { cleanCountyText } from "@/lib/content/cleanCountyText";
import { format } from "date-fns";
import { Nav } from "@/components/Nav";
import Footer from "@/components/Footer";
import { createClient } from "@supabase/supabase-js";
import MetricCard from "@/components/county/MetricCard";
import ExpandableBullets from "@/components/county/ExpandableBullets";
import HeroImage from "@/components/county/HeroImage";
import HeroCinematic from "@/components/HeroCinematic";
import HeroSignatureBottom from "@/components/HeroSignatureBottom";

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function fetchCounty(slug: string): Promise<CountyData> {
  // Try exact slug first
  let { data, error } = await supabase
    .from('counties')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  // If not found and slug doesn't end with '-county', try adding it
  if ((error || !data) && !slug.endsWith('-county')) {
    const slugWithCounty = `${slug}-county`;
    const retry = await supabase
      .from('counties')
      .select('*')
      .eq('slug', slugWithCounty)
      .eq('is_active', true)
      .single();

    data = retry.data;
    error = retry.error;
  }

  if (error || !data) {
    throw new Error("County not found");
  }

  return mapCountyToData(data as County);
}

export default async function CountyPage({ params }: { params: { slug: string } }) {
  const data = await fetchCounty(params.slug);

  // Clean AI text (strip markdown, footnotes, etc.)
  const market = cleanCountyText(data.content.marketOverview);
  const living = cleanCountyText(data.content.livingInCounty);
  const schools = cleanCountyText(data.content.schoolsEducation);
  const commute = cleanCountyText(data.content.commuteLocation);
  const outlook = cleanCountyText(data.content.investmentOutlook);

  // Prepare sources component
  const SourceLinks = () => (
    <div className="mt-4 rounded-xl border border-slate-200 bg-white/70 p-4">
      <h4 className="mb-2 text-sm font-semibold tracking-wide text-slate-700">
        Sources
      </h4>
      <ul className="space-y-1">
        {data.content.sources.map((s, i) => (
          <li key={i} className="text-[15px]">
            <a
              href={s.url}
              target="_blank"
              rel="nofollow external noopener"
              className="text-slate-800 underline decoration-orange-300 underline-offset-4 hover:text-slate-900"
            >
              {s.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <>
      <SeoJsonLd
        name={data.name}
        state={data.state}
        lat={data.lat}
        lng={data.lng}
        lastUpdatedISO={data.lastUpdatedISO}
      />
      <Nav />

      <main className="min-h-screen bg-porcelain">
        {/* HERO */}
        <section className="section-tight">
          <HeroSignatureBottom
            county={data.name}
            tag={data.tagline}
            lat={data.lat}
            lng={data.lng}
            bg={`/counties/${data.slug}-hero.jpg`}
            updatedAt={format(new Date(data.lastUpdatedISO), "MMM d")}
          />
        </section>

        {/* STAT CARDS */}
        <section className="section-tight">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricCard
              label="Population Growth"
              value={`${data.stats.populationGrowthPct}%`}
              highlight={true}
              positive={data.stats.populationGrowthPct > 0}
              context="Year-over-year population change - a key indicator of market demand"
            />
            <MetricCard
              label="Median Price"
              value={`$${data.stats.medianPrice.toLocaleString()}`}
              context="Typical home sale price in this county"
            />
            <MetricCard
              label="Days on Market"
              value={`${data.stats.daysOnMarket}`}
              context="Average time homes spend listed before selling - lower means faster turnover"
            />
            <MetricCard
              label="Price Trend"
              value={`${data.stats.priceTrendPct > 0 ? '+' : ''}${data.stats.priceTrendPct}%`}
              highlight={true}
              positive={data.stats.priceTrendPct > 0}
              context="12-month price appreciation - shows market momentum"
            />
          </div>
        </section>

        {/* Gradient divider */}
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-amber-200/50 to-transparent"></div>
        </div>

        {/* PREMIUM CHARTS - Market Intelligence */}
        <section className="section-tight">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Inventory vs Demand - 2 columns */}
            <div className="lg:col-span-2">
              <InventoryVsDemandChart
                data={data.series.inventoryVsDemand}
                lastUpdated={format(new Date(data.lastUpdatedISO), "MMM d, yyyy")}
              />
            </div>

            {/* Days on Market - 1 column */}
            <DaysOnMarketChart data={data.series.daysOnMarket} />
          </div>

          {/* List-to-Sale Ratio - Full width */}
          <div className="mt-3">
            <ListToSaleRatioChart data={data.series.listToSale} />
          </div>
        </section>

        {/* Gradient divider */}
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-amber-200/50 to-transparent"></div>
        </div>

        {/* COUNTY INTELLIGENCE REPORT */}
        <section className="section">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">
              County Intelligence Report
            </h2>
          </div>

          {/* Intelligence sections */}
          <div className="space-y-3">
            <ExpandableBullets
              icon="📊"
              title="Market Overview"
              bullets={market.bullets.slice(0, 8)}
              initiallyOpen={true}
            />

            <ExpandableBullets
              icon="🌳"
              title={`Living in ${data.name}`}
              bullets={living.bullets.slice(0, 8)}
            />

            <ExpandableBullets
              icon="🏫"
              title="Schools & Education"
              bullets={schools.bullets.slice(0, 8)}
            />

            <ExpandableBullets
              icon="🧭"
              title="Commute & Location"
              bullets={commute.bullets.slice(0, 8)}
            />

            <ExpandableBullets
              icon="📈"
              title="Investment Outlook"
              bullets={outlook.bullets.slice(0, 8)}
            />
          </div>

          {/* Sources - moved to bottom */}
          <div className="mt-6 rounded-3xl bg-[#FBF3E7] border border-black/5 shadow-elev-1 p-5 transition-all duration-300 hover:shadow-elev-2">
            <p className="mb-3 text-sm font-semibold text-neutral-900">Data Sources</p>
            <ul className="space-y-2">
              {data.content.sources.map((s, i) => (
                <li key={i} className="text-[15px]">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="nofollow external noopener"
                    className="text-neutral-800 underline decoration-amber-300 underline-offset-4 hover:text-[#E44B22] transition-colors"
                  >
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* AI MARKET SUMMARY */}
        <section className="section-tight">
          <div className="rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-lg ring-1 ring-amber-100/50 sm:p-8">
            <div className="flex items-start gap-3 mb-4">
              <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-600">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900">Market Insights Summary</h3>
                <p className="text-sm text-zinc-600 mt-1">AI-generated overview based on real-time data</p>
              </div>
            </div>

            <div className="prose prose-sm max-w-none">
              <p className="text-[15px] leading-relaxed text-zinc-800">
                <strong className="text-amber-700">{data.name}</strong> shows {data.stats.populationGrowthPct > 0 ? 'strong' : 'steady'} population growth at <strong>{data.stats.populationGrowthPct}%</strong>,
                with homes selling at a median price of <strong>${data.stats.medianPrice.toLocaleString()}</strong>.
                Properties spend an average of <strong>{data.stats.daysOnMarket} days</strong> on market,
                indicating a {data.stats.daysOnMarket < 30 ? 'highly competitive' : data.stats.daysOnMarket < 60 ? 'balanced' : 'buyer-friendly'} market.
                Price trends show <strong>{data.stats.priceTrendPct > 0 ? '+' : ''}{data.stats.priceTrendPct}%</strong> year-over-year movement,
                reflecting {data.stats.priceTrendPct > 3 ? 'strong appreciation' : data.stats.priceTrendPct > 0 ? 'modest growth' : 'market adjustment'} in this area.
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-amber-200/50">
              <p className="text-xs text-zinc-500 flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Last updated {format(new Date(data.lastUpdatedISO), "MMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
          </div>
        </section>

        {/* Gradient divider */}
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-amber-200/50 to-transparent"></div>
        </div>

        {/* CTAs */}
        <section className="section my-10 md:my-14">
          <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
            <a
              href={`/search/properties`}
              className="flex-1 text-center rounded-xl px-6 py-3 font-medium text-white bg-brand-500 hover:bg-brand-600 shadow-md transition-colors"
            >
              View {data.name} Properties
            </a>
            <a
              href="/contact"
              className="flex-1 text-center rounded-xl px-6 py-3 font-medium bg-white text-slate-900 border border-black/10 hover:bg-slate-50 shadow-sm transition-colors"
            >
              Schedule Consultation
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
