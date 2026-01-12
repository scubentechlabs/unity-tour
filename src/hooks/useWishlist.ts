import { useState, useEffect, useCallback } from "react";

export interface WishlistTour {
  id: string;
  title: string;
  slug: string;
  location: string;
  featured_image: string;
  price_per_person: number;
  discounted_price: number | null;
  duration_days: number;
  duration_nights: number;
  tour_type: "domestic" | "international";
  rating: number;
  addedAt: number;
}

const STORAGE_KEY = "tour-wishlist";

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<WishlistTour[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as WishlistTour[];
        setWishlist(parsed);
      }
    } catch (error) {
      console.error("Error loading wishlist:", error);
    }
  }, []);

  // Check if a tour is in wishlist
  const isInWishlist = useCallback((tourId: string) => {
    return wishlist.some((t) => t.id === tourId);
  }, [wishlist]);

  // Add a tour to wishlist
  const addToWishlist = useCallback((tour: Omit<WishlistTour, "addedAt">) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let tours: WishlistTour[] = stored ? JSON.parse(stored) : [];

      // Check if already exists
      if (tours.some((t) => t.id === tour.id)) {
        return; // Already in wishlist
      }

      // Add to beginning with timestamp
      const newTour: WishlistTour = {
        ...tour,
        addedAt: Date.now(),
      };
      tours.unshift(newTour);

      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tours));
      setWishlist(tours);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  }, []);

  // Remove a tour from wishlist
  const removeFromWishlist = useCallback((tourId: string) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let tours: WishlistTour[] = stored ? JSON.parse(stored) : [];

      tours = tours.filter((t) => t.id !== tourId);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(tours));
      setWishlist(tours);
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  }, []);

  // Toggle wishlist status
  const toggleWishlist = useCallback((tour: Omit<WishlistTour, "addedAt">) => {
    if (isInWishlist(tour.id)) {
      removeFromWishlist(tour.id);
      return false;
    } else {
      addToWishlist(tour);
      return true;
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist]);

  // Clear all wishlist
  const clearWishlist = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setWishlist([]);
  }, []);

  return {
    wishlist,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    wishlistCount: wishlist.length,
  };
};
