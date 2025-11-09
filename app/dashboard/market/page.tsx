import { Card, Header, Body } from '@/components/cards/Card'
import { StatusPill } from '@/components/cards/StatusPill'
import VelocityBars from '@/components/charts/VelocityBars'
import PriceGapDiverge from '@/components/charts/PriceGapDiverge'
import TimeToContractLine from '@/components/charts/TimeToContractLine'
import ZipSparkGrid from '@/components/charts/ZipSparkGrid'
import ShowOfferHeatmap from '@/components/charts/ShowOfferHeatmap'
import KpiRow from '@/components/KpiRow'
import { kpis, countyPulse, velocity, priceGap, timeToContract, zipMomentum, showOffer } from '@/lib/mock/market'
import { formatCompact, formatDays, formatPrice, formatPct } from '@/lib/format'

export default function MarketPage(){
  const K = kpis();
  const counties = countyPulse();

  const kpiData = [
    {
      label: "NEW LISTINGS (7D)",
      value: formatCompact(K.newListings7d),
      sub: "All counties",
      colorLight: "from-orange-500/18 to-orange-500/6",
      colorDark: "from-[#1a120a] to-[#0f0b07]",
      glow: "shadow-[0_0_18px_rgba(249,115,22,0.35)]",
    },
    {
      label: "PENDINGS (7D)",
      value: formatCompact(K.pendings7d),
      sub: "All counties",
      colorLight: "from-green-500/18 to-green-500/6",
      colorDark: "from-[#0f140f] to-[#0a0f0a]",
      glow: "shadow-[0_0_18px_rgba(34,197,94,0.35)]",
    },
    {
      label: "MEDIAN DOM",
      value: formatDays(K.medianDom),
      sub: "Rolling 30d",
      colorLight: "from-purple-500/18 to-purple-500/6",
      colorDark: "from-[#120f16] to-[#0b0910]",
      glow: "shadow-[0_0_18px_rgba(168,85,247,0.35)]",
    },
    {
      label: "ABSORPTION",
      value: formatPct(K.absorption * 100, false, 0),
      sub: "By segment",
      colorLight: "from-yellow-500/18 to-yellow-500/6",
      colorDark: "from-[#141206] to-[#0c0b04]",
      glow: "shadow-[0_0_18px_rgba(234,179,8,0.35)]",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Market Intelligence</h1>
        <p className="text-sm text-[var(--sub)]">Real‑time trends for Middle Tennessee — pricing, demand, timing.</p>
      </div>

      {/* KPIs */}
      <KpiRow kpis={kpiData} />

      <section className="grid grid-cols-12 gap-6">

        {/* County Pulse (list) */}
        <Card className="col-span-12 lg:col-span-5" hover>
          <Header title="County Pulse" subtitle="7‑day snapshot" right={<StatusPill status="succeeded" updatedAt={K.updatedAt} source={K.source} provenance="live" />} />
          <Body>
            <div className="divide-y divide-[var(--border)]">
              {counties.map(c=> (
                <div key={c.county} className="py-3 flex items-center justify-between gap-4">
                  <div className="w-32 font-semibold text-[var(--text)]">{c.county}</div>
                  <div className="flex items-center gap-5 text-sm">
                    <span className="w-20"><span className="text-[var(--sub)] text-xs">New</span> <b className="ml-1">{c.new}</b></span>
                    <span className="w-24"><span className="text-[var(--sub)] text-xs">Pending</span> <b className="ml-1">{c.pending}</b></span>
                    <span className="w-24"><span className="text-[var(--sub)] text-xs">Price</span> <b className="ml-1">{formatPrice(c.price * 1000)}</b></span>
                    <span className="w-16"><span className="text-[var(--sub)] text-xs">DOM</span> <b className="ml-1">{c.dom}</b></span>
                  </div>
                  <span
                    className="px-2 py-1 rounded-md text-xs font-medium min-w-[56px] text-center"
                    style={{
                      background: c.wow >= 0 ? 'rgba(101,163,13,0.12)' : 'rgba(249,115,22,0.12)',
                      color: c.wow >= 0 ? '#65A30D' : '#F97316'
                    }}
                  >
                    {formatPct(c.wow, true)}
                  </span>
                </div>
              ))}
            </div>
            <a href="/dashboard/geo" className="text-sm font-medium text-[#2563EB] hover:text-[#1D4ED8] inline-block mt-3 transition-colors">View details →</a>
          </Body>
        </Card>

        {/* Velocity */}
        <Card className="col-span-12 lg:col-span-7" hover>
          <Header title="Listings vs Pending Velocity" subtitle="Week‑over‑week" right={<StatusPill status="succeeded" updatedAt={K.updatedAt} source={K.source} provenance="live" />} />
          <Body>
            <VelocityBars data={velocity()} />
            <a href="/dashboard/market#velocity" className="text-sm font-medium text-[#2563EB] hover:text-[#1D4ED8] inline-block mt-3 transition-colors">View details →</a>
          </Body>
        </Card>

        {/* Price Gap */}
        <Card className="col-span-12 lg:col-span-5" hover>
          <Header title="Price → Sale Gap" subtitle="Median % by segment (30d)" right={<StatusPill status="succeeded" updatedAt={K.updatedAt} source={K.source} provenance="live" />} />
          <Body>
            <PriceGapDiverge data={priceGap()} />
            <a href="/dashboard/segments" className="text-sm font-medium text-[#2563EB] hover:text-[#1D4ED8] inline-block mt-3 transition-colors">View pricing details →</a>
          </Body>
        </Card>

        {/* Time to Contract */}
        <Card className="col-span-12 lg:col-span-7" hover>
          <Header title="Time to Contract" subtitle="Actuals (30d)" right={<StatusPill status="succeeded" updatedAt={K.updatedAt} source={K.source} provenance="live" />} />
          <Body>
            <TimeToContractLine data={timeToContract()} />
            <a href="/dashboard/segments#timing" className="text-sm font-medium text-[#2563EB] hover:text-[#1D4ED8] inline-block mt-3 transition-colors">View timing details →</a>
          </Body>
        </Card>

        {/* ZIP grid */}
        <Card className="col-span-12 lg:col-span-7">
          <Header title="ZIP Momentum" subtitle="30d trend" right={<StatusPill status="succeeded" updatedAt={K.updatedAt} source={K.source} provenance="live" />} />
          <Body>
            <ZipSparkGrid zips={zipMomentum()} />
            <a href="/dashboard/geo#zip" className="text-sm font-medium text-[#2563EB] hover:text-[#1D4ED8] inline-block mt-3 transition-colors">View ZIP details →</a>
          </Body>
        </Card>

        {/* Heatmap */}
        <Card className="col-span-12 lg:col-span-5" hover>
          <Header title="Showing → Offer Conversion" subtitle="last 4 weeks" right={<StatusPill status="succeeded" updatedAt={K.updatedAt} source={K.source} provenance="live" />} />
          <Body>
            <ShowOfferHeatmap weeks={showOffer()} />
            <a href="/dashboard/segments#conversion" className="text-sm font-medium text-[#2563EB] hover:text-[#1D4ED8] inline-block mt-3 transition-colors">View conversion details →</a>
          </Body>
        </Card>
      </section>
    </div>
  );
}
