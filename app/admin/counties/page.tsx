"use client";

import { useState, useEffect } from "react";
import type { County } from "@/lib/types/county";

type CountyWithStatus = County & {
  refreshing: boolean;
  lastRefreshMessage?: string;
};

export default function CountiesAdminPage() {
  const [counties, setCounties] = useState<CountyWithStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCounties();
  }, []);

  async function loadCounties() {
    try {
      // Fetch all counties directly from Supabase
      const response = await fetch("/api/admin/counties/list");
      const data = await response.json();

      setCounties(data.map((c: County) => ({ ...c, refreshing: false })));
    } catch (error) {
      console.error("Failed to load counties:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRefreshNarrative(slug: string) {
    setCounties((prev) =>
      prev.map((c) =>
        c.slug === slug ? { ...c, refreshing: true, lastRefreshMessage: undefined } : c
      )
    );

    try {
      const response = await fetch("/api/admin/refresh-county", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });

      const data = await response.json();

      if (data.success) {
        setCounties((prev) =>
          prev.map((c) =>
            c.slug === slug
              ? {
                  ...c,
                  refreshing: false,
                  narrative_updated_at: data.updated_at,
                  lastRefreshMessage: "✅ Narrative refreshed successfully!",
                }
              : c
          )
        );

        // Reload full county data
        setTimeout(loadCounties, 1000);
      } else {
        setCounties((prev) =>
          prev.map((c) =>
            c.slug === slug
              ? { ...c, refreshing: false, lastRefreshMessage: `❌ ${data.error}` }
              : c
          )
        );
      }
    } catch (error: any) {
      setCounties((prev) =>
        prev.map((c) =>
          c.slug === slug
            ? { ...c, refreshing: false, lastRefreshMessage: `❌ ${error.message}` }
            : c
        )
      );
    }
  }

  async function handleUpdateSchedule(slug: string, autoRefresh: boolean, frequency: string) {
    try {
      const response = await fetch("/api/admin/counties/update-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, auto_refresh: autoRefresh, refresh_frequency: frequency }),
      });

      if (response.ok) {
        loadCounties(); // Reload to show updated settings
      }
    } catch (error) {
      console.error("Failed to update schedule:", error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linen75 flex items-center justify-center">
        <div className="text-xl text-neutral-700">Loading counties...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linen75 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="h1 font-display font-bold text-neutral-900">
            County Management
          </h1>
          <p className="mt-3 text-neutral-700 text-lg">
            Manually refresh AI narratives and control Perplexity API usage
          </p>
        </div>

        {/* Credit Warning */}
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-6 mb-8">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-amber-900 mb-1">API Credit Control</h3>
              <p className="text-amber-800 text-sm">
                Each manual refresh uses Perplexity AI credits. Only refresh when you need updated market narratives.
                Set to "Manual" to prevent automatic credit usage.
              </p>
            </div>
          </div>
        </div>

        {/* Counties Grid */}
        <div className="space-y-6">
          {counties.map((county) => (
            <div
              key={county.id}
              className="rounded-3xl bg-[#FBF3E7] border border-black/5 shadow-elev-1 p-6 md:p-8"
            >
              {/* County Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-neutral-900">{county.name}</h3>
                  <p className="text-neutral-600 text-sm mt-1">
                    Slug: <code className="bg-white/60 px-2 py-0.5 rounded">/counties/{county.slug}</code>
                  </p>
                </div>

                <a
                  href={`/counties/${county.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-neutral-800 bg-white/90 ring-1 ring-black/10 hover:bg-white transition-all"
                >
                  View Page →
                </a>
              </div>

              {/* Narrative Status */}
              <div className="rounded-xl bg-white/60 border border-black/5 p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-neutral-700">AI Narrative Status</span>
                  {county.narrative_updated_at ? (
                    <span className="text-xs text-neutral-600">
                      Last updated: {new Date(county.narrative_updated_at).toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-xs text-amber-600 font-medium">Not generated yet</span>
                  )}
                </div>

                {county.narrative ? (
                  <p className="text-sm text-neutral-700 line-clamp-2">{county.narrative}</p>
                ) : (
                  <p className="text-sm text-neutral-500 italic">
                    No narrative generated. Click "Refresh Narrative" to generate using Perplexity AI.
                  </p>
                )}
              </div>

              {/* Refresh Controls */}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                {/* Manual Refresh */}
                <div className="rounded-xl bg-white/60 border border-black/5 p-4">
                  <h4 className="text-sm font-semibold text-neutral-900 mb-3">Manual Refresh</h4>
                  <button
                    onClick={() => handleRefreshNarrative(county.slug)}
                    disabled={county.refreshing}
                    className="w-full px-4 py-2.5 rounded-xl font-medium text-white bg-[linear-gradient(180deg,var(--brand-copper),var(--brand-copper-700))] shadow-[0_10px_28px_rgba(231,106,60,.45)] hover:shadow-[0_14px_36px_rgba(231,106,60,.45)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {county.refreshing ? "Refreshing..." : "Refresh Narrative (Uses Credits)"}
                  </button>

                  {county.lastRefreshMessage && (
                    <p className="text-sm mt-2 text-center">{county.lastRefreshMessage}</p>
                  )}
                </div>

                {/* Auto-Refresh Schedule */}
                <div className="rounded-xl bg-white/60 border border-black/5 p-4">
                  <h4 className="text-sm font-semibold text-neutral-900 mb-3">Auto-Refresh Schedule</h4>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={county.auto_refresh || false}
                        onChange={(e) =>
                          handleUpdateSchedule(
                            county.slug,
                            e.target.checked,
                            county.refresh_frequency || "manual"
                          )
                        }
                        className="rounded border-neutral-300"
                      />
                      <span className="text-neutral-700">Enable Auto-Refresh</span>
                    </label>

                    <select
                      value={county.refresh_frequency || "manual"}
                      onChange={(e) =>
                        handleUpdateSchedule(county.slug, county.auto_refresh || false, e.target.value)
                      }
                      disabled={!county.auto_refresh}
                      className="w-full rounded-lg px-3 py-2 text-sm bg-white border border-neutral-300 disabled:opacity-50"
                    >
                      <option value="manual">Manual Only</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>

                    {county.auto_refresh && (
                      <p className="text-xs text-amber-600 font-medium">
                        ⚠️ Will use credits automatically on {county.refresh_frequency} basis
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* KPIs Preview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center p-3 rounded-lg bg-white/40">
                  <div className="text-xs text-neutral-600">Pop. Growth</div>
                  <div className="text-lg font-bold text-emerald-600">{county.kpis.population_growth}</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/40">
                  <div className="text-xs text-neutral-600">Median Price</div>
                  <div className="text-lg font-bold text-neutral-900">{county.kpis.median_price}</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/40">
                  <div className="text-xs text-neutral-600">DOM</div>
                  <div className="text-lg font-bold text-neutral-900">{county.kpis.days_on_market}</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/40">
                  <div className="text-xs text-neutral-600">Trend</div>
                  <div className="text-lg font-bold text-emerald-600">{county.kpis.price_trend}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Back Link */}
        <div className="mt-8">
          <a
            href="/admin"
            className="inline-flex items-center gap-2 text-neutral-700 hover:text-neutral-900 underline underline-offset-4 transition-colors"
          >
            ← Back to Admin Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
