"use client";
import { clsx } from "clsx";

export function Card({ className, children }:{className?:string; children:React.ReactNode}) {
  return (
    <div
      className={clsx(
        "rounded-[var(--radius-panel)] border transition-shadow",
        "backdrop-blur-md", // glass in light, inert in dark
        className
      )}
      style={{
        background: "color-mix(in oklab, var(--surface) 94%, transparent)",
        borderColor: "var(--border)",
        boxShadow: "var(--shadow-card)"
      }}
      onMouseEnter={(e)=> (e.currentTarget.style.boxShadow = "var(--shadow-card-hover)")}
      onMouseLeave={(e)=> (e.currentTarget.style.boxShadow = "var(--shadow-card)")}
    >
      {children}
    </div>
  );
}

export const CardHeader = ({children,className}:{children:React.ReactNode; className?:string}) =>
  <div className={clsx("px-5 pt-4 pb-2 font-semibold", className)}
       style={{fontFamily:"var(--font-heading)", color:"var(--ink)"}}>{children}</div>;

export const CardBody = ({children,className}:{children:React.ReactNode; className?:string}) =>
  <div className={clsx("px-5 pb-5 text-[14px] leading-6", className)}
       style={{color:"var(--sub)"}}>{children}</div>;
