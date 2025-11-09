type IntelProps = {
  county: string;
  city: string;
  growth: string;
  price: string;
  dom: string;
  trend: string;
  badge?: "HOT" | "RISING" | "STABLE";
};

export default function IntelCard({ county, city, growth, price, dom, trend, badge }: IntelProps) {
  return (
    <div className="rounded-3xl p-6 md:p-7 bg-white/70 intel-surface shadow-[0_30px_80px_rgba(16,24,40,0.12),0_6px_18px_rgba(16,24,40,0.08)]">
      <div className="flex items-center justify-between">
        <h4 className="text-2xl font-semibold text-charcoal-900">{county}</h4>
        {badge && (
          <span className="text-xs px-2 py-1 rounded-full bg-charcoal-900/5 text-charcoal-900/80 font-semibold">
            {badge}
          </span>
        )}
      </div>
      <div className="mt-1 text-charcoal-900/70">{city}</div>

      <div className="mt-5 space-y-4">
        <div>
          <div className="text-charcoal-900/70 text-sm">Population Growth</div>
          <div className="text-green-600 font-bold text-lg">{growth}</div>
        </div>
        <div>
          <div className="text-charcoal-900/70 text-sm">Median Price</div>
          <div className="text-2xl font-extrabold text-charcoal-900">{price}</div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-charcoal-900/70 text-sm">Days on Market</div>
            <div className="font-semibold text-charcoal-900">{dom}</div>
          </div>
          <div>
            <div className="text-charcoal-900/70 text-sm">Price Trend</div>
            <div className="font-semibold text-charcoal-900">{trend}</div>
          </div>
        </div>
      </div>

      <button className="mt-6 underline underline-offset-4 text-charcoal-900 hover:text-copper-600 transition font-medium">
        View County Details
      </button>
    </div>
  );
}
