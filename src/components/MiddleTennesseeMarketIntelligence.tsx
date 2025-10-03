import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Link } from "react-router-dom";

const counties = [
  {
    name: "Davidson County",
    city: "Nashville",
    badge: { text: "HOT", variant: "destructive" as const, emoji: "🔥" },
    populationGrowth: "+4.2%",
    medianPrice: "$425,000",
    daysOnMarket: "18 days",
    priceTrend: { value: "+8.1%", isUp: true },
    slug: "davidson-tn"
  },
  {
    name: "Williamson County",
    city: "Franklin",
    badge: { text: "RISING", variant: "rising" as const, emoji: "⚡" },
    populationGrowth: "+5.8%",
    medianPrice: "$685,000",
    daysOnMarket: "22 days",
    priceTrend: { value: "+6.3%", isUp: true },
    slug: "williamson-tn"
  },
  {
    name: "Rutherford County",
    city: "Murfreesboro",
    badge: { text: "STABLE", variant: "secondary" as const, emoji: "📊" },
    populationGrowth: "+3.1%",
    medianPrice: "$375,000",
    daysOnMarket: "25 days",
    priceTrend: { value: "+4.2%", isUp: true },
    slug: "rutherford-tn"
  }
];

export const MiddleTennesseeMarketIntelligence = () => {
  return (
    <section className="w-full">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-3">Middle Tennessee Market Intelligence</h2>
        <p className="text-xl text-muted-foreground mb-2">
          Real-time insights across 9 counties from Nashville's most trusted experts
        </p>
        <p className="text-muted-foreground">
          Our deep local knowledge combined with live market data gives you the intelligence edge
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {counties.map((county) => (
          <Card 
            key={county.slug}
            className="relative overflow-hidden bg-gradient-to-br from-muted/50 to-muted/30 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-300"
          >
            <CardContent className="p-6">
              <Badge variant={county.badge.variant} className="absolute top-4 right-4 gap-1">
                {county.badge.emoji} {county.badge.text}
              </Badge>
              
              <h3 className="text-2xl font-bold mb-1 pr-20">{county.name}</h3>
              <p className="text-lg text-muted-foreground mb-6">{county.city}</p>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Population Growth</p>
                  <p className="text-2xl font-bold text-green-500">{county.populationGrowth}</p>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Median Price</p>
                  <p className="text-2xl font-bold">{county.medianPrice}</p>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Days on Market</p>
                  <p className="text-xl font-bold">{county.daysOnMarket}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">Price Trend</p>
                  <div className="flex items-center gap-1">
                    {county.priceTrend.isUp ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-xl font-bold ${county.priceTrend.isUp ? 'text-green-500' : 'text-red-500'}`}>
                      {county.priceTrend.value}
                    </span>
                  </div>
                </div>
              </div>
              
              <Button 
                asChild 
                size="lg" 
                className="w-full mt-6 bg-primary hover:bg-primary/90"
              >
                <Link to={`/counties/${county.slug}`}>View County Details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
