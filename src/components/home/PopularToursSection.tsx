import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Clock, Star, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { TourCardSkeleton } from "@/components/skeletons/TourCardSkeleton";

interface TourPackage {
  id: string;
  title: string;
  slug: string;
  location: string;
  duration_days: number;
  duration_nights: number;
  price_per_person: number;
  discounted_price: number | null;
  rating: number;
  total_reviews: number;
  featured_image: string | null;
  images: string[];
  is_featured: boolean;
  tour_type: "domestic" | "international";
  category: string;
}

const categoryLabels: Record<string, string> = {
  adventure: "Adventure",
  cultural: "Cultural",
  wildlife: "Wildlife",
  pilgrimage: "Pilgrimage",
  honeymoon: "Honeymoon",
  family: "Family",
  beach: "Beach",
  hill_station: "Hill Station",
};

export const PopularToursSection = () => {
  const [tours, setTours] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedTours = async () => {
      try {
        const { data, error } = await supabase
          .from("tour_packages")
          .select("*")
          .eq("is_active", true)
          .eq("is_featured", true)
          .order("rating", { ascending: false })
          .limit(6);

        if (error) throw error;
        setTours(data || []);
      } catch (error) {
        console.error("Error fetching featured tours:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTours();
  }, []);

  const getTagLabel = (tour: TourPackage) => {
    if (tour.discounted_price && tour.discounted_price < tour.price_per_person) {
      const discount = Math.round(((tour.price_per_person - tour.discounted_price) / tour.price_per_person) * 100);
      return `${discount}% Off`;
    }
    return categoryLabels[tour.category] || "Featured";
  };

  const getTourUrl = (tour: TourPackage) => {
    const baseUrl = tour.tour_type === "international" ? "/international-tours" : "/domestic-tours";
    return `${baseUrl}/${tour.slug}`;
  };

  const getDisplayPrice = (tour: TourPackage) => {
    return tour.discounted_price || tour.price_per_person;
  };

  const getImage = (tour: TourPackage) => {
    return tour.featured_image || (tour.images && tour.images.length > 0 ? tour.images[0] : "/placeholder.svg");
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
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <TourCardSkeleton key={i} />
            ))}
          </div>
        ) : tours.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No featured tours available at the moment.</p>
            <Link to="/domestic-tours">
              <Button className="mt-4 bg-gradient-gold hover:opacity-90">
                Browse All Tours
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour, index) => (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Link to={getTourUrl(tour)}>
                  <div className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-gold">
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={getImage(tour)}
                        alt={tour.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                          {getTagLabel(tour)}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-lg">
                        <Star className="h-4 w-4 text-primary fill-primary" />
                        <span className="text-sm font-medium text-foreground">{tour.rating || 0}</span>
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
                          {tour.duration_days}D / {tour.duration_nights}N
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {tour.total_reviews || 0} reviews
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div>
                          <span className="text-muted-foreground text-xs">Starting from</span>
                          <p className="text-primary font-display text-xl font-bold">
                            ₹{getDisplayPrice(tour).toLocaleString()}
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
        )}
      </div>
    </section>
  );
};
