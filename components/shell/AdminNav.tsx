"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const adminItems = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/lead-management", label: "Lead Management" },
  { href: "/admin/mls-assignments", label: "MLS Assignments" },
  { href: "/admin/content", label: "Site Content" },
  { href: "/admin/analytics", label: "Agent Analytics" },
  { href: "/admin/blog", label: "Blog Posts" },
];

const settingsItems = [
  { href: "/admin/settings", label: "Settings" },
  { href: "/dashboard", label: "View Agent Dashboard →" },
];

export function AdminNav(){
  const pathname = usePathname();
  return (
    <nav className="p-4 space-y-4">
      {/* Public Site Link */}
      <div>
        <div className="text-xs uppercase tracking-wide opacity-70 px-2 mb-2">Site</div>
        <div className="space-y-1">
          <Link href="/"
            className="block px-3 py-2 rounded-xl border transition-all hover:bg-[color-mix(in_oklab,var(--panel)_60%,transparent)] border-transparent"
          >← Back to Public Site</Link>
        </div>
      </div>

      <div>
        <div className="text-xs uppercase tracking-wide opacity-70 px-2 mb-2">Admin</div>
        <div className="space-y-1">
          {adminItems.map(i=>{
            const active = i.exact
              ? pathname === i.href
              : pathname.startsWith(i.href) && i.href !== "/admin";
            return (
              <Link key={i.href} href={i.href}
                className={`block px-3 py-2 rounded-xl border transition-all ${active
                  ? "bg-[color-mix(in_oklab,var(--panel)_72%,transparent)] border-[var(--border)]"
                  : "hover:bg-[color-mix(in_oklab,var(--panel)_60%,transparent)] border-transparent"}`}
              >{i.label}</Link>
            );
          })}
        </div>
      </div>

      <div>
        <div className="text-xs uppercase tracking-wide opacity-70 px-2 mb-2">System</div>
        <div className="space-y-1">
          {settingsItems.map(i=>{
            const active = pathname === i.href;
            return (
              <Link key={i.href} href={i.href}
                className={`block px-3 py-2 rounded-xl border transition-all ${active
                  ? "bg-[color-mix(in_oklab,var(--panel)_72%,transparent)] border-[var(--border)]"
                  : "hover:bg-[color-mix(in_oklab,var(--panel)_60%,transparent)] border-transparent"}`}
              >{i.label}</Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
