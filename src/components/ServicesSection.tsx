import { Card, CardContent } from "@/components/ui/card";
import { Home, DollarSign, Calculator, FileText, Shield, Handshake } from "lucide-react";

const services = [
  {
    icon: Home,
    title: "Residential Sales",
    description: "Expert guidance through every step of buying or selling your home with personalized attention."
  },
  {
    icon: DollarSign,
    title: "Market Analysis",
    description: "Comprehensive market evaluations to ensure optimal pricing and investment decisions."
  },
  {
    icon: Calculator,
    title: "Investment Consulting",
    description: "Strategic advice for real estate investments and portfolio development opportunities."
  },
  {
    icon: FileText,
    title: "Contract Negotiation",
    description: "Professional representation to secure the best terms and protect your interests."
  },
  {
    icon: Shield,
    title: "Legal Protection",
    description: "Thorough due diligence and legal safeguards throughout the transaction process."
  },
  {
    icon: Handshake,
    title: "Concierge Service",
    description: "Full-service support including staging, photography, and move coordination."
  }
];

const ServicesSection = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            Comprehensive Real Estate Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From first-time buyers to luxury estates, we provide expert guidance 
            and personalized service tailored to your unique needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-card transition-smooth border border-border/50">
              <CardContent className="p-8">
                <div className="bg-gradient-luxury rounded-lg p-3 w-fit mb-6 group-hover:shadow-luxury transition-smooth">
                  <service.icon className="h-6 w-6 text-luxury-gold-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;