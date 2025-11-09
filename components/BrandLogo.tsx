'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

/**
 * Production-grade logo with:
 * - SVG-first with automatic PNG fallback
 * - Z-index and blend-mode isolation
 * - Case-sensitive path safety for Linux deployments
 * - Accessibility and focus states
 */
export default function BrandLogo() {
  // Primary: SVG for crisp rendering at any DPI
  // Fallback: ICO/PNG for legacy browser support
  const PRIMARY = '/favicon.svg';
  const FALLBACK = '/favicon.ico';

  const [src, setSrc] = useState(PRIMARY);

  return (
    <Link
      href="/"
      className="relative z-[100] flex items-center gap-3
                 mix-blend-normal opacity-100 isolate
                 focus-visible:outline-2 focus-visible:outline-copper-600
                 focus-visible:outline-offset-4 rounded-lg
                 transition-opacity hover:opacity-90"
      aria-label="Hodges & Fooshee - Return to Home"
    >
      <Image
        src={src}
        alt="Hodges & Fooshee Logo"
        width={32}
        height={32}
        priority
        className="shrink-0 rounded"
        onError={() => {
          console.warn(`[BrandLogo] Failed to load ${src}, switching to ${FALLBACK}`);
          setSrc(FALLBACK);
        }}
      />
      <span className="font-semibold text-charcoal-900 whitespace-nowrap">
        Hodges & Fooshee
      </span>
    </Link>
  );
}
