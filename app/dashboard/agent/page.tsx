import ThemeToggle from '@/components/ThemeToggle';
import Kpis from '@/components/agent/Kpis';
import CountyPulse from '@/components/agent/CountyPulse';
import TimeToContract from '@/components/agent/TimeToContract';
import PriceSaleGap from '@/components/agent/PriceSaleGap';
import ShowingOfferHeatmap from '@/components/agent/ShowingOfferHeatmap';
import WeekVelocity from '@/components/agent/WeekVelocity';
import ZipMomentum from '@/components/agent/ZipMomentum';
import CompetitiveBars from '@/components/agent/CompetitiveBars';
import MarketSummary from '@/components/agent/MarketSummary';

export const dynamic = 'force-static'; // safe with deterministic mocks

export default function AgentDashboard() {
  return (
    <div className="p-4 md:p-6 space-y-4 bg-ui-light dark:bg-ui-dark min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold tracking-tight text-ui-text dark:text-ui-dtext">Agent Dashboard</h1>
          <p className="text-sm text-ui-sub dark:text-ui-dsub">Instant market advantage for pricing, advising, and winning offers</p>
        </div>
        <ThemeToggle />
      </div>

      <Kpis />

      {/* Row 1 */}
      <div className="grid xl:grid-cols-3 gap-4">
        <CountyPulse />
        <TimeToContract />
        <PriceSaleGap />
      </div>

      {/* Row 2 */}
      <div className="grid xl:grid-cols-3 gap-4">
        <ShowingOfferHeatmap />
        <WeekVelocity />
        <CompetitiveBars />
      </div>

      {/* Row 3 */}
      <div className="grid xl:grid-cols-3 gap-4">
        <ZipMomentum />
        <MarketSummary />
        <div className="hidden xl:block" />
      </div>
    </div>
  );
}
