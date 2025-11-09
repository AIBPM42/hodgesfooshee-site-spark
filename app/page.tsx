"use client";

import { Nav } from "@/components/Nav";
import Hero from "@/components/Hero";
import LatestMarketInsights from "@/components/LatestMarketInsights";
import NashvilleInsiderAccess from "@/components/NashvilleInsiderAccess";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-porcelain min-h-screen">
      <Nav />
      <Hero />

      <main className="bg-transparent">
        {/* Open Houses CTA */}
        <section className="text-center py-12">
          <Link
            href="/open-houses"
            className="inline-flex items-center gap-3 rounded-xl bg-brand-500 px-7 py-3.5 text-white font-medium hover:bg-brand-600 transition-colors shadow-md"
          >
            View Upcoming Open Houses
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </section>

        <section className="section-tight">
          <NashvilleInsiderAccess />
        </section>

        <section className="section">
          <LatestMarketInsights />
        </section>
      </main>

      <Footer />
    </div>
  );
}
