"use client";

import { useState } from "react";

type Props = {
  title: string;
  icon?: string;
  bullets: string[];
  initiallyOpen?: boolean;
};

export default function ExpandableBullets({
  title,
  icon = "📊",
  bullets,
  initiallyOpen = false
}: Props) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  return (
    <div className="rounded-3xl bg-[#FBF3E7] border border-black/5 shadow-elev-1 p-4 transition-all duration-300 hover:shadow-elev-2">
      {/* HEADER - Only this triggers open/close */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-3 text-left hover:opacity-80 transition-opacity"
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 shadow-sm text-xl">
            {icon}
          </span>
          <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
        </div>

        {/* Arrow indicator */}
        <span className="shrink-0 text-[#E44B22] transition-transform duration-200" style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M0 8L16 0V16L0 8Z" />
          </svg>
        </span>
      </button>

      {/* CONTENT - Bullets on the RIGHT side when open */}
      {isOpen && (
        <div className="mt-4 pl-13">
          <ul className="space-y-2">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-[15px] text-neutral-700 leading-relaxed">
                <span className="shrink-0 mt-1.5 text-[#E44B22]">•</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
