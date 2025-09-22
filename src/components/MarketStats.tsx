import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Home, DollarSign, Calendar } from "lucide-react";

const MarketStats = () => {
  const stats = [
    {
      icon: DollarSign,
      label: "Median Home Price",
      value: "$425,000",
      change: "+8.2%",
      trend: "up"
    },
    {
      icon: Home,
      label: "Homes Sold",
      value: "2,847",
      change: "+12.5%",
      trend: "up"
    },
    {
      icon: Calendar,
      label: "Days on Market",
      value: "18",
      change: "-15%",
      trend: "down"
    },
    {
      icon: TrendingUp,
      label: "Price Per Sq Ft",
      value: "$215",
      change: "+6.8%",
      trend: "up"
    }
  ];

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Nashville Market Intelligence
          </h2>
          <p className="text-xl text-muted-foreground">
            Real-time data from the Nashville MLS
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-luxury transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {stat.value}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {stat.label}
                </p>
                <div className={`flex items-center justify-center text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className={`h-4 w-4 mr-1 ${
                    stat.trend === 'down' ? 'rotate-180' : ''
                  }`} />
                  {stat.change}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarketStats;