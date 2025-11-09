import { cn } from "@/lib/cn";

export default function Tile({
  title,
  actions,
  className,
  children,
}: {
  title?: string;
  actions?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl p-6",
        "bg-white border border-black/[0.08] shadow-premium",
        "dark:bg-[#0F1420] dark:border-white/[0.08] dark:shadow-premium-dark",
        "hover:shadow-premium-lg dark:hover:shadow-premium-dark-lg",
        "transition-all duration-300 ease-out",
        className
      )}
    >
      {(title || actions) && (
        <header className="mb-4 flex items-center justify-between">
          {title && (
            <h3 className="text-micro-caps uppercase text-black/60 dark:text-white/60">
              {title}
            </h3>
          )}
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}
