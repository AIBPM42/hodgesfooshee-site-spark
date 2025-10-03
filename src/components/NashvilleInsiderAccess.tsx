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
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Nashville Insider Access
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Exclusive opportunities before they hit the market
          </p>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
            Get first access to off-market properties, coming soon listings, and investment opportunities through our insider network
          </p>
        </div>

        {/* Exclusive Properties */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="overflow-hidden card-glass relative group">
            <div className="aspect-[4/3] bg-gradient-to-br from-gray-400 to-gray-600 relative">
              <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
              <Badge className="absolute top-4 left-4 pill-orange">
                COMING SOON
              </Badge>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <h4 className="text-xl font-semibold mb-2">EXCLUSIVE ACCESS</h4>
                  <p className="text-sm">Register to View Details</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h4 className="text-lg font-semibold text-foreground mb-2">Historic Estate</h4>
              <p className="text-muted-foreground text-sm mb-3">Belle Meade Area</p>
              <div className="space-y-2 text-sm text-muted-foreground mb-4">
                <div className="flex justify-between">
                  <span>Price Range:</span>
                  <span className="font-semibold text-foreground">$1.2M - $1.4M</span>
                </div>
                <div className="text-center py-2 border-t border-border">
                  <span className="font-medium">5+ Beds | 4+ Baths | 2+ Acres</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic mb-4">
                "Rare historic estate with modern updates"
              </p>
              <Button className="w-full btn">
                Register for Full Details
              </Button>
            </div>
          </Card>

          <Card className="overflow-hidden card-glass relative group">
            <div className="aspect-[4/3] bg-gradient-to-br from-blue-400 to-blue-600 relative">
              <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
              <Badge className="absolute top-4 left-4 pill-orange">
                OFF-MARKET
              </Badge>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <h4 className="text-xl font-semibold mb-2">EXCLUSIVE ACCESS</h4>
                  <p className="text-sm">Register to View Details</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h4 className="text-lg font-semibold text-foreground mb-2">New Construction</h4>
              <p className="text-muted-foreground text-sm mb-3">Williamson County</p>
              <div className="space-y-2 text-sm text-muted-foreground mb-4">
                <div className="flex justify-between">
                  <span>Price Range:</span>
                  <span className="font-semibold text-foreground">$650K - $750K</span>
                </div>
                <div className="text-center py-2 border-t border-border">
                  <span className="font-medium">3+ Beds | 2+ Baths | Premium Finishes</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic mb-4">
                "Brand new luxury townhome in top-rated district"
              </p>
              <Button className="w-full btn">
                Register for Full Details
              </Button>
            </div>
          </Card>

          <Card className="overflow-hidden card-glass relative group">
            <div className="aspect-[4/3] bg-gradient-to-br from-green-400 to-green-600 relative">
              <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
              <Badge className="absolute top-4 left-4 pill-purple">
                EXCLUSIVE
              </Badge>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <h4 className="text-xl font-semibold mb-2">EXCLUSIVE ACCESS</h4>
                  <p className="text-sm">Register to View Details</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h4 className="text-lg font-semibold text-foreground mb-2">Investment Opportunity</h4>
              <p className="text-muted-foreground text-sm mb-3">Davidson County</p>
              <div className="space-y-2 text-sm text-muted-foreground mb-4">
                <div className="flex justify-between">
                  <span>Price Range:</span>
                  <span className="font-semibold text-foreground">$350K - $450K</span>
                </div>
                <div className="text-center py-2 border-t border-border">
                  <span className="font-medium">Multi-Unit | Cash Flow Positive</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic mb-4">
                "Turnkey rental property with proven returns"
              </p>
              <Button className="w-full btn">
                Register for Full Details
              </Button>
            </div>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center card-glass rounded-2xl p-12">
          <h3 className="text-3xl font-display font-bold text-foreground mb-4">
            Join Our Insider Network
          </h3>
          <p className="text-lg text-muted-foreground mb-6 max-w-3xl mx-auto">
            Get exclusive access to Nashville's hidden gems before they hit the public market. Our insider network gives you the competitive edge in today's fast-moving market.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn px-8">
              Get Instant Access
            </Button>
            <Button size="lg" className="btn-ghost px-8">
              Schedule Private Consultation
            </Button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default NashvilleInsiderAccess;