export default function SectionCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <article
      className={`rounded-2xl bg-white p-6 shadow-md ring-1 ring-black/5 ${className}`}
    >
      {children}
    </article>
  );
}
