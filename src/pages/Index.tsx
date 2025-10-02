import { useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturedProperties from "@/components/FeaturedProperties";
import ServicesSection from "@/components/ServicesSection";
import LatestMarketInsights from "@/components/LatestMarketInsights";
import NashvilleInsiderAccess from "@/components/NashvilleInsiderAccess";
import Footer from "@/components/Footer";
import DynamicStats from "@/components/DynamicStats";
import { NewThisWeekSection } from "@/components/NewThisWeekSection";
import { UpcomingOpenHousesSection } from "@/components/UpcomingOpenHousesSection";
import { ExploreCitiesSection } from "@/components/ExploreCitiesSection";
import AIHotPropertiesSection from "@/components/AIHotPropertiesSection";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useAnalytics } from "@/hooks/useAnalytics";
import { logPageView } from "@/lib/analytics";
import { Loader2 } from "lucide-react";


const Index = () => {
  const { data: settings, isLoading } = useSiteSettings();
  useAnalytics(); // Track page views (legacy)

  // Track page view with new analytics system
  useEffect(() => {
    logPageView('/', document.referrer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <HeroSection settings={settings} />

      {/* Rest of sections with subtle dark surface */}
      <main className="bg-transparent">
        <div className="mx-auto max-w-7xl px-4 py-20 space-y-20">
          {/* Premium Stats Section */}
          <section>
            <DynamicStats />
          </section>
          
          {/* Insider Access */}
          <section>
            <NashvilleInsiderAccess />
          </section>
          
          {/* Featured Properties with Glass Cards */}
          <section>
            <FeaturedProperties />
          </section>
          
          {/* Services Section with Glass Design */}
          <section>
            <ServicesSection />
          </section>
          
          {/* Market Insights with Premium Cards */}
          <section>
            <LatestMarketInsights />
          </section>
        </div>

        {/* Conditional Dynamic Sections */}
        {settings?.show_hot_ai && <AIHotPropertiesSection />}
        {settings?.show_new_this_week && <NewThisWeekSection />}
        {settings?.show_open_houses && <UpcomingOpenHousesSection />}
        {settings?.show_explore_cities && <ExploreCitiesSection />}
      </main>
      
      {/* Premium Footer */}
      <Footer />
    </>
  );
};

export default Index;
