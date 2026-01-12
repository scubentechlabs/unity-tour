import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist, WishlistTour } from "@/hooks/useWishlist";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  tour: Omit<WishlistTour, "addedAt">;
  variant?: "icon" | "button";
  className?: string;
}

export const WishlistButton = ({ tour, variant = "icon", className }: WishlistButtonProps) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(tour.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(tour);
    
    if (added) {
      toast.success("Added to wishlist!", {
        description: tour.title,
      });
    } else {
      toast.info("Removed from wishlist", {
        description: tour.title,
      });
    }
  };

  if (variant === "button") {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        className={cn(
          "text-muted-foreground hover:text-foreground",
          isWishlisted && "text-red-500 hover:text-red-600",
          className
        )}
      >
        <Heart className={cn("h-4 w-4 mr-2", isWishlisted && "fill-current")} />
        {isWishlisted ? "Saved" : "Save"}
      </Button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200",
        "bg-background/80 backdrop-blur-sm hover:bg-background",
        isWishlisted ? "text-red-500" : "text-muted-foreground hover:text-foreground",
        className
      )}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart className={cn("h-5 w-5", isWishlisted && "fill-current")} />
    </button>
  );
};
