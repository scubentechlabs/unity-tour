import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { TourCard } from "@/components/tours/TourCard";
import { TourGridSkeleton } from "@/components/skeletons/TourCardSkeleton";
import { supabase } from "@/integrations/supabase/client";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TourPackage {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  country: string;
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

const countries = [
  "Thailand", "Singapore", "Dubai", "Maldives", "Bali", "Malaysia",
  "Sri Lanka", "Vietnam", "Nepal", "Bhutan", "Switzerland", "France",
  "Italy", "Greece", "Turkey", "Japan", "Australia", "New Zealand"
];

const categories = [
  { value: "adventure", label: "Adventure" },
  { value: "honeymoon", label: "Honeymoon" },
  { value: "family", label: "Family" },
  { value: "beach", label: "Beach" },
  { value: "heritage", label: "Heritage" },
];

const InternationalTours = () => {
  const [searchParams] = useSearchParams();
  const [tours, setTours] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    country: searchParams.get("country") || "",
    category: searchParams.get("category") || "",
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
        .eq("tour_type", "international")
        .eq("is_active", true)
        .order("is_featured", { ascending: false })
        .order("rating", { ascending: false });

      if (filters.country) {
        query = query.eq("country", filters.country);
      }
      if (filters.category) {
        query = query.eq("category", filters.category as any);
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,location.ilike.%${filters.search}%,country.ilike.%${filters.search}%`);
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

  const clearFilters = () => {
    setFilters({ country: "", category: "", search: "" });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
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
              🌍 Explore The World
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              International <span className="text-primary">Tour Packages</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover breathtaking destinations across the globe. From exotic beaches to 
              historic cities, find your dream international vacation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters and Tours Grid */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-6 mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Filter Tours</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  placeholder="Search tours..."
                  className="pl-10"
                />
              </div>
              <Select 
                value={filters.country || "all"} 
                onValueChange={(v) => setFilters({ ...filters, country: v === "all" ? "" : v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select 
                value={filters.category || "all"} 
                onValueChange={(v) => setFilters({ ...filters, category: v === "all" ? "" : v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </motion.div>

          {/* Tours Grid */}
          {loading ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="h-5 w-40 bg-muted animate-pulse rounded" />
              </div>
              <TourGridSkeleton count={8} />
            </div>
          ) : tours.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-2xl border border-border">
              <p className="text-muted-foreground text-lg">
                No international tours found matching your criteria.
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 text-primary hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <p className="text-muted-foreground">
                  Showing <span className="text-foreground font-medium">{tours.length}</span> international tours
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tours.map((tour, index) => (
                  <motion.div
                    key={tour.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <TourCard tour={tour} tourType="international" />
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default InternationalTours;
