import { motion } from "framer-motion";
import { 
  Shield, 
  Clock, 
  Award, 
  Headphones, 
  CreditCard, 
  MapPin 
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "100% secure payments and data protection for all your bookings.",
  },
  {
    icon: Clock,
    title: "Best Price Guarantee",
    description: "We offer competitive prices with no hidden charges.",
  },
  {
    icon: Award,
    title: "Handpicked Tours",
    description: "Each tour is carefully curated by our travel experts.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Round-the-clock assistance for all your travel needs.",
  },
  {
    icon: CreditCard,
    title: "Easy Payments",
    description: "Multiple payment options including EMI and pay later.",
  },
  {
    icon: MapPin,
    title: "Local Expertise",
    description: "Expert local guides who know every destination inside out.",
  },
];

export const WhyChooseUsSection = () => {
  return (
    <section className="py-20 md:py-28 bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary text-sm font-semibold tracking-wider uppercase">
              Why Choose Us
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
              Your Journey, Our <span className="text-primary">Passion</span>
            </h2>
            <p className="text-muted-foreground mb-8">
              Since 2014, Unity Global Tours has been helping travelers from Veraval and across 
              Gujarat create unforgettable memories. Our commitment to excellence, attention to 
              detail, and personalized service sets us apart as Saurashtra's trusted travel partner.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { value: "10+", label: "Years Since 2014" },
                { value: "25K+", label: "Happy Travelers" },
                { value: "150+", label: "Destinations" },
              ].map((stat, index) => (
                <div key={index} className="text-center p-4 bg-card rounded-xl border border-border">
                  <p className="font-display text-2xl md:text-3xl font-bold text-primary">
                    {stat.value}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Features Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-5 bg-card rounded-xl border border-border hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                  <feature.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-display text-base font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
