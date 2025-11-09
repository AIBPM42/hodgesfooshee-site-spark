import type { PropertyType } from '@/lib/types/leads';

interface PropertyTypeBadgeProps {
  type: PropertyType;
}

export function PropertyTypeBadge({ type }: PropertyTypeBadgeProps) {
  const styles = {
    'Pre-Foreclosure': 'bg-red-50 text-red-700 border-red-200',
    'Foreclosure': 'bg-orange-50 text-orange-700 border-orange-200',
    'Tax Lien': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'Probate Sale': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Expired Listing': 'bg-gray-50 text-gray-700 border-gray-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[type]}`}>
      {type}
    </span>
  );
}
