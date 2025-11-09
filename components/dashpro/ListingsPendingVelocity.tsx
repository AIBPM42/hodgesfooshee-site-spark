"use client";
import { Frame, LegendBadge } from "./ChartChrome";
import { useChartTheme } from "./useChartTheme";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from "recharts";

// data: { label: "This Week", newActives: 245, newPendings: 198, showingsPerListing: 4.2, delta: +12 }
export default function ListingsPendingVelocity({ data }:{ data: {
  thisWeek: { newActives: number; newPendings: number; showingsPerListing: number };
  lastWeek: { newActives: number; newPendings: number; showingsPerListing: number };
  delta: { actives: number; pendings: number; showings: number };
}}) {
  const c = useChartTheme();

  const chartData = [
    {
      name: "Last Week",
      Actives: data.lastWeek.newActives,
      Pendings: data.lastWeek.newPendings
    },
    {
      name: "This Week",
      Actives: data.thisWeek.newActives,
      Pendings: data.thisWeek.newPendings
    }
  ];

  return (
    <Frame
      title="Listings vs Pending Velocity"
      subtitle="Week-over-week demand vs supply"
      right={
        <div className="flex gap-2">
          <LegendBadge tone={data.delta.actives >= 0 ? "positive" : "negative"}>
            Actives {data.delta.actives >= 0 ? '+' : ''}{data.delta.actives}%
          </LegendBadge>
          <LegendBadge tone={data.delta.pendings >= 0 ? "positive" : "negative"}>
            Pendings {data.delta.pendings >= 0 ? '+' : ''}{data.delta.pendings}%
          </LegendBadge>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ left: 0, right: 0 }}>
              <CartesianGrid stroke={c.grid} />
              <XAxis dataKey="name" tick={{ fill: c.axis, fontSize: 12 }} />
              <YAxis tick={{ fill: c.axis, fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "12px"
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px" }}
                iconType="circle"
              />
              <Bar dataKey="Actives" fill={c.primary} radius={[8, 8, 0, 0]} />
              <Bar dataKey="Pendings" fill={c.success} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Showings per listing metric */}
        <div className="flex items-center justify-between p-3 rounded-[10px] border" style={{ borderColor: "var(--border)", background: "color-mix(in oklab, var(--muted) 50%, transparent)" }}>
          <div className="text-[12px]" style={{ color: c.axis }}>Showings per Listing</div>
          <div className="flex items-center gap-2">
            <div className="text-[18px] font-bold" style={{ color: c.secondary }}>
              {data.thisWeek.showingsPerListing.toFixed(1)}
            </div>
            <LegendBadge tone={data.delta.showings >= 0 ? "positive" : "negative"}>
              {data.delta.showings >= 0 ? '+' : ''}{data.delta.showings}%
            </LegendBadge>
          </div>
        </div>
      </div>
    </Frame>
  );
}
