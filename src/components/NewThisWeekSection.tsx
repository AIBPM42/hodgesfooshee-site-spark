import { useNewListingsRealtyna } from "@/hooks/useNewListingsRealtyna";
import { useNewListings } from "@/hooks/useNewListings";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home, Bed, Bath, Square } from "lucide-react";
import { Link } from "react-router-dom";

export const NewThisWeekSection = () => {
  // Realtyna-first, local-fallback pattern
  const { data: realtynaListings, isLoading: realtynaLoading, error: realtynaError } = useNewListingsRealtyna(12);
  const { data: localListings, isLoading: localLoading } = useNewListings(12);

  const listings = realtynaError ? localListings : realtynaListings;
  const isLoading = realtynaLoading || (realtynaError && localLoading);

  if (realtynaError) {
    console.warn('[NewThisWeek] Realtyna failed, using local fallback:', realtynaError);
  }

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">New This Week</h2>
            <p className="text-xl text-white/80">Loading latest listings...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!listings || listings.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold mb-4">New This Week</h2>
            <p className="text-xl text-white/80">Fresh listings just added to the market</p>
          </div>
          <Button asChild className="btn">
            <Link to="/search?days=7">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listings.slice(0, 12).map((listing) => (
            <Card key={listing.ListingKey || listing.listing_key} className="card-glass overflow-hidden group cursor-pointer hover:scale-105 transition-transform">
              <Link to={`/property/${listing.ListingKey || listing.listing_key}`}>
                <div className="aspect-video bg-gradient-to-br from-luxury-gold/20 to-luxury-gold/5 flex items-center justify-center">
                  <Home className="h-12 w-12 text-luxury-gold/40" />
                </div>
                <div className="p-4">
                  <div className="text-2xl font-bold text-luxury-gold mb-2">
                    ${(listing.ListPrice || listing.list_price || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-white/80 mb-3">{listing.City || listing.city || 'N/A'}</div>
                  <div className="flex items-center gap-4 text-sm text-white/60">
                    {(listing.BedroomsTotal || listing.bedrooms_total) && (
                      <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        {listing.BedroomsTotal || listing.bedrooms_total}
                      </div>
                    )}
                    {(listing.BathroomsTotalInteger || listing.bathrooms_total_integer) && (
                      <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        {listing.BathroomsTotalInteger || listing.bathrooms_total_integer}
                      </div>
                    )}
                    {(listing.LivingArea || listing.living_area) && (
                      <div className="flex items-center gap-1">
                        <Square className="h-4 w-4" />
                        {(listing.LivingArea || listing.living_area).toLocaleString()} sqft
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
