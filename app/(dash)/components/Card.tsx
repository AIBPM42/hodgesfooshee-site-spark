import clsx from "clsx";

export function Card({
  children, className,
}: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={clsx(
        "ring-token rounded-2xl bg-[var(--bg-card)] shadow-card ring-1",
        "dark:shadow-cardDark",
        className
      )}
    >
      {children}
    </section>
  );
}

export function CardBody({
  className, children,
}: { className?: string; children: React.ReactNode; }) {
  return <div className={clsx("p-5 md:p-6", className)}>{children}</div>;
}

export function CardTitle({ children }:{children:React.ReactNode}) {
  return <h3 className="text-lg font-semibold tracking-tight">{children}</h3>;
}
