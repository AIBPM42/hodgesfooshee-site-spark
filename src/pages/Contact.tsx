import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Contact = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Ready to start your real estate journey? Get in touch with our expert team today.
          </p>
        </div>
      </section>

      {/* Contact Info & Form Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <h2 className="font-display text-3xl font-bold text-foreground mb-8">
                Get In Touch
              </h2>
              
              <div className="space-y-6">
                <Card className="hover:shadow-card transition-smooth">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <MapPin className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Address</h3>
                        <p className="text-muted-foreground">
                          123 Luxury Avenue<br />
                          Nashville, TN 37201
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-card transition-smooth">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Phone className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Phone</h3>
                        <a 
                          href="tel:+16154567890" 
                          className="text-muted-foreground hover:text-primary transition-smooth"
                        >
                          (615) 456-7890
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-card transition-smooth">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Mail className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Email</h3>
                        <a 
                          href="mailto:info@luxuryrealestate.com" 
                          className="text-muted-foreground hover:text-primary transition-smooth"
                        >
                          info@luxuryrealestate.com
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-card transition-smooth">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Clock className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Hours</h3>
                        <div className="text-muted-foreground">
                          <p>Monday - Friday: 9:00 AM - 7:00 PM</p>
                          <p>Saturday: 10:00 AM - 6:00 PM</p>
                          <p>Sunday: 12:00 PM - 5:00 PM</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Visit Our Office
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Located in the heart of Nashville, we're easily accessible and always ready to help.
            </p>
          </div>
          
          {/* Placeholder for map - in production, you'd integrate Google Maps or similar */}
          <div className="w-full h-96 bg-card rounded-lg border border-border flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Interactive map would be displayed here</p>
              <p className="text-sm text-muted-foreground mt-2">
                123 Luxury Avenue, Nashville, TN 37201
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;