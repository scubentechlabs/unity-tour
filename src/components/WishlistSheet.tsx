import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, Clock, MapPin, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useWishlist, WishlistTour } from "@/hooks/useWishlist";
import { Badge } from "@/components/ui/badge";

export const WishlistSheet = () => {
  const { wishlist, removeFromWishlist, clearWishlist, wishlistCount } = useWishlist();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Heart className="h-5 w-5" />
          {wishlistCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground text-xs"
            >
              {wishlistCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              My Wishlist ({wishlistCount})
            </SheetTitle>
            {wishlistCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearWishlist}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="py-4">
          {wishlistCount === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Your wishlist is empty</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Save tours you love by clicking the heart icon
              </p>
              <Button asChild onClick={() => setIsOpen(false)}>
                <Link to="/domestic-tours">Explore Tours</Link>
              </Button>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="space-y-4">
                {wishlist.map((tour) => (
                  <WishlistItem
                    key={tour.id}
                    tour={tour}
                    onRemove={() => removeFromWishlist(tour.id)}
                    onClose={() => setIsOpen(false)}
                  />
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

const WishlistItem = ({ 
  tour, 
  onRemove, 
  onClose 
}: { 
  tour: WishlistTour; 
  onRemove: () => void;
  onClose: () => void;
}) => {
  const tourPath = tour.tour_type === "international" 
    ? `/international-tours/${tour.slug}` 
    : `/domestic-tours/${tour.slug}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-card border border-border rounded-xl overflow-hidden"
    >
      <div className="flex gap-3 p-3">
        {/* Image */}
        <Link to={tourPath} onClick={onClose} className="flex-shrink-0">
          <div className="w-20 h-20 rounded-lg overflow-hidden">
            <img
              src={tour.featured_image || "/placeholder.svg"}
              alt={tour.title}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <Link to={tourPath} onClick={onClose}>
            <h4 className="font-medium text-foreground text-sm line-clamp-2 hover:text-primary transition-colors">
              {tour.title}
            </h4>
          </Link>
          <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{tour.location}</span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {tour.duration_days}D/{tour.duration_nights}N
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3 text-primary fill-primary" />
              {tour.rating}
            </span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-primary font-bold text-sm">
              ₹{(tour.discounted_price || tour.price_per_person).toLocaleString()}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
