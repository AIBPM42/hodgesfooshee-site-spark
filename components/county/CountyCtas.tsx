export default function CountyCtas({ countyName }: { countyName: string }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <a
        href="/search/properties"
        className="btn-copper-shimmer rounded-full px-8 py-4 font-semibold text-lg ring-1 ring-black/10 shadow-[0_12px_32px_rgba(228,85,46,.5)] focus-brand inline-flex items-center justify-center gap-2 transition-all duration-300"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        View {countyName} Properties
      </a>

      <a
        href="/contact"
        className="rounded-full px-8 py-4 font-semibold text-lg ring-1 ring-[var(--hairline)] bg-white hover:bg-[var(--white-glass)] backdrop-blur shadow-elev-1 hover:shadow-elev-2 transition-all duration-300 focus-brand inline-flex items-center justify-center gap-2 text-neutral-900"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Schedule Consultation
      </a>
    </div>
  );
}
