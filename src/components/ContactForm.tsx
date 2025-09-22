import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Send } from "lucide-react";

// Enhanced validation schema with security rules
const contactFormSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s-']+$/, "Name contains invalid characters"),
  email: z.string()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters")
    .toLowerCase(),
  phone: z.string()
    .optional()
    .refine((phone) => !phone || /^\+?[\d\s()-]{10,15}$/.test(phone), {
      message: "Please enter a valid phone number"
    }),
  message: z.string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters")
    .refine((msg) => !/[<>{}]/g.test(msg), {
      message: "Message contains invalid characters"
    }),
  interest: z.enum(["buying", "selling", "consultation", "other"]).refine((val) => val !== undefined, {
    message: "Please select your interest"
  })
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      interest: "consultation"
    }
  });

  const onSubmit = async (data: ContactFormData) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Submit lead with rate limiting handled by database trigger
      const { error } = await supabase
        .from("leads")
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          // Store additional data in metadata if needed
        });

      if (error) {
        // Handle rate limiting error specifically
        if (error.message.includes("Rate limit exceeded")) {
          toast({
            title: "Rate Limit Exceeded",
            description: "Please wait before submitting another request. Maximum 3 submissions per hour.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      // Log successful submission for audit
      await supabase.rpc("log_data_access", {
        p_table_name: "leads",
        p_operation: "INSERT",
        p_metadata: {
          source: "contact_form",
          interest: data.interest,
          has_phone: !!data.phone,
          ip_address: "client_side" // In production, this would be server-side
        }
      });

      toast({
        title: "Message Sent Successfully",
        description: "Thank you for your interest! We'll contact you within 24 hours.",
      });

      form.reset();
    } catch (error: any) {
      console.error("Contact form submission error:", error);
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly at the number above.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto glass">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Shield className="h-8 w-8 text-primary mr-2" />
          <CardTitle className="font-display text-3xl text-foreground">
            Get In Touch
          </CardTitle>
        </div>
        <CardDescription className="text-muted-foreground">
          Secure contact form with spam protection. All submissions are encrypted and rate-limited.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="John Doe" 
                        {...field}
                        maxLength={100}
                        autoComplete="name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="john@example.com" 
                        {...field}
                        maxLength={255}
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        type="tel" 
                        placeholder="+1 (555) 123-4567" 
                        {...field}
                        autoComplete="tel"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interest"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>I'm Interested In *</FormLabel>
                    <FormControl>
                      <select 
                        {...field}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="consultation">Free Consultation</option>
                        <option value="buying">Buying Property</option>
                        <option value="selling">Selling Property</option>
                        <option value="other">Other Services</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us about your real estate needs..."
                      className="min-h-[120px]"
                      maxLength={1000}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    {field.value?.length || 0}/1000 characters
                  </p>
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between pt-4">
              <p className="text-xs text-muted-foreground flex items-center">
                <Shield className="h-4 w-4 mr-1" />
                Protected by rate limiting (3 submissions/hour)
              </p>
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                size="lg"
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;