"use client";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  const items = [
    { icon: "🔥", label: "Dashboard", href: "/" },
    { icon: "📊", label: "Market Analytics", href: "#market" },
    { icon: "🏙️", label: "Neighborhood Intel", href: "#neighborhood" },
    { icon: "💼", label: "Deals & Offers", href: "#deals" },
    { icon: "👥", label: "Agents & Pipeline", href: "#agents" },
    { icon: "⚙️", label: "Settings", href: "#settings" },
  ];

  return (
    <nav className="flex flex-col gap-1">
      {items.map((it) => (
        <a
          key={it.label}
          href={it.href}
          className={`transition ${pathname === it.href ? "active" : ""}`}
        >
          <span className="mr-1">{it.icon}</span>
          <span>{it.label}</span>
        </a>
      ))}
    </nav>
  );
}
