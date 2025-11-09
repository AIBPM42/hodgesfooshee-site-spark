import { ReactNode } from "react";

type Kpi = {
  label: string;
  value: string | number;
  icon?: ReactNode;
  tone?: "orange" | "purple" | "green" | "yellow"
};

const toneClass = {
  orange: "text-[#F2683A]",
  purple: "text-[#6F52ED]",
  green: "text-[#4CAF50]",
  yellow: "text-[#F3B544]"
};

export default function KpiPills({ items }: { items: Kpi[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {items.map((k, i) => (
        <div key={i} className="rounded-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-4 border border-slate-100">
          <div className="text-xs tracking-wide text-slate-500 uppercase font-semibold">
            {k.label}
          </div>
          <div className={`mt-1 text-2xl font-extrabold ${k.tone ? toneClass[k.tone] : "text-slate-900"}`}>
            {k.value}
          </div>
        </div>
      ))}
    </div>
  );
}
