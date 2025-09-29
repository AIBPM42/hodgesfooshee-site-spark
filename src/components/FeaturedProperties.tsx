import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Bed, Bath, Square, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useFeaturedListings } from "@/hooks/useFeaturedListings";

const FeaturedProperties = () => {
  const { data: listings, isLoading, error } = useFeaturedListings();

  if (error) {
    return null; // Gracefully hide the section if there's an error
  }

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
            Featured Properties
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover exceptional homes handpicked by our experts across Middle Tennessee
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <PropertyCardSkeleton key={index} />
            ))
          ) : (
            listings?.map((listing) => (
              <Card key={listing.id} className="card-glass p-0 group overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="relative overflow-hidden">
                  <div className="w-full h-64 bg-muted animate-pulse" />
                  <Badge 
                    variant="secondary" 
                    className="absolute top-4 left-4 pill-orange px-3 py-1 text-[12px] rounded-full font-semibold"
                  >
                    Active
                  </Badge>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-display font-semibold text-foreground mb-2 group-hover:text-[#FF6A2A] transition-colors">
                    Beautiful Home in {listing.city}
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    {listing.city}, TN
                  </p>
                  
                  <div className="text-2xl font-bold text-positive mb-4">
                    ${Number(listing.list_price).toLocaleString()}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-1">
                      <Bed className="w-4 h-4" />
                      <span>{listing.bedrooms_total || 0} beds</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      <span>{listing.bathrooms_total_integer || 0} baths</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Square className="w-4 h-4" />
                      <span>{Number(listing.living_area).toLocaleString() || 0} sqft</span>
                    </div>
                  </div>
                  
                  <Link to={`/property/${listing.listing_key}`}>
                    <Button className="btn w-full group">
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="text-center">
          <Link to="/listings">
            <Button size="lg" className="btn">
              View All Properties
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

const PropertyCardSkeleton = () => (
  <Card className="overflow-hidden border-border">
    <Skeleton className="w-full h-64 rounded-none" />
    <CardContent className="p-6">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <Skeleton className="h-8 w-1/3 mb-4" />
      <div className="flex gap-4 mb-6">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-10 w-full" />
    </CardContent>
  </Card>
);

export default FeaturedProperties;