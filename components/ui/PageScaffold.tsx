import { ReactNode } from 'react';

export default function PageScaffold({
  title,
  subtitle,
  right,
  children
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F3EFE9]">
      <div className="mx-auto max-w-[1400px] px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1F2937]">{title}</h1>
            {subtitle && <p className="mt-1 text-[#6B7280]">{subtitle}</p>}
          </div>
          {right && <div>{right}</div>}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
