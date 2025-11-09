"use client";

import { useState } from "react";

export default function MetricCard({
  label,
  value,
  highlight = false,
  positive,
  context,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  positive?: boolean;
  context?: string;
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative group">
      <div
        className="rounded-3xl bg-[#FBF3E7] border border-black/5 shadow-elev-1 p-4 transition-all duration-300 hover:shadow-elev-2"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-700">{label}</p>
          {context && (
            <button
              className="shrink-0 flex items-center justify-center w-4 h-4 rounded-full bg-white/80 text-neutral-700 hover:bg-white transition-colors"
              aria-label="More info"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                <circle cx="5" cy="3" r="0.8"/>
                <rect x="4.3" y="4.5" width="1.4" height="4" rx="0.7"/>
              </svg>
            </button>
          )}
        </div>
        <p
          className={`mt-0.5 text-2xl font-extrabold tracking-tight ${
            highlight
              ? positive
                ? "text-emerald-600"
                : positive === false
                ? "text-rose-600"
                : "text-brand-500"
              : "text-neutral-900"
          }`}
        >
          {value}
        </p>
      </div>

      {/* Tooltip */}
      {context && showTooltip && (
        <div className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-zinc-900 text-white text-xs rounded-lg shadow-lg max-w-[200px] text-center pointer-events-none">
          {context}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-zinc-900 rotate-45"></div>
        </div>
      )}
    </div>
  );
}
