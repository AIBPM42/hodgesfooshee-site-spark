'use client';

import PremiumCard from '@/components/ui/PremiumCard';
import Link from 'next/link';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-4">
      {/* Page header */}
      <div>
        <h1 className="text-3xl md:text-[34px] font-extrabold tracking-tight text-[var(--text-strong)]">
          Settings
        </h1>
        <p className="mt-1 text-[15px] text-[var(--text-muted)]">
          Manage system configuration and preferences
        </p>
      </div>

      {/* Active Settings - API Keys */}
      <div className="rounded-xl border bg-[var(--surface-2)] p-6" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-strong)]">🔑 API Keys</h3>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Manage third-party API keys for Manus, Perplexity, and OpenAI
            </p>
          </div>
          <Link
            href="/admin/settings/keys"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-copper)] px-4 py-2 text-sm font-medium text-white hover:brightness-110 transition"
          >
            Manage Keys →
          </Link>
        </div>
      </div>

      {/* Coming Soon - User Management */}
      <PremiumCard title="Coming Soon" subtitle="Control who has access">
        <div className="py-12 px-6 space-y-4">
          <div className="text-center">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-[var(--text-strong)] mb-3">
              User & Role Management
            </h3>
          </div>

          <div className="max-w-2xl mx-auto">
            <p className="text-[var(--text-muted)] leading-relaxed text-center">
              Add agents, assign roles, and control permissions—all from one place. Coming Q2 2025.
            </p>
          </div>
        </div>
      </PremiumCard>

      {/* Coming Soon - Branding */}
      <PremiumCard title="Coming Soon" subtitle="Make it yours">
        <div className="py-12 px-6 space-y-4">
          <div className="text-center">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-bold text-[var(--text-strong)] mb-3">
              Branding & Customization
            </h3>
          </div>

          <div className="max-w-2xl mx-auto">
            <p className="text-[var(--text-muted)] leading-relaxed text-center">
              Upload your logo, set brand colors, and customize email templates. Coming Q3 2025.
            </p>
          </div>
        </div>
      </PremiumCard>
    </div>
  );
}
