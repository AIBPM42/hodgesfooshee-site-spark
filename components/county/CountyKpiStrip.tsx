function KpiCard({ label, value, index }: { label: string; value: string; index: number }) {
  return (
    <div
      className="rounded-2xl bg-white shadow-elev-2 ring-1 ring-[var(--hairline)] p-5 md:p-6 reveal hover:shadow-elev-3 transition-all duration-300"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-2">
        {label}
      </div>
      <div className="text-2xl md:text-3xl font-bold text-neutral-900">
        {value}
      </div>
    </div>
  );
}

export default function CountyKpiStrip({
  items
}: {
  items: { label: string; value: string }[];
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 -mt-12 relative z-30">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {items.map((item, idx) => (
          <KpiCard key={item.label} {...item} index={idx} />
        ))}
      </div>
    </section>
  );
}
