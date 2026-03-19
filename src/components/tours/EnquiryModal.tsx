import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { nameSchema, emailSchema, phoneSchema, onlyNumbers } from "@/lib/validation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Calendar, Users, Send, CheckCircle } from "lucide-react";

const enquirySchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
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
  const [submittedData, setSubmittedData] = useState<EnquiryFormData | null>(null);

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

      // Send email notification to admin
      try {
        await supabase.functions.invoke("send-enquiry-notification", {
          body: {
            type: "tour",
            name: data.name,
            email: data.email,
            phone: data.phone,
            tourName: tour.title,
            travelDate: data.travel_date,
            adults: data.adults,
            children: data.children,
            message: data.message,
          },
        });
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
      }

      setSubmittedData(data);
      setIsSuccess(true);
      toast.success("Enquiry submitted successfully!");
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
      setSubmittedData(null);
      onClose();
    }
  };

  const handleNewEnquiry = () => {
    reset();
    setIsSuccess(false);
    setSubmittedData(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-foreground">
            {isSuccess ? "Enquiry Submitted!" : "Send Enquiry"}
          </DialogTitle>
        </DialogHeader>

        {isSuccess && submittedData ? (
          <div className="py-6 space-y-6">
            {/* Success Icon */}
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground mb-2">Thank You!</h3>
              <p className="text-muted-foreground">
                Your enquiry has been submitted successfully.
              </p>
              <p className="text-muted-foreground">
                Our team will connect with you soon.
              </p>
            </div>

            {/* Enquiry Summary */}
            <div className="bg-secondary/50 rounded-xl p-4 space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Enquiry Summary
              </h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tour Package</span>
                  <span className="font-medium text-foreground">{tour.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium text-foreground">{submittedData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium text-foreground">{submittedData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-medium text-foreground">{submittedData.phone}</span>
                </div>
                {submittedData.travel_date && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Travel Date</span>
                    <span className="font-medium text-foreground">
                      {new Date(submittedData.travel_date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Travelers</span>
                  <span className="font-medium text-foreground">
                    {submittedData.adults} Adult{submittedData.adults > 1 ? 's' : ''}
                    {submittedData.children > 0 && `, ${submittedData.children} Child${submittedData.children > 1 ? 'ren' : ''}`}
                  </span>
                </div>
                {submittedData.message && (
                  <div className="pt-2 border-t border-border">
                    <span className="text-muted-foreground block mb-1">Message</span>
                    <span className="font-medium text-foreground">{submittedData.message}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleNewEnquiry}
                className="flex-1"
              >
                New Enquiry
              </Button>
              <Button
                onClick={handleClose}
                className="flex-1 bg-gradient-gold hover:opacity-90 text-primary-foreground"
              >
                Close
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              We typically respond within 24 hours. For urgent queries, please call us.
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
                className="bg-white text-gray-900 placeholder:text-gray-500 border-gray-300 mt-1"
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
                  className="bg-white text-gray-900 placeholder:text-gray-500 border-gray-300 mt-1"
                  {...register("email")}
                />
                {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="phone" className="text-foreground">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter 10-digit number"
                  className="bg-white text-gray-900 placeholder:text-gray-500 border-gray-300 mt-1"
                  maxLength={10}
                  {...register("phone")}
                  onChange={(e) => {
                    const val = onlyNumbers(e.target.value);
                    e.target.value = val;
                    register("phone").onChange(e);
                  }}
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
