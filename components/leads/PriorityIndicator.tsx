import type { LeadPriority } from '@/lib/types/leads';

interface PriorityIndicatorProps {
  priority: LeadPriority;
}

export function PriorityIndicator({ priority }: PriorityIndicatorProps) {
  const styles = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500',
  };

  const labels = {
    high: 'High Priority',
    medium: 'Medium Priority',
    low: 'Low Priority',
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${styles[priority]}`} />
      <span className="text-xs text-[var(--text-muted)]">{labels[priority]}</span>
    </div>
  );
}
