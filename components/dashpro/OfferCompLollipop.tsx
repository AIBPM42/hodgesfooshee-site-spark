"use client";
import { Frame, TooltipShell } from "./ChartChrome";
import { useChartTheme } from "./useChartTheme";
import { ResponsiveContainer, ComposedChart, Bar, Scatter, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

// rows: { segment:"SFH <$400K", low:94, high:105, median:101 }  // % of list in accepted offers
export default function OfferCompLollipop({ rows }:{ rows:Array<{segment:string; low:number; high:number; median:number}> }) {
  const c = useChartTheme();

  // Build data with range bar
  const data = rows.map(r => ({
    segment: r.segment,
    low: r.low,
    high: r.high,
    median: r.median,
    range: r.high - r.low,
    rangeStart: r.low
  }));

  return (
    <Frame title="Offer Competitiveness" subtitle="Accepted offers as % of list by segment">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} layout="vertical" margin={{left: 20, right: 20}}>
            <CartesianGrid stroke={c.grid}/>
            <XAxis type="number" domain={[90,110]} tick={{ fill: c.axis, fontSize: 12 }} />
            <YAxis dataKey="segment" type="category" width={140} tick={{ fill: c.axis, fontSize: 12 }} />

            {/* Range bars */}
            <Bar
              dataKey="range"
              stackId="a"
              barSize={8}
              fill={c.grid}
              radius={[4,4,4,4]}
            />

            {/* Median dots */}
            <Scatter
              dataKey="median"
              fill={c.primary}
              shape={(props: any) => {
                const { cx, cy } = props;
                return (
                  <circle cx={cx} cy={cy} r={6} fill={c.primary} stroke="#fff" strokeWidth={2} />
                );
              }}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.[0]) return null;
                const d = payload[0].payload;
                return (
                  <TooltipShell
                    lines={[
                      { label: "Range", value: `${d.low}% - ${d.high}%` },
                      { label: "Median", value: `${d.median}%` }
                    ]}
                  />
                );
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Frame>
  );
}
