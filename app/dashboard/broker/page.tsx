"use client";
import AgentLeaderboard from "@/components/dashpro/broker/AgentLeaderboard";
import LeadSourceROI from "@/components/dashpro/broker/LeadSourceROI";
import ConversionFunnel from "@/components/dashpro/ConversionFunnel";

export default function BrokerDashboard() {
  // Mock data for broker-only tiles

  // Agent Leaderboard
  const agentData = [
    { name: "Sarah Chen", listingsWon: 28, listToSalePct: 99.2, closeRate: 72, avgDOM: 22, rank: 1 },
    { name: "Michael Rodriguez", listingsWon: 24, listToSalePct: 98.8, closeRate: 68, avgDOM: 24, rank: 2 },
    { name: "Jennifer Williams", listingsWon: 22, listToSalePct: 98.5, closeRate: 65, avgDOM: 26, rank: 3 },
    { name: "David Thompson", listingsWon: 19, listToSalePct: 97.9, closeRate: 62, avgDOM: 28, rank: 4 },
    { name: "Emily Johnson", listingsWon: 18, listToSalePct: 98.1, closeRate: 64, avgDOM: 27, rank: 5 },
    { name: "Robert Martinez", listingsWon: 16, listToSalePct: 97.5, closeRate: 60, avgDOM: 29, rank: 6 },
  ];

  // Lead Source ROI
  const leadSources = [
    { name: "Zillow Premier", spend: 4500, pipeline: 32000, closedGCI: 18500, roi: 4.1 },
    { name: "Facebook Ads", spend: 2800, pipeline: 24000, closedGCI: 14200, roi: 5.1 },
    { name: "Google PPC", spend: 3200, pipeline: 28000, closedGCI: 15800, roi: 4.9 },
    { name: "Referrals", spend: 500, pipeline: 45000, closedGCI: 28500, roi: 57.0 },
    { name: "Open Houses", spend: 1200, pipeline: 18000, closedGCI: 9800, roi: 8.2 },
    { name: "Direct Mail", spend: 1800, pipeline: 12000, closedGCI: 6500, roi: 3.6 },
  ];

  // Funnel Drop-Off
  const funnelData = [
    { stage: "Leads", count: 450, rate: 100 },
    { stage: "Qualified", count: 285, rate: 63 },
    { stage: "Showing", count: 178, rate: 62 },
    { stage: "Offer", count: 95, rate: 53 },
    { stage: "Pending", count: 72, rate: 76 },
    { stage: "Closed", count: 58, rate: 81 },
  ];

  return (
    <div className="min-h-screen p-6" style={{ background: "var(--bg)" }}>
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-[28px] font-bold" style={{ color: "var(--ink)" }}>
              Broker Dashboard
            </h1>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold" style={{ background: "color-mix(in oklab, #FF7E0A 20%, transparent)", color: "#FF7E0A", border: "1px solid #FF7E0A" }}>
              BROKER ONLY
            </span>
          </div>
          <p className="text-[14px]" style={{ color: "var(--sub)" }}>
            Manage performance, optimize spend, and drive team success
          </p>
        </div>

        {/* Broker Tiles */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Agent Leaderboard */}
          <AgentLeaderboard agents={agentData} />

          {/* Lead Source ROI */}
          <LeadSourceROI sources={leadSources} />

          {/* Funnel Drop-Off */}
          <ConversionFunnel data={funnelData} />

          {/* Goal Tracker - Simple version */}
          <div className="p-6 rounded-[var(--radius-panel)] border" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
            <div className="mb-4">
              <div className="text-[15px] font-semibold" style={{ color: "var(--ink)" }}>
                Monthly Goal Tracker
              </div>
              <div className="text-[12px]" style={{ color: "var(--sub)" }}>
                Closed GCI vs target
              </div>
            </div>

            <div className="space-y-4">
              {[
                { month: "January", target: 125000, actual: 138500 },
                { month: "February", target: 125000, actual: 142000 },
                { month: "March", target: 125000, actual: 118200 },
                { month: "April", target: 125000, actual: 98500 },
              ].map((m, i) => {
                const pct = (m.actual / m.target) * 100;
                const isGood = pct >= 100;
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[13px]" style={{ color: "var(--sub)" }}>{m.month}</span>
                      <span className="text-[13px] font-bold" style={{ color: isGood ? "#78B84B" : "#FF5252" }}>
                        ${(m.actual / 1000).toFixed(0)}K / ${(m.target / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--muted)" }}>
                      <div
                        className="h-full transition-all rounded-full"
                        style={{
                          width: `${Math.min(pct, 100)}%`,
                          background: isGood ? "#78B84B" : "#FF7E0A"
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
