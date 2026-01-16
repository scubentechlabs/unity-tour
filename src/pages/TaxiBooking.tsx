import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Car, MapPin, Calendar, Clock, Users, Briefcase, 
  Check, Phone, Mail, User, MessageSquare, ArrowRight,
  Fuel, Wind, ChevronRight
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Vehicle {
  id: string;
  name: string;
  category: string;
  image_url: string | null;
  seating_capacity: number;
  luggage_capacity: number;
  ac: boolean;
  fuel_type: string | null;
  base_price_per_km: number;
  base_price_per_day: number;
  features: string[] | null;
}

const tripTypes = [
  { value: "one-way", label: "One Way Trip", description: "Point to point travel" },
  { value: "round-trip", label: "Round Trip", description: "Go and return journey" },
  { value: "local", label: "Local Rental", description: "Hourly/daily rental in city" },
  { value: "airport", label: "Airport Transfer", description: "Airport pickup/drop" },
];

const TaxiBooking = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<"search" | "vehicles" | "booking" | "success">("search");
  
  // Search Form State
  const [tripType, setTripType] = useState(searchParams.get("type") || "one-way");
  const [pickupLocation, setPickupLocation] = useState(searchParams.get("pickup") || "");
  const [dropLocation, setDropLocation] = useState(searchParams.get("drop") || "");
  const [pickupDate, setPickupDate] = useState<Date | undefined>(
    searchParams.get("date") ? new Date(searchParams.get("date")!) : undefined
  );
  const [pickupTime, setPickupTime] = useState("09:00");
  const [returnDate, setReturnDate] = useState<Date>();
  const [passengers, setPassengers] = useState("2");
  
  // Booking Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from("taxi_vehicles")
        .select("*")
        .eq("is_active", true)
        .order("base_price_per_km", { ascending: true });
      
      if (error) throw error;
      setVehicles(data || []);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateEstimatedPrice = (vehicle: Vehicle) => {
    // Simple estimation based on trip type
    if (tripType === "local") {
      return vehicle.base_price_per_day;
    }
    // Assume average 100km for one-way, 200km for round trip
    const estimatedKm = tripType === "round-trip" ? 200 : 100;
    return vehicle.base_price_per_km * estimatedKm;
  };

  const handleSearchSubmit = () => {
    if (!pickupLocation || !pickupDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in pickup location and date",
        variant: "destructive",
      });
      return;
    }
    if (tripType !== "local" && !dropLocation) {
      toast({
        title: "Missing Information",
        description: "Please enter drop location",
        variant: "destructive",
      });
      return;
    }
    setStep("vehicles");
  };

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setStep("booking");
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedVehicle || !pickupDate) return;
    
    setSubmitting(true);
    try {
      const { error } = await supabase.from("taxi_enquiries").insert({
        vehicle_id: selectedVehicle.id,
        name,
        email,
        phone,
        pickup_location: pickupLocation,
        drop_location: dropLocation || null,
        trip_type: tripType,
        pickup_date: format(pickupDate, "yyyy-MM-dd"),
        pickup_time: pickupTime,
        return_date: returnDate ? format(returnDate, "yyyy-MM-dd") : null,
        passengers: parseInt(passengers),
        message: message || null,
        estimated_price: calculateEstimatedPrice(selectedVehicle),
      });

      if (error) throw error;

      // Send email notification to admin
      try {
        await supabase.functions.invoke("send-enquiry-notification", {
          body: {
            type: "taxi",
            name,
            email,
            phone,
            pickupLocation,
            dropLocation,
            tripType,
            travelDate: format(pickupDate, "dd MMM yyyy"),
            vehicleName: selectedVehicle.name,
            message,
          },
        });
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
      }

      // Go to success step
      setStep("success");
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewEnquiry = () => {
    setStep("search");
    setSelectedVehicle(null);
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setPickupLocation("");
    setDropLocation("");
    setPickupDate(undefined);
    setReturnDate(undefined);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-secondary to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Premium Cab Services
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Book Your <span className="text-primary">Perfect Ride</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Comfortable, reliable, and affordable taxi services for all your travel needs. 
              From city rides to outstation trips.
            </p>
          </motion.div>

          {/* Progress Steps */}
          {step !== "success" && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2">
                {[
                  { key: "search", label: "Trip Details" },
                  { key: "vehicles", label: "Select Vehicle" },
                  { key: "booking", label: "Your Details" },
                ].map((s, i) => (
                  <div key={s.key} className="flex items-center">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                        s.key === "search" && (step === "search" || step === "vehicles" || step === "booking")
                          ? "bg-primary text-primary-foreground"
                          : s.key === "vehicles" && (step === "vehicles" || step === "booking")
                          ? "bg-primary text-primary-foreground"
                          : s.key === "booking" && step === "booking"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {i + 1}
                    </div>
                    {i < 2 && (
                      <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Step 1: Search Form */}
          {step === "search" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-primary" />
                    Plan Your Journey
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Trip Type Selection */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {tripTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setTripType(type.value)}
                        className={cn(
                          "p-4 rounded-lg border text-left transition-all",
                          tripType === type.value
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <p className="font-medium text-foreground">{type.label}</p>
                        <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pickup Location */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        Pickup Location
                      </Label>
                      <Input
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        placeholder="Enter pickup city or address"
                        className="bg-white text-gray-900 placeholder:text-gray-500"
                      />
                    </div>

                    {/* Drop Location */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        Drop Location
                      </Label>
                      <Input
                        value={dropLocation}
                        onChange={(e) => setDropLocation(e.target.value)}
                        placeholder="Enter drop city or address"
                        disabled={tripType === "local"}
                        className="bg-white text-gray-900 placeholder:text-gray-500"
                      />
                    </div>

                    {/* Pickup Date */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        Pickup Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-white text-gray-900",
                              !pickupDate && "text-gray-500"
                            )}
                          >
                            {pickupDate ? format(pickupDate, "dd MMM yyyy") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={pickupDate}
                            onSelect={setPickupDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Pickup Time */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        Pickup Time
                      </Label>
                      <Select value={pickupTime} onValueChange={setPickupTime}>
                        <SelectTrigger className="bg-white text-gray-900">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => {
                            const hour = i.toString().padStart(2, "0");
                            return (
                              <SelectItem key={hour} value={`${hour}:00`}>
                                {hour}:00
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    {tripType === "round-trip" && (
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          Return Date
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                          <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal bg-white text-gray-900",
                                !returnDate && "text-gray-500"
                              )}
                            >
                              {returnDate ? format(returnDate, "dd MMM yyyy") : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={returnDate}
                              onSelect={setReturnDate}
                              disabled={(date) => date < (pickupDate || new Date())}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}

                    {/* Passengers */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        Passengers
                      </Label>
                      <Select value={passengers} onValueChange={setPassengers}>
                        <SelectTrigger className="bg-white text-gray-900">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? "Passenger" : "Passengers"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    onClick={handleSearchSubmit}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                  >
                    Search Available Vehicles
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Vehicle Selection */}
          {step === "vehicles" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    Select Your Vehicle
                  </h2>
                  <p className="text-muted-foreground">
                    {pickupLocation} → {dropLocation || "Local"} | {pickupDate && format(pickupDate, "dd MMM yyyy")}
                  </p>
                </div>
                <Button variant="outline" onClick={() => setStep("search")}>
                  Modify Search
                </Button>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                {["all", "sedan", "suv", "muv", "luxury"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      const el = document.getElementById(`category-${cat}`);
                      if (cat === "all") {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      } else if (el) {
                        el.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }}
                    className="px-4 py-2 rounded-full text-sm font-medium border border-border hover:border-primary hover:bg-primary/5 transition-colors capitalize"
                  >
                    {cat === "all" ? "All Vehicles" : cat}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="bg-card border-border animate-pulse">
                      <div className="h-44 bg-muted" />
                      <CardContent className="p-4 space-y-4">
                        <div className="h-6 bg-muted rounded w-3/4" />
                        <div className="h-4 bg-muted rounded w-1/2" />
                        <div className="flex gap-2">
                          <div className="h-6 bg-muted rounded w-16" />
                          <div className="h-6 bg-muted rounded w-16" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <>
                  {/* Group vehicles by category */}
                  {["sedan", "suv", "muv", "luxury"].map((category) => {
                    const categoryVehicles = vehicles
                      .filter((v) => v.category === category && v.seating_capacity >= parseInt(passengers));
                    
                    if (categoryVehicles.length === 0) return null;
                    
                    return (
                      <div key={category} id={`category-${category}`} className="mb-10">
                        <div className="flex items-center gap-3 mb-4">
                          <h3 className="font-display text-xl font-semibold text-foreground capitalize">
                            {category} Vehicles
                          </h3>
                          <Badge variant="secondary" className="text-xs">
                            {categoryVehicles.length} available
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                          {categoryVehicles.map((vehicle, index) => (
                            <motion.div
                              key={vehicle.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ y: -4, transition: { duration: 0.2 } }}
                              className="group"
                            >
                              <Card className="bg-card border-border overflow-hidden h-full flex flex-col hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                                {/* Image Section */}
                                <div className="relative h-44 overflow-hidden">
                                  <img
                                    src={vehicle.image_url || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400"}
                                    alt={vehicle.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                  <Badge className="absolute top-3 left-3 bg-white/90 text-foreground capitalize backdrop-blur-sm">
                                    {vehicle.category}
                                  </Badge>
                                  {vehicle.ac && (
                                    <Badge className="absolute top-3 right-3 bg-primary/90 text-primary-foreground backdrop-blur-sm">
                                      <Wind className="h-3 w-3 mr-1" />
                                      AC
                                    </Badge>
                                  )}
                                </div>

                                <CardContent className="p-4 flex-1 flex flex-col">
                                  {/* Vehicle Name */}
                                  <h4 className="font-display text-lg font-semibold text-foreground mb-1">
                                    {vehicle.name}
                                  </h4>
                                  
                                  {/* Fuel Type */}
                                  {vehicle.fuel_type && (
                                    <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                                      <Fuel className="h-3 w-3" />
                                      {vehicle.fuel_type}
                                    </p>
                                  )}
                                  
                                  {/* Specs Grid */}
                                  <div className="grid grid-cols-2 gap-2 mb-3">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg px-2 py-1.5">
                                      <Users className="h-4 w-4 text-primary" />
                                      <span>{vehicle.seating_capacity} Seats</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg px-2 py-1.5">
                                      <Briefcase className="h-4 w-4 text-primary" />
                                      <span>{vehicle.luggage_capacity} Bags</span>
                                    </div>
                                  </div>

                                  {/* Features */}
                                  {vehicle.features && vehicle.features.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-3">
                                      {vehicle.features.slice(0, 4).map((feature) => (
                                        <span 
                                          key={feature} 
                                          className="inline-flex items-center text-xs text-muted-foreground"
                                        >
                                          <Check className="h-3 w-3 mr-1 text-primary" />
                                          {feature}
                                        </span>
                                      ))}
                                    </div>
                                  )}

                                  {/* Pricing & CTA */}
                                  <div className="mt-auto pt-3 border-t border-border">
                                    <div className="flex items-end justify-between mb-3">
                                      <div>
                                        <p className="text-xs text-muted-foreground">Starting from</p>
                                        <p className="text-xl font-bold text-primary">
                                          ₹{calculateEstimatedPrice(vehicle).toLocaleString()}
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-xs text-muted-foreground">₹{vehicle.base_price_per_km}/km</p>
                                        <p className="text-xs text-muted-foreground">₹{vehicle.base_price_per_day}/day</p>
                                      </div>
                                    </div>
                                    <Button
                                      onClick={() => handleVehicleSelect(vehicle)}
                                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium group-hover:shadow-md transition-shadow"
                                    >
                                      Select This Vehicle
                                      <ArrowRight className="h-4 w-4 ml-2" />
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}

              {!loading && vehicles.filter((v) => v.seating_capacity >= parseInt(passengers)).length === 0 && (
                <Card className="bg-card border-border p-12 text-center">
                  <Car className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    No Vehicles Available
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    No vehicles available for {passengers} passengers. Please adjust your search criteria.
                  </p>
                  <Button variant="outline" onClick={() => setStep("search")}>
                    Modify Search
                  </Button>
                </Card>
              )}
            </motion.div>
          )}

          {/* Step 3: Booking Form */}
          {step === "booking" && selectedVehicle && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Booking Form */}
                <div className="lg:col-span-2">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        Contact Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleBookingSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="flex items-center gap-2">
                              <User className="h-4 w-4 text-primary" />
                              Full Name *
                            </Label>
                            <Input
                              id="name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Enter your name"
                              required
                              className="bg-white text-gray-900 placeholder:text-gray-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-primary" />
                              Phone Number *
                            </Label>
                            <Input
                              id="phone"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="Enter your phone"
                              required
                              className="bg-white text-gray-900 placeholder:text-gray-500"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email" className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-primary" />
                            Email Address *
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            className="bg-white text-gray-900 placeholder:text-gray-500"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="message" className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-primary" />
                            Special Requests (Optional)
                          </Label>
                          <Textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Any special requirements or instructions..."
                            className="bg-white text-gray-900 placeholder:text-gray-500"
                            rows={3}
                          />
                        </div>

                        <div className="flex gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setStep("vehicles")}
                            className="flex-1"
                          >
                            Back
                          </Button>
                          <Button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                          >
                            {submitting ? "Submitting..." : "Submit Enquiry"}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                {/* Booking Summary */}
                <div>
                  <Card className="bg-card border-border sticky top-24">
                    <CardHeader>
                      <CardTitle className="text-lg">Booking Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-3">
                        <img
                          src={selectedVehicle.image_url || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=100"}
                          alt={selectedVehicle.name}
                          className="w-20 h-16 object-cover rounded"
                        />
                        <div>
                          <p className="font-semibold text-foreground">{selectedVehicle.name}</p>
                          <p className="text-sm text-muted-foreground capitalize">{selectedVehicle.category}</p>
                        </div>
                      </div>

                      <div className="border-t border-border pt-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Trip Type</span>
                          <span className="text-foreground capitalize">{tripType.replace("-", " ")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Pickup</span>
                          <span className="text-foreground">{pickupLocation}</span>
                        </div>
                        {dropLocation && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Drop</span>
                            <span className="text-foreground">{dropLocation}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date</span>
                          <span className="text-foreground">
                            {pickupDate && format(pickupDate, "dd MMM yyyy")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Time</span>
                          <span className="text-foreground">{pickupTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Passengers</span>
                          <span className="text-foreground">{passengers}</span>
                        </div>
                      </div>

                      <div className="border-t border-border pt-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-foreground">Estimated Total</span>
                          <span className="text-2xl font-bold text-primary">
                            ₹{calculateEstimatedPrice(selectedVehicle).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Final price may vary based on actual distance
                        </p>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                        <p className="text-xs font-medium text-foreground flex items-center gap-1">
                          <Check className="h-3 w-3 text-primary" />
                          Free cancellation up to 24 hours
                        </p>
                        <p className="text-xs font-medium text-foreground flex items-center gap-1">
                          <Check className="h-3 w-3 text-primary" />
                          Professional drivers
                        </p>
                        <p className="text-xs font-medium text-foreground flex items-center gap-1">
                          <Check className="h-3 w-3 text-primary" />
                          24/7 customer support
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Success Message */}
          {step === "success" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto text-center"
            >
              <Card className="bg-card border-border p-8 md:p-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Thank You!
                </h2>
                <p className="text-lg text-muted-foreground mb-2">
                  Your enquiry has been submitted successfully.
                </p>
                <p className="text-muted-foreground mb-8">
                  Our team will connect with you soon to confirm your booking and provide the best rates.
                </p>
                
                <div className="bg-muted/50 rounded-lg p-6 mb-8 text-left">
                  <h3 className="font-semibold text-foreground mb-4">Enquiry Summary</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Name</p>
                      <p className="font-medium text-foreground">{name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium text-foreground">{phone}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Pickup</p>
                      <p className="font-medium text-foreground">{pickupLocation}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Drop</p>
                      <p className="font-medium text-foreground">{dropLocation || "Local"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Date</p>
                      <p className="font-medium text-foreground">{pickupDate && format(pickupDate, "dd MMM yyyy")}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Vehicle</p>
                      <p className="font-medium text-foreground">{selectedVehicle?.name}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    onClick={handleNewEnquiry}
                    variant="outline"
                    className="px-8"
                  >
                    Submit Another Enquiry
                  </Button>
                  <Button 
                    onClick={() => window.location.href = "/"}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                  >
                    Back to Home
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center text-foreground mb-12">
            Why Choose Our <span className="text-primary">Taxi Service</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Car, title: "Well Maintained Vehicles", desc: "Clean, sanitized and regularly serviced" },
              { icon: Users, title: "Professional Drivers", desc: "Verified, trained and courteous" },
              { icon: Clock, title: "24/7 Availability", desc: "Book anytime, travel anytime" },
              { icon: Check, title: "Transparent Pricing", desc: "No hidden charges, pay what you see" },
            ].map((feature) => (
              <motion.div
                key={feature.title}
                whileHover={{ y: -5 }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TaxiBooking;
