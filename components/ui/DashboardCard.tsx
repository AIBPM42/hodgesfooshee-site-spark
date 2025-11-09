import { ReactNode } from 'react';

export function Card({
  title,
  subtitle,
  children,
  className = ''
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-2xl border border-[#E8E3DA] shadow-[0_10px_30px_rgba(25,15,0,.07)] p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[#1F2937]">{title}</h3>
        {subtitle && <p className="text-sm text-[#6B7280] mt-1">{subtitle}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
}
