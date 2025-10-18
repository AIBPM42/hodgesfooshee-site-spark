import { Nav } from "@/components/Nav";
import Hero from "@/components/Hero";
import SearchBar from "@/components/SearchBar";
import LatestMarketInsights from "@/components/LatestMarketInsights";
import NashvilleInsiderAccess from "@/components/NashvilleInsiderAccess";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />

      {/* Search bar with glass overlay */}
      <div className="relative z-10 -mt-10 md:-mt-14">
        <div className="w-[min(1200px,94vw)] mx-auto">
          <div className="glass-strong rounded-3xl p-4 md:p-5 shadow-[0_10px_50px_rgba(16,24,40,0.25)]">
            <SearchBar />
          </div>
        </div>
      </div>

      <main className="bg-transparent">
        <div className="w-[min(1200px,94vw)] mx-auto space-y-20 pt-20">
          {/* Open Houses CTA */}
          <section className="text-center">
            <Link href="/open-houses" className="btn-primary inline-flex items-center gap-2">
              View Upcoming Open Houses
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </section>

          <section className="scroll-mt-24">
            <NashvilleInsiderAccess />
          </section>

          <section className="scroll-mt-24">
            <LatestMarketInsights />
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
