import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    id: 1,
    name: "Jignesh Baraiya",
    location: "Veraval",
    avatar: "",
    rating: 5,
    tour: "Dwarka Darshan",
    review: "We booked a taxi from Veraval to Dwarka for our family's pilgrimage. The driver was punctual and very knowledgeable about the temples. Unity Global Tours made our spiritual journey comfortable and hassle-free.",
  },
  {
    id: 2,
    name: "Meera Trivedi",
    location: "Rajkot",
    avatar: "",
    rating: 5,
    tour: "Gir Safari Trip",
    review: "Planned our Gir National Park visit through Unity Global Tours. They arranged safari permits, comfortable stay at Sasan Gir, and even helped us spot Asiatic lions! Excellent service from start to finish.",
  },
  {
    id: 3,
    name: "Hitesh Solanki",
    location: "Ahmedabad",
    avatar: "",
    rating: 5,
    tour: "Somnath-Diu Package",
    review: "My family visited Somnath temple and Diu beaches on a 3-day package. Everything was well organized - hotel bookings, vehicle, and timing. Will definitely book again for our next Gujarat trip.",
  },
  {
    id: 4,
    name: "Kavita Mehta",
    location: "Junagadh",
    avatar: "",
    rating: 5,
    tour: "Airport Transfer",
    review: "Needed an airport pickup from Rajkot for my parents. The car arrived on time and the driver helped with all the luggage. Very reliable service. I always recommend Unity Global Tours to my friends.",
  },
  {
    id: 5,
    name: "Ramesh Chudasama",
    location: "Porbandar",
    avatar: "",
    rating: 5,
    tour: "Kashmir Honeymoon",
    review: "Booked our honeymoon package to Kashmir. Unity Global Tours handled everything from flights to hotels to local sightseeing. The houseboat stay in Srinagar was the highlight. Thank you for making our trip special!",
  },
];

export const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 md:py-28 bg-secondary/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold tracking-wider uppercase">
            Testimonials
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-4">
            What Our <span className="text-primary">Travelers Say</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real stories from real travelers. See why thousands choose Unity Global Tours for their adventures.
          </p>
        </motion.div>

        {/* Testimonials Slider */}
        <div className="max-w-4xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="bg-card border border-border rounded-2xl p-8 md:p-12"
            >
              {/* Quote Icon */}
              <Quote className="h-12 w-12 text-primary/20 mb-6" />

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-primary fill-primary" />
                ))}
              </div>

              {/* Review */}
              <p className="text-lg md:text-xl text-foreground leading-relaxed mb-8">
                "{testimonials[currentIndex].review}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">
                    {testimonials[currentIndex].name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-display font-semibold text-foreground">
                    {testimonials[currentIndex].name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonials[currentIndex].location} • {testimonials[currentIndex].tour}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              className="rounded-full border-border hover:border-primary hover:text-primary"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? "w-6 bg-primary" : "bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="rounded-full border-border hover:border-primary hover:text-primary"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
