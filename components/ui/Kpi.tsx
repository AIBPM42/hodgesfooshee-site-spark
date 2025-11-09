export function Kpi({
  label,
  value,
  delta,
  color,
}: {
  label: string;
  value: string;
  delta?: string;
  color?: "orange" | "plum" | "green";
}) {
  const colorMap = {
    orange: "#E87722",
    plum: "#6F4DA0",
    green: "#7BB241",
  } as const;

  return (
    <div className="space-y-1.5">
      <div className="text-[10px] font-medium tracking-wider uppercase text-black/50 dark:text-white/50">
        {label}
      </div>
      <div
        className="text-kpi-large"
        style={{ color: color ? colorMap[color] : undefined }}
      >
        {value}
      </div>
      {delta && (
        <div className="text-xs font-medium text-black/60 dark:text-white/60">
          {delta}
        </div>
      )}
    </div>
  );
}
