import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PropertySearch from "@/components/PropertySearch";
import MarketStats from "@/components/MarketStats";
import ServicesSection from "@/components/ServicesSection";
import InsiderAccess from "@/components/InsiderAccess";
import BlogSection from "@/components/BlogSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <PropertySearch />
        <MarketStats />
        <ServicesSection />
        <InsiderAccess />
        <BlogSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
