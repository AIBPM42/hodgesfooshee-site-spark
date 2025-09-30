import { useUpcomingOpenHouses } from "@/hooks/useUpcomingOpenHouses";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export const UpcomingOpenHousesSection = () => {
  const { data: openHouses, isLoading } = useUpcomingOpenHouses(7, 8);

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-b from-transparent to-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Upcoming Open Houses</h2>
            <p className="text-xl text-white/80">Loading events...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!openHouses || openHouses.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-transparent to-black/20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold mb-4">Upcoming Open Houses</h2>
            <p className="text-xl text-white/80">Schedule your visit this week</p>
          </div>
          <Button asChild className="btn">
            <Link to="/open-houses">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {openHouses.slice(0, 8).map((oh) => {
            const listing = oh.mls_listings as any;
            return (
              <Card key={oh.open_house_key} className="card-glass p-5">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-luxury-gold">
                    <Calendar className="h-4 w-4" />
                    <span className="font-semibold">
                      {new Date(oh.open_house_date).toLocaleDateString()}
                    </span>
                  </div>

                  {oh.open_house_start_time && (
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <Clock className="h-4 w-4" />
                      <span>{oh.open_house_start_time} - {oh.open_house_end_time}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <MapPin className="h-4 w-4" />
                    <span>{listing?.city || 'N/A'}</span>
                  </div>

                  <div className="pt-3 border-t border-white/10">
                    <div className="text-2xl font-bold text-luxury-gold mb-1">
                      ${(listing?.list_price || 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-white/60">
                      {listing?.bedrooms_total || 0} bed • {listing?.bathrooms_total_integer || 0} bath
                    </div>
                  </div>

                  <Button asChild size="sm" className="w-full btn">
                    <Link to={`/listing/${oh.listing_key}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
