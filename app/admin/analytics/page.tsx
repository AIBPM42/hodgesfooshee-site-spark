'use client';

import PremiumCard from '@/components/ui/PremiumCard';

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-4">
      {/* Page header */}
      <div>
        <h1 className="text-3xl md:text-[34px] font-extrabold tracking-tight text-[var(--text-strong)]">
          Agent Analytics
        </h1>
        <p className="mt-1 text-[15px] text-[var(--text-muted)]">
          Track agent activity, usage metrics, and performance
        </p>
      </div>

      {/* Coming Soon Card */}
      <PremiumCard title="Coming Soon" subtitle="Know exactly what's working (and who's crushing it)">
        <div className="py-12 px-6 space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-[var(--text-strong)] mb-3">
              Stop Guessing. Start Measuring.
            </h3>
          </div>

          {/* The Problem */}
          <div className="max-w-2xl mx-auto space-y-3">
            <h4 className="font-semibold text-[var(--text-strong)]">The Problem</h4>
            <p className="text-[var(--text-muted)] leading-relaxed">
              You're paying for premium tools—AI search, image studio, lead intel—but you have no idea if your agents are actually using them.
              Are they logging in? Running searches? Converting leads?
            </p>
            <p className="text-[var(--text-muted)] leading-relaxed">
              Without data, you can't coach your team. You don't know which features drive ROI. You're flying blind.
            </p>
          </div>

          {/* The Solution */}
          <div className="max-w-2xl mx-auto space-y-3">
            <h4 className="font-semibold text-[var(--text-strong)]">What You'll Get</h4>
            <p className="text-[var(--text-muted)] leading-relaxed">
              See exactly who's using what, when, and how often. Track logins, search patterns, image edits, and lead touches—all in one dashboard.
              <strong className="text-[var(--text-strong)]"> Find your power users. Identify who needs training. Double down on what's working.</strong>
            </p>
          </div>

          {/* Features List */}
          <div className="max-w-2xl mx-auto">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong className="text-[var(--text-strong)] block">Activity Tracking</strong>
                    <span className="text-sm text-[var(--text-muted)]">See who logged in, when, and what they did</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong className="text-[var(--text-strong)] block">Search Analytics</strong>
                    <span className="text-sm text-[var(--text-muted)]">Which neighborhoods, price ranges, and filters get the most action</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong className="text-[var(--text-strong)] block">Image Studio Metrics</strong>
                    <span className="text-sm text-[var(--text-muted)]">Track edits, downloads, and most-used prompts</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong className="text-[var(--text-strong)] block">Lead Engagement</strong>
                    <span className="text-sm text-[var(--text-muted)]">Who's claiming leads and actually following up</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong className="text-[var(--text-strong)] block">Performance Leaderboards</strong>
                    <span className="text-sm text-[var(--text-muted)]">Gamify adoption with friendly competition</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong className="text-[var(--text-strong)] block">Export Reports</strong>
                    <span className="text-sm text-[var(--text-muted)]">CSV and PDF downloads for team meetings</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* The Benefit */}
          <div className="max-w-2xl mx-auto pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <p className="text-[var(--text-muted)] leading-relaxed">
              <strong className="text-[var(--text-strong)]">Coach with confidence.</strong> Celebrate your top performers. Give struggling agents the nudge they need.
              Know which tools deliver value so you can invest smarter. Turn usage data into competitive advantage.
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
