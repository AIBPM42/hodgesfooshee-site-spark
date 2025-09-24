import SearchHub from "@/components/SearchHub";
import ProfessionalHeader from "@/components/ProfessionalHeader";
import FeaturedProperties from "@/components/FeaturedProperties";
import ServicesSection from "@/components/ServicesSection";
import LatestMarketInsights from "@/components/LatestMarketInsights";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-glass-gradient">
      <ProfessionalHeader />
      
      {/* Hero Section with SearchHub */}
      <section className="relative py-20 px-4" style={{
        backgroundImage: 'url("/hodges-hero-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="container mx-auto max-w-6xl text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">
            Your Source for <span className="text-brand-600">Nashville Real Estate</span> Excellence
          </h1>
          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto">
            Discover exceptional properties across Middle Tennessee with Nashville's most trusted real estate experts
          </p>
          
          {/* SearchHub Component */}
          <SearchHub />
          
          {/* Stats Section */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="bg-glass rounded-2xl p-6 shadow-glass">
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-white/80">Homes Sold</div>
            </div>
            <div className="bg-glass rounded-2xl p-6 shadow-glass">
              <div className="text-4xl font-bold text-white mb-2">25+</div>
              <div className="text-white/80">Years Experience</div>
            </div>
            <div className="bg-glass rounded-2xl p-6 shadow-glass">
              <div className="text-4xl font-bold text-white mb-2">9</div>
              <div className="text-white/80">Counties Served</div>
            </div>
            <div className="bg-glass rounded-2xl p-6 shadow-glass">
              <div className="text-4xl font-bold text-white mb-2">98%</div>
              <div className="text-white/80">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Properties */}
      <FeaturedProperties />
      
      {/* Services Section */}
      <ServicesSection />
      
      {/* Latest Market Insights */}
      <LatestMarketInsights />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
