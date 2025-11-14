"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [servicesOpen, setServicesOpen] = useState(false);

  const handleHashClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const linkClass = (path: string) =>
    `px-3 py-2 rounded-full hover:bg-white/10 text-white/90 transition ${pathname === path ? 'bg-white/10' : ''}`;

  return (
    <header className="fixed top-3 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="nav-glass flex items-center justify-between px-4 py-2 md:px-6 md:py-3">
          {/* Left: logo + nav */}
          <div className="flex items-center gap-3">
            <img src="/logo-hf.png" alt="Hodges & Fooshee" className="h-8 w-8 rounded-md" />
            <nav className="hidden md:flex items-center gap-2">
              <Link href="/" className={linkClass("/")}>Home</Link>
              <Link href="/search/properties" className={linkClass("/search/properties")}>Property Search</Link>

              {/* Services Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <button className="px-3 py-2 rounded-full hover:bg-white/10 text-white/90 transition flex items-center gap-1">
                  Services
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {servicesOpen && (
                  <div className="absolute top-full left-0 mt-1 w-56 rounded-lg bg-white dark:bg-gray-800 shadow-lg py-2 border border-gray-200 dark:border-gray-700">
                    <Link
                      href="/services/sell-your-home"
                      className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      Sell Your Home
                    </Link>
                    <Link
                      href="/services/buy-a-home"
                      className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      Buy A Home
                    </Link>
                    <Link
                      href="/services/property-management"
                      className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      Property Management
                    </Link>
                  </div>
                )}
              </div>

              <a href="#insights" onClick={(e) => handleHashClick(e, 'insights')} className="px-3 py-2 rounded-full hover:bg-white/10 text-white/90">Market Insights</a>
              <Link href="/about-us" className={linkClass("/about-us")}>About Us</Link>
              <Link href="/contact" className={linkClass("/contact")}>Contact</Link>
            </nav>
          </div>
          {/* Right: auth */}
          <div className="flex items-center gap-2">
            <Link href="/login">
              <button className="btn-ghost">Login</button>
            </Link>
            <button className="btn">Register</button>
          </div>
        </div>
      </div>
    </header>
  );
}
