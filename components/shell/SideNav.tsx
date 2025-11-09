"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

const items = [
  { href: "/dashboard", label: "Market Intelligence" },
  { href: "/dashboard/segments", label: "Segments" },
  { href: "/dashboard/geo", label: "Geography" },
  { href: "/dashboard/construction", label: "Construction" },
];

const aiItems = [
  { href: "/dashboard/ask", label: "Realty Intelligence" },
  { href: "/dashboard/image-editor", label: "Image Editor" },
];

export function SideNav(){
  const pathname = usePathname();
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'super_admin' || profile?.role === 'broker' || profile?.role === 'admin';

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
        <div className="text-xs uppercase tracking-wide opacity-70 px-2 mb-2">Overview</div>
        <div className="space-y-1">
          {items.map(i=>{
            const active = pathname.startsWith(i.href);
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
        <div className="text-xs uppercase tracking-wide opacity-70 px-2 mb-2">AI Tools</div>
        <div className="space-y-1">
          {aiItems.map(i=>{
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

      {/* Show admin links only for super_admin/broker/admin users */}
      {isAdmin && (
        <div>
          <div className="text-xs uppercase tracking-wide opacity-70 px-2 mb-2">Admin</div>
          <div className="space-y-1">
            <Link href="/dashboard/admin/leads"
              className={`block px-3 py-2 rounded-xl border transition-all ${pathname === '/dashboard/admin/leads'
                ? "bg-[color-mix(in_oklab,var(--panel)_72%,transparent)] border-[var(--border)]"
                : "hover:bg-[color-mix(in_oklab,var(--panel)_60%,transparent)] border-transparent"}`}
            >Lead Management</Link>
            <Link href="/admin"
              className="block px-3 py-2 rounded-xl border transition-all hover:bg-[color-mix(in_oklab,var(--panel)_60%,transparent)] border-transparent"
            >Admin Dashboard</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
