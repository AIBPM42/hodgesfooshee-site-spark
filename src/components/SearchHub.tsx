import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Search, Home, Calendar, MapPin, Users, Building2 } from "lucide-react";

type SearchType = 'properties' | 'open-houses' | 'zip' | 'agents' | 'offices';

const SearchHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SearchType>('properties');
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (location) params.set('location', location);
    navigate(`/search/${activeTab}?${params.toString()}`);
  };

  const searchTabs = [
    { key: 'properties', label: 'Properties', icon: Home },
    { key: 'open-houses', label: 'Open Houses', icon: Calendar },
    { key: 'zip', label: 'ZIP Search', icon: MapPin },
    { key: 'agents', label: 'Agents', icon: Users },
    { key: 'offices', label: 'Offices', icon: Building2 },
  ];

  return (
    <Card className="bg-glass rounded-2xl p-8 max-w-5xl mx-auto shadow-glass">
      {/* Property Search Form */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="space-y-2">
          <div className="flex items-center text-white/80 text-sm">
            <Home className="w-4 h-4 mr-2" />
            Property Type
          </div>
          <Select>
            <SelectTrigger className="h-12 bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Any Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Type</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="condo">Condo</SelectItem>
              <SelectItem value="townhouse">Townhouse</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-white/80 text-sm">
            <MapPin className="w-4 h-4 mr-2" />
            Location
          </div>
          <Select>
            <SelectTrigger className="h-12 bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="All Counties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Counties</SelectItem>
              <SelectItem value="davidson">Davidson County</SelectItem>
              <SelectItem value="williamson">Williamson County</SelectItem>
              <SelectItem value="rutherford">Rutherford County</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-white/80 text-sm">
            <Building2 className="w-4 h-4 mr-2" />
            Min Beds
          </div>
          <Select>
            <SelectTrigger className="h-12 bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Any" />
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
        
        <div className="space-y-2">
          <div className="flex items-center text-white/80 text-sm">
            <Building2 className="w-4 h-4 mr-2" />
            Min Baths
          </div>
          <Select>
            <SelectTrigger className="h-12 bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="md:col-span-4 mb-6">
        <Button onClick={handleSearch} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold">
          <Search className="w-5 h-5 mr-2" />
          Search Properties
        </Button>
      </div>
      
      {/* Price Range */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-white/80 text-sm">
            <span className="text-lg">$</span>
            <span className="ml-1">Price Range</span>
          </div>
          <div className="text-white/80 text-sm">$100,000 - $1,000,000</div>
        </div>
        <div className="px-2">
          <div className="h-2 bg-white/20 rounded-full relative">
            <div className="absolute left-0 top-0 h-2 bg-white rounded-full w-full"></div>
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg"></div>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg"></div>
          </div>
        </div>
      </div>
      
      {/* Advanced Filters */}
      <div className="flex justify-center">
        <button className="flex items-center text-white/80 hover:text-white text-sm">
          <span className="mr-2">≡</span>
          Advanced Filters
        </button>
      </div>
    </Card>
  );
};

export default SearchHub;