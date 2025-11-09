"use client";

import React, { useMemo, useState } from "react";
import clsx from "clsx";
import ReactMarkdown from "react-markdown";

export type CountySection = {
  id: string;
  icon: string; // e.g. "📊" | "🌳" | "🏫" | "🧭" | "📈"
  title: string;
  stats?: { label: string; value: string }[];
  bullets?: string[]; // Key takeaway bullets (primary content)
  content?: string; // Optional detailed analysis (collapsible)
  sources?: { label: string; href?: string }[];
};

type Props = {
  sections: CountySection[];
  defaultOpenIds?: string[]; // which sections start open
};

export default function CountyAccordionSet({
  sections,
  defaultOpenIds = [],
}: Props) {
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    sections.reduce((acc, s) => {
      acc[s.id] = defaultOpenIds.includes(s.id);
      return acc;
    }, {} as Record<string, boolean>)
  );

  const allOpen = useMemo(
    () => sections.every((s) => open[s.id]),
    [open, sections]
  );

  const toggleAll = (next?: boolean) => {
    const val = next ?? !allOpen;
    setOpen(
      sections.reduce((acc, s) => {
        acc[s.id] = val;
        return acc;
      }, {} as Record<string, boolean>)
    );
  };

  return (
    <section className="w-full">
      {/* Top controls */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold tracking-tight text-slate-800">
          County Intelligence Report
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => toggleAll(true)}
            className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Expand All
          </button>
          <button
            onClick={() => toggleAll(false)}
            className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Collapse All
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((s) => (
          <SmartAccordion
            key={s.id}
            open={open[s.id]}
            onToggle={() =>
              setOpen((prev) => ({ ...prev, [s.id]: !prev[s.id] }))
            }
            icon={s.icon}
            title={s.title}
          >
            <div className="mt-3 space-y-5">
              {s.stats && s.stats.length > 0 && <StatPills items={s.stats} />}

              {s.bullets && s.bullets.length > 0 && (
                <KeyTakeaways bullets={s.bullets} content={s.content} />
              )}

              {s.sources && s.sources.length > 0 && (
                <SourceList sources={s.sources} />
              )}
            </div>
          </SmartAccordion>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── helpers/components ───────────────────────── */

function SmartAccordion({
  open,
  onToggle,
  icon,
  title,
  children,
}: {
  open: boolean;
  onToggle: () => void;
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-slate-200 bg-[#FFF8F0]/60 shadow-[0_10px_30px_rgba(16,24,40,0.05)] backdrop-blur",
        open ? "ring-1 ring-orange-200" : "hover:shadow-lg"
      )}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left"
        aria-expanded={open}
      >
        <SectionHeader icon={icon} title={title} />
        <span
          className={clsx(
            "inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition",
            open ? "rotate-180 bg-white" : "bg-white"
          )}
        >
          ▾
        </span>
      </button>

      <div
        className={clsx(
          "grid transition-all duration-300 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden px-5 pb-5">{children}</div>
      </div>
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="text-2xl leading-none">{icon}</span>
      <div className="min-w-0">
        <h3 className="truncate text-lg font-bold tracking-tight text-slate-900">
          {title}
        </h3>
        <div className="mt-1 h-1 w-16 rounded-full bg-gradient-to-r from-[#FF6A3D] via-[#FF9E3D] to-[#FFC53D]" />
      </div>
    </div>
  );
}

function StatPills({
  items,
}: {
  items: { label: string; value: string }[];
}) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((it, idx) => (
        <li
          key={idx}
          className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-sm shadow-sm backdrop-blur hover:border-orange-200"
        >
          <span className="text-slate-500">{it.label}</span>
          <span className="font-semibold text-slate-900">{it.value}</span>
        </li>
      ))}
    </ul>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-orange-200/60 bg-orange-50/60 px-4 py-3 text-[15px] text-slate-800">
      {children}
    </div>
  );
}

function ArticleCopy({ children }: { children: string }) {
  return (
    <div className="prose prose-neutral max-w-none prose-p:leading-relaxed prose-p:text-slate-700 prose-p:mb-4 prose-strong:text-slate-900 prose-li:marker:text-slate-400 [&>*:last-child]:mb-0">
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}

function SourceList({
  sources,
}: {
  sources: { label: string; href?: string }[];
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/70 p-4">
      <h4 className="mb-2 text-sm font-semibold tracking-wide text-slate-700">
        Sources
      </h4>
      <ul className="space-y-1">
        {sources.map((s, i) => (
          <li key={i} className="text-[15px]">
            {s.href ? (
              <a
                href={s.href}
                target="_blank"
                rel="nofollow external noopener"
                className="text-slate-800 underline decoration-orange-300 underline-offset-4 hover:text-slate-900"
              >
                {s.label}
              </a>
            ) : (
              <span className="text-slate-700">{s.label}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function KeyTakeaways({ bullets, content }: { bullets: string[]; content?: string }) {
  const [showFullAnalysis, setShowFullAnalysis] = React.useState(false);

  if (!bullets || bullets.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Primary bullet-only content */}
      <div className="space-y-1 text-[15px] leading-7">
        <ul className="list-disc pl-5 space-y-2 marker:text-orange-500 text-neutral-800">
          {bullets.map((bullet, i) => (
            <li key={i} className="leading-relaxed">{bullet}</li>
          ))}
        </ul>
      </div>

      {/* Optional detailed analysis - collapsed by default */}
      {content && (
        <div>
          <button
            onClick={() => setShowFullAnalysis(!showFullAnalysis)}
            className="text-sm font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1.5 transition-colors"
          >
            <span>📊</span>
            <span>{showFullAnalysis ? 'Hide' : 'View'} full analysis</span>
            <span className="text-xs">{showFullAnalysis ? '▲' : '▼'}</span>
          </button>

          {showFullAnalysis && (
            <div className="mt-3 rounded-xl bg-slate-50/50 border border-slate-200 px-4 py-3">
              <div className="prose prose-neutral prose-sm max-w-none prose-p:leading-relaxed prose-p:text-slate-700 prose-p:mb-3 [&>*:last-child]:mb-0">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
