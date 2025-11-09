"use client";
import { Frame, LegendBadge, fmtUSD0 } from "../ChartChrome";
import { useChartTheme } from "../useChartTheme";
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

// source: { name, spend, pipeline, closedGCI, roi }
export default function LeadSourceROI({ sources }:{ sources: Array<{
  name: string;
  spend: number;
  pipeline: number;
  closedGCI: number;
  roi: number;
}> }) {
  const c = useChartTheme();

  return (
    <Frame title="Lead Source ROI" subtitle="Spend → Pipeline → Closed GCI (last 90 days)">
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={sources} margin={{ left: 0, right: 0 }}>
            <CartesianGrid stroke={c.grid} />
            <XAxis dataKey="name" tick={{ fill: c.axis, fontSize: 11 }} angle={-15} textAnchor="end" height={70} />
            <YAxis yAxisId="left" tick={{ fill: c.axis, fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: c.axis, fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: "12px"
              }}
              formatter={(value: number, name: string) => {
                if (name === "ROI") return `${value.toFixed(1)}x`;
                return fmtUSD0(value);
              }}
            />
            <Legend wrapperStyle={{ fontSize: "11px" }} />

            {/* Stacked bars for spend, pipeline, closed */}
            <Bar yAxisId="left" dataKey="spend" stackId="a" fill="#FF5252" name="Spend" radius={[0, 0, 0, 0]} />
            <Bar yAxisId="left" dataKey="pipeline" stackId="a" fill={c.primary} name="Pipeline" radius={[0, 0, 0, 0]} />
            <Bar yAxisId="left" dataKey="closedGCI" stackId="a" fill={c.success} name="Closed GCI" radius={[8, 8, 0, 0]} />

            {/* ROI line */}
            <Line yAxisId="right" dataKey="roi" type="monotone" stroke={c.secondary} strokeWidth={3} dot={{ r: 5 }} name="ROI" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="p-3 rounded-[10px] border text-center" style={{ borderColor: "var(--border)", background: "color-mix(in oklab, var(--surface) 96%, transparent)" }}>
          <div className="text-[11px]" style={{ color: c.axis }}>Total Spend</div>
          <div className="text-[18px] font-bold" style={{ color: "#FF5252" }}>
            {fmtUSD0(sources.reduce((sum, s) => sum + s.spend, 0))}
          </div>
        </div>
        <div className="p-3 rounded-[10px] border text-center" style={{ borderColor: "var(--border)", background: "color-mix(in oklab, var(--surface) 96%, transparent)" }}>
          <div className="text-[11px]" style={{ color: c.axis }}>Total Closed GCI</div>
          <div className="text-[18px] font-bold" style={{ color: c.success }}>
            {fmtUSD0(sources.reduce((sum, s) => sum + s.closedGCI, 0))}
          </div>
        </div>
        <div className="p-3 rounded-[10px] border text-center" style={{ borderColor: "var(--border)", background: "color-mix(in oklab, var(--surface) 96%, transparent)" }}>
          <div className="text-[11px]" style={{ color: c.axis }}>Avg ROI</div>
          <div className="text-[18px] font-bold" style={{ color: c.secondary }}>
            {(sources.reduce((sum, s) => sum + s.roi, 0) / sources.length).toFixed(1)}x
          </div>
        </div>
      </div>
    </Frame>
  );
}
