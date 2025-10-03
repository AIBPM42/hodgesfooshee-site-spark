import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export const CountyHighlight = () => {
  return (
    <section className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">County Market Intelligence</h2>
        <p className="text-muted-foreground">Deep dive into local market data and trends</p>
      </div>
      
      <div className="flex justify-center">
        <Card className="relative overflow-hidden bg-gradient-to-br from-muted/50 to-muted/30 backdrop-blur-xl border-white/10 max-w-md w-full">
          <CardContent className="p-8">
            <Badge variant="destructive" className="absolute top-4 right-4 gap-1">
              🔥 HOT
            </Badge>
            
            <h3 className="text-4xl font-bold mb-2">Davidson County</h3>
            <p className="text-xl text-muted-foreground mb-8">Nashville</p>
            
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Population Growth</p>
                <p className="text-3xl font-bold text-green-500">+4.2%</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Median Price</p>
                <p className="text-4xl font-bold">$425,000</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Days on Market</p>
                <p className="text-3xl font-bold">18 days</p>
              </div>
              
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">Price Trend</p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-2xl font-bold text-green-500">+8.1%</span>
                </div>
              </div>
            </div>
            
            <Button 
              asChild 
              size="lg" 
              className="w-full mt-8 bg-primary hover:bg-primary/90 text-lg py-6"
            >
              <Link to="/counties/davidson-tn">View County Intelligence</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
