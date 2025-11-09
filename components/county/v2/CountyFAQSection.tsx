import type { County, FAQQuestion } from "@/lib/types/county";

export function CountyFAQSection({ county }: { county: County }) {
  if (!county.faq_questions || county.faq_questions.length === 0) return null;

  const displayQuestions = county.faq_questions.filter(q => q.display);
  if (displayQuestions.length === 0) return null;

  return (
    <section className="mb-14">
      <article className="rounded-3xl bg-[var(--hf-porcelain)] p-6 md:p-8 shadow-elev-1">
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-3 text-[22px] font-extrabold text-neutral-900">
              <span className="text-2xl">❓</span>
              Frequently Asked Questions
            </h2>
            {county.seo_score && (
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200">
                <span className="text-sm font-medium text-emerald-700">SEO</span>
                <span className="text-lg font-bold text-emerald-600">{county.seo_score}/100</span>
              </div>
            )}
          </div>
          <div className="mt-3 h-0.5 w-20 bg-gradient-to-r from-[var(--brand-copper)] to-[var(--brand-copper-600)] rounded-full" />
        </header>

        <div className="space-y-6">
          {displayQuestions.map((faq, idx) => (
            <div key={idx} className="pb-6 border-b border-neutral-200 last:border-0 last:pb-0">
              <h3 className="text-base md:text-lg font-semibold text-neutral-900 mb-2 flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--brand-copper)] text-white flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </span>
                <span>{faq.question}</span>
              </h3>
              <p className="text-sm md:text-base text-neutral-700 leading-relaxed ml-9">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        {county.seo_score && (
          <div className="md:hidden mt-6 pt-6 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-600">SEO Quality Score</span>
              <span className="text-xl font-bold text-emerald-600">{county.seo_score}/100</span>
            </div>
          </div>
        )}
      </article>
    </section>
  );
}
