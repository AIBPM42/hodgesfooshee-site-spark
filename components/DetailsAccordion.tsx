"use client";
import { useState } from "react";
import { brand } from "@/lib/brand";

type DetailsAccordionProps = {
  title: string;
  icon?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

/**
 * DetailsAccordion Component
 * Premium collapsible section for property detail pages
 * SEO-friendly using <details> element with enhanced styling
 */
export default function DetailsAccordion({
  title,
  icon,
  children,
  defaultOpen = false,
}: DetailsAccordionProps) {
  return (
    <details
      className="group rounded-2xl bg-white ring-1 ring-black/5
                 shadow-[0_8px_24px_rgba(20,20,20,.06)]
                 hover:shadow-[0_12px_28px_rgba(20,20,20,.09)]
                 transition-all duration-300 overflow-hidden"
      open={defaultOpen}
    >
      <summary className="cursor-pointer list-none px-6 py-5 select-none
                         hover:bg-neutral-50/50 transition-colors duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && <span className="text-xl">{icon}</span>}
            <h3 className="text-lg font-bold text-neutral-900 tracking-tight">
              {title}
            </h3>
          </div>

          {/* Chevron indicator */}
          <svg
            className="w-5 h-5 text-neutral-400 transition-transform duration-300 group-open:rotate-180"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {/* Copper accent line */}
        <div className="mt-3 h-[2px] w-16 rounded-full bg-gradient-to-r from-[#E45A2E] to-[#F3C14B]
                        opacity-0 group-open:opacity-100 transition-opacity duration-300" />
      </summary>

      {/* Content area */}
      <div className="px-6 pb-6 text-neutral-700 leading-relaxed">
        {children}
      </div>
    </details>
  );
}

/**
 * PropertyFeatureGrid Component
 * Grid layout for property features within accordion sections
 */
export function PropertyFeatureGrid({ features }: { features: Array<{ label: string; value: string }> }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
      {features.map((feature, idx) => (
        <div key={idx} className="flex justify-between py-3 px-4 rounded-lg bg-neutral-50">
          <span className="font-medium text-neutral-600">{feature.label}</span>
          <span className="font-semibold text-neutral-900">{feature.value}</span>
        </div>
      ))}
    </div>
  );
}
