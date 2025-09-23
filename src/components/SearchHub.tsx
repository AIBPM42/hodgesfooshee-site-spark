import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Search, Home, Calendar, MapPin, Users, Building } from 'lucide-react';

type SearchType = 'properties' | 'open-houses' | 'zip' | 'agents' | 'offices';

const SearchHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SearchType>('properties');
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const navigate = useNavigate();

  const tabs = [
    { id: 'properties' as SearchType, label: 'Properties', icon: Home },
    { id: 'open-houses' as SearchType, label: 'Open Houses', icon: Calendar },
    { id: 'zip' as SearchType, label: 'ZIP Search', icon: MapPin },
    { id: 'agents' as SearchType, label: 'Agents', icon: Users },
    { id: 'offices' as SearchType, label: 'Offices', icon: Building },
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('q', searchQuery);
    if (location) params.set('location', location);
    if (priceRange) params.set('price', priceRange);
    if (bedrooms) params.set('beds', bedrooms);
    if (bathrooms) params.set('baths', bathrooms);
    
    const queryString = params.toString();
    const path = `/search/${activeTab}${queryString ? `?${queryString}` : ''}`;
    
    navigate(path);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto glass-light border-white/30 backdrop-blur-lg">
      <div className="p-8">
        {/* Search Type Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {tabs.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={activeTab === id ? "default" : "ghost"}
              className={`search-tab ${activeTab === id ? 'active' : ''}`}
              onClick={() => setActiveTab(id)}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </Button>
          ))}
        </div>

        {/* Search Form */}
        <div className="space-y-6">
          {/* Main Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder={getPlaceholder(activeTab)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-12 h-14 text-lg glass border-white/20 focus:border-primary/50"
            />
          </div>

          {/* Conditional Additional Fields */}
          {(activeTab === 'properties' || activeTab === 'open-houses') && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyPress={handleKeyPress}
                className="glass border-white/20 focus:border-primary/50"
              />
              
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="glass border-white/20 focus:border-primary/50">
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

              <Select value={bedrooms} onValueChange={setBedrooms}>
                <SelectTrigger className="glass border-white/20 focus:border-primary/50">
                  <SelectValue placeholder="Bedrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1+">1+ Bed</SelectItem>
                  <SelectItem value="2+">2+ Beds</SelectItem>
                  <SelectItem value="3+">3+ Beds</SelectItem>
                  <SelectItem value="4+">4+ Beds</SelectItem>
                  <SelectItem value="5+">5+ Beds</SelectItem>
                </SelectContent>
              </Select>

              <Select value={bathrooms} onValueChange={setBathrooms}>
                <SelectTrigger className="glass border-white/20 focus:border-primary/50">
                  <SelectValue placeholder="Bathrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1+">1+ Bath</SelectItem>
                  <SelectItem value="2+">2+ Baths</SelectItem>
                  <SelectItem value="3+">3+ Baths</SelectItem>
                  <SelectItem value="4+">4+ Baths</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {activeTab === 'zip' && (
            <Input
              type="text"
              placeholder="City, State or ZIP Code"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={handleKeyPress}
              className="glass border-white/20 focus:border-primary/50"
            />
          )}

          {(activeTab === 'agents' || activeTab === 'offices') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyPress={handleKeyPress}
                className="glass border-white/20 focus:border-primary/50"
              />
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="glass border-white/20 focus:border-primary/50">
                  <SelectValue placeholder="Specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="luxury">Luxury Homes</SelectItem>
                  <SelectItem value="first-time">First-Time Buyers</SelectItem>
                  <SelectItem value="investment">Investment Properties</SelectItem>
                  <SelectItem value="commercial">Commercial Real Estate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Search Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleSearch}
              size="lg"
              className="btn-primary min-w-[200px] h-14 text-lg font-semibold"
            >
              <Search className="w-5 h-5 mr-2" />
              Search {tabs.find(t => t.id === activeTab)?.label}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

function getPlaceholder(searchType: SearchType): string {
  switch (searchType) {
    case 'properties':
      return 'Search properties by address, city, or MLS number...';
    case 'open-houses':
      return 'Find open houses by location or date...';
    case 'zip':
      return 'Enter ZIP code, city, or neighborhood...';
    case 'agents':
      return 'Search agents by name or specialty...';
    case 'offices':
      return 'Find real estate offices by name or location...';
    default:
      return 'Enter your search criteria...';
  }
}

export default SearchHub;