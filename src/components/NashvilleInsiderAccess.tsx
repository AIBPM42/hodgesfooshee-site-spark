import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Lock, Star, BarChart3 } from "lucide-react";

const marketData = [
  {
    county: "Davidson",
    avgPrice: "$425,000",
    change: "+8.2%",
    inventory: "2.3 months",
    trend: "up"
  },
  {
    county: "Williamson", 
    avgPrice: "$650,000",
    change: "+12.5%",
    inventory: "1.8 months",
    trend: "up"
  },
  {
    county: "Rutherford",
    avgPrice: "$375,000", 
    change: "+6.1%",
    inventory: "2.7 months",
    trend: "up"
  },
  {
    county: "Wilson",
    avgPrice: "$385,000",
    change: "+4.8%", 
    inventory: "3.1 months",
    trend: "up"
  }
];

const exclusiveListings = [
  {
    title: "Belle Meade Estate",
    type: "OFF-MARKET",
    price: "$3.2M",
    description: "Historic 6BR/5BA estate on 2 acres"
  },
  {
    title: "Music Row Penthouse", 
    type: "COMING SOON",
    price: "$1.8M",
    description: "Luxury 3BR penthouse with city views"
  },
  {
    title: "Green Hills Modern",
    type: "EXCLUSIVE", 
    price: "$1.2M",
    description: "Contemporary 4BR home with pool"
  }
];

const NashvilleInsiderAccess = () => {
  return (
    <section className="py-20 bg-accent/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary text-primary-foreground">
            <Lock className="h-3 w-3 mr-1" />
            Nashville Insider Access
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            Middle Tennessee Market Pulse
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get exclusive access to off-market properties, market intelligence, 
            and insider insights from Nashville's real estate experts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Market Intelligence */}
          <div>
            <h3 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center">
              <BarChart3 className="h-6 w-6 mr-2 text-primary" />
              Market Intelligence
            </h3>
            <div className="space-y-4">
              {marketData.map((data, index) => (
                <Card key={index} className="hover:shadow-card transition-smooth">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-foreground">{data.county} County</h4>
                      <Badge variant={data.trend === 'up' ? 'default' : 'secondary'}>
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {data.change}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Avg Price</span>
                        <div className="font-semibold text-primary">{data.avgPrice}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Inventory</span>
                        <div className="font-semibold">{data.inventory}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Exclusive Properties */}
          <div>
            <h3 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center">
              <Star className="h-6 w-6 mr-2 text-primary" />
              Exclusive Properties
            </h3>
            <div className="space-y-4">
              {exclusiveListings.map((listing, index) => (
                <Card key={index} className="hover:shadow-card transition-smooth">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{listing.title}</CardTitle>
                      <Badge 
                        className={`${
                          listing.type === 'OFF-MARKET' ? 'bg-destructive' :
                          listing.type === 'COMING SOON' ? 'bg-accent' :
                          'bg-primary'
                        }`}
                      >
                        {listing.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <p className="text-muted-foreground text-sm">{listing.description}</p>
                      <div className="text-xl font-bold text-primary">{listing.price}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-card rounded-lg p-8 shadow-card">
          <h3 className="font-display text-2xl font-bold text-foreground mb-4">
            Unlock Nashville's Best-Kept Secrets
          </h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Join our exclusive network to receive off-market listings, market reports, 
            and early access to new properties before they hit the public market.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="orange" size="lg">
              Get Insider Access
            </Button>
            <Button variant="orange-outline" size="lg">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NashvilleInsiderAccess;