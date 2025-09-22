import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { confettiCannon } from "@/lib/confetti";

const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
});

type LeadForm = z.infer<typeof leadSchema>;

interface LeadModalProps {
  open: boolean;
  onClose: () => void;
}

export const LeadModal = ({ open, onClose }: LeadModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<LeadForm>({
    resolver: zodResolver(leadSchema)
  });

  const onSubmit = async (data: LeadForm) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('leads')
        .insert([{ name: data.name, email: data.email }]);

      if (error) throw error;

      // Success - trigger confetti and close
      confettiCannon();
      toast({
        title: "Welcome to Hodges & Fooshee!",
        description: "We'll be in touch with exclusive property opportunities.",
      });
      
      reset();
      setTimeout(() => {
        onClose();
      }, 900);
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: error.message || "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-strong border-0 max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-display text-foreground">
            Get Instant Access
          </DialogTitle>
          <p className="text-center text-muted-foreground mt-2">
            Join our exclusive list for premium property opportunities
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">Name</Label>
            <Input
              id="name"
              {...register("name")}
              className="bg-background/50 border-white/20 text-foreground"
              placeholder="Your full name"
            />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className="bg-background/50 border-white/20 text-foreground"
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="text-destructive text-sm">{errors.email.message}</p>
            )}
          </div>
          
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white hover:bg-black/80 font-semibold py-3"
          >
            {isSubmitting ? "Joining..." : "Get Instant Access"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};