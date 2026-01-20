import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "lucide-react";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.city || !formData.vehicle_type) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
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
              <a href="tel:+919727248890">
                <Button size="lg" className="bg-gradient-gold hover:opacity-90 text-primary-foreground font-semibold shadow-gold">
                  <Phone className="h-5 w-5 mr-2" />
                  Call +91 97272 48890
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
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Select
                    value={formData.city}
                    onValueChange={(value) => setFormData({ ...formData, city: value })}
                  >
                    <SelectTrigger id="city">
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicle_type">Vehicle Type *</Label>
                  <Select
                    value={formData.vehicle_type}
                    onValueChange={(value) => setFormData({ ...formData, vehicle_type: value })}
                  >
                    <SelectTrigger id="vehicle_type">
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
              <a href="tel:+919727248890" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
                <Phone className="h-5 w-5" />
                +91 97272 48890
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Driver;
