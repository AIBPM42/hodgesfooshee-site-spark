export default function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold tracking-tight text-slate-900">
          {title}
        </h3>
        {subtitle && <p className="text-sm text-zinc-600 mt-1">{subtitle}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
}
