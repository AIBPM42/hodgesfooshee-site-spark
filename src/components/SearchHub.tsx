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
    <Card className="glass-light p-8 max-w-4xl mx-auto">
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {searchTabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as SearchType)}
            className={`search-tab ${activeTab === key ? 'active' : ''}`}
          >
            <Icon className="w-4 h-4 mr-2" />
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter search terms..."
            className="pl-12 h-14 text-lg glass-light border-white/20"
          />
        </div>

        <Button onClick={handleSearch} className="w-full h-14 text-lg btn-primary font-semibold">
          <Search className="w-5 h-5 mr-2" />
          Search {activeTab.replace('-', ' ')}
        </Button>
      </div>
    </Card>
  );
};

export default SearchHub;