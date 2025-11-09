import type { County } from "@/lib/types/county";

type SectionDef = {
  key: 'market_overview' | 'living_here' | 'schools_education' | 'commute_location' | 'investment_outlook';
  title: string;
  icon: string;
};

const sections: SectionDef[] = [
  { key: 'market_overview', title: 'Market Overview', icon: '📊' },
  { key: 'living_here', title: 'Living in', icon: '🏡' },
  { key: 'schools_education', title: 'Schools & Education', icon: '🏫' },
  { key: 'commute_location', title: 'Commute & Location', icon: '🧭' },
  { key: 'investment_outlook', title: 'Investment Outlook', icon: '📈' },
];

export function CountyInsights({ county }: { county: County }) {
  return (
    <section className="mb-14 space-y-10">
      {sections.map(({ key, title, icon }) => {
        const body = county[key];
        if (!body) return null;

        const displayTitle = key === 'living_here' ? `${title} ${county.name}` : title;
        const paragraphs = body.split('\n\n').filter(p => p.trim());

        return (
          <article key={key} className="rounded-3xl bg-[var(--hf-porcelain)] p-6 md:p-8 shadow-elev-1 hover:shadow-elev-2 transition-all duration-300">
            <header className="mb-5">
              <h2 className="flex items-center gap-3 text-[22px] font-extrabold text-neutral-900">
                <span className="text-2xl">{icon}</span>
                {displayTitle}
              </h2>
              <div className="mt-3 h-0.5 w-20 bg-gradient-to-r from-[var(--brand-copper)] to-[var(--brand-copper-600)] rounded-full" />
            </header>
            <div className="county-prose">
              {paragraphs.map((para, idx) => (
                <p key={idx} className="mb-4 last:mb-0 text-base leading-relaxed text-neutral-700">
                  {para}
                </p>
              ))}
            </div>
          </article>
        );
      })}
    </section>
  );
}
