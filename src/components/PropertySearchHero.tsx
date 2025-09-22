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
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
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
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Property Type */}
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center text-white/90 text-sm mb-2">
                  <div className="w-4 h-4 mr-2 bg-white/40 rounded"></div>
                  Property Type
                </div>
                <select className="w-full bg-transparent text-white text-lg font-medium border-0 outline-0">
                  <option>Any Type</option>
                </select>
              </div>

              {/* Location */}
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center text-white/90 text-sm mb-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  Location
                </div>
                <select className="w-full bg-transparent text-white text-lg font-medium border-0 outline-0">
                  <option>All Counties</option>
                </select>
              </div>

              {/* Min Beds */}
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center text-white/90 text-sm mb-2">
                  <div className="w-4 h-4 mr-2 bg-white/40 rounded"></div>
                  Min Beds
                </div>
                <select className="w-full bg-transparent text-white text-lg font-medium border-0 outline-0">
                  <option>Any</option>
                </select>
              </div>

              {/* Min Baths */}
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center text-white/90 text-sm mb-2">
                  <div className="w-4 h-4 mr-2 bg-white/40 rounded"></div>
                  Min Baths
                </div>
                <select className="w-full bg-transparent text-white text-lg font-medium border-0 outline-0">
                  <option>Any</option>
                </select>
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="mb-6">
              <div className="flex items-center text-white/90 text-sm mb-4">
                <div className="w-4 h-4 mr-2 bg-white/40 rounded"></div>
                Price Range
              </div>
              <div className="relative">
                <div className="flex justify-between text-white text-lg font-medium mb-3">
                  <span>$100,000</span>
                  <span>$1,000,000</span>
                </div>
                <div className="relative h-2 bg-white/20 rounded-full">
                  <div className="absolute h-2 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full" style={{width: '60%', left: '20%'}}></div>
                  <div className="absolute w-4 h-4 bg-white rounded-full shadow-lg" style={{left: '20%', top: '-4px'}}></div>
                  <div className="absolute w-4 h-4 bg-white rounded-full shadow-lg" style={{left: '80%', top: '-4px'}}></div>
                </div>
              </div>
            </div>

            {/* Search Button and Advanced Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <Button size="lg" className="btn-orange flex-1 px-8 py-4 text-lg font-semibold">
                <Search className="mr-3 h-5 w-5" />
                Search Properties
              </Button>
              <Button variant="outline" size="lg" className="bg-white/20 border-white/30 text-white hover:bg-white/30 px-6 py-4">
                <div className="flex items-center">
                  <div className="grid grid-cols-2 gap-1 mr-2">
                    <div className="w-1 h-1 bg-current rounded-full"></div>
                    <div className="w-1 h-1 bg-current rounded-full"></div>
                    <div className="w-1 h-1 bg-current rounded-full"></div>
                    <div className="w-1 h-1 bg-current rounded-full"></div>
                  </div>
                  Advanced Filters
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto">
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">500+</div>
            <div className="text-white/80 text-lg">Homes Sold</div>
          </div>
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">25+</div>
            <div className="text-white/80 text-lg">Years Experience</div>
          </div>
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">9</div>
            <div className="text-white/80 text-lg">Counties Served</div>
          </div>
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">98%</div>
            <div className="text-white/80 text-lg">Client Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertySearchHero;