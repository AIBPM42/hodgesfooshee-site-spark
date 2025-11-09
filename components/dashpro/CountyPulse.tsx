"use client";
import { Frame, LegendBadge } from "./ChartChrome";
import { useChartTheme } from "./useChartTheme";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

// county: { name, newListings, pendings, medianPrice, medianDOM, trend: "up"|"down"|"flat", trendPct }
export default function CountyPulse({ counties }:{ counties: Array<{
  name: string;
  newListings: number;
  pendings: number;
  medianPrice: number;
  medianDOM: number;
  trend: "up"|"down"|"flat";
  trendPct: number;
}> }) {
  const c = useChartTheme();

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp size={14} />;
    if (trend === "down") return <TrendingDown size={14} />;
    return <Minus size={14} />;
  };

  const getTrendTone = (trend: string): "positive"|"negative"|"neutral" => {
    if (trend === "up") return "positive";
    if (trend === "down") return "negative";
    return "neutral";
  };

  return (
    <Frame title="County Pulse" subtitle="7-day market snapshot">
      <div className="space-y-3">
        {counties.map((county, i) => (
          <div
            key={i}
            className="p-3 rounded-[12px] border transition-all hover:scale-[1.02]"
            style={{
              background: "color-mix(in oklab, var(--surface) 96%, transparent)",
              borderColor: "var(--border)"
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-[14px]" style={{ color: c.axis }}>
                {county.name}
              </div>
              <LegendBadge tone={getTrendTone(county.trend)}>
                <span className="flex items-center gap-1">
                  {getTrendIcon(county.trend)}
                  {county.trendPct > 0 ? '+' : ''}{county.trendPct}%
                </span>
              </LegendBadge>
            </div>

            {/* Metrics grid */}
            <div className="grid grid-cols-4 gap-3 text-center">
              <div>
                <div className="text-[11px]" style={{ color: c.axis }}>New</div>
                <div className="text-[16px] font-bold" style={{ color: c.primary }}>{county.newListings}</div>
              </div>
              <div>
                <div className="text-[11px]" style={{ color: c.axis }}>Pending</div>
                <div className="text-[16px] font-bold" style={{ color: c.success }}>{county.pendings}</div>
              </div>
              <div>
                <div className="text-[11px]" style={{ color: c.axis }}>Med Price</div>
                <div className="text-[14px] font-bold" style={{ color: "var(--ink)" }}>
                  ${(county.medianPrice / 1000).toFixed(0)}K
                </div>
              </div>
              <div>
                <div className="text-[11px]" style={{ color: c.axis }}>Med DOM</div>
                <div className="text-[16px] font-bold" style={{ color: c.secondary }}>{county.medianDOM}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}
