"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = {
  overview: [
    { href: "/dashboard", label: "Market Intelligence" },
    { href: "/dashboard/segments", label: "Segments" },
    { href: "/dashboard/geo", label: "Geography" },
    { href: "/dashboard/construction", label: "Construction" },
  ],
  tools: [
    { href: "/dashboard/ask", label: "Ask AI" },
    { href: "/dashboard/image-editor", label: "Image Editor" },
  ],
};

const adminNav = {
  main: [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/settings", label: "Settings" },
    { href: "/admin/counties", label: "Counties" },
  ],
};

export default function Sidebar({ variant = "agent" }: { variant?: "agent" | "admin" }) {
  const pathname = usePathname();
  const links = variant === "admin" ? adminNav : nav;

  const Item = ({ href, label }:{href:string;label:string}) => (
    <Link
      href={href}
      className={`block rounded-xl px-3 py-2 text-sm transition-colors
      ${pathname===href ? "bg-black/[.04] text-zinc-900 dark:bg-white/[.06] dark:text-white"
                        : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"}`}
    >
      {label}
    </Link>
  );

  return (
    <aside className="hidden w-64 shrink-0 border-r border-black/10 p-3 md:block dark:border-white/10">
      <div className="space-y-6">
        {variant === "admin" ? (
          <div>
            <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Admin</div>
            <div className="space-y-1">{adminNav.main.map(i => <Item key={i.href} {...i}/>)}</div>
          </div>
        ) : (
          <>
            <div>
              <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Overview</div>
              <div className="space-y-1">{nav.overview.map(i => <Item key={i.href} {...i}/>)}</div>
            </div>
            <div>
              <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">AI Tools</div>
              <div className="space-y-1">{nav.tools.map(i => <Item key={i.href} {...i}/>)}</div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
