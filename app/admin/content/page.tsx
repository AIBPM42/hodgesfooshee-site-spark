'use client';

import PremiumCard from '@/components/ui/PremiumCard';

export default function AdminContentPage() {
  return (
    <div className="space-y-4">
      {/* Page header */}
      <div>
        <h1 className="text-3xl md:text-[34px] font-extrabold tracking-tight text-[var(--text-strong)]">
          Site Content
        </h1>
        <p className="mt-1 text-[15px] text-[var(--text-muted)]">
          Manage home page content, hero section, and CTAs
        </p>
      </div>

      {/* Coming Soon Card */}
      <PremiumCard title="Coming Soon" subtitle="Ship faster without waiting on developers">
        <div className="py-12 px-6 space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">✨</div>
            <h3 className="text-2xl font-bold text-[var(--text-strong)] mb-3">
              Update Your Site in Seconds, Not Days
            </h3>
          </div>

          {/* The Problem */}
          <div className="max-w-2xl mx-auto space-y-3">
            <h4 className="font-semibold text-[var(--text-strong)]">The Problem</h4>
            <p className="text-[var(--text-muted)] leading-relaxed">
              Need to update the hero image for a new listing? Change the homepage tagline for market conditions?
              Right now, that means finding a developer, waiting for their schedule, and hoping they don't break something else.
            </p>
            <p className="text-[var(--text-muted)] leading-relaxed">
              Your marketing moves fast. Your website shouldn't be the bottleneck.
            </p>
          </div>

          {/* The Solution */}
          <div className="max-w-2xl mx-auto space-y-3">
            <h4 className="font-semibold text-[var(--text-strong)]">What You'll Get</h4>
            <p className="text-[var(--text-muted)] leading-relaxed">
              Point, click, publish. Edit hero sections, swap featured properties, update CTAs, and tweak SEO meta tags—all from one dashboard.
              <strong className="text-[var(--text-strong)]"> No code. No developer tickets. No waiting.</strong>
            </p>
          </div>

          {/* Features List */}
          <div className="max-w-2xl mx-auto">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong className="text-[var(--text-strong)] block">Hero Editor</strong>
                    <span className="text-sm text-[var(--text-muted)]">Swap images, headlines, and CTAs instantly</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong className="text-[var(--text-strong)] block">Featured Properties</strong>
                    <span className="text-sm text-[var(--text-muted)]">Control what listings appear on your homepage</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong className="text-[var(--text-strong)] block">Market Insights</strong>
                    <span className="text-sm text-[var(--text-muted)]">Update stats and market commentary on the fly</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong className="text-[var(--text-strong)] block">Navigation & Footer</strong>
                    <span className="text-sm text-[var(--text-muted)]">Add, remove, or reorder menu items yourself</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong className="text-[var(--text-strong)] block">SEO Controls</strong>
                    <span className="text-sm text-[var(--text-muted)]">Edit meta titles and descriptions for better rankings</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong className="text-[var(--text-strong)] block">Live Preview</strong>
                    <span className="text-sm text-[var(--text-muted)]">See changes before you publish them</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* The Benefit */}
          <div className="max-w-2xl mx-auto pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <p className="text-[var(--text-muted)] leading-relaxed">
              <strong className="text-[var(--text-strong)]">Ship campaigns faster.</strong> Test new messaging without developer time.
              Keep your site fresh without the friction. Your content moves at the speed of your market.
            </p>
          </div>

          {/* Status */}
          <div className="text-center pt-6">
            <span className="pill">In Development • Launching Q2 2025</span>
          </div>
        </div>
      </PremiumCard>
    </div>
  );
}
