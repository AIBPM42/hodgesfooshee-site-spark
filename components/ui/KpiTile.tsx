type KpiProps = {
  label: string;
  value: string | number;
  hint?: string;
  badge?: string;
  strong?: boolean;
};

export function KpiTile({ label, value, hint, badge, strong }: KpiProps){
  return (
    <section className={strong ? "card-matte--heavy" : "card-matte"}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-muted text-sm">{label}</h3>
        {badge && <span className="badge">{badge}</span>}
      </div>
      <div className="text-1 text-4xl font-extrabold leading-none">{value}</div>
      {hint && <p className="mt-2 text-muted text-sm">{hint}</p>}
    </section>
  );
}
