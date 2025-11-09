'use client';

import { useState } from 'react';
import { useLeads, useLeadStats } from '@/lib/hooks';
import { KpiTile } from '@/components/ui/KpiTile';
import { LeadCard } from '@/components/leads/LeadCard';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';
import { RefreshCw, Settings, Play } from 'lucide-react';
import type { AdminLeadStats } from '@/lib/types/leads';

export default function AdminLeadsPage() {
  const { data: leads, loading: leadsLoading, error: leadsError } = useLeads('admin');
  const { data: stats, loading: statsLoading } = useLeadStats('admin') as { data: AdminLeadStats | null, loading: boolean };
  const [filter, setFilter] = useState<'all' | 'new' | 'claimed' | 'assigned' | 'featured'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Handle lead actions
  const handleClaim = async (leadId: string) => {
    try {
      const response = await fetch(`/api/leads/${leadId}/claim`, {
        method: 'POST',
      });
      if (response.ok) {
        // TODO: Refresh leads
        alert('Lead claimed successfully!');
      }
    } catch (error) {
      console.error('Error claiming lead:', error);
    }
  };

  const handleAssign = async (leadId: string, agentId: string) => {
    try {
      const response = await fetch(`/api/leads/${leadId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId }),
      });
      if (response.ok) {
        // TODO: Refresh leads
        alert('Lead assigned successfully!');
      }
    } catch (error) {
      console.error('Error assigning lead:', error);
    }
  };

  const handleFeature = async (leadId: string, isFeatured: boolean) => {
    try {
      const response = await fetch(`/api/leads/${leadId}/feature`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured }),
      });
      if (response.ok) {
        // TODO: Refresh leads
        alert(isFeatured ? 'Lead featured successfully!' : 'Lead unfeatured successfully!');
      }
    } catch (error) {
      console.error('Error featuring lead:', error);
    }
  };

  // Filter leads
  const filteredLeads = leads?.filter(lead => {
    // Apply status filter
    if (filter === 'new' && lead.status !== 'new') return false;
    if (filter === 'claimed' && lead.status !== 'claimed_by_broker') return false;
    if (filter === 'assigned' && lead.status !== 'assigned_to_agent') return false;
    if (filter === 'featured' && !lead.is_featured) return false;

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
            Lead Management
          </h1>
          <p className="mt-1 text-[15px] text-[var(--text-muted)]">
            Distressed property leads discovered by Lead Hunter Prime
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <KpiTile
            label="New Today"
            value={stats.newToday}
            badge={stats.newToday > 0 ? '+' + stats.newToday : undefined}
          />
          <KpiTile
            label="Total Active"
            value={stats.totalActive}
          />
          <KpiTile
            label="Claimed by You"
            value={stats.claimedByBroker}
          />
          <KpiTile
            label="Avg Response"
            value={`${stats.avgResponseTimeHours.toFixed(1)}h`}
            hint="Time to first contact"
          />
          <KpiTile
            label="Conversion"
            value={`${stats.conversionRate.toFixed(1)}%`}
            badge={stats.conversionRate > 25 ? '🔥' : undefined}
          />
          <KpiTile
            label="Pipeline Value"
            value={formatPrice(stats.pipelineValue)}
            strong
          />
        </div>
      )}

      {/* Lead Hunter Prime Status Banner */}
      <div className="card-matte bg-gradient-to-r from-blue-50 to-purple-50 border-2" style={{ borderColor: 'var(--hf-plum500)' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-bold text-[var(--text-strong)]">🤖 Lead Hunter Prime</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                  Active
                </span>
              </div>
              <div className="space-y-1 text-sm text-[var(--text-muted)]">
                <p>
                  <strong className="text-[var(--text-strong)]">Status:</strong> Last run 2 hours ago • Next run at 6:00 AM tomorrow
                </p>
                <p>
                  <strong className="text-[var(--text-strong)]">Activity:</strong> Found 6 new properties today • 47 properties monitored
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="default" size="sm">
              <Play className="w-4 h-4" />
              Run Now
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Tab Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { key: 'all', label: 'All', count: leads?.length || 0 },
            { key: 'new', label: 'New', count: leads?.filter(l => l.status === 'new').length || 0 },
            { key: 'claimed', label: 'Claimed by Me', count: leads?.filter(l => l.status === 'claimed_by_broker').length || 0 },
            { key: 'assigned', label: 'Assigned', count: leads?.filter(l => l.status === 'assigned_to_agent').length || 0 },
            { key: 'featured', label: 'Featured', count: leads?.filter(l => l.is_featured).length || 0 },
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
                : 'Lead Hunter Prime will discover distressed properties and display them here.'}
            </p>
          </div>
        ) : (
          filteredLeads.map(lead => (
            <LeadCard
              key={lead.id}
              lead={lead}
              mode="admin"
              onClaim={handleClaim}
              onAssign={handleAssign}
              onFeature={handleFeature}
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
