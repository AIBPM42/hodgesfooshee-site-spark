import SmartSearchBar from "@/components/SmartSearchBar";
import ProfessionalHeader from "@/components/ProfessionalHeader";
import FeaturedProperties from "@/components/FeaturedProperties";
import ServicesSection from "@/components/ServicesSection";
import LatestMarketInsights from "@/components/LatestMarketInsights";
import Footer from "@/components/Footer";
import DynamicStats from "@/components/DynamicStats";

const Index = () => {
  function handleSearch(params: Record<string,string>) {
    const qs = new URLSearchParams({ page: "1", page_size: "12", ...params }).toString();
    window.location.href = `/mls?${qs}`;
  }

  return (
    <div className="min-h-screen bg-glass-gradient">
      <ProfessionalHeader />
      
      {/* Hero Section with Glass Design */}
      <section className="relative py-32 px-4 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-luxury-gold/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-3xl animate-glass-float"></div>
        </div>
        
        <div className="container mx-auto max-w-6xl text-center relative z-10">
          <h1 className="text-6xl md:text-8xl font-display font-bold text-white mb-8 animate-fade-in">
            Your Source for{" "}
            <span className="text-gradient-luxury">Nashville Real Estate</span>{" "}
            Excellence
          </h1>
          <p className="text-2xl text-white/90 mb-16 max-w-4xl mx-auto leading-relaxed animate-fade-in">
            Discover exceptional properties across Middle Tennessee with Nashville's most trusted real estate experts
          </p>
          
          {/* Glass Search Container */}
          <div className="glass-card p-8 mb-16 max-w-4xl mx-auto animate-fade-in">
            <SmartSearchBar onGo={handleSearch} />
          </div>
          
          {/* Premium Stats Section */}
          <div className="animate-fade-in">
            <DynamicStats />
          </div>
        </div>
      </section>
      
      {/* Featured Properties with Glass Cards */}
      <FeaturedProperties />
      
      {/* Services Section with Glass Design */}
      <ServicesSection />
      
      {/* Market Insights with Premium Cards */}
      <LatestMarketInsights />
      
      {/* Premium Footer */}
      <Footer />
    </div>
  );
};

export default Index;
