'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Image, HardDrive } from 'lucide-react';

type SummaryRow = { label: string; value: number };
type TopAgent = { user_email: string | null; edits: number };

export default function UsageWidget() {
  const [summary, setSummary] = useState<SummaryRow[]>([]);
  const [top, setTop] = useState<TopAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/usage-summary');
        if (!res.ok) {
          if (res.status === 403) {
            setError('Owner access required');
            return;
          }
          throw new Error('Failed to fetch usage data');
        }
        const json = await res.json();
        setSummary(json.summary || []);
        setTop(json.top || []);
      } catch (err: any) {
        console.error('Error fetching usage:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border bg-token-surface-1 p-6 backdrop-blur shadow-matte-1" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-token-text-mute" />
          <h3 className="text-lg font-semibold text-token-text-hi">Image Studio Usage</h3>
        </div>
        <div className="mt-4 text-sm text-token-text-mute">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return null; // Hide widget if not owner
  }

  const icons = [TrendingUp, Image, HardDrive];

  return (
    <div className="rounded-2xl border bg-token-surface-1 p-6 backdrop-blur shadow-matte-1" style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-token-text-mute" />
        <h3 className="text-lg font-semibold text-token-text-hi">Image Studio • This Month</h3>
      </div>

      {/* Summary Cards */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {summary.map((s, idx) => {
          const Icon = icons[idx] || TrendingUp;
          return (
            <div
              key={s.label}
              className="rounded-xl border bg-token-surface-0 p-4 transition hover:bg-token-surface-2"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-token-text-mute" />
                <div className="text-xs text-token-text-mute">{s.label}</div>
              </div>
              <div className="mt-2 text-2xl font-bold text-token-text-hi">
                {s.value.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Top 5 Agents */}
      {top.length > 0 && (
        <div className="mt-5">
          <div className="text-sm font-medium text-token-text-lo">Top 5 agents by edits</div>
          <div className="mt-3 space-y-2">
            {top.map((t, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border bg-token-surface-0 px-3 py-2"
                style={{ borderColor: 'var(--border)' }}
              >
                <span className="text-sm text-token-text-lo truncate">{t.user_email ?? 'Unknown'}</span>
                <span className="text-sm font-semibold text-token-text-hi ml-3">{t.edits}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
