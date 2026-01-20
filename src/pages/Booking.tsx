import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, MapPin, Phone, Mail, Clock, CheckCircle, Plane, Car, Hotel, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import UpiPaymentDialog from "@/components/UpiPaymentDialog";

const bookingSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(15, "Phone number must be less than 15 digits"),
  serviceType: z.string().min(1, "Please select a service type"),
  destination: z.string().trim().max(200, "Destination must be less than 200 characters").optional(),
  travelDate: z.string().optional(),
  travelers: z.string().optional(),
  message: z.string().trim().max(1000, "Message must be less than 1000 characters").optional(),
});

const serviceTypes = [
  { value: "domestic-tour", label: "Domestic Tour Package", icon: MapPin },
  { value: "international-tour", label: "International Tour Package", icon: Globe },
  { value: "taxi-booking", label: "Taxi/Car Rental", icon: Car },
  { value: "flight-booking", label: "Flight Booking", icon: Plane },
  { value: "hotel-booking", label: "Hotel Booking", icon: Hotel },
  { value: "visa-services", label: "Visa Services", icon: Globe },
  { value: "group-booking", label: "Group Booking", icon: Users },
  { value: "custom-package", label: "Custom Package", icon: CheckCircle },
];

const features = [
  { icon: Clock, title: "Quick Response", description: "Get a quote within 24 hours" },
  { icon: CheckCircle, title: "Best Prices", description: "Competitive rates guaranteed" },
  { icon: Users, title: "Expert Support", description: "24/7 customer assistance" },
  { icon: MapPin, title: "Custom Itineraries", description: "Tailored to your preferences" },
];

const Booking = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: "",
    destination: "",
    travelDate: "",
    travelers: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = bookingSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Save to database
      const { error } = await supabase
        .from("tour_enquiries")
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: `Service Type: ${formData.serviceType}\nDestination: ${formData.destination || "Not specified"}\nTravel Date: ${formData.travelDate || "Flexible"}\nTravelers: ${formData.travelers || "Not specified"}\n\nAdditional Message: ${formData.message || "None"}`,
          travel_date: formData.travelDate || null,
          adults: formData.travelers ? parseInt(formData.travelers) : null,
        });

      if (error) throw error;

      // Send confirmation email via edge function
      try {
        await supabase.functions.invoke("send-enquiry-notification", {
          body: {
            type: "booking",
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            serviceType: formData.serviceType,
            destination: formData.destination,
            travelDate: formData.travelDate,
            travelers: formData.travelers,
            message: formData.message,
          },
        });
        console.log("Booking confirmation email sent successfully");
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
        // Don't fail the whole submission if email fails
      }

      toast({
        title: "Booking Request Submitted!",
        description: "Our team will contact you within 24 hours with the best options. A confirmation email has been sent.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        serviceType: "",
        destination: "",
        travelDate: "",
        travelers: "",
        message: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit booking request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Book Your <span className="text-primary">Dream Trip</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Fill out the form below and our travel experts will get back to you with the best options tailored to your needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-3">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl">Booking Request Form</CardTitle>
                  <CardDescription>
                    Tell us about your travel plans and we'll create the perfect itinerary for you.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className={`bg-white text-gray-900 placeholder:text-gray-500 ${errors.name ? "border-red-500" : ""}`}
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className={`bg-white text-gray-900 placeholder:text-gray-500 ${errors.email ? "border-red-500" : ""}`}
                        />
                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className={`bg-white text-gray-900 placeholder:text-gray-500 ${errors.phone ? "border-red-500" : ""}`}
                        />
                        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="serviceType">Service Type *</Label>
                        <Select
                          value={formData.serviceType}
                          onValueChange={(value) => handleInputChange("serviceType", value)}
                        >
                          <SelectTrigger className={`bg-white text-gray-900 ${errors.serviceType ? "border-red-500" : ""}`}>
                            <SelectValue placeholder="Select service type" />
                          </SelectTrigger>
                          <SelectContent>
                            {serviceTypes.map((service) => (
                              <SelectItem key={service.value} value={service.value}>
                                {service.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.serviceType && <p className="text-sm text-red-500">{errors.serviceType}</p>}
                      </div>
                    </div>

                    {/* Travel Details */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="destination">Destination</Label>
                        <Input
                          id="destination"
                          placeholder="Where do you want to go?"
                          value={formData.destination}
                          onChange={(e) => handleInputChange("destination", e.target.value)}
                          className="bg-white text-gray-900 placeholder:text-gray-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="travelDate">Travel Date</Label>
                        <Input
                          id="travelDate"
                          type="date"
                          value={formData.travelDate}
                          onChange={(e) => handleInputChange("travelDate", e.target.value)}
                          className="bg-white text-gray-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="travelers">Number of Travelers</Label>
                        <Select
                          value={formData.travelers}
                          onValueChange={(value) => handleInputChange("travelers", value)}
                        >
                          <SelectTrigger className="bg-white text-gray-900">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} {num === 1 ? "Person" : "People"}
                              </SelectItem>
                            ))}
                            <SelectItem value="10+">10+ People</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Additional Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message">Additional Requirements</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us about your specific requirements, preferences, or any questions you have..."
                        rows={4}
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        className="bg-white text-gray-900 placeholder:text-gray-500"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-gradient-gold hover:opacity-90 text-primary-foreground font-semibold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Booking Request"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Info Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                  <CardDescription>
                    Our travel experts are here to assist you.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <a
                    href="tel:+917005050020"
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Call Us</p>
                      <p className="text-sm text-muted-foreground">+91 70050 50020</p>
                    </div>
                  </a>
                  <a
                    href="mailto:booking@unityglobaltours.com"
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Email Us</p>
                      <p className="text-sm text-muted-foreground">booking@unityglobaltours.com</p>
                    </div>
                  </a>
                  
                  {/* UPI Payment Option */}
                  <UpiPaymentDialog variant="card" />
                </CardContent>
              </Card>

              <Card className="shadow-lg bg-primary text-primary-foreground">
                <CardContent className="pt-6">
                  <h3 className="font-bold text-lg mb-3">Why Book With Us?</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">Best Price Guarantee</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">No Hidden Charges</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">Flexible Cancellation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">24/7 Support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">Verified Operators</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardContent className="pt-6">
                  <h3 className="font-bold text-lg mb-3 text-foreground">Our Services</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {serviceTypes.slice(0, 6).map((service) => (
                      <div
                        key={service.value}
                        className="flex items-center gap-2 p-2 rounded bg-secondary/50"
                      >
                        <service.icon className="h-4 w-4 text-primary" />
                        <span className="text-xs text-foreground">{service.label}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Booking;