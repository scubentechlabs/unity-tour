import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Plane,
  Calendar as CalendarIcon,
  Users,
  MapPin,
  ArrowRightLeft,
  Phone,
  CheckCircle,
  Shield,
  Clock,
  HeadphonesIcon,
  Loader2,
} from "lucide-react";
import UpiPaymentDialog from "@/components/UpiPaymentDialog";

const features = [
  {
    icon: Shield,
    title: "Best Price Guarantee",
    description: "We match any lower price you find",
  },
  {
    icon: Clock,
    title: "Quick Booking",
    description: "Get instant confirmation",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "Help available round the clock",
  },
  {
    icon: CheckCircle,
    title: "Trusted Partners",
    description: "All major airlines covered",
  },
];

const airlines = [
  { name: "Air India", logo: "🇮🇳" },
  { name: "IndiGo", logo: "✈️" },
  { name: "SpiceJet", logo: "🌶️" },
  { name: "Vistara", logo: "⭐" },
  { name: "GoAir", logo: "🔵" },
  { name: "AirAsia", logo: "🔴" },
];

const Flights = () => {
  const [tripType, setTripType] = useState("round-trip");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departDate, setDepartDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [passengers, setPassengers] = useState("1");
  const [travelClass, setTravelClass] = useState("economy");

  // Popover open states for auto-close
  const [departDateOpen, setDepartDateOpen] = useState(false);
  const [returnDateOpen, setReturnDateOpen] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to || !departDate) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setShowContactModal(true);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await supabase.functions.invoke("send-enquiry-notification", {
        body: {
          type: "flight",
          name: contactForm.name,
          email: contactForm.email,
          phone: contactForm.phone,
          from,
          to,
          departDate: departDate ? format(departDate, "dd MMM yyyy") : "",
          returnDate: returnDate ? format(returnDate, "dd MMM yyyy") : "",
          passengers,
          travelClass,
        },
      });

      toast({
        title: "Ticket Enquiry Submitted!",
        description: "Our team will contact you shortly with the best train & flight options.",
      });
      setShowContactModal(false);
      setContactForm({ name: "", email: "", phone: "" });
    } catch (error) {
      console.error("Error:", error);
      toast({ title: "Failed to submit", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-primary text-sm font-medium mb-6">
              🚂 ✈️ Train & Flight Bookings
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Book <span className="text-primary">Train & Flight</span> Tickets
            </h1>
            <p className="text-muted-foreground text-lg">
              Compare prices across all major airlines and railways. Book your perfect
              journey with domestic and international options at unbeatable rates.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search Form */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl p-6 md:p-8 -mt-24 relative z-20 shadow-xl"
          >
            <form onSubmit={handleSearch} className="space-y-6">
              {/* Trip Type */}
              <div className="flex flex-wrap gap-4">
                <RadioGroup
                  value={tripType}
                  onValueChange={setTripType}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="one-way" id="one-way" />
                    <Label htmlFor="one-way">One Way</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="round-trip" id="round-trip" />
                    <Label htmlFor="round-trip">Round Trip</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="multi-city" id="multi-city" />
                    <Label htmlFor="multi-city">Multi City</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Search Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* From */}
                <div className="space-y-2">
                  <Label>From</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      placeholder="Departure city"
                      className="pl-10 bg-white text-gray-900 placeholder:text-gray-500"
                      required
                    />
                  </div>
                </div>

                {/* Swap Button */}
                <div className="hidden lg:flex items-end justify-center pb-2">
                  <button
                    type="button"
                    onClick={() => {
                      const temp = from;
                      setFrom(to);
                      setTo(temp);
                    }}
                    className="p-2 rounded-full bg-secondary hover:bg-primary/10 transition-colors"
                  >
                    <ArrowRightLeft className="h-4 w-4 text-primary" />
                  </button>
                </div>

                {/* To */}
                <div className="space-y-2">
                  <Label>To</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      placeholder="Arrival city"
                      className="pl-10 bg-white text-gray-900 placeholder:text-gray-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Departure</Label>
                  <Popover open={departDateOpen} onOpenChange={setDepartDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-white text-gray-900",
                          !departDate && "text-gray-500"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {departDate
                          ? format(departDate, "dd MMM yyyy")
                          : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={departDate}
                        onSelect={(date) => {
                          setDepartDate(date);
                          setDepartDateOpen(false);
                        }}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Return</Label>
                  <Popover open={returnDateOpen} onOpenChange={setReturnDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-white text-gray-900",
                          !returnDate && "text-gray-500"
                        )}
                        disabled={tripType === "one-way"}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {returnDate
                          ? format(returnDate, "dd MMM yyyy")
                          : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={returnDate}
                        onSelect={(date) => {
                          setReturnDate(date);
                          setReturnDateOpen(false);
                        }}
                        disabled={(date) =>
                          date < new Date() ||
                          (departDate ? date < departDate : false)
                        }
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Additional Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Passengers</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      min="1"
                      max="9"
                      value={passengers}
                      onChange={(e) => setPassengers(e.target.value)}
                      className="pl-10 bg-white text-gray-900"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Class</Label>
                  <RadioGroup
                    value={travelClass}
                    onValueChange={setTravelClass}
                    className="flex gap-4 pt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="economy" id="economy" />
                      <Label htmlFor="economy">Economy</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="business" id="business" />
                      <Label htmlFor="business">Business</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="flex items-end">
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    <Plane className="h-4 w-4 mr-2" />
                    Search Tickets
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-border rounded-xl p-6 text-center"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Airlines */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Partner Airlines
            </h2>
            <p className="text-muted-foreground mt-2">
              Book flights from all major domestic and international carriers.
            </p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-6">
            {airlines.map((airline, index) => (
              <motion.div
                key={airline.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-xl px-8 py-4 flex items-center gap-3"
              >
                <span className="text-2xl">{airline.logo}</span>
                <span className="font-medium text-foreground">
                  {airline.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* IRCTC Train Booking Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full text-orange-600 dark:text-orange-400 text-sm font-medium mb-4">
              🚂 Indian Railways
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              IRCTC Train Booking
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              We help you book confirmed train tickets across India. Get assistance with Tatkal bookings, 
              premium trains, and group reservations.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Train Booking Tips */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card border border-border rounded-2xl p-6 md:p-8"
            >
              <h3 className="font-display text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <span className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  💡
                </span>
                Train Booking Tips
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Book in Advance</p>
                    <p className="text-sm text-muted-foreground">Train bookings open 120 days before the journey date. Book early for confirmed tickets.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Tatkal Booking Timing</p>
                    <p className="text-sm text-muted-foreground">Tatkal bookings open at 10:00 AM for AC classes and 11:00 AM for non-AC classes, one day before journey.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Keep Documents Ready</p>
                    <p className="text-sm text-muted-foreground">Carry valid ID proof (Aadhaar, PAN, Passport, Voter ID) during travel for ticket verification.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Check PNR Status</p>
                    <p className="text-sm text-muted-foreground">Monitor your PNR status regularly. Waitlisted tickets may get confirmed closer to departure.</p>
                  </div>
                </li>
              </ul>
            </motion.div>

            {/* Train Classes & Services */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card border border-border rounded-2xl p-6 md:p-8"
            >
              <h3 className="font-display text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <span className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  🎫
                </span>
                Train Classes We Book
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/50 rounded-xl p-4">
                  <p className="font-semibold text-foreground">1A - First AC</p>
                  <p className="text-xs text-muted-foreground">Premium private cabins</p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-4">
                  <p className="font-semibold text-foreground">2A - Two Tier AC</p>
                  <p className="text-xs text-muted-foreground">Comfortable AC sleeper</p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-4">
                  <p className="font-semibold text-foreground">3A - Three Tier AC</p>
                  <p className="text-xs text-muted-foreground">Economical AC travel</p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-4">
                  <p className="font-semibold text-foreground">SL - Sleeper Class</p>
                  <p className="text-xs text-muted-foreground">Budget-friendly option</p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-4">
                  <p className="font-semibold text-foreground">CC - AC Chair Car</p>
                  <p className="text-xs text-muted-foreground">Day journey comfort</p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-4">
                  <p className="font-semibold text-foreground">EC - Executive Chair</p>
                  <p className="text-xs text-muted-foreground">Premium seating</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300 flex items-center gap-2">
                  <span>⚡</span> Tatkal & Premium Tatkal Available
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  We provide assistance with Tatkal and Premium Tatkal bookings for urgent travel needs.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Popular Train Routes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8"
          >
            <h3 className="font-display text-lg font-semibold text-foreground mb-4 text-center">
              Popular Train Routes from Gujarat
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                "Ahmedabad → Mumbai",
                "Rajkot → Delhi",
                "Surat → Pune",
                "Vadodara → Jaipur",
                "Junagadh → Ahmedabad",
                "Veraval → Mumbai",
                "Bhavnagar → Delhi",
                "Gandhinagar → Chennai"
              ].map((route, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-secondary border border-border rounded-full text-sm text-foreground hover:border-primary/50 transition-colors cursor-pointer"
                >
                  {route}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border border-primary/30 rounded-2xl p-8 md:p-12 text-center"
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              Need Help Booking Your Train or Flight?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our travel experts are available 24/7 to help you find the best
              train and flight deals and assist with your booking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="tel:+917005050020">
                <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                  <Phone className="h-4 w-4 mr-2" />
                  Call +91 70050 50020
                </Button>
              </a>
              <UpiPaymentDialog variant="outline" />
              <Button variant="outline" className="w-full sm:w-auto">
                Request Callback
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Modal */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Flight Enquiry</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleContactSubmit} className="space-y-4 mt-4">
            <div className="p-4 bg-secondary rounded-lg text-sm">
              <p><strong>Route:</strong> {from} → {to}</p>
              <p><strong>Date:</strong> {departDate ? format(departDate, "dd MMM yyyy") : ""} {returnDate && `- ${format(returnDate, "dd MMM yyyy")}`}</p>
              <p><strong>Passengers:</strong> {passengers} | <strong>Class:</strong> {travelClass}</p>
            </div>
            <div>
              <Label>Full Name *</Label>
              <Input value={contactForm.name} onChange={(e) => setContactForm({...contactForm, name: e.target.value})} required placeholder="Your name" className="bg-white text-gray-900 placeholder:text-gray-500" />
            </div>
            <div>
              <Label>Email *</Label>
              <Input type="email" value={contactForm.email} onChange={(e) => setContactForm({...contactForm, email: e.target.value})} required placeholder="your@email.com" className="bg-white text-gray-900 placeholder:text-gray-500" />
            </div>
            <div>
              <Label>Phone *</Label>
              <Input value={contactForm.phone} onChange={(e) => setContactForm({...contactForm, phone: e.target.value})} required placeholder="+91 98765 43210" className="bg-white text-gray-900 placeholder:text-gray-500" />
            </div>
            <Button type="submit" className="w-full bg-primary" disabled={submitting}>
              {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Submitting...</> : "Submit Enquiry"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Flights;
