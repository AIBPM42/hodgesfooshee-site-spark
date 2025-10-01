import { useTopCitiesRealtyna } from "@/hooks/useTopCitiesRealtyna";
import { useTopCities } from "@/hooks/useTopCities";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const ExploreCitiesSection = () => {
  // Realtyna-first, local-fallback pattern
  const { data: realtynaCities, isLoading: realtynaLoading, error: realtynaError } = useTopCitiesRealtyna(6);
  const { data: localCities, isLoading: localLoading } = useTopCities(6);

  const cities = realtynaError ? localCities : realtynaCities;
  const isLoading = realtynaLoading || (realtynaError && localLoading);

  if (realtynaError) {
    console.warn('[ExploreCities] Realtyna failed, using local fallback:', realtynaError);
  }

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Explore Top Cities</h2>
            <p className="text-xl text-white/80">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!cities || cities.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Explore Top Cities</h2>
          <p className="text-xl text-white/80">Discover properties in high-inventory markets</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city) => (
            <Card key={city.city} className="card-glass p-6 group hover:scale-105 transition-transform cursor-pointer">
              <Link to={`/search?city=${encodeURIComponent(city.city)}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-luxury-gold/10">
                      <MapPin className="h-6 w-6 text-luxury-gold" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{city.city}</h3>
                      <p className="text-sm text-white/60">Tennessee</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div>
                    <div className="text-3xl font-bold text-luxury-gold">{city.count}</div>
                    <div className="text-sm text-white/60">Active Listings</div>
                  </div>
                  <Button size="sm" variant="ghost" className="btn-ghost">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
