import { motion } from "framer-motion";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-primary text-sm font-medium mb-6">
            ✨ Premium Travel Experiences
          </span>
          
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            Discover the World in
            <br />
            <span className="text-gradient-gold">Unparalleled Luxury</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Experience extraordinary journeys with our curated tours, premium taxi services, 
            and hassle-free flight bookings. Your dream vacation awaits.
          </p>
        </motion.div>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass-card rounded-2xl p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                <Input 
                  placeholder="Where to?" 
                  className="pl-10 h-12 bg-background border-border"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                <Input 
                  type="date"
                  className="pl-10 h-12 bg-background border-border"
                />
              </div>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                <Input 
                  placeholder="Travelers" 
                  className="pl-10 h-12 bg-background border-border"
                />
              </div>
              <Button className="h-12 bg-gradient-gold hover:opacity-90 text-primary-foreground font-semibold shadow-gold">
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-8 md:gap-16 mt-12"
        >
          {[
            { value: "15K+", label: "Happy Travelers" },
            { value: "500+", label: "Destinations" },
            { value: "98%", label: "Satisfaction Rate" },
            { value: "24/7", label: "Support" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-3xl md:text-4xl font-display font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-primary rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
};
