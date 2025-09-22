import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, Square, MapPin, Eye } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data - in real app, this would come from your Supabase database
const featuredProperties = [
  {
    id: "1",
    title: "Luxury Downtown Condo",
    address: "123 Music Row, Nashville, TN",
    price: 750000,
    beds: 2,
    baths: 2.5,
    sqft: 1800,
    image: "/placeholder.svg",
    badge: "FEATURED",
    type: "Condo"
  },
  {
    id: "2", 
    title: "Modern Belle Meade Estate",
    address: "456 Belle Meade Blvd, Nashville, TN",
    price: 2500000,
    beds: 5,
    baths: 4.5,
    sqft: 4200,
    image: "/placeholder.svg",
    badge: "EXCLUSIVE",
    type: "Residential"
  },
  {
    id: "3",
    title: "Stylish Green Hills Home",
    address: "789 Green Hills Dr, Nashville, TN", 
    price: 950000,
    beds: 4,
    baths: 3,
    sqft: 2800,
    image: "/placeholder.svg",
    badge: "COMING SOON",
    type: "Residential"
  },
  {
    id: "4",
    title: "Historic Germantown Loft",
    address: "321 Germantown Ave, Nashville, TN",
    price: 425000,
    beds: 1,
    baths: 1.5,
    sqft: 1200,
    image: "/placeholder.svg",
    badge: "OFF-MARKET",
    type: "Loft"
  }
];

const FeaturedProperties = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            Featured Properties
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our hand-picked selection of Nashville's finest properties, 
            from luxury estates to modern condos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {featuredProperties.map((property) => (
            <Card key={property.id} className="group overflow-hidden hover:shadow-card transition-smooth">
              <div className="relative">
                <img 
                  src={property.image}
                  alt={property.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <Badge 
                  className={`absolute top-3 left-3 ${
                    property.badge === 'FEATURED' ? 'bg-primary' :
                    property.badge === 'EXCLUSIVE' ? 'bg-orange' :
                    property.badge === 'COMING SOON' ? 'bg-accent' :
                    'bg-secondary'
                  }`}
                >
                  {property.badge}
                </Badge>
                <Button 
                  variant="secondary" 
                  size="icon"
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
              
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {property.title}
                  </h3>
                  <div className="flex items-center text-muted-foreground text-sm mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.address}
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    ${property.price.toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    {property.beds} beds
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    {property.baths} baths
                  </div>
                  <div className="flex items-center">
                    <Square className="h-4 w-4 mr-1" />
                    {property.sqft.toLocaleString()} sqft
                  </div>
                </div>

                <Link to={`/property/${property.id}`}>
                  <Button variant="orange" className="w-full">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/listings">
            <Button variant="orange-outline" size="lg">
              View All Properties
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;