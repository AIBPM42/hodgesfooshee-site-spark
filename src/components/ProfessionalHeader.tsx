import React from "react";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin } from "lucide-react";

const ProfessionalHeader: React.FC = () => {
  return (
    <header className="glass-dark sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">HF</span>
            </div>
            <h1 className="text-xl font-display font-bold text-white">
              Hodges & Fooshee
            </h1>
          </div>
          
          {/* Navigation Menu */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a href="#" className="text-white hover:text-brand-200 transition-colors">Home</a>
            <a href="#" className="text-white hover:text-brand-200 transition-colors">Featured Listings</a>
            <a href="#" className="text-white hover:text-brand-200 transition-colors">Property Search</a>
            <a href="#" className="text-white hover:text-brand-200 transition-colors">Communities</a>
            <a href="#" className="text-white hover:text-brand-200 transition-colors">Our Services</a>
            <a href="#" className="text-white hover:text-brand-200 transition-colors">Market Insights</a>
            <a href="#" className="text-white hover:text-brand-200 transition-colors">About</a>
            <a href="#" className="text-white hover:text-brand-200 transition-colors">Contact</a>
          </nav>
          
          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-white hover:text-brand-200 hover:bg-white/10">
              Login
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold">
              Register
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ProfessionalHeader;