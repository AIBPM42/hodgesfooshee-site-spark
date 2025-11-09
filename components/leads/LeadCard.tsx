'use client';

import { useState } from 'react';
import type { DistressedLead } from '@/lib/types/leads';
import { LeadStatusBadge } from './LeadStatusBadge';
import { PropertyTypeBadge } from './PropertyTypeBadge';
import { PriorityIndicator } from './PriorityIndicator';
import { Button } from '../ui/button';
import { formatPrice } from '@/lib/format';
import { MapPin, Calendar, TrendingUp, Award, ChevronDown, ChevronUp, Brain } from 'lucide-react';

interface LeadCardProps {
  lead: DistressedLead;
  mode: 'admin' | 'agent';
  onClaim?: (leadId: string) => void;
  onAssign?: (leadId: string, agentId: string) => void;
  onFeature?: (leadId: string, isFeatured: boolean) => void;
  onUpdate?: () => void; // Callback for agent to refresh data after updates
}

export function LeadCard({ lead, mode, onClaim, onAssign, onFeature, onUpdate }: LeadCardProps) {
  const [isAssigning, setIsAssigning] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteText, setNoteText] = useState(lead.agent_notes || '');
  const [followUpDate, setFollowUpDate] = useState(lead.follow_up_date || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleClaim = () => {
    if (onClaim) {
      onClaim(lead.id);
    }
  };

  const handleAssign = (agentId: string) => {
    if (onAssign) {
      onAssign(lead.id, agentId);
    }
    setIsAssigning(false);
  };

  const handleFeatureToggle = () => {
    if (onFeature) {
      onFeature(lead.id, !lead.is_featured);
    }
  };

  // Agent action handlers
  const handleMarkContacted = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/agent/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contacted: true,
          contactAttempts: (lead.contact_attempts || 0) + 1,
          lastContactDate: new Date().toISOString(),
          leadStatus: 'working',
        }),
      });
      if (response.ok && onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error marking as contacted:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveNote = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/agent/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentNotes: noteText,
        }),
      });
      if (response.ok && onUpdate) {
        setIsAddingNote(false);
        onUpdate();
      }
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/agent/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadStatus: newStatus,
        }),
      });
      if (response.ok && onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveFollowUp = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/agent/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          followUpDate: followUpDate,
        }),
      });
      if (response.ok && onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error saving follow-up date:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="card-matte">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-[var(--text-muted)]" />
            <h3 className="text-lg font-semibold text-[var(--text-strong)]">
              {lead.address}
            </h3>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            {lead.city}, {lead.state} {lead.zip}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <PropertyTypeBadge type={lead.property_type} />
          <LeadStatusBadge status={lead.status} />
        </div>
      </div>

      {/* Priority & Days in Distress */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b" style={{ borderColor: 'var(--ring)' }}>
        <PriorityIndicator priority={lead.priority} />
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <Calendar className="w-4 h-4" />
          <span>{lead.days_in_distress} days in distress</span>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-xs text-[var(--text-muted)] mb-1">Estimated Value</p>
          <p className="text-lg font-bold text-[var(--text-strong)]">{formatPrice(lead.estimated_value)}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--text-muted)] mb-1">Estimated Equity</p>
          <p className="text-lg font-bold text-[var(--text-strong)]">{formatPrice(lead.estimated_equity)}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--text-muted)] mb-1">Confidence Score</p>
          <div className="flex items-center gap-2">
            <p className="text-lg font-bold text-[var(--text-strong)]">{lead.confidence_score}%</p>
            <Award className="w-4 h-4 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* AI Insight - Expandable */}
      <div className="mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all border border-blue-200"
        >
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-[var(--text-strong)]">
              AI Insight from Lead Hunter Prime
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-[var(--text-muted)]" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[var(--text-muted)]" />
          )}
        </button>

        {isExpanded && (
          <div className="mt-2 p-4 rounded-lg bg-gradient-to-r from-blue-50/50 to-purple-50/50 border border-blue-100 animate-in slide-in-from-top-2">
            <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-3">
              {lead.ai_insight}
            </p>
            <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
              <div className="flex items-center gap-1">
                <Award className="w-3 h-3" />
                <span>Confidence: {lead.confidence_score}%</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>Priority: {lead.priority.charAt(0).toUpperCase() + lead.priority.slice(1)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Data Source */}
      <div className="mb-4">
        <p className="text-xs text-[var(--text-muted)]">
          Source: <span className="font-medium text-[var(--text-strong)]">{lead.source}</span>
        </p>
      </div>

      {/* Admin Actions */}
      {mode === 'admin' && (
        <div className="flex flex-wrap gap-2">
          {lead.status === 'new' && (
            <>
              <Button variant="default" size="sm" onClick={handleClaim}>
                Claim This Lead
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsAssigning(!isAssigning)}>
                Assign to Agent
              </Button>
            </>
          )}

          {lead.status === 'claimed_by_broker' && (
            <Button variant="outline" size="sm" onClick={() => setIsAssigning(!isAssigning)}>
              Assign to Agent
            </Button>
          )}

          {lead.status === 'assigned_to_agent' && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--text-muted)]">Assigned to Agent</span>
              <Button variant="ghost" size="sm">
                Reassign
              </Button>
            </div>
          )}

          {/* Feature Toggle */}
          {lead.status !== 'archived' && (
            <Button
              variant={lead.is_featured ? 'default' : 'outline'}
              size="sm"
              onClick={handleFeatureToggle}
            >
              {lead.is_featured ? '⭐ Featured' : 'Feature on Homepage'}
            </Button>
          )}
        </div>
      )}

      {/* Agent Actions */}
      {mode === 'agent' && (
        <div className="space-y-3">
          {/* Assignment Info */}
          {lead.assigned_date && (
            <div className="text-sm text-[var(--text-muted)]">
              Assigned to you on {new Date(lead.assigned_date).toLocaleDateString()}
            </div>
          )}

          {/* Contact Info */}
          {(lead.last_contact_date || lead.contact_attempts) && (
            <div className="text-sm text-[var(--text-muted)] space-y-1">
              {lead.last_contact_date && (
                <div>Last contacted: {new Date(lead.last_contact_date).toLocaleDateString()}</div>
              )}
              {lead.contact_attempts > 0 && (
                <div>Contact attempts: {lead.contact_attempts}</div>
              )}
            </div>
          )}

          {/* Follow-up Date */}
          {lead.follow_up_date && (
            <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
              <p className="text-xs font-semibold text-yellow-800 mb-1">Follow-up Scheduled</p>
              <p className="text-sm text-yellow-700">{new Date(lead.follow_up_date).toLocaleDateString()}</p>
            </div>
          )}

          {/* Agent Notes Display */}
          {lead.agent_notes && !isAddingNote && (
            <div className="p-3 rounded-lg bg-[var(--hf-porcelain-50)]">
              <p className="text-xs font-semibold text-[var(--text-strong)] mb-1">My Notes</p>
              <p className="text-sm text-[var(--text-muted)] whitespace-pre-wrap">{lead.agent_notes}</p>
            </div>
          )}

          {/* Add/Edit Note Form */}
          {isAddingNote && (
            <div className="space-y-2">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add your notes here..."
                rows={4}
                className="w-full px-3 py-2 rounded-lg border bg-[var(--bg-card)] text-[var(--text-strong)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--hf-plum500)]"
                style={{ borderColor: 'var(--ring)' }}
              />
              <div className="flex gap-2">
                <Button variant="default" size="sm" onClick={handleSaveNote} disabled={isUpdating}>
                  Save Note
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsAddingNote(false)} disabled={isUpdating}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            {!lead.contacted && (
              <Button
                variant="default"
                size="sm"
                onClick={handleMarkContacted}
                disabled={isUpdating}
              >
                Mark as Contacted
              </Button>
            )}

            {!isAddingNote && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddingNote(true)}
                disabled={isUpdating}
              >
                {lead.agent_notes ? 'Edit Note' : 'Add Note'}
              </Button>
            )}

            {/* Status Update Dropdown */}
            {lead.contacted && (
              <select
                value={lead.lead_status || 'working'}
                onChange={(e) => handleUpdateStatus(e.target.value)}
                disabled={isUpdating}
                className="px-3 py-1.5 text-sm rounded-lg border bg-[var(--bg-card)] text-[var(--text-strong)] focus:outline-none focus:ring-2 focus:ring-[var(--hf-plum500)]"
                style={{ borderColor: 'var(--ring)' }}
              >
                <option value="working">Working</option>
                <option value="pending">Pending</option>
                <option value="closed_won">Closed Won</option>
                <option value="closed_lost">Closed Lost</option>
              </select>
            )}

            {/* Follow-up Date Picker */}
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                disabled={isUpdating}
                className="px-3 py-1.5 text-sm rounded-lg border bg-[var(--bg-card)] text-[var(--text-strong)] focus:outline-none focus:ring-2 focus:ring-[var(--hf-plum500)]"
                style={{ borderColor: 'var(--ring)' }}
              />
              {followUpDate !== (lead.follow_up_date || '') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSaveFollowUp}
                  disabled={isUpdating}
                >
                  Save
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Agent Assignment Dropdown (Simple MVP version) */}
      {isAssigning && (
        <div className="mt-4 p-4 border rounded-lg" style={{ borderColor: 'var(--ring)' }}>
          <p className="text-sm font-semibold mb-2">Assign to Agent</p>
          <div className="space-y-2">
            <button
              onClick={() => handleAssign('agent-1')}
              className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--hf-porcelain-50)] rounded"
            >
              Sarah Johnson (7 active, 35% conversion)
            </button>
            <button
              onClick={() => handleAssign('agent-2')}
              className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--hf-porcelain-50)] rounded"
            >
              Mike Patterson (5 active, 32% conversion)
            </button>
            <button
              onClick={() => handleAssign('agent-3')}
              className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--hf-porcelain-50)] rounded"
            >
              Emily Rodriguez (8 active, 28% conversion)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
