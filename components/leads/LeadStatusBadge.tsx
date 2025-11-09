import type { LeadStatus } from '@/lib/types/leads';

interface LeadStatusBadgeProps {
  status: LeadStatus;
}

export function LeadStatusBadge({ status }: LeadStatusBadgeProps) {
  const styles = {
    new: 'bg-blue-50 text-blue-700 border-blue-200',
    claimed_by_broker: 'bg-purple-50 text-purple-700 border-purple-200',
    assigned_to_agent: 'bg-green-50 text-green-700 border-green-200',
    archived: 'bg-gray-50 text-gray-600 border-gray-200',
  };

  const labels = {
    new: 'New',
    claimed_by_broker: 'Claimed by You',
    assigned_to_agent: 'Assigned',
    archived: 'Archived',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
