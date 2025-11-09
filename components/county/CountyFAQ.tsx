import type { FAQQuestion } from "@/lib/types/county";

export default function CountyFAQ({
  questions,
  seoScore
}: {
  questions: FAQQuestion[];
  seoScore?: number;
}) {
  const displayQuestions = questions.filter(q => q.display);

  if (displayQuestions.length === 0) return null;

  return (
    <div className="rounded-3xl bg-white ring-1 ring-[var(--hairline)] shadow-elev-2 p-6 md:p-10">
      <div className="flex items-center justify-between mb-6 pb-5 border-b-2 border-[var(--brand-copper)]">
        <h2 className="h2 font-bold text-neutral-900">Frequently Asked Questions</h2>
        {seoScore && (
          <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200">
            <span className="text-sm font-medium text-emerald-700">SEO Score</span>
            <span className="text-lg font-bold text-emerald-600">{seoScore}/100</span>
          </div>
        )}
      </div>

      <div className="space-y-8">
        {displayQuestions.map((faq, idx) => (
          <div
            key={idx}
            className="pb-8 border-b border-neutral-200 last:border-0 last:pb-0"
          >
            <h3 className="text-lg md:text-xl font-semibold text-neutral-900 mb-3 flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--brand-copper)] text-white flex items-center justify-center text-sm font-bold">
                {idx + 1}
              </span>
              <span>{faq.question}</span>
            </h3>
            <p className="text-base text-neutral-700 leading-relaxed ml-10">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>

      {seoScore && (
        <div className="md:hidden mt-8 pt-6 border-t border-neutral-200">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-neutral-600">SEO Quality Score</span>
            <span className="text-xl font-bold text-emerald-600">{seoScore}/100</span>
          </div>
        </div>
      )}
    </div>
  );
}
