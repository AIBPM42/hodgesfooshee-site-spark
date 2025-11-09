export default function KeyTakeaways({ title, bullets }: { title: string; bullets: string[] }) {
  if (!bullets?.length) return null;

  return (
    <section className="rounded-3xl bg-white shadow-sm border border-slate-100 p-5 md:p-6 mb-4">
      <h3 className="text-xl font-bold mb-3 text-slate-900">{title}</h3>
      <ul className="grid gap-2 marker:text-[#F2683A] list-disc pl-5">
        {bullets.map((b, i) => (
          <li key={i} className="leading-relaxed text-slate-700">
            {b}
          </li>
        ))}
      </ul>
    </section>
  );
}
