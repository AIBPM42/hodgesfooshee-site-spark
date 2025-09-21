import { Button } from "@/components/ui/button";
import { Search, TrendingUp, Award, Users } from "lucide-react";
import heroImage from "@/assets/hero-home.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Luxury home exterior with professional landscaping" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-3xl">
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Find Your
            <span className="text-gradient-luxury block">Dream Home</span>
          </h1>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Experience unparalleled service and expertise in luxury real estate. 
            Let our award-winning team guide you home.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button variant="luxury" size="lg" className="text-lg px-8 py-3">
              View Properties
            </Button>
            <Button variant="hero" size="lg" className="text-lg px-8 py-3">
              Free Consultation
            </Button>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-2">
                <TrendingUp className="h-8 w-8 text-luxury-gold mx-auto" />
              </div>
              <div className="text-2xl font-bold text-white">$2.5B+</div>
              <div className="text-white/80 text-sm">Sales Volume</div>
            </div>
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-2">
                <Users className="h-8 w-8 text-luxury-gold mx-auto" />
              </div>
              <div className="text-2xl font-bold text-white">1,200+</div>
              <div className="text-white/80 text-sm">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-2">
                <Award className="h-8 w-8 text-luxury-gold mx-auto" />
              </div>
              <div className="text-2xl font-bold text-white">25+</div>
              <div className="text-white/80 text-sm">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-2">
                <Search className="h-8 w-8 text-luxury-gold mx-auto" />
              </div>
              <div className="text-2xl font-bold text-white">500+</div>
              <div className="text-white/80 text-sm">Properties Sold</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;