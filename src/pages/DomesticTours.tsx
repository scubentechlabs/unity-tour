import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { TourFilters } from "@/components/tours/TourFilters";
import { TourCard } from "@/components/tours/TourCard";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface TourPackage {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  state: string;
  category: string;
  duration_days: number;
  duration_nights: number;
  price_per_person: number;
  discounted_price: number | null;
  featured_image: string;
  is_featured: boolean;
  rating: number;
  total_reviews: number;
  highlights: string[];
}

const DomesticTours = () => {
  const [searchParams] = useSearchParams();
  const [tours, setTours] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    state: searchParams.get("state") || "",
    category: searchParams.get("category") || "",
    duration: searchParams.get("duration") || "",
    priceRange: searchParams.get("price") || "",
    search: searchParams.get("search") || "",
  });

  useEffect(() => {
    fetchTours();
  }, [filters]);

  const fetchTours = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("tour_packages")
        .select("*")
        .eq("tour_type", "domestic")
        .eq("is_active", true)
        .order("is_featured", { ascending: false })
        .order("rating", { ascending: false });

      if (filters.state) {
        query = query.eq("state", filters.state);
      }
      if (filters.category) {
        query = query.eq("category", filters.category as any);
      }
      if (filters.duration) {
        const [min, max] = filters.duration.split("-").map(Number);
        if (max) {
          query = query.gte("duration_days", min).lte("duration_days", max);
        } else {
          query = query.gte("duration_days", min);
        }
      }
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split("-").map(Number);
        if (max) {
          query = query.gte("price_per_person", min).lte("price_per_person", max);
        } else {
          query = query.gte("price_per_person", min);
        }
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,location.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      setTours(data || []);
    } catch (error) {
      console.error("Error fetching tours:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
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
              🇮🇳 Explore India
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Domestic <span className="text-primary">Tour Packages</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover the incredible diversity of India - from the snow-capped Himalayas to tropical beaches, 
              ancient temples to modern cities. Find your perfect getaway.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters and Tours Grid */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <TourFilters filters={filters} onFilterChange={setFilters} />
            </div>

            {/* Tours Grid */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : tours.length === 0 ? (
                <div className="text-center py-20 bg-card rounded-2xl border border-border">
                  <p className="text-muted-foreground text-lg">
                    No tours found matching your criteria.
                  </p>
                  <button
                    onClick={() => setFilters({ state: "", category: "", duration: "", priceRange: "", search: "" })}
                    className="mt-4 text-primary hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-muted-foreground">
                      Showing <span className="text-foreground font-medium">{tours.length}</span> tours
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {tours.map((tour, index) => (
                      <motion.div
                        key={tour.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <TourCard tour={tour} />
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DomesticTours;
