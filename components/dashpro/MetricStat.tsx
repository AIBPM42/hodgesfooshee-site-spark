"use client";
import { Frame, LegendBadge } from "./ChartChrome";
import { ResponsiveContainer, LineChart, Line } from "recharts";
import { CircleDollarSign, Briefcase, Timer, TrendingUp } from "lucide-react";
import { useChartTheme } from "./useChartTheme";

type Metric = {
  label: string;
  value: string;
  sub?: string;
  icon: "pipeline" | "deals" | "dom" | "absorption";
  spark: Array<{x:number; y:number}>;
};

const IconMap = {
  pipeline: CircleDollarSign,
  deals: Briefcase,
  dom: Timer,
  absorption: TrendingUp,
};

export default function MetricStat({ metric }:{metric: Metric}) {
  const c = useChartTheme();
  const Icon = IconMap[metric.icon];
  return (
    <Frame title={metric.label} right={<LegendBadge tone="highlight">{metric.sub ?? "30d"}</LegendBadge>}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-[12px] p-2 border"
               style={{ background:"var(--muted)", borderColor:"var(--border)" }}>
            <Icon size={18} />
          </div>
          <div>
            <div className="text-2xl font-semibold" style={{ color:"var(--ink)" }}>{metric.value}</div>
          </div>
        </div>
        <div className="h-10 w-28">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metric.spark}>
              <Line type="monotone" dataKey="y" stroke={c.primary} dot={false} strokeWidth={2}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Frame>
  );
}
