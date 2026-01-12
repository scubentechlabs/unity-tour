import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FiltersProps {
  filters: {
    state: string;
    category: string;
    duration: string;
    priceRange: string;
    search: string;
  };
  onFilterChange: (filters: any) => void;
}

const states = [
  "Delhi",
  "Rajasthan",
  "Kerala",
  "Goa",
  "Jammu & Kashmir",
  "Himachal Pradesh",
  "Uttarakhand",
  "Tamil Nadu",
  "Karnataka",
  "Maharashtra",
  "Andaman & Nicobar",
  "Ladakh",
];

const categories = [
  { value: "adventure", label: "Adventure" },
  { value: "honeymoon", label: "Honeymoon" },
  { value: "family", label: "Family" },
  { value: "pilgrimage", label: "Pilgrimage" },
  { value: "wildlife", label: "Wildlife" },
  { value: "beach", label: "Beach" },
  { value: "hill_station", label: "Hill Station" },
  { value: "heritage", label: "Heritage" },
];

const durations = [
  { value: "1-3", label: "1-3 Days" },
  { value: "4-6", label: "4-6 Days" },
  { value: "7-10", label: "7-10 Days" },
  { value: "10", label: "10+ Days" },
];

const priceRanges = [
  { value: "0-20000", label: "Under ₹20,000" },
  { value: "20000-35000", label: "₹20,000 - ₹35,000" },
  { value: "35000-50000", label: "₹35,000 - ₹50,000" },
  { value: "50000", label: "Above ₹50,000" },
];

export const TourFilters = ({ filters, onFilterChange }: FiltersProps) => {
  const handleChange = (key: string, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      state: "",
      category: "",
      duration: "",
      priceRange: "",
      search: "",
    });
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-lg font-semibold text-foreground">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-5">
        {/* Search */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tours..."
              value={filters.search}
              onChange={(e) => handleChange("search", e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
        </div>

        {/* State */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Destination</label>
          <Select value={filters.state} onValueChange={(v) => handleChange("state", v)}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="All States" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All States</SelectItem>
              {states.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
          <Select value={filters.category} onValueChange={(v) => handleChange("category", v)}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Duration */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Duration</label>
          <Select value={filters.duration} onValueChange={(v) => handleChange("duration", v)}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Any Duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any Duration</SelectItem>
              {durations.map((dur) => (
                <SelectItem key={dur.value} value={dur.value}>
                  {dur.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Budget</label>
          <Select value={filters.priceRange} onValueChange={(v) => handleChange("priceRange", v)}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Any Budget" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any Budget</SelectItem>
              {priceRanges.map((price) => (
                <SelectItem key={price.value} value={price.value}>
                  {price.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Apply Button (for mobile) */}
        <Button className="w-full lg:hidden bg-gradient-gold hover:opacity-90 text-primary-foreground font-semibold">
          Apply Filters
        </Button>
      </div>
    </div>
  );
};
