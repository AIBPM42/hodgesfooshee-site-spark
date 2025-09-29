import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, User } from "lucide-react";

const insights = [
  {
    id: 1,
    category: "Market Reports",
    title: "Nashville Market Report: Q4 2024 Trends",
    description: "Discover the latest market trends, price movements, and investment opportunities across Middle Tennessee's hottest...",
    readTime: "5 min read",
    date: "Dec 15, 2024",
    author: "Hodges & Fooshee Team",
    image: "/api/placeholder/400/250"
  },
  {
    id: 2,
    category: "Buyer Guides",
    title: "First-Time Buyer's Guide to Nashville",
    description: "Everything you need to know about purchasing your first home in Nashville, from financing to neighborhood selection.",
    readTime: "8 min read",
    date: "Dec 12, 2024",
    author: "Hodges & Fooshee Team",
    image: "/api/placeholder/400/250"
  },
  {
    id: 3,
    category: "Investment Insights",
    title: "Investment Properties: East Nashville ROI Analysis",
    description: "Deep dive into East Nashville's investment potential with real ROI data, rental yields, and future growth projections.",
    readTime: "6 min read",
    date: "Dec 10, 2024",
    author: "Hodges & Fooshee Team",
    image: "/api/placeholder/400/250"
  }
];

const LatestMarketInsights = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="h-6 w-6 text-[#FF6A2A] mr-3" />
            <span className="text-[#FF6A2A] font-semibold text-lg">Latest Market</span>
            <span className="text-[#FF6A2A] font-semibold text-lg ml-1">Insights</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
            Stay ahead with expert analysis and insights from Nashville's most trusted real estate professionals
          </h2>
        </div>

        {/* Insights Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {insights.map((insight) => (
            <Card key={insight.id} className="card-glass p-0 overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="insight-band h-24 relative overflow-hidden">
                <Badge className="absolute top-4 left-4 pill-orange px-3 py-1 text-[12px] rounded-full font-semibold">
                  {insight.category}
                </Badge>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center text-sm text-muted-foreground mb-3">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="mr-4">{insight.readTime}</span>
                  <span>{insight.date}</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-[#FF6A2A] transition-colors">
                  {insight.title}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {insight.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="h-4 w-4 mr-1" />
                    {insight.author}
                  </div>
                  <Button className="btn p-0 h-auto">
                    Read More →
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" className="btn px-8">
            <TrendingUp className="mr-2 h-5 w-5" />
            See All Market Insights →
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LatestMarketInsights;