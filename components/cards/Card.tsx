import { clsx } from "clsx";

export function Card({ className, children, hover }:{ className?:string; children:React.ReactNode; hover?:boolean }){
  return (
    <div className={clsx(
      "rounded-2xl border bg-[var(--panel)] border-[var(--border)]",
      "shadow-[0_10px_30px_rgba(15,17,21,.06)]",
      "dark:shadow-[0_10px_34px_rgba(0,0,0,.35),_inset_0_1px_0_rgba(255,255,255,.02)]",
      "transition-all duration-300",
      hover && "hover:shadow-[0_14px_40px_rgba(15,17,21,.12)] hover:-translate-y-0.5 cursor-pointer",
      hover && "dark:hover:shadow-[0_14px_44px_rgba(0,0,0,.45),_inset_0_1px_0_rgba(255,255,255,.04)]",
      className
    )}>{children}</div>
  );
}

export const Header = ({title, subtitle, right}:{title:string; subtitle?:string; right?:React.ReactNode}) => (
  <div className="px-5 pt-4 pb-2 flex items-end justify-between gap-3">
    <div>
      <div className="text-[17px] font-semibold">{title}</div>
      {subtitle && <div className="text-xs text-[var(--sub)] mt-0.5">{subtitle}</div>}
    </div>
    {right}
  </div>
);

export const Body = ({children, className}:{children:React.ReactNode; className?:string}) => (
  <div className={clsx("px-5 pb-5", className)}>{children}</div>
);
