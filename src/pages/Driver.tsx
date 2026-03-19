import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { nameSchema, phoneSchema, onlyNumbers, getValidationErrors } from "@/lib/validation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Car,
  Banknote,
  Clock,
  MapPin,
  Headphones,
  CheckCircle,
  Phone,
  Loader2,
  Briefcase,
  IndianRupee,
} from "lucide-react";
import upiQrCode from "@/assets/upi-qr-code.jpeg";

const cities = [
  "Ahmedabad",
  "Amreli",
  "Anand",
  "Bharuch",
  "Bhavnagar",
  "Bhuj",
  "Dahod",
  "Deesa",
  "Diu",
  "Dwarka",
  "Gandhidham",
  "Gandhinagar",
  "Godhra",
  "Gondal",
  "Jamnagar",
  "Junagadh",
  "Keshod",
  "Mehsana",
  "Morbi",
  "Palitana",
  "Porbandar",
  "Rajkot",
  "Saputara",
  "Sasan Gir",
  "Somnath",
  "Surat",
  "Vadodara",
  "Veraval",
];

const vehicleTypes = [
  "Swift Dzire",
  "Toyota Etios",
  "Maruti Ertiga",
  "Toyota Innova",
  "Toyota Innova Crysta",
  "Force Urbania",
  "Tempo Traveller 12 Seater",
  "Tempo Traveller 14 Seater",
  "Tempo Traveller 17 Seater",
  "Tempo Traveller 20 Seater",
  "Luxury Bus",
];

const benefits = [
  {
    icon: Briefcase,
    title: "Start Same Day",
    description: "Quick onboarding process, start earning from day one",
  },
  {
    icon: Banknote,
    title: "Daily Payments",
    description: "Get paid daily, 365 days a year",
  },
  {
    icon: Clock,
    title: "Flexible Hours",
    description: "Choose your own working hours and schedule",
  },
  {
    icon: MapPin,
    title: "Multiple Cities",
    description: "Work across Gujarat's major cities",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Round the clock helpline for your assistance",
  },
  {
    icon: Car,
    title: "Your Vehicle, Your Way",
    description: "Get bookings suited to your vehicle type",
  },
];

const Driver = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    vehicle_type: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const driverSchema = z.object({
    name: nameSchema,
    phone: phoneSchema,
    city: z.string().min(1, "Please select your city"),
    vehicle_type: z.string().min(1, "Please select vehicle type"),
    message: z.string().trim().max(500, "Message is too long").optional(),
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = driverSchema.safeParse(formData);
    if (!result.success) {
      setErrors(getValidationErrors(result));
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("driver_registrations").insert({
        name: formData.name,
        phone: formData.phone,
        city: formData.city,
        vehicle_type: formData.vehicle_type,
        message: formData.message || null,
      });

      if (error) throw error;

      toast({
        title: "Registration Successful!",
        description: "We'll contact you soon to discuss the partnership.",
      });

      setFormData({
        name: "",
        phone: "",
        city: "",
        vehicle_type: "",
        message: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Error submitting driver registration:", error);
      toast({
        title: "Submission Failed",
        description: "Something went wrong. Please try again or call us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <SEOHead
        title="Join as Driver Partner - Attach Your Vehicle with Unity Global Tours"
        description="Become a driver partner with Unity Global Tours. Attach your taxi, SUV, or tempo traveller and earn daily. Flexible hours, quick payments, 24/7 support across Gujarat."
        canonicalPath="/driver"
        keywords="driver partner Gujarat, attach vehicle Unity Tours, taxi driver job Veraval, tempo traveller partner, earn with taxi, driver registration"
      />
      {/* UPI Payment Topbar */}
      <div className="bg-primary/10 border-b border-primary/20">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <p className="text-sm text-muted-foreground hidden sm:block">
            Quick & secure payment via UPI
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto border-primary/30 hover:bg-primary/10">
                <IndianRupee className="h-4 w-4 mr-2 text-primary" />
                <span className="text-primary font-medium">Pay via UPI</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-center text-xl font-display">Pay via UPI</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center space-y-4 py-4">
                <p className="text-2xl font-bold text-foreground">UNITY GLOBAL TOURS</p>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="font-semibold text-primary">UPI ID:</span>
                  <a 
                    href="upi://pay?pa=unityglobaltours@idfcbank" 
                    className="text-primary hover:underline"
                  >
                    unityglobaltours@idfcbank
                  </a>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Scan this QR code with any UPI app to transfer
                </p>
                <div className="bg-white p-4 rounded-xl shadow-md">
                  <img 
                    src={upiQrCode} 
                    alt="Unity Global Tours UPI QR Code" 
                    className="w-64 h-64 object-contain"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Powered by</span>
                  <span className="font-semibold text-red-600">IDFC FIRST Bank</span>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Join as a <span className="text-primary">Driver Partner</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Attach your vehicle with Unity Global Tours and start earning. 
              Be part of Gujarat's growing travel network and maximize your income.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+917005050020">
                <Button size="lg" className="bg-gradient-gold hover:opacity-90 text-primary-foreground font-semibold shadow-gold">
                  <Phone className="h-5 w-5 mr-2" />
                  Call +91 70050 50020
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Partner with <span className="text-primary">Us?</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Freedom, flexibility, and financial growth – here's what makes our drivers love working with us
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It <span className="text-primary">Works</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  1
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  Register
                </h3>
                <p className="text-muted-foreground text-sm">
                  Fill out the form below or call us to get started with the registration process
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  2
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  Verification
                </h3>
                <p className="text-muted-foreground text-sm">
                  We verify your documents and vehicle details for a smooth partnership
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  3
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  Start Earning
                </h3>
                <p className="text-muted-foreground text-sm">
                  Get bookings and start earning from day one with daily payments
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Register <span className="text-primary">Now</span>
              </h2>
              <p className="text-muted-foreground">
                Fill out the form below and our team will contact you shortly
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", onlyNumbers(e.target.value))}
                    placeholder="Enter 10-digit phone number"
                    maxLength={10}
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Select
                    value={formData.city}
                    onValueChange={(value) => handleInputChange("city", value)}
                  >
                    <SelectTrigger id="city" className={errors.city ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select your city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicle_type">Vehicle Type *</Label>
                  <Select
                    value={formData.vehicle_type}
                    onValueChange={(value) => handleInputChange("vehicle_type", value)}
                  >
                    <SelectTrigger id="vehicle_type" className={errors.vehicle_type ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.vehicle_type && <p className="text-sm text-destructive">{errors.vehicle_type}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Additional Message (Optional)</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Any additional information you'd like to share..."
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-gold hover:opacity-90 text-primary-foreground font-semibold shadow-gold"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Submit Registration
                  </>
                )}
              </Button>
            </form>

            {/* Contact Alternative */}
            <div className="mt-8 text-center">
              <p className="text-muted-foreground mb-3">
                Prefer to talk directly? Give us a call!
              </p>
              <a href="tel:+917005050020" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
                <Phone className="h-5 w-5" />
                +91 70050 50020
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Driver;
