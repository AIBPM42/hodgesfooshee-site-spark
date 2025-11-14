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
