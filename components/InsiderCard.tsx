"use client";

type InsiderCardProps = {
  tag?: "EXCLUSIVE" | "COMING SOON" | "OFF-MARKET";
  title: string;
  subtitle?: string;      // e.g. "Williamson County"
  statLeftLabel?: string; // e.g. "Price Range"
  statLeftValue?: string; // e.g. "$650K–$750K"
  statRightLabel?: string;
  statRightValue?: string;
  image: string;
  href?: string;
};

export function InsiderCard({
  tag = "EXCLUSIVE",
  title,
  subtitle,
  statLeftLabel,
  statLeftValue,
  statRightLabel,
  statRightValue,
  image,
  href = "#",
}: InsiderCardProps) {
  return (
    <a
      href={href}
      className="group block rounded-3xl bg-[#FBF3E7] border border-black/5
                 shadow-elev-1 hover:shadow-elev-2
                 transition-all duration-300"
    >
      <div className="relative h-56 rounded-t-3xl overflow-hidden">
        <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover blur-[8px] scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-2.5 py-1 rounded-full text-[12px] font-semibold
                           bg-white/85 text-neutral-900 ring-1 ring-black/10 backdrop-blur">
            {tag}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="text-[18px] font-semibold">{title}</h3>
          {subtitle && <p className="mt-1 text-[13px] opacity-90">{subtitle}</p>}
        </div>
      </div>

      <div className="p-6">
        <div className="h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
        <dl className="mt-4 grid grid-cols-2 gap-3 text-[14px] text-neutral-900">
          <div>
            <dt className="text-neutral-600">{statLeftLabel}</dt>
            <dd className="font-medium">{statLeftValue}</dd>
          </div>
          <div>
            <dt className="text-neutral-600">{statRightLabel}</dt>
            <dd className="font-medium">{statRightValue}</dd>
          </div>
        </dl>
      </div>
    </a>
  );
}
