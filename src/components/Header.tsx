import { Button } from "@/components/ui/button";
import { Phone, Mail, Menu } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top contact bar */}
        <div className="flex items-center justify-between py-2 text-sm border-b border-border/50">
          <div className="flex items-center space-x-6">
            <a href="tel:+15551234567" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-smooth">
              <Phone className="h-4 w-4" />
              <span>(555) 123-4567</span>
            </a>
            <a href="mailto:info@hodgesfooshee.com" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-smooth">
              <Mail className="h-4 w-4" />
              <span>info@hodgesfooshee.com</span>
            </a>
          </div>
          <div className="hidden md:block text-muted-foreground">
            Licensed Real Estate Professionals
          </div>
        </div>
        
        {/* Main navigation */}
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-luxury rounded-lg flex items-center justify-center">
              <span className="text-luxury-gold-foreground font-bold text-xl">H&F</span>
            </div>
            <div>
              <h1 className="font-display text-xl font-semibold text-foreground">
                Hodges & Fooshee
              </h1>
              <p className="text-sm text-muted-foreground">Realty</p>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-luxury-gold transition-smooth font-medium">
              Home
            </Link>
            <Link to="/listings" className="text-foreground hover:text-luxury-gold transition-smooth font-medium">
              Listings
            </Link>
            <Link to="/about" className="text-foreground hover:text-luxury-gold transition-smooth font-medium">
              About
            </Link>
            <Link to="/contact" className="text-foreground hover:text-luxury-gold transition-smooth font-medium">
              Contact
            </Link>
            <Link to="/admin" className="text-foreground hover:text-luxury-gold transition-smooth font-medium">
              Admin
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button variant="accent" size="sm" className="hidden md:inline-flex">
              Schedule Consultation
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;