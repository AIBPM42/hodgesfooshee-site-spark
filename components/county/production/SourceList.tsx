import Link from "next/link";

export default function SourceList({ sources }: { sources: {name:string; url:string}[] }) {
  if (!sources?.length) return null;

  return (
    <section aria-labelledby="sources" className="mt-8 rounded-2xl bg-white shadow-[0_8px_24px_rgba(20,20,20,.06)] ring-1 ring-black/5 p-6">
      <h3 id="sources" className="text-lg font-semibold tracking-tight text-neutral-900">Sources</h3>
      <ul className="mt-4 space-y-3 list-disc pl-6">
        {sources.map((s, i) => (
          <li key={i} className="text-neutral-700">
            <Link
              href={s.url}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-500 hover:text-neutral-900 transition-colors"
            >
              {s.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
