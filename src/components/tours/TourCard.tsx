import { Link } from "react-router-dom";
import { MapPin, Clock, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WishlistButton } from "@/components/WishlistButton";

interface TourCardProps {
  tour: {
    id: string;
    title: string;
    slug: string;
    location: string;
    category: string;
    duration_days: number;
    duration_nights: number;
    price_per_person: number;
    discounted_price: number | null;
    featured_image: string;
    is_featured: boolean;
    rating: number;
    total_reviews: number;
  };
  tourType?: "domestic" | "international";
}

const categoryLabels: Record<string, string> = {
  adventure: "Adventure",
  honeymoon: "Honeymoon",
  family: "Family",
  pilgrimage: "Pilgrimage",
  wildlife: "Wildlife",
  beach: "Beach",
  hill_station: "Hill Station",
  heritage: "Heritage",
};

export const TourCard = ({ tour, tourType = "domestic" }: TourCardProps) => {
  const displayPrice = tour.discounted_price || tour.price_per_person;
  const hasDiscount = tour.discounted_price && tour.discounted_price < tour.price_per_person;
  const discountPercent = hasDiscount
    ? Math.round(((tour.price_per_person - tour.discounted_price!) / tour.price_per_person) * 100)
    : 0;

  const tourPath = tourType === "international" 
    ? `/international-tours/${tour.slug}` 
    : `/domestic-tours/${tour.slug}`;

  return (
    <Link to={tourPath}>
      <div className="group h-full bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-gold">
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          <img
            src={tour.featured_image || "/placeholder.svg"}
            alt={tour.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            {tour.is_featured && (
              <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                Featured
              </span>
            )}
            {hasDiscount && (
              <span className="px-3 py-1 bg-destructive text-destructive-foreground text-xs font-semibold rounded-full">
                {discountPercent}% OFF
              </span>
            )}
          </div>
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <WishlistButton
              tour={{
                id: tour.id,
                title: tour.title,
                slug: tour.slug,
                location: tour.location,
                featured_image: tour.featured_image,
                price_per_person: tour.price_per_person,
                discounted_price: tour.discounted_price,
                duration_days: tour.duration_days,
                duration_nights: tour.duration_nights,
                tour_type: tourType,
                rating: tour.rating,
              }}
            />
          </div>
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <span className="px-2 py-1 bg-background/80 backdrop-blur-sm text-xs font-medium text-foreground rounded">
              {categoryLabels[tour.category] || tour.category}
            </span>
            <span className="flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
              <Star className="h-3 w-3 text-primary fill-primary" />
              <span className="text-xs font-medium text-foreground">{tour.rating}</span>
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <MapPin className="h-4 w-4 text-primary" />
            {tour.location}
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {tour.title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {tour.duration_days}D / {tour.duration_nights}N
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {tour.total_reviews} reviews
            </span>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              <span className="text-muted-foreground text-xs">Starting from</span>
              <div className="flex items-center gap-2">
                <p className="text-primary font-display text-xl font-bold">
                  ₹{displayPrice.toLocaleString()}
                </p>
                {hasDiscount && (
                  <span className="text-muted-foreground text-sm line-through">
                    ₹{tour.price_per_person.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
            <Button size="sm" className="bg-gradient-gold hover:opacity-90 text-primary-foreground">
              View Details
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};
