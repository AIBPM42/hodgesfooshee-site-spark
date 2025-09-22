import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Clock, Users, Star } from "lucide-react";

const InsiderAccess = () => {
  const benefits = [
    {
      icon: Eye,
      title: "Off-Market Properties",
      description: "Access exclusive listings before they hit the public market"
    },
    {
      icon: Clock,
      title: "Coming Soon Alerts",
      description: "Get notified 24-48 hours before listings go live"
    },
    {
      icon: Users,
      title: "VIP Showing Access",
      description: "Priority scheduling for property viewings and open houses"
    },
    {
      icon: Star,
      title: "Market Updates",
      description: "Weekly insights and analysis from Nashville market experts"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              Exclusive Access
            </Badge>
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Nashville Insider Access
            </h2>
            <p className="text-xl text-muted-foreground">
              Join our exclusive network and get access to Nashville's best properties before anyone else
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {benefits.map((benefit, index) => (
              <Card key={index} className="hover:shadow-card transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button size="lg" className="px-8">
              Get Insider Access
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              100% free • No spam • Unsubscribe anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InsiderAccess;