import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Clock, Star, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const popularTours = [
  {
    id: 1,
    title: "Golden Triangle Tour",
    location: "Delhi - Agra - Jaipur",
    duration: "6 Days / 5 Nights",
    price: 24999,
    rating: 4.9,
    reviews: 245,
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tag: "Bestseller",
  },
  {
    id: 2,
    title: "Kerala Backwaters Escape",
    location: "Kochi - Munnar - Alleppey",
    duration: "5 Days / 4 Nights",
    price: 29999,
    rating: 4.8,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tag: "Popular",
  },
  {
    id: 3,
    title: "Goa Beach Paradise",
    location: "North & South Goa",
    duration: "4 Days / 3 Nights",
    price: 18999,
    rating: 4.7,
    reviews: 312,
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tag: "Budget Friendly",
  },
  {
    id: 4,
    title: "Kashmir Valley Dream",
    location: "Srinagar - Pahalgam - Gulmarg",
    duration: "7 Days / 6 Nights",
    price: 35999,
    rating: 4.9,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1597074866923-dc0589150358?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tag: "Premium",
  },
  {
    id: 5,
    title: "Rajasthan Royal Heritage",
    location: "Jaipur - Udaipur - Jodhpur",
    duration: "8 Days / 7 Nights",
    price: 42999,
    rating: 4.8,
    reviews: 198,
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tag: "Luxury",
  },
  {
    id: 6,
    title: "Andaman Islands Explorer",
    location: "Port Blair - Havelock - Neil",
    duration: "6 Days / 5 Nights",
    price: 38999,
    rating: 4.9,
    reviews: 134,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tag: "Adventure",
  },
];

export const PopularToursSection = () => {
  return (
    <section className="py-20 md:py-28 bg-secondary/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12"
        >
          <div>
            <span className="text-primary text-sm font-semibold tracking-wider uppercase">
              Featured Tours
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-4">
              Popular <span className="text-primary">Destinations</span>
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Handpicked tour packages loved by thousands of travelers. Start your adventure today.
            </p>
          </div>
          <Link to="/domestic-tours">
            <Button variant="outline" className="mt-4 md:mt-0 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              View All Tours
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </motion.div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularTours.map((tour, index) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <Link to={`/domestic-tours/${tour.id}`}>
                <div className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-gold">
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={tour.image}
                      alt={tour.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                        {tour.tag}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-lg">
                      <Star className="h-4 w-4 text-primary fill-primary" />
                      <span className="text-sm font-medium text-foreground">{tour.rating}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      {tour.location}
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {tour.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {tour.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {tour.reviews} reviews
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <span className="text-muted-foreground text-xs">Starting from</span>
                        <p className="text-primary font-display text-xl font-bold">
                          ₹{tour.price.toLocaleString()}
                        </p>
                      </div>
                      <Button size="sm" className="bg-gradient-gold hover:opacity-90 text-primary-foreground">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
