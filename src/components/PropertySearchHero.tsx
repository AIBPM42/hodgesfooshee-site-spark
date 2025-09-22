import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin } from "lucide-react";
import heroImage from "@/assets/hero-home.jpg";

const PropertySearchHero = () => {
  return (
    <section 
      className="relative min-h-[600px] flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Hero Content */}
        <div className="max-w-4xl mx-auto mb-12">
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6">
            Your Source for{" "}
            <span className="text-gradient-orange">Nashville</span>{" "}
            Real Estate Excellence
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Discover exceptional properties in Music City with Nashville's most trusted real estate professionals.
          </p>
        </div>

        {/* Advanced Property Search */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-card/95 backdrop-blur-sm rounded-lg p-6 shadow-premium">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              {/* Property Type */}
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                </SelectContent>
              </Select>

              {/* Location */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Location" 
                  className="pl-10"
                />
              </div>

              {/* Min Beds */}
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Min Beds" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1+ Beds</SelectItem>
                  <SelectItem value="2">2+ Beds</SelectItem>
                  <SelectItem value="3">3+ Beds</SelectItem>
                  <SelectItem value="4">4+ Beds</SelectItem>
                  <SelectItem value="5">5+ Beds</SelectItem>
                </SelectContent>
              </Select>

              {/* Min Baths */}
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Min Baths" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1+ Baths</SelectItem>
                  <SelectItem value="2">2+ Baths</SelectItem>
                  <SelectItem value="3">3+ Baths</SelectItem>
                  <SelectItem value="4">4+ Baths</SelectItem>
                </SelectContent>
              </Select>

              {/* Price Range */}
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-200000">Under $200K</SelectItem>
                  <SelectItem value="200000-400000">$200K - $400K</SelectItem>
                  <SelectItem value="400000-600000">$400K - $600K</SelectItem>
                  <SelectItem value="600000-800000">$600K - $800K</SelectItem>
                  <SelectItem value="800000-1000000">$800K - $1M</SelectItem>
                  <SelectItem value="1000000+">$1M+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Button */}
            <Button variant="orange" size="lg" className="w-full md:w-auto px-12">
              <Search className="mr-2 h-5 w-5" />
              Search Properties
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">500+</div>
            <div className="text-white/80 text-sm">Properties Sold</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">$2.5B</div>
            <div className="text-white/80 text-sm">Sales Volume</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">1,200+</div>
            <div className="text-white/80 text-sm">Happy Clients</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">15+</div>
            <div className="text-white/80 text-sm">Years Experience</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertySearchHero;