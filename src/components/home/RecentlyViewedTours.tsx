import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRecentlyViewedTours, RecentlyViewedTour } from "@/hooks/useRecentlyViewedTours";

export const RecentlyViewedTours = () => {
  const { recentlyViewed, clearAll } = useRecentlyViewedTours();

  if (recentlyViewed.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <span className="text-primary text-sm font-semibold tracking-wider uppercase">
              Continue Exploring
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mt-2">
              Recently Viewed
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {recentlyViewed.map((tour, index) => (
            <RecentlyViewedCard key={tour.id} tour={tour} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const RecentlyViewedCard = ({ tour, index }: { tour: RecentlyViewedTour; index: number }) => {
  const tourPath = tour.tour_type === "international" 
    ? `/international-tours/${tour.slug}` 
    : `/domestic-tours/${tour.slug}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link to={tourPath} className="group block">
        <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-gold">
          {/* Image */}
          <div className="relative h-28 md:h-32 overflow-hidden">
            <img
              src={tour.featured_image || "/placeholder.svg"}
              alt={tour.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute bottom-2 left-2 right-2">
              <p className="text-primary font-bold text-sm truncate">
                ₹{(tour.discounted_price || tour.price_per_person).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-3">
            <h3 className="font-medium text-foreground text-sm line-clamp-2 group-hover:text-primary transition-colors mb-1">
              {tour.title}
            </h3>
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{tour.location}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1">
              <Clock className="h-3 w-3" />
              <span>{tour.duration_days}D/{tour.duration_nights}N</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
