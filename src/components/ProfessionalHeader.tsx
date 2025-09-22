import { Button } from "@/components/ui/button";
import { Search, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const ProfessionalHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">H&F</span>
            </div>
            <div>
              <h1 className="font-display text-lg font-semibold text-foreground">
                Hodges & Fooshee
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">Realty</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/featured" className="text-foreground hover:text-primary transition-smooth font-medium">
              Featured Listings
            </Link>
            <Link to="/search" className="text-foreground hover:text-primary transition-smooth font-medium">
              Property Search
            </Link>
            <Link to="/communities" className="text-foreground hover:text-primary transition-smooth font-medium">
              Communities
            </Link>
            <Link to="/services" className="text-foreground hover:text-primary transition-smooth font-medium">
              Our Services
            </Link>
            <Link to="/insights" className="text-foreground hover:text-primary transition-smooth font-medium">
              Market Insights
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-smooth font-medium">
              About
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-smooth font-medium">
              Contact
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="hidden md:inline-flex">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="orange-outline" size="sm" className="hidden md:inline-flex">
              Login
            </Button>
            <Button variant="orange" size="sm" className="hidden md:inline-flex">
              Register
            </Button>
            
            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <nav className="space-y-3">
              <Link 
                to="/featured" 
                className="block py-2 text-foreground hover:text-primary transition-smooth"
                onClick={() => setIsMenuOpen(false)}
              >
                Featured Listings
              </Link>
              <Link 
                to="/search" 
                className="block py-2 text-foreground hover:text-primary transition-smooth"
                onClick={() => setIsMenuOpen(false)}
              >
                Property Search
              </Link>
              <Link 
                to="/communities" 
                className="block py-2 text-foreground hover:text-primary transition-smooth"
                onClick={() => setIsMenuOpen(false)}
              >
                Communities
              </Link>
              <Link 
                to="/services" 
                className="block py-2 text-foreground hover:text-primary transition-smooth"
                onClick={() => setIsMenuOpen(false)}
              >
                Our Services
              </Link>
              <Link 
                to="/insights" 
                className="block py-2 text-foreground hover:text-primary transition-smooth"
                onClick={() => setIsMenuOpen(false)}
              >
                Market Insights
              </Link>
              <Link 
                to="/about" 
                className="block py-2 text-foreground hover:text-primary transition-smooth"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="block py-2 text-foreground hover:text-primary transition-smooth"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="pt-3 space-y-2">
                <Button variant="orange-outline" size="sm" className="w-full">
                  Login
                </Button>
                <Button variant="orange" size="sm" className="w-full">
                  Register
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default ProfessionalHeader;