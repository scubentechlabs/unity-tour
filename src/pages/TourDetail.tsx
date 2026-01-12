import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { EnquiryModal } from "@/components/tours/EnquiryModal";
import { TourDetailSkeleton } from "@/components/skeletons/TourDetailSkeleton";
import { WishlistButton } from "@/components/WishlistButton";
import { supabase } from "@/integrations/supabase/client";
import { useRecentlyViewedTours } from "@/hooks/useRecentlyViewedTours";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Clock,
  Star,
  Users,
  Check,
  X,
  Calendar,
  Phone,
  Download,
  Share2,
} from "lucide-react";

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

interface TourPackage {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  state: string;
  country: string;
  category: string;
  duration_days: number;
  duration_nights: number;
  price_per_person: number;
  discounted_price: number | null;
  max_group_size: number;
  min_group_size: number;
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  highlights: string[];
  featured_image: string;
  images: string[];
  rating: number;
  total_reviews: number;
}

const TourDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const [tour, setTour] = useState<TourPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addTour } = useRecentlyViewedTours();

  // Determine tour type from URL
  const tourType = location.pathname.includes("/international-tours/") ? "international" : "domestic";

  useEffect(() => {
    if (slug) {
      fetchTour();
    }
  }, [slug]);

  const fetchTour = async () => {
    try {
      const { data, error } = await supabase
        .from("tour_packages")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

      if (error) throw error;
      const itineraryData = Array.isArray(data.itinerary) 
        ? (data.itinerary as unknown as ItineraryDay[]) 
        : [];
      const tourData = {
        ...data,
        itinerary: itineraryData,
      } as unknown as TourPackage;
      
      setTour(tourData);

      // Add to recently viewed
      addTour({
        id: tourData.id,
        title: tourData.title,
        slug: tourData.slug,
        location: tourData.location,
        featured_image: tourData.featured_image,
        price_per_person: tourData.price_per_person,
        discounted_price: tourData.discounted_price,
        duration_days: tourData.duration_days,
        duration_nights: tourData.duration_nights,
        tour_type: tourType,
      });
    } catch (error) {
      console.error("Error fetching tour:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <TourDetailSkeleton />;
  }

  if (!tour) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-2xl font-display font-bold text-foreground mb-4">Tour Not Found</h1>
          <Link to="/domestic-tours">
            <Button>Browse All Tours</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const displayPrice = tour.discounted_price || tour.price_per_person;
  const hasDiscount = tour.discounted_price && tour.discounted_price < tour.price_per_person;
  const allImages = [tour.featured_image, ...(tour.images || [])].filter(Boolean);

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-secondary border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-primary">Home</Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/domestic-tours" className="text-muted-foreground hover:text-primary">Domestic Tours</Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{tour.title}</span>
          </div>
        </div>
      </div>

      {/* Hero Gallery */}
      <section className="bg-background py-6">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Main Image */}
            <div className="relative h-80 md:h-[500px] rounded-2xl overflow-hidden">
              <img
                src={allImages[selectedImage] || "/placeholder.svg"}
                alt={tour.title}
                className="w-full h-full object-cover"
              />
              {hasDiscount && (
                <div className="absolute top-4 left-4 px-4 py-2 bg-destructive text-destructive-foreground font-semibold rounded-lg">
                  {Math.round(((tour.price_per_person - tour.discounted_price!) / tour.price_per_person) * 100)}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-2 gap-4">
              {allImages.slice(0, 4).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-36 md:h-60 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === index ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${tour.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {index === 3 && allImages.length > 4 && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                      <span className="text-foreground font-semibold">+{allImages.length - 4} more</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tour Info */}
      <section className="py-8 md:py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title & Meta */}
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-primary/20 text-primary text-sm font-medium rounded-full">
                    {tour.category.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 text-primary fill-primary" />
                    <span className="font-medium text-foreground">{tour.rating}</span>
                    <span className="text-muted-foreground">({tour.total_reviews} reviews)</span>
                  </div>
                </div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {tour.title}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    {tour.location}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    {tour.duration_days} Days / {tour.duration_nights} Nights
                  </span>
                  <span className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    {tour.min_group_size}-{tour.max_group_size} People
                  </span>
                </div>
              </div>

              {/* Highlights */}
              {tour.highlights && tour.highlights.length > 0 && (
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-4">Tour Highlights</h3>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {tour.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full justify-start bg-card border border-border rounded-xl p-1 h-auto flex-wrap">
                  <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="itinerary" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    Itinerary
                  </TabsTrigger>
                  <TabsTrigger value="inclusions" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    Inclusions
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <div className="prose prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed">{tour.description}</p>
                  </div>
                </TabsContent>

                <TabsContent value="itinerary" className="mt-6">
                  <div className="space-y-4">
                    {(tour.itinerary as ItineraryDay[])?.map((day, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-card border border-border rounded-xl p-5"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-primary font-bold">{day.day}</span>
                          </div>
                          <div>
                            <h4 className="font-display font-semibold text-foreground mb-2">{day.title}</h4>
                            <p className="text-muted-foreground text-sm">{day.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="inclusions" className="mt-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Inclusions */}
                    <div>
                      <h4 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-500" />
                        What's Included
                      </h4>
                      <ul className="space-y-3">
                        {tour.inclusions?.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-muted-foreground">
                            <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Exclusions */}
                    <div>
                      <h4 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                        <X className="h-5 w-5 text-destructive" />
                        What's Not Included
                      </h4>
                      <ul className="space-y-3">
                        {tour.exclusions?.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-muted-foreground">
                            <X className="h-4 w-4 text-destructive mt-1 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
                {/* Price */}
                <div className="mb-6">
                  <span className="text-muted-foreground text-sm">Starting from</span>
                  <div className="flex items-end gap-2">
                    <span className="font-display text-4xl font-bold text-primary">
                      ₹{displayPrice.toLocaleString()}
                    </span>
                    {hasDiscount && (
                      <span className="text-muted-foreground text-lg line-through">
                        ₹{tour.price_per_person.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <span className="text-muted-foreground text-sm">per person</span>
                </div>

                {/* Quick Info */}
                <div className="space-y-3 py-6 border-y border-border mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="text-foreground font-medium">{tour.duration_days}D / {tour.duration_nights}N</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Group Size</span>
                    <span className="text-foreground font-medium">{tour.min_group_size}-{tour.max_group_size} People</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Location</span>
                    <span className="text-foreground font-medium">{tour.state}</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-gradient-gold hover:opacity-90 text-primary-foreground font-semibold shadow-gold h-12"
                    onClick={() => setIsEnquiryOpen(true)}
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    Send Enquiry
                  </Button>
                  <a href="tel:+919876543210" className="block">
                    <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground h-12">
                      <Phone className="h-5 w-5 mr-2" />
                      Call Now
                    </Button>
                  </a>
                </div>

                {/* Share & Save */}
                <div className="flex gap-3 mt-6 pt-6 border-t border-border">
                  <Button variant="ghost" size="sm" className="flex-1 text-muted-foreground">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
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
                    variant="button"
                    className="flex-1"
                  />
                  <Button variant="ghost" size="sm" className="flex-1 text-muted-foreground">
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-border text-center">
                  <p className="text-muted-foreground text-xs">
                    ✓ Best Price Guarantee • ✓ 24/7 Support • ✓ Secure Booking
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enquiry Modal */}
      <EnquiryModal 
        isOpen={isEnquiryOpen} 
        onClose={() => setIsEnquiryOpen(false)} 
        tour={tour}
      />
    </Layout>
  );
};

export default TourDetail;
