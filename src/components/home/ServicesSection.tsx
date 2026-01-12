import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Globe, Car, Plane, ArrowRight } from "lucide-react";

const services = [
  {
    icon: MapPin,
    title: "Domestic Tours",
    description: "Explore India's diverse landscapes, from serene beaches to majestic mountains. Curated packages for every traveler.",
    link: "/domestic-tours",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: Globe,
    title: "International Tours",
    description: "Discover world-renowned destinations with our expertly planned international tour packages.",
    link: "/international-tours",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    icon: Car,
    title: "Taxi Booking",
    description: "Premium cab services for local trips, outstation journeys, and airport transfers at competitive rates.",
    link: "/taxi",
    gradient: "from-purple-500 to-pink-600",
  },
  {
    icon: Plane,
    title: "Flight Tickets",
    description: "Get the best deals on domestic and international flights with our hassle-free booking service.",
    link: "/flights",
    gradient: "from-orange-500 to-red-600",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export const ServicesSection = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
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
            Our Services
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-4">
            Travel Solutions for <span className="text-primary">Every Need</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From domestic getaways to international adventures, we offer comprehensive travel 
            services designed to make your journey seamless and memorable.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="group"
            >
              <Link to={service.link}>
                <div className="h-full bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-gold">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-5`}>
                    <service.icon className="h-7 w-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {service.description}
                  </p>

                  {/* Link */}
                  <span className="inline-flex items-center text-primary text-sm font-medium">
                    Explore
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
