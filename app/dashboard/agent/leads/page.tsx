'use client';

import { useState } from 'react';
import { useLeads, useLeadStats } from '@/lib/hooks';
import { KpiTile } from '@/components/ui/KpiTile';
import { LeadCard } from '@/components/leads/LeadCard';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';
import { RefreshCw } from 'lucide-react';
import type { AgentLeadStats } from '@/lib/types/leads';

export default function AgentLeadsPage() {
  const { data: leads, loading: leadsLoading, error: leadsError, refetch } = useLeads('agent');
  const { data: stats, loading: statsLoading } = useLeadStats('agent') as { data: AgentLeadStats | null, loading: boolean };
  const [filter, setFilter] = useState<'all' | 'new' | 'inProgress' | 'pending' | 'closed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Handle lead update
  const handleLeadUpdate = async () => {
    // Refetch leads after any update
    await refetch();
  };

  // Filter leads
  const filteredLeads = leads?.filter(lead => {
    // Apply status filter
    if (filter === 'new' && lead.contacted) return false;
    if (filter === 'inProgress' && lead.lead_status !== 'working') return false;
    if (filter === 'pending' && lead.lead_status !== 'pending') return false;
    if (filter === 'closed' && !['closed_won', 'closed_lost'].includes(lead.lead_status || '')) return false;

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        lead.address.toLowerCase().includes(search) ||
        lead.city.toLowerCase().includes(search) ||
        lead.zip.includes(search)
      );
    }

    return true;
  }) || [];

  if (leadsLoading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-[var(--text-muted)]">Loading...</div>
      </div>
    );
  }

  if (leadsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Error loading leads: {leadsError}</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-[34px] font-extrabold tracking-tight text-[var(--text-strong)]">
            My Leads
          </h1>
          <p className="mt-1 text-[15px] text-[var(--text-muted)]">
            Distressed property leads assigned to you
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <KpiTile
            label="My Active Leads"
            value={stats.myActive}
          />
          <KpiTile
            label="Contacted This Week"
            value={stats.contactedThisWeek}
            badge={stats.contactedThisWeek > 0 ? '+' + stats.contactedThisWeek : undefined}
          />
          <KpiTile
            label="Conversion Rate"
            value={`${stats.conversionRate.toFixed(1)}%`}
            badge={stats.conversionRate > 25 ? '🔥' : undefined}
          />
          <KpiTile
            label="Pipeline Value"
            value={formatPrice(stats.myPipelineValue)}
            strong
          />
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Tab Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { key: 'all', label: 'All My Leads', count: leads?.length || 0 },
            { key: 'new', label: 'New Assignments', count: leads?.filter(l => !l.contacted).length || 0 },
            { key: 'inProgress', label: 'In Progress', count: leads?.filter(l => l.lead_status === 'working').length || 0 },
            { key: 'pending', label: 'Pending', count: leads?.filter(l => l.lead_status === 'pending').length || 0 },
            { key: 'closed', label: 'Closed', count: leads?.filter(l => ['closed_won', 'closed_lost'].includes(l.lead_status || '')).length || 0 },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                filter === tab.key
                  ? 'bg-[var(--hf-plum500)] text-white'
                  : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:bg-[var(--hf-porcelain-50)]'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by address, city, or ZIP..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 rounded-lg border bg-[var(--bg-card)] text-[var(--text-strong)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--hf-plum500)]"
          style={{ borderColor: 'var(--ring)' }}
        />
      </div>

      {/* Lead Cards */}
      <div className="space-y-4">
        {filteredLeads.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold mb-2">No leads found</h3>
            <p className="text-[var(--text-muted)] max-w-md mx-auto">
              {filter !== 'all'
                ? `No ${filter} leads at the moment. Try a different filter.`
                : 'No leads have been assigned to you yet.'}
            </p>
          </div>
        ) : (
          filteredLeads.map(lead => (
            <LeadCard
              key={lead.id}
              lead={lead}
              mode="agent"
              onUpdate={handleLeadUpdate}
            />
          ))
        )}
      </div>

      {/* Results Count */}
      {filteredLeads.length > 0 && (
        <div className="text-center text-sm text-[var(--text-muted)]">
          Showing {filteredLeads.length} of {leads?.length || 0} leads
        </div>
      )}
    </div>
  );
}
