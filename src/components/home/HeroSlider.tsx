import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, Calendar, Car, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string;
  button_text: string | null;
  button_link: string | null;
  display_order: number;
  is_taxi_slide?: boolean;
}

// Static taxi booking slide
const taxiSlide: HeroSlide = {
  id: "taxi-booking-slide",
  title: "Book Your Taxi Ride",
  subtitle: "🚖 Reliable Cab Service",
  description: "Comfortable and affordable taxi services across Gujarat. Book your ride now for a hassle-free journey!",
  image_url: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920&q=80",
  button_text: null,
  button_link: null,
  display_order: 0,
  is_taxi_slide: true,
};

export const HeroSlider = () => {
  const navigate = useNavigate();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Taxi form state
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [taxiDate, setTaxiDate] = useState<Date>();
  const [tripType, setTripType] = useState("one-way");

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const { data, error } = await supabase
        .from("hero_slides")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      // Add taxi slide at the beginning
      setSlides([taxiSlide, ...(data || [])]);
    } catch (error) {
      console.error("Error fetching slides:", error);
      setSlides([taxiSlide]);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-advance slides
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [slides.length, nextSlide]);

  const handleTaxiSearch = () => {
    const params = new URLSearchParams();
    if (pickupLocation) params.set("pickup", pickupLocation);
    if (dropLocation) params.set("drop", dropLocation);
    if (taxiDate) params.set("date", format(taxiDate, "yyyy-MM-dd"));
    if (tripType) params.set("type", tripType);
    navigate(`/taxi?${params.toString()}`);
  };

  if (loading) {
    return (
      <section className="relative min-h-[90vh] flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="relative min-h-[90vh] flex items-center justify-center bg-background">
        <p className="text-muted-foreground">No slides available</p>
      </section>
    );
  }

  const currentSlide = slides[currentIndex];

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${currentSlide.image_url}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
          >
            {currentSlide.subtitle && (
              <span className="inline-block px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-primary text-sm font-medium mb-6">
                {currentSlide.subtitle}
              </span>
            )}

            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              {currentSlide.title.split(" ").slice(0, -2).join(" ")}
              <br />
              <span className="text-gradient-gold">
                {currentSlide.title.split(" ").slice(-2).join(" ")}
              </span>
            </h1>

            {currentSlide.description && (
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                {currentSlide.description}
              </p>
            )}

            {/* Taxi Booking Form - Only show on taxi slide */}
            {currentSlide.is_taxi_slide && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="max-w-4xl mx-auto bg-card/95 backdrop-blur-md rounded-2xl shadow-xl border border-border p-6"
              >
                {/* Trip Type Selection */}
                <div className="flex justify-center gap-6 mb-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="heroTripType"
                      value="one-way"
                      checked={tripType === "one-way"}
                      onChange={(e) => setTripType(e.target.value)}
                      className="text-primary accent-primary"
                    />
                    <span className="text-sm font-medium text-foreground">One Way</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="heroTripType"
                      value="round-trip"
                      checked={tripType === "round-trip"}
                      onChange={(e) => setTripType(e.target.value)}
                      className="text-primary accent-primary"
                    />
                    <span className="text-sm font-medium text-foreground">Round Trip</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="heroTripType"
                      value="local"
                      checked={tripType === "local"}
                      onChange={(e) => setTripType(e.target.value)}
                      className="text-primary accent-primary"
                    />
                    <span className="text-sm font-medium text-foreground">Local Rental</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Pickup Location */}
                  <div className="space-y-2 text-left">
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      Pickup Location
                    </label>
                    <Input
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      placeholder="Enter pickup city"
                      className="bg-background border-border h-11"
                    />
                  </div>

                  {/* Drop Location */}
                  <div className="space-y-2 text-left">
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      Drop Location
                    </label>
                    <Input
                      value={dropLocation}
                      onChange={(e) => setDropLocation(e.target.value)}
                      placeholder="Enter drop city"
                      className="bg-background border-border h-11"
                      disabled={tripType === "local"}
                    />
                  </div>

                  {/* Travel Date */}
                  <div className="space-y-2 text-left">
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Calendar className="h-4 w-4 text-primary" />
                      Travel Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-background border-border h-11",
                            !taxiDate && "text-muted-foreground"
                          )}
                        >
                          {taxiDate ? format(taxiDate, "dd/MM/yyyy") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={taxiDate}
                          onSelect={setTaxiDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Search Button */}
                  <div className="flex items-end">
                    <Button
                      onClick={handleTaxiSearch}
                      className="w-full bg-gradient-gold hover:opacity-90 text-primary-foreground font-semibold h-11 shadow-gold"
                    >
                      <Car className="h-4 w-4 mr-2" />
                      Book Now
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Regular slide button */}
            {!currentSlide.is_taxi_slide && currentSlide.button_text && currentSlide.button_link && (
              <Link to={currentSlide.button_link}>
                <Button className="h-14 px-8 bg-gradient-gold hover:opacity-90 text-primary-foreground font-semibold shadow-gold text-lg">
                  {currentSlide.button_text}
                </Button>
              </Link>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Slide Indicators */}
        <div className="flex justify-center gap-3 mt-12">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-primary"
                  : "w-2 bg-primary/30 hover:bg-primary/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 bg-background/50 backdrop-blur-sm border border-border rounded-full text-foreground hover:bg-primary hover:text-primary-foreground transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 bg-background/50 backdrop-blur-sm border border-border rounded-full text-foreground hover:bg-primary hover:text-primary-foreground transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
    </section>
  );
};
