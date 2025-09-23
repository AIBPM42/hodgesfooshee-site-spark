import React from "react";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin } from "lucide-react";

const ProfessionalHeader: React.FC = () => {
  return (
    <header className="glass-dark border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg"></div>
            <h1 className="text-2xl font-display font-bold text-gradient">
              Hodges & Fooshee
            </h1>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>(615) 555-0123</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span>info@hfrealty.com</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>Nashville, TN</span>
            </div>
          </div>
          <Button className="btn-primary">
            Contact Agent
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ProfessionalHeader;