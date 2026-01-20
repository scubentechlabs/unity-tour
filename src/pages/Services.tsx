import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Car, 
  Bus, 
  Plane, 
  Hotel, 
  Users, 
  MapPin, 
  Globe, 
  FileText, 
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";

const vehicleCategories = [
  {
    title: "Sedan",
    icon: Car,
    description: "Comfortable sedans for city travel and short trips",
    vehicles: ["Maruti Suzuki Swift Dzire", "Hyundai Xcent", "Toyota Etios", "Honda Amaze", "Hyundai Aura"],
    gradient: "from-blue-500 to-blue-600",
  },
  {
    title: "SUV",
    icon: Car,
    description: "Spacious SUVs for family trips and group travel",
    vehicles: ["Maruti Suzuki Ertiga", "Toyota Rumion", "Toyota Innova", "Toyota Innova Crysta"],
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    title: "Tempo Traveller",
    icon: Bus,
    description: "Perfect for medium-sized groups and pilgrimages",
    vehicles: ["14 Seater Tempo Traveller", "17 Seater Tempo Traveller", "25 Seater Tempo Traveller"],
    gradient: "from-purple-500 to-pink-600",
  },
  {
    title: "SML Coaches",
    icon: Bus,
    description: "Large coaches for corporate events and big groups",
    vehicles: ["19 Seater SML Coach", "28 Seater SML Coach", "35 Seater SML Coach"],
    gradient: "from-orange-500 to-red-600",
  },
];

const travelServices = [
  {
    icon: MapPin,
    title: "Domestic Tours",
    description: "Explore the beauty of India with our curated domestic tour packages covering all major destinations.",
    link: "/domestic-tours",
  },
  {
    icon: Globe,
    title: "International Tours",
    description: "Discover world-renowned destinations with expertly planned international tour packages.",
    link: "/international-tours",
  },
  {
    icon: Hotel,
    title: "Hotel Bookings",
    description: "From budget-friendly stays to luxurious 5-star hotels, we arrange accommodations that suit your preferences.",
    link: "/contact",
  },
  {
    icon: Plane,
    title: "Air Ticket Booking",
    description: "Get the best deals on domestic and international flights with our hassle-free booking service.",
    link: "/flights",
  },
  {
    icon: FileText,
    title: "Visa Services",
    description: "Hassle-free visa processing and documentation assistance for international travel.",
    link: "/contact",
  },
  {
    icon: Users,
    title: "Group Bookings",
    description: "Special arrangements for corporate events, weddings, and large group travel with customized packages.",
    link: "/contact",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Services = () => {
  return (
    <Layout>
      <SEOHead
        title="Travel Services - Taxi Rental, Tours, Flights & Hotels in Gujarat"
        description="Unity Global Tours offers comprehensive travel services: taxi rental, domestic & international tour packages, flight bookings, hotel reservations, and visa assistance in Gujarat."
        canonicalPath="/services"
        keywords="Gujarat travel services, taxi rental Veraval, tour packages Gujarat, flight booking, hotel booking, visa services India"
      />
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-primary/10 via-background to-secondary overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-primary text-sm font-semibold tracking-wider uppercase">
              Our Services
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-3 mb-6">
              Complete Travel <span className="text-primary">Solutions</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              From vehicle rentals to tour packages, hotel bookings to visa services – 
              we provide end-to-end travel solutions for all your needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vehicle Rental Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-primary text-sm font-semibold tracking-wider uppercase">
              Vehicle Rental
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
              Choose Your <span className="text-primary">Perfect Ride</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We offer a wide range of vehicles for local trips, outstation journeys, 
              and airport transfers at competitive rates.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {vehicleCategories.map((category, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/50 hover:shadow-gold transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-5`}>
                  <category.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {category.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {category.description}
                </p>
                <ul className="space-y-2">
                  {category.vehicles.map((vehicle, vIndex) => (
                    <li key={vIndex} className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                      {vehicle}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-10"
          >
            <Link to="/taxi">
              <Button className="bg-gradient-gold hover:opacity-90 text-primary-foreground font-semibold shadow-gold">
                Book a Vehicle
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Travel Services Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-primary text-sm font-semibold tracking-wider uppercase">
              Travel Services
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
              Everything You Need for <span className="text-primary">Your Journey</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We offer comprehensive travel services to make your trip seamless and memorable.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {travelServices.map((service, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group"
              >
                <Link to={service.link}>
                  <div className="h-full bg-card border border-border rounded-2xl p-6 hover:border-primary/50 hover:shadow-gold transition-all duration-300">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {service.description}
                    </p>
                    <span className="inline-flex items-center text-primary text-sm font-medium">
                      Learn More
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Plan Your Trip?
            </h2>
            <p className="text-white/90 max-w-2xl mx-auto mb-8 text-lg">
              Contact us today for customized travel solutions tailored to your needs and budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold">
                  Contact Us
                </Button>
              </Link>
              <a href="tel:+917005050020">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-semibold">
                  Call: +91 70050 50020
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
