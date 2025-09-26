import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Bed, Bath, Square, MapPin, Heart, Phone } from "lucide-react";

// Mock data - replace with MLS API integration
const properties = [
  {
    id: 1,
    title: "Luxury Estate with Pool",
    price: "$2,850,000",
    address: "1234 Oak Hill Drive, Prestigious Neighborhood",
    beds: 5,
    baths: 4,
    sqft: 4200,
    type: "Single Family",
    status: "For Sale",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&crop=center"
  },
  {
    id: 2,
    title: "Modern Downtown Condo",
    price: "$750,000",
    address: "567 City Center Blvd, Unit 1204",
    beds: 2,
    baths: 2,
    sqft: 1200,
    type: "Condominium",
    status: "For Sale",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&crop=center"
  },
  {
    id: 3,
    title: "Charming Victorian Home",
    price: "$1,425,000",
    address: "890 Heritage Street, Historic District",
    beds: 4,
    baths: 3,
    sqft: 2800,
    type: "Victorian",
    status: "Pending",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop&crop=center"
  },
  {
    id: 4,
    title: "Waterfront Contemporary",
    price: "$3,200,000",
    address: "456 Lakeside Avenue, Waterfront Community",
    beds: 6,
    baths: 5,
    sqft: 5500,
    type: "Contemporary",
    status: "For Sale",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop&crop=center"
  }
];

const Listings = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
                Premium Property Listings
              </h1>
              <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
                Discover exceptional homes curated by our expert team. 
                Each property represents the pinnacle of luxury living.
              </p>
            </div>
          </div>
        </section>
        
        {/* Filters Section */}
        <section className="py-8 bg-secondary/30 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="accent" className="text-sm">All Properties</Button>
              <Button variant="ghost" className="text-sm">Single Family</Button>
              <Button variant="ghost" className="text-sm">Condominiums</Button>
              <Button variant="ghost" className="text-sm">Luxury Estates</Button>
              <Button variant="ghost" className="text-sm">Waterfront</Button>
            </div>
          </div>
        </section>
        
        {/* Properties Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {properties.map((property) => (
                <Card key={property.id} className="group hover:shadow-premium transition-premium overflow-hidden">
                  <div className="relative">
                    <img 
                      src={property.image} 
                      alt={property.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-premium"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge 
                        variant={property.status === "Pending" ? "secondary" : "default"}
                        className="bg-background/90 text-foreground"
                      >
                        {property.status}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Button variant="ghost" size="icon" className="bg-background/80 hover:bg-background">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                        {property.title}
                      </h3>
                      <div className="flex items-center text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{property.address}</span>
                      </div>
                      <div className="text-2xl font-bold text-luxury-gold">
                        {property.price}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        <span>{property.beds} beds</span>
                      </div>
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        <span>{property.baths} baths</span>
                      </div>
                      <div className="flex items-center">
                        <Square className="h-4 w-4 mr-1" />
                        <span>{property.sqft.toLocaleString()} sqft</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button className="flex-1" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button variant="accent" size="lg">
                Load More Properties
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Listings;