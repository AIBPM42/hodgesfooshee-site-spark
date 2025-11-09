export function ChartShell({
  title,
  tone = "white",
  children
}: {
  title: string;
  tone?: "white" | "warm";
  children: React.ReactNode;
}) {
  const toneCls = tone === "warm" ? "bg-[var(--card-bg)]" : "bg-white";

  return (
    <div
      className={`rounded-2xl ${toneCls} ring-1 ring-[var(--hairline)] shadow-elev-2 p-6 md:p-7 transition-all duration-300 hover:shadow-elev-3 hover:-translate-y-0.5`}
    >
      <h3 className="text-lg md:text-xl font-bold text-neutral-900 mb-4">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}
