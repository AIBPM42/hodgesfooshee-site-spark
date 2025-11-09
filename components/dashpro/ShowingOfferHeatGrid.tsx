"use client";
import { Frame, TooltipShell } from "./ChartChrome";
import { useChartTheme } from "./useChartTheme";
import { useState } from "react";

// data: { day: "Mon", week: "W1", pct: 0.12 }
export default function ShowingOfferHeatGrid({ data }:{ data: Array<{day:string; week:string; pct:number}> }) {
  const c = useChartTheme();
  const [hover, setHover] = useState<{day:string; week:string; pct:number} | null>(null);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeks = ["W1", "W2", "W3", "W4"];

  // Build grid map
  const gridMap = new Map<string, number>();
  data.forEach(d => gridMap.set(`${d.day}-${d.week}`, d.pct));

  // Color scale
  const getColor = (pct: number) => {
    if (pct >= 0.15) return c.success;
    if (pct >= 0.10) return c.primary;
    if (pct >= 0.05) return c.secondary;
    return c.grid;
  };

  return (
    <Frame title="Showing → Offer Conversion" subtitle="% of showings that convert to offers (4 weeks)">
      <div className="relative p-4">
        <div className="grid grid-cols-8 gap-2">
          {/* Header row */}
          <div></div>
          {weeks.map(w => (
            <div key={w} className="text-center text-[11px]" style={{ color: c.axis }}>
              {w}
            </div>
          ))}

          {/* Day rows */}
          {days.map(day => (
            <>
              <div key={`label-${day}`} className="text-right text-[11px] pr-2 flex items-center justify-end" style={{ color: c.axis }}>
                {day}
              </div>
              {weeks.map(week => {
                const key = `${day}-${week}`;
                const pct = gridMap.get(key) || 0;
                const color = getColor(pct);
                return (
                  <div
                    key={key}
                    className="aspect-square rounded-[6px] border flex items-center justify-center text-[10px] font-medium transition-all cursor-pointer hover:scale-110"
                    style={{
                      background: color,
                      borderColor: hover?.day === day && hover?.week === week ? c.primary : "transparent",
                      color: pct >= 0.05 ? "#fff" : c.axis
                    }}
                    onMouseEnter={() => setHover({ day, week, pct })}
                    onMouseLeave={() => setHover(null)}
                  >
                    {Math.round(pct * 100)}%
                  </div>
                );
              })}
            </>
          ))}
        </div>

        {/* Tooltip */}
        {hover && (
          <div className="absolute top-2 right-2 z-10">
            <TooltipShell
              lines={[
                { label: `${hover.day} ${hover.week}`, value: `${Math.round(hover.pct * 100)}%` }
              ]}
            />
          </div>
        )}
      </div>
    </Frame>
  );
}
