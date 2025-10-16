import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import LatestMarketInsights from "@/components/LatestMarketInsights";
import NashvilleInsiderAccess from "@/components/NashvilleInsiderAccess";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />

      <main className="bg-transparent">
        <div className="mx-auto max-w-7xl px-4 py-20 space-y-20">
          <section>
            <NashvilleInsiderAccess />
          </section>

          <section>
            <LatestMarketInsights />
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
