import { useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import LatestMarketInsights from "@/components/LatestMarketInsights";
import NashvilleInsiderAccess from "@/components/NashvilleInsiderAccess";
import Footer from "@/components/Footer";
import { NewThisWeekSection } from "@/components/NewThisWeekSection";
import { useAnalytics } from "@/hooks/useAnalytics";
import { logPageView } from "@/lib/analytics";

const Index = () => {
  useAnalytics();

  useEffect(() => {
    logPageView('/', document.referrer);
  }, []);

  return (
    <>
      <Header />
      <HeroSection />

      <main className="bg-transparent">
        <div className="mx-auto max-w-7xl px-4 py-20 space-y-20">
          <section>
            <NewThisWeekSection />
          </section>
          
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
};

export default Index;
