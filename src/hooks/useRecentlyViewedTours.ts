import { useState, useEffect, useCallback } from "react";

export interface RecentlyViewedTour {
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
  viewedAt: number;
}

const STORAGE_KEY = "recently-viewed-tours";
const MAX_ITEMS = 6;

export const useRecentlyViewedTours = () => {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedTour[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as RecentlyViewedTour[];
        // Sort by most recently viewed
        const sorted = parsed.sort((a, b) => b.viewedAt - a.viewedAt);
        setRecentlyViewed(sorted);
      }
    } catch (error) {
      console.error("Error loading recently viewed tours:", error);
    }
  }, []);

  // Add a tour to recently viewed
  const addTour = useCallback((tour: Omit<RecentlyViewedTour, "viewedAt">) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let tours: RecentlyViewedTour[] = stored ? JSON.parse(stored) : [];

      // Remove if already exists (will be re-added at top)
      tours = tours.filter((t) => t.id !== tour.id);

      // Add to beginning with timestamp
      const newTour: RecentlyViewedTour = {
        ...tour,
        viewedAt: Date.now(),
      };
      tours.unshift(newTour);

      // Keep only MAX_ITEMS
      tours = tours.slice(0, MAX_ITEMS);

      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tours));
      setRecentlyViewed(tours);
    } catch (error) {
      console.error("Error saving recently viewed tour:", error);
    }
  }, []);

  // Clear all recently viewed
  const clearAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setRecentlyViewed([]);
  }, []);

  return {
    recentlyViewed,
    addTour,
    clearAll,
  };
};
