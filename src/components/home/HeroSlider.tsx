import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, Calendar, Car, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

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

export const HeroSlider = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

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
      setSlides(data || []);
    } catch (error) {
      console.error("Error fetching slides:", error);
      setSlides([]);
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
      <div className="relative z-10 container mx-auto px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
          >
            {/* Taxi Slide - Centered Layout */}
            {currentSlide.is_taxi_slide ? (
              <div className="text-center">
                {currentSlide.subtitle && (
                  <motion.span 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-primary text-sm font-medium mb-6"
                  >
                    {currentSlide.subtitle}
                  </motion.span>
                )}

                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight"
                >
                  {currentSlide.title.split(" ").slice(0, -2).join(" ")}
                  <br />
                  <span className="text-gradient-gold">
                    {currentSlide.title.split(" ").slice(-2).join(" ")}
                  </span>
                </motion.h1>

                {currentSlide.description && (
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
                  >
                    {currentSlide.description}
                  </motion.p>
                )}

                {/* Features */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap justify-center gap-4 mb-8"
                >
                  <div className="flex items-center gap-2 text-foreground">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Car className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">24/7 Available</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">All Gujarat</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">Best Rates</span>
                  </div>
                </motion.div>

                {/* Phone CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <a href="tel:+917005050020">
                    <Button className="h-14 px-8 bg-gradient-gold hover:opacity-90 text-primary-foreground font-semibold shadow-gold text-lg">
                      <Phone className="h-5 w-5 mr-2" />
                      Call Now: +91 70050 50020
                    </Button>
                  </a>
                </motion.div>
              </div>
            ) : (
              /* Regular Slides - Centered Layout */
              <div className="text-center">
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

                {currentSlide.button_text && currentSlide.button_link && (
                  <Link to={currentSlide.button_link}>
                    <Button className="h-14 px-8 bg-gradient-gold hover:opacity-90 text-primary-foreground font-semibold shadow-gold text-lg">
                      {currentSlide.button_text}
                    </Button>
                  </Link>
                )}
              </div>
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
