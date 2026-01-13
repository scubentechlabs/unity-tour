import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { 
  Users, 
  Award, 
  Globe, 
  Heart, 
  Target, 
  Eye,
  CheckCircle,
  MapPin
} from "lucide-react";

const stats = [
  { value: "10+", label: "Years Experience" },
  { value: "25K+", label: "Happy Travelers" },
  { value: "100+", label: "Destinations" },
  { value: "24/7", label: "Customer Support" },
];

const values = [
  {
    icon: Heart,
    title: "Customer First",
    description: "Your satisfaction is our top priority. We go above and beyond to ensure every trip exceeds expectations.",
  },
  {
    icon: Award,
    title: "Quality Assured",
    description: "We partner only with verified hotels, trusted drivers, and experienced guides to deliver premium experiences.",
  },
  {
    icon: Globe,
    title: "Expert Knowledge",
    description: "Our team has traveled extensively and brings firsthand experience to help plan your perfect journey.",
  },
  {
    icon: Users,
    title: "Personal Touch",
    description: "Every itinerary is customized to your preferences, ensuring a unique and memorable travel experience.",
  },
];

const services = [
  "Local and Outstation Taxi Services",
  "Airport Transfers",
  "Pilgrimage Tours (Somnath, Dwarka, etc.)",
  "Customised Tour Packages",
  "Corporate Travel Solutions",
  "Domestic & International Tours",
];

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
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
              About Us
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Your Journey, <span className="text-primary">Our Passion</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              We are dedicated to creating unforgettable travel experiences that 
              inspire, connect, and transform. Discover the world with Unity Global Tours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-display font-bold text-primary">
                  {stat.value}
                </p>
                <p className="text-muted-foreground mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary font-medium">Our Story</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                Your Trusted Travel Partner
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Unity Global Tours is a dedicated tour and travel company specializing in 
                  well-planned, comfortable, and affordable travel solutions. Whether you're 
                  traveling for leisure, business, education, or religious purposes, we ensure 
                  every journey is seamless and memorable.
                </p>
                <p>
                  Based in Veraval, Gujarat, we serve travelers across Somnath, Diu, Talala, 
                  Sasan-Gir, Dwarka, Rajkot, Hirasar Airport, Jamnagar, Bhavnagar, Morbi, 
                  and Ahmedabad. Our extensive network allows us to provide reliable services 
                  across Gujarat and beyond.
                </p>
                <p>
                  From local taxi services to international tour packages, we bring expertise 
                  and personalized attention to every booking. Our team is committed to making 
                  global travel accessible and stress-free for all our customers.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1522199710521-72d69614c702?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Team planning a trip"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-xl shadow-lg">
                <p className="text-3xl font-bold">10+</p>
                <p className="text-sm opacity-90">Years of Excellence</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card border border-border rounded-2xl p-8"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Target className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                Our Mission
              </h3>
              <p className="text-muted-foreground">
                To deliver high-quality travel experiences that combine comfort, reliability, 
                and value. We aim to make global travel accessible and stress-free, ensuring 
                every journey exceeds expectations and creates lasting memories.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-2xl p-8"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Eye className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                Our Vision
              </h3>
              <p className="text-muted-foreground">
                To become a globally recognized travel brand known for integrity, innovation, 
                and personalized service. We strive to bring people together through travel 
                and create meaningful connections across cultures.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <span className="text-primary font-medium">Our Values</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
              What We Stand For
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <span className="text-primary font-medium">Our Services</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
              What We Offer
            </h2>
            <p className="text-muted-foreground mt-4">
              Comprehensive travel solutions for all your needs.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {services.map((service, index) => (
              <motion.div
                key={service}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground">
                  {service}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary font-medium">Why Choose Us</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                Experience the Unity Global Difference
              </h2>
              <div className="space-y-4">
                {[
                  "Handpicked destinations and verified accommodations",
                  "Flexible booking and cancellation policies",
                  "24/7 customer support throughout your journey",
                  "Transparent pricing with no hidden costs",
                  "Customized itineraries tailored to your preferences",
                  "Experienced local guides and trusted partners",
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Happy travelers"
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
