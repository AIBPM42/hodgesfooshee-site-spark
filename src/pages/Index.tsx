import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import Footer from "@/components/Footer";
import { LeadModal } from "@/components/LeadModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { confettiCannon } from "@/lib/confetti";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Homeowner",
    content: "Exceptional service from start to finish. The team found us our dream home in record time.",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Investor",
    content: "Their market knowledge is unmatched. They've helped me build a profitable real estate portfolio.",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    role: "First-time Buyer",
    content: "Patient, knowledgeable, and genuinely cared about finding the perfect home for our family.",
    rating: 5
  }
];

const Index = () => {
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <ServicesSection />
      
      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              What Our Clients Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our satisfied clients 
              have to say about their experience with us.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-card transition-smooth">
                <CardContent className="p-8">
                   <div className="flex items-center mb-4">
                     {[...Array(testimonial.rating)].map((_, i) => (
                       <Star key={i} className="h-5 w-5 text-luxury-gold fill-current" />
                     ))}
                   </div>
                   <Quote className="h-8 w-8 text-luxury-gold mb-4" />
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Let our experienced team guide you through every step of your real estate journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="luxury" 
              size="lg" 
              className="text-lg px-8 py-3"
              onClick={confettiCannon}
            >
              Browse Properties
            </Button>
            <Button 
              variant="hero" 
              size="lg" 
              className="text-lg px-8 py-3"
              onClick={confettiCannon}
            >
              Schedule Consultation
            </Button>
            <Button 
              size="lg" 
              className="text-lg px-8 py-3 bg-black text-white hover:bg-black/80 font-semibold"
              onClick={() => setLeadModalOpen(true)}
            >
              Get Instant Access
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
      
      <LeadModal 
        open={leadModalOpen} 
        onClose={() => setLeadModalOpen(false)} 
      />
    </div>
  );
};

export default Index;
