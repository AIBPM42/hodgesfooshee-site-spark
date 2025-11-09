"use client";
import { Frame, LegendBadge } from "../ChartChrome";
import { useChartTheme } from "../useChartTheme";
import { Trophy, TrendingUp } from "lucide-react";

// agent: { name, listingsWon, listToSalePct, closeRate, avgDOM }
export default function AgentLeaderboard({ agents }:{ agents: Array<{
  name: string;
  listingsWon: number;
  listToSalePct: number;
  closeRate: number;
  avgDOM: number;
  rank: number;
}> }) {
  const c = useChartTheme();

  return (
    <Frame title="Agent Leaderboard" subtitle="Top performers (last 30 days)">
      <div className="space-y-2">
        {agents.map((agent, i) => (
          <div
            key={i}
            className="p-3 rounded-[10px] border transition-all hover:scale-[1.01]"
            style={{
              background: agent.rank <= 3 ? "color-mix(in oklab, var(--surface) 92%, #FF7E0A 8%)" : "color-mix(in oklab, var(--surface) 96%, transparent)",
              borderColor: agent.rank <= 3 ? c.primary : "var(--border)"
            }}
          >
            <div className="flex items-center gap-3">
              {/* Rank badge */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold"
                style={{
                  background: agent.rank === 1 ? "#FFD700" : agent.rank === 2 ? "#C0C0C0" : agent.rank === 3 ? "#CD7F32" : "var(--muted)",
                  color: agent.rank <= 3 ? "#000" : "var(--sub)"
                }}
              >
                {agent.rank <= 3 ? <Trophy size={14} /> : agent.rank}
              </div>

              {/* Name */}
              <div className="flex-1">
                <div className="font-semibold text-[14px]" style={{ color: "var(--ink)" }}>
                  {agent.name}
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-[10px]" style={{ color: c.axis }}>Won</div>
                  <div className="text-[14px] font-bold" style={{ color: c.primary }}>
                    {agent.listingsWon}
                  </div>
                </div>
                <div>
                  <div className="text-[10px]" style={{ color: c.axis }}>List/Sale</div>
                  <div className="text-[14px] font-bold" style={{ color: c.success }}>
                    {agent.listToSalePct}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px]" style={{ color: c.axis }}>Close</div>
                  <div className="text-[14px] font-bold" style={{ color: c.secondary }}>
                    {agent.closeRate}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px]" style={{ color: c.axis }}>DOM</div>
                  <div className="text-[14px] font-bold" style={{ color: "var(--ink)" }}>
                    {agent.avgDOM}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}
