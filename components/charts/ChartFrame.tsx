'use client';

export default function ChartFrame({
  title,
  subtitle,
  badge,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-3xl bg-[#FBF3E7] border border-black/5 shadow-elev-1 p-4 sm:p-6 transition-all duration-300 hover:shadow-elev-2 ${className || ''}`}
    >
      <header className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">
            {title}
          </h3>
          {subtitle && <p className="text-xs text-neutral-700 mt-0.5">{subtitle}</p>}
        </div>
        {badge}
      </header>
      <div className="overflow-hidden rounded-2xl bg-white/90 p-4">{children}</div>
    </section>
  );
}
