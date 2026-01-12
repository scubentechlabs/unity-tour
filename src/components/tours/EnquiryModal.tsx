import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Calendar, Users, Send, CheckCircle } from "lucide-react";

const enquirySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().trim().email("Please enter a valid email").max(255, "Email is too long"),
  phone: z.string().trim().min(10, "Please enter a valid phone number").max(15, "Phone number is too long")
    .regex(/^[+]?[\d\s-]+$/, "Please enter a valid phone number"),
  travel_date: z.string().optional(),
  adults: z.number().min(1, "At least 1 adult required").max(50, "Maximum 50 adults"),
  children: z.number().min(0).max(50, "Maximum 50 children"),
  message: z.string().trim().max(1000, "Message is too long").optional(),
});

type EnquiryFormData = z.infer<typeof enquirySchema>;

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  tour: {
    id: string;
    title: string;
    price_per_person: number;
    discounted_price: number | null;
  };
}

export const EnquiryModal = ({ isOpen, onClose, tour }: EnquiryModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      adults: 2,
      children: 0,
    },
  });

  const onSubmit = async (data: EnquiryFormData) => {
    setIsSubmitting(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      
      const { error } = await supabase.from("tour_enquiries").insert({
        tour_package_id: tour.id,
        user_id: session?.session?.user?.id || null,
        name: data.name,
        email: data.email,
        phone: data.phone,
        travel_date: data.travel_date || null,
        adults: data.adults,
        children: data.children,
        message: data.message || null,
        status: "pending",
      });

      if (error) throw error;

      setIsSuccess(true);
      toast.success("Enquiry submitted successfully! We'll contact you soon.");
      
      setTimeout(() => {
        reset();
        setIsSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      toast.error("Failed to submit enquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      setIsSuccess(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-foreground">
            {isSuccess ? "Enquiry Submitted!" : "Send Enquiry"}
          </DialogTitle>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Thank You!</h3>
            <p className="text-muted-foreground">
              Your enquiry for <span className="text-primary font-medium">{tour.title}</span> has been received. 
              Our team will contact you within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            {/* Tour Info */}
            <div className="p-4 bg-secondary rounded-lg mb-4">
              <p className="text-sm text-muted-foreground">Tour Package</p>
              <p className="font-display font-semibold text-foreground">{tour.title}</p>
              <p className="text-primary font-bold mt-1">
                ₹{(tour.discounted_price || tour.price_per_person).toLocaleString()} per person
              </p>
            </div>

            {/* Name */}
            <div>
              <Label htmlFor="name" className="text-foreground">Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                className="bg-background border-border mt-1"
                {...register("name")}
              />
              {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email" className="text-foreground">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="bg-background border-border mt-1"
                  {...register("email")}
                />
                {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="phone" className="text-foreground">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="bg-background border-border mt-1"
                  {...register("phone")}
                />
                {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>}
              </div>
            </div>

            {/* Travel Date */}
            <div>
              <Label htmlFor="travel_date" className="text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Preferred Travel Date
              </Label>
              <Input
                id="travel_date"
                type="date"
                className="bg-background border-border mt-1"
                min={new Date().toISOString().split("T")[0]}
                {...register("travel_date")}
              />
            </div>

            {/* Travelers */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="adults" className="text-foreground flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Adults *
                </Label>
                <Input
                  id="adults"
                  type="number"
                  min={1}
                  max={50}
                  className="bg-background border-border mt-1"
                  {...register("adults", { valueAsNumber: true })}
                />
                {errors.adults && <p className="text-destructive text-sm mt-1">{errors.adults.message}</p>}
              </div>
              <div>
                <Label htmlFor="children" className="text-foreground">Children (0-12)</Label>
                <Input
                  id="children"
                  type="number"
                  min={0}
                  max={50}
                  className="bg-background border-border mt-1"
                  {...register("children", { valueAsNumber: true })}
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <Label htmlFor="message" className="text-foreground">Additional Requirements</Label>
              <Textarea
                id="message"
                placeholder="Any special requests or questions..."
                className="bg-background border-border mt-1 resize-none"
                rows={3}
                {...register("message")}
              />
              {errors.message && <p className="text-destructive text-sm mt-1">{errors.message.message}</p>}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-gold hover:opacity-90 text-primary-foreground font-semibold h-12"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Submit Enquiry
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              By submitting, you agree to our Terms & Privacy Policy
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
