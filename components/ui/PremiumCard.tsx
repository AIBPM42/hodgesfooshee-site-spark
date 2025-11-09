import { cn } from "@/lib/utils";

type Props = React.PropsWithChildren<{
  title?: string;
  subtitle?: string;
  right?: React.ReactNode;
  className?: string;
}>;

export default function PremiumCard({ title, subtitle, right, className, children }: Props) {
  return (
    <section className={cn("card-matte", className)}>
      {(title || subtitle || right) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h3 className="text-xl font-semibold text-1">{title}</h3>}
            {subtitle && <p className="text-muted text-sm mt-1">{subtitle}</p>}
          </div>
          {right}
        </header>
      )}
      {children}
    </section>
  );
}
