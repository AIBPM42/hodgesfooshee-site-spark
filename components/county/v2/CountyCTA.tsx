import type { County } from "@/lib/types/county";

export function CountyCTA({ county }: { county: County }) {
  return (
    <section className="mb-16">
      <div className="sticky bottom-4 z-10">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-4 shadow-elev-3 ring-1 ring-black/5">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href={`/search/properties`}
              className="relative inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 font-semibold text-white bg-gradient-to-b from-[var(--brand-copper)] to-[var(--brand-copper-700)] shadow-elev-2 hover:shadow-[0_16px_36px_-10px_rgba(228,85,46,.55)] focus:outline-none focus:ring-4 focus:ring-[var(--brand-copper)]/40 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              View {county.name} Properties
            </a>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 rounded-2xl border border-neutral-200 px-6 py-3.5 font-semibold text-neutral-800 bg-white hover:bg-neutral-50 shadow-elev-1 hover:shadow-elev-2 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Schedule Consultation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
