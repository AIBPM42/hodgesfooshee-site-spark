import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, MapPin, Bed, Bath, Square, TrendingUp } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function AIHotPropertiesSection() {
  const { trackEvent } = useAnalytics();

  const { data: properties, isLoading } = useQuery({
    queryKey: ['ai-hot-properties-public'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('ai-hot-properties', {
        method: 'GET',
        body: { limit: 3, minScore: 0.7 }
      });
      if (error) throw error;
      return data.items || [];
    }
  });

  const handlePropertyClick = (property: any) => {
    trackEvent('click_ai_property', {
      property_id: property.id,
      address: property.address,
      score: property.score
    });
  };

  if (isLoading || !properties?.length) return null;

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Intelligence</span>
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Hot Investment Opportunities
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Properties identified by our AI as exceptional investment opportunities based on market trends and growth potential
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {properties.map((property: any, idx: number) => (
            <Card 
              key={property.id} 
              className="hover-scale cursor-pointer group overflow-hidden border-2 hover:border-primary/50 transition-all"
              style={{ animationDelay: `${idx * 100}ms` }}
              onClick={() => handlePropertyClick(property)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="default" className="bg-gradient-to-r from-primary to-primary/80">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {Math.round(property.score * 100)}% Match
                  </Badge>
                  {property.verified && (
                    <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                      Verified
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {property.address}
                </CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {property.city}, {property.county}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Est. Range</span>
                  <span className="font-bold text-foreground">
                    ${property.price_low?.toLocaleString()} - ${property.price_high?.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Bed className="h-4 w-4" />
                    {property.beds} Beds
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="h-4 w-4" />
                    {property.baths} Baths
                  </div>
                  <div className="flex items-center gap-1">
                    <Square className="h-4 w-4" />
                    {property.sqft?.toLocaleString()} sq ft
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3">
                  {property.summary}
                </p>

                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => trackEvent('click_view_all_ai_properties')}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            View All AI Opportunities
          </Button>
        </div>
      </div>
    </section>
  );
}
