export default function CountyNarrative({
  title,
  content,
  icon
}: {
  title: string;
  content: string;
  icon?: React.ReactNode;
}) {
  const paragraphs = content.split('\n\n').filter(p => p.trim());

  return (
    <div className="rounded-3xl bg-[var(--card-bg)] p-6 md:p-10 ring-1 ring-[var(--hairline)] shadow-elev-2 hover:shadow-elev-3 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6 pb-5 border-b-2 border-[var(--brand-copper)]">
        {icon && <div className="text-[var(--brand-copper)]">{icon}</div>}
        <h2 className="h2 font-bold text-neutral-900">{title}</h2>
      </div>

      <div className="county-prose">
        {paragraphs.map((paragraph, idx) => (
          <p key={idx} className="mb-5 last:mb-0 text-base md:text-lg leading-relaxed text-neutral-700">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
