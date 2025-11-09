'use client';

import PremiumCard from '@/components/ui/PremiumCard';

export default function AdminBlogPage() {
  return (
    <div className="space-y-4">
      {/* Page header */}
      <div>
        <h1 className="text-3xl md:text-[34px] font-extrabold tracking-tight text-[var(--text-strong)]">
          Blog Management
        </h1>
        <p className="mt-1 text-[15px] text-[var(--text-muted)]">
          Create and edit blog posts for market insights
        </p>
      </div>

      {/* Coming Soon Card */}
      <PremiumCard title="Coming Soon" subtitle="Own your thought leadership without the hassle">
        <div className="py-12 px-6 space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">✍️</div>
            <h3 className="text-2xl font-bold text-[var(--text-strong)] mb-3">
              Become the Go-To Expert in Your Market
            </h3>
          </div>

          {/* The Problem */}
          <div className="max-w-2xl mx-auto space-y-3">
            <h4 className="font-semibold text-[var(--text-strong)]">The Problem</h4>
            <p className="text-[var(--text-muted)] leading-relaxed">
              Your agents know Nashville better than anyone. Green Hills vs Germantown. Inventory trends. What's actually moving.
              But getting that knowledge published? Most brokerages are stuck on WordPress, hiring writers who don't know the market, or waiting weeks for IT.
            </p>
            <p className="text-[var(--text-muted)] leading-relaxed">
              Worse: traditional SEO is dying. Buyers aren't Googling anymore—they're asking ChatGPT and Perplexity. Your blog posts aren't showing up there.
            </p>
          </div>

          {/* The Solution */}
          <div className="max-w-2xl mx-auto space-y-3">
            <h4 className="font-semibold text-[var(--text-strong)]">What You'll Get</h4>
            <p className="text-[var(--text-muted)] leading-relaxed">
              Write, schedule, and publish from the same dashboard you use for everything else. No WordPress. No FTP. No developers.
              <strong className="text-[var(--text-strong)]"> Draft on Monday. Schedule for Thursday. Done.</strong>
            </p>
            <p className="text-[var(--text-muted)] leading-relaxed">
              Every post is automatically optimized for AI search engines—ChatGPT, Perplexity, Gemini. Your content gets cited when buyers ask about Nashville real estate.
            </p>
          </div>

          {/* Features List */}
          <div className="max-w-2xl mx-auto">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong className="text-[var(--text-strong)] block">Rich Text Editor</strong>
                    <span className="text-sm text-[var(--text-muted)]">Write like you're in Google Docs, publish like a pro</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong className="text-[var(--text-strong)] block">Image Management</strong>
                    <span className="text-sm text-[var(--text-muted)]">Drag, drop, done—no FTP, no resize tools</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong className="text-[var(--text-strong)] block">AI-Era SEO</strong>
                    <span className="text-sm text-[var(--text-muted)]">Show up in ChatGPT, Perplexity, and Gemini when buyers search</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong className="text-[var(--text-strong)] block">Draft & Schedule</strong>
                    <span className="text-sm text-[var(--text-muted)]">Write now, publish later—set it and forget it</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong className="text-[var(--text-strong)] block">Categories & Tags</strong>
                    <span className="text-sm text-[var(--text-muted)]">Organize by neighborhood, property type, market trend</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong className="text-[var(--text-strong)] block">Performance Tracking</strong>
                    <span className="text-sm text-[var(--text-muted)]">See what resonates—views, shares, time on page</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* The Benefit */}
          <div className="max-w-2xl mx-auto pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <p className="text-[var(--text-muted)] leading-relaxed">
              <strong className="text-[var(--text-strong)]">Dominate AI search.</strong> When buyers ask ChatGPT "What's the Nashville market like right now?" they see your insights cited in the answer.
              Build authority, generate leads, and own your market—without fighting for Google rankings.
            </p>
          </div>

          {/* Status */}
          <div className="text-center pt-6">
            <span className="pill">In Development • Launching Q3 2025</span>
          </div>
        </div>
      </PremiumCard>
    </div>
  );
}
