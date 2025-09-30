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


const Index = () => {
  return (
    <>
      <Header />
      <HeroSection /> {/* full-bleed, no container around it */}

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

        {/* Live Data Sections - Full Width */}
        <NewThisWeekSection />
        <UpcomingOpenHousesSection />
        <ExploreCitiesSection />
      </main>
      
      {/* Premium Footer */}
      <Footer />
    </>
  );
};

export default Index;
