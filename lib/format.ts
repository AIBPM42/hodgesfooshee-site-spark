/**
 * Fire v3 Number Formatting Utilities
 * Consistent, accessible, professional formatting across all dashboard views
 */

/** Format currency: 485000 → "$485K" */
export function formatPrice(val: number): string {
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `$${Math.round(val / 1_000)}K`;
  return `$${val.toLocaleString()}`;
}

/** Format days: 18 → "18 days" */
export function formatDays(val: number): string {
  return `${val} day${val === 1 ? '' : 's'}`;
}

/** Format percentage: 0.69 → "69.0%" or 2.1 → "+2.1%" */
export function formatPct(val: number, showSign = false, decimals = 1): string {
  const sign = showSign && val > 0 ? '+' : '';
  return `${sign}${val.toFixed(decimals)}%`;
}

/** Format ratio: 98.6 → "98.6%" */
export function formatRatio(val: number, decimals = 1): string {
  return `${val.toFixed(decimals)}%`;
}

/** Format large numbers: 12543 → "12,543" */
export function formatCount(val: number): string {
  return val.toLocaleString();
}

/** Format compact count: 12543 → "12.5K" */
export function formatCompact(val: number): string {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K`;
  return val.toString();
}

/** Format delta with color tone */
export function formatDelta(val: number, decimals = 1): { text: string; tone: string } {
  const sign = val > 0 ? '+' : '';
  const text = `${sign}${val.toFixed(decimals)}%`;
  const tone = val > 0 ? 'var(--brand-green)' : val < 0 ? 'var(--brand-orange)' : 'var(--sub)';
  return { text, tone };
}

/** Format timestamp: "2025-10-23T08:42:00" → "8:42 AM" */
export function formatTime(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

/** Format date: "2025-10-23" → "Oct 23, 2025" */
export function formatDate(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
