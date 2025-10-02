import React from "react";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const ProfessionalHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-hf-charcoal-900/90 border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-hf-orange to-hf-green rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">H&F</span>
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-white">
                Hodges & Fooshee
              </h1>
              <p className="text-sm text-white/70 font-medium">Premium Real Estate</p>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="text-white/90 hover:text-hf-orange transition-colors font-medium">Home</Link>
            <Link to="/mls" className="text-white/90 hover:text-hf-orange transition-colors font-medium">Properties</Link>
            <Link to="/admin" className="text-white/90 hover:text-hf-orange transition-colors font-medium">Admin</Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button className="btn-ghost px-6 py-2 text-white font-medium">
              Login
            </button>
            <button className="btn-premium px-6 py-2 text-white font-medium">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ProfessionalHeader;