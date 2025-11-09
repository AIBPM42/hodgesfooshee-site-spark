"use client";

import Link from "next/link";
import { useState } from "react";
import BrandLogo from "./BrandLogo";

export function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-4 z-[100] mx-auto w-[min(1200px,94vw)]">
      <nav className="glass rounded-3xl px-5 sm:px-7 py-3 flex items-center justify-between shadow-[0_8px_24px_rgba(16,24,40,0.14)]">
        <BrandLogo />

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10 lg:gap-12 text-charcoal-900/90">
          <Link href="/" className="hover:text-copper-600 transition focus-visible:outline-2 focus-visible:outline-copper-600 focus-visible:outline-offset-4 rounded">
            Home
          </Link>
          <Link href="/search/properties" className="hover:text-copper-600 transition focus-visible:outline-2 focus-visible:outline-copper-600 focus-visible:outline-offset-4 rounded">
            Property Search
          </Link>
          <Link href="/open-houses" className="hover:text-copper-600 transition focus-visible:outline-2 focus-visible:outline-copper-600 focus-visible:outline-offset-4 rounded">
            Open Houses
          </Link>
          <Link href="/#blog" className="hover:text-copper-600 transition focus-visible:outline-2 focus-visible:outline-copper-600 focus-visible:outline-offset-4 rounded">
            Market Insights
          </Link>
          <Link href="/#contact" className="hover:text-copper-600 transition focus-visible:outline-2 focus-visible:outline-copper-600 focus-visible:outline-offset-4 rounded">
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/30 transition focus-visible:outline-2 focus-visible:outline-copper-600 focus-visible:outline-offset-2"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg className="w-6 h-6 text-charcoal-900" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <Link href="/login" className="rounded-full border border-charcoal-900/20 px-4 py-1.5 text-sm hover:bg-white/30 transition focus-visible:outline-2 focus-visible:outline-copper-600 focus-visible:outline-offset-2">
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-copper-sweep text-white px-5 py-2 text-sm shadow-[0_10px_30px_rgba(242,87,45,0.45)] hover:shadow-[0_14px_40px_rgba(242,87,45,0.55)] transition font-semibold focus-visible:outline-2 focus-visible:outline-copper-300 focus-visible:outline-offset-2"
          >
            Register
          </Link>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 glass rounded-3xl px-5 py-4 shadow-[0_8px_24px_rgba(16,24,40,0.14)]">
          <div className="flex flex-col gap-4">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-charcoal-900/90 hover:text-copper-600 transition py-2 focus-visible:outline-2 focus-visible:outline-copper-600 focus-visible:outline-offset-2 rounded">
              Home
            </Link>
            <Link href="/search/properties" onClick={() => setMobileMenuOpen(false)} className="text-charcoal-900/90 hover:text-copper-600 transition py-2 focus-visible:outline-2 focus-visible:outline-copper-600 focus-visible:outline-offset-2 rounded">
              Property Search
            </Link>
            <Link href="/open-houses" onClick={() => setMobileMenuOpen(false)} className="text-charcoal-900/90 hover:text-copper-600 transition py-2 focus-visible:outline-2 focus-visible:outline-copper-600 focus-visible:outline-offset-2 rounded">
              Open Houses
            </Link>
            <Link href="/#blog" onClick={() => setMobileMenuOpen(false)} className="text-charcoal-900/90 hover:text-copper-600 transition py-2 focus-visible:outline-2 focus-visible:outline-copper-600 focus-visible:outline-offset-2 rounded">
              Market Insights
            </Link>
            <Link href="/#contact" onClick={() => setMobileMenuOpen(false)} className="text-charcoal-900/90 hover:text-copper-600 transition py-2 focus-visible:outline-2 focus-visible:outline-copper-600 focus-visible:outline-offset-2 rounded">
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
