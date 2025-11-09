"use client";

import { useId, useState } from "react";

type InfoSectionProps = {
  icon?: React.ReactNode;
  title: string;
  bullets: (string | React.ReactNode)[];
  children?: React.ReactNode; // Optional full analysis content (rich text)
  defaultOpen?: boolean;
};

export default function InfoSection({
  icon,
  title,
  bullets,
  children,
  defaultOpen = false,
}: InfoSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  // unique ids per instance for aria hookup
  const panelId = useId();
  const btnId = useId();

  return (
    <section className="rounded-2xl border border-slate-200 bg-[#FFF8F0]/60 shadow-[0_10px_30px_rgba(16,24,40,0.05)] backdrop-blur hover:shadow-lg transition-shadow">
      {/* Clickable header */}
      <button
        id={btnId}
        type="button"
        className="flex w-full items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left cursor-pointer hover:bg-white/50 transition-colors"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex min-w-0 items-center gap-3">
          {icon && <span className="text-2xl leading-none">{icon}</span>}
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold tracking-tight text-slate-900">
              {title}
            </h3>
            <div className="mt-1 h-1 w-16 rounded-full bg-gradient-to-r from-[#FF6A3D] via-[#FF9E3D] to-[#FFC53D]" />
          </div>
        </div>
        <span
          className={`inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition ${
            open ? "rotate-180 bg-white" : "bg-white"
          }`}
        >
          ▾
        </span>
      </button>

      {/* Collapsible content */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={btnId}
        className={`grid transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden px-5 pb-5">
          <div className="mt-3 space-y-5">
            {/* Key takeaways bullets */}
            <div className="space-y-1 text-[15px] leading-7">
              <ul className="list-disc pl-5 space-y-2 marker:text-orange-500 text-neutral-800">
                {bullets.map((bullet, i) => (
                  <li key={i} className="leading-relaxed">{bullet}</li>
                ))}
              </ul>
            </div>

            {/* Optional full analysis */}
            {children && (
              <div className="rounded-xl border border-neutral-200/70 bg-neutral-50/80 p-4 text-[16px] leading-7 text-neutral-800 prose prose-neutral prose-sm max-w-none">
                {children}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
