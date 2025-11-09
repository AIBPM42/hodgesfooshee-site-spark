"use client";

type CountyCardProps = {
  name: string;
  status?: "HOT" | "RISING" | "STABLE";
  growth?: string;
  medianPrice?: string;
  dom?: string;
  trend?: string;
  href?: string;
};

export function CountyCard({
  name,
  status = "RISING",
  growth = "+3.8%",
  medianPrice = "$650,000",
  dom = "22 days",
  trend = "+6.3%",
  href = "#"
}: CountyCardProps) {
  const chip = {
    HOT:    "bg-rose-100 text-rose-800 ring-rose-300/40",
    RISING: "bg-emerald-100 text-emerald-800 ring-emerald-300/40",
    STABLE: "bg-slate-100 text-slate-800 ring-slate-300/40",
  }[status];

  return (
    <article className="rounded-3xl bg-[#FBF3E7] border border-black/5 shadow-elev-1 p-6">
      <header className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:justify-between">
        <h3 className="h3 font-semibold text-neutral-900">{name}</h3>
        <span className={`mt-1 sm:mt-0 text-xs px-2 py-1 rounded-full font-semibold ring-1 ${chip}`}>
          {status}
        </span>
      </header>

      <dl className="mt-4 space-y-3">
        <div>
          <dt className="text-neutral-600">Population Growth</dt>
          <dd className="text-2xl font-bold text-emerald-600">{growth}</dd>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <dt className="text-neutral-600">Median Price</dt>
            <dd className="text-xl font-semibold text-neutral-900">{medianPrice}</dd>
          </div>
          <div>
            <dt className="text-neutral-600">Days on Market</dt>
            <dd className="text-xl font-semibold text-neutral-900">{dom}</dd>
          </div>
        </div>

        <div>
          <dt className="text-neutral-600">Price Trend</dt>
          <dd className="font-semibold text-neutral-900">{trend}</dd>
        </div>
      </dl>

      <a href={href} className="mt-5 inline-flex items-center gap-2 text-[15px] font-medium text-neutral-800 hover:text-neutral-900 underline underline-offset-4">
        View County Details →
      </a>
    </article>
  );
}
