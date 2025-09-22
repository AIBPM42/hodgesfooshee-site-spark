import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Home, Bed, Bath, DollarSign } from "lucide-react";

const PropertySearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Find Your Perfect Home
          </h2>
          <p className="text-xl text-muted-foreground">
            Search thousands of properties across Nashville and Middle Tennessee
          </p>
        </div>
        
        <Card className="p-8 shadow-luxury">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="City, Neighborhood, or ZIP"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Property Type</label>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger>
                  <Home className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="single-family">Single Family</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Price Range</label>
              <div className="flex gap-2">
                <Select value={minPrice} onValueChange={setMinPrice}>
                  <SelectTrigger>
                    <DollarSign className="h-4 w-4" />
                    <SelectValue placeholder="Min" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No Min</SelectItem>
                    <SelectItem value="200000">$200K</SelectItem>
                    <SelectItem value="300000">$300K</SelectItem>
                    <SelectItem value="400000">$400K</SelectItem>
                    <SelectItem value="500000">$500K</SelectItem>
                    <SelectItem value="750000">$750K</SelectItem>
                    <SelectItem value="1000000">$1M+</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={maxPrice} onValueChange={setMaxPrice}>
                  <SelectTrigger>
                    <SelectValue placeholder="Max" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="999999999">No Max</SelectItem>
                    <SelectItem value="300000">$300K</SelectItem>
                    <SelectItem value="400000">$400K</SelectItem>
                    <SelectItem value="500000">$500K</SelectItem>
                    <SelectItem value="750000">$750K</SelectItem>
                    <SelectItem value="1000000">$1M</SelectItem>
                    <SelectItem value="2000000">$2M+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Bed/Bath</label>
              <div className="flex gap-2">
                <Select value={beds} onValueChange={setBeds}>
                  <SelectTrigger>
                    <Bed className="h-4 w-4" />
                    <SelectValue placeholder="Beds" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                    <SelectItem value="5">5+</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={baths} onValueChange={setBaths}>
                  <SelectTrigger>
                    <Bath className="h-4 w-4" />
                    <SelectValue placeholder="Baths" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button size="lg" className="px-12">
              <Search className="h-5 w-5 mr-2" />
              Search Properties
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default PropertySearch;