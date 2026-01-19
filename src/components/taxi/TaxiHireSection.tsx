import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Vehicle {
  id: string;
  name: string;
  category: string;
  image_url: string | null;
  seating_capacity: number;
  base_price_per_km: number;
}

const TaxiHireSection = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from("taxi_vehicles")
        .select("id, name, category, image_url, seating_capacity, base_price_per_km")
        .eq("is_active", true)
        .order("base_price_per_km", { ascending: true });

      if (error) throw error;
      setVehicles(data || []);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  const visibleCount = typeof window !== 'undefined' ? (window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3) : 3;
  const maxIndex = Math.max(0, vehicles.length - visibleCount);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const handleBookNow = (vehicleId: string) => {
    navigate(`/taxi?vehicleId=${vehicleId}`);
  };

  const handleWhatsApp = (vehicleName: string) => {
    const message = encodeURIComponent(`Hi, I'm interested in hiring ${vehicleName}. Please share more details.`);
    window.open(`https://wa.me/919898989898?text=${message}`, "_blank");
  };

  if (loading || vehicles.length === 0) return null;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">
            Our Taxi For <span className="text-primary">Hire</span>
          </h2>

          <div className="relative">
            {/* Navigation Arrows */}
            {currentIndex > 0 && (
              <button
                onClick={handlePrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="h-6 w-6 text-gray-700" />
              </button>
            )}
            {currentIndex < maxIndex && (
              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="h-6 w-6 text-gray-700" />
              </button>
            )}

            {/* Vehicles Carousel */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-in-out gap-6"
                style={{
                  transform: `translateX(-${currentIndex * (100 / visibleCount + 2)}%)`,
                }}
              >
                {vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                  >
                    <div className="bg-card rounded-lg overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow">
                      {/* Image Container */}
                      <div className="relative h-48 bg-gradient-to-br from-yellow-400 to-yellow-300 overflow-hidden">
                        {/* Price Badge */}
                        <div className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm font-semibold">
                          ₹{vehicle.base_price_per_km.toFixed(2)}/ KM
                        </div>

                        {/* Promotional Text Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <p className="text-white font-bold text-lg leading-tight">
                            Hire {vehicle.name}
                            <br />
                            <span className="text-yellow-300">In Somnath</span>
                          </p>
                        </div>

                        {/* Vehicle Image */}
                        {vehicle.image_url ? (
                          <img
                            src={vehicle.image_url}
                            alt={vehicle.name}
                            className="w-full h-full object-contain object-center p-4"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Car className="h-20 w-20 text-yellow-600/50" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-display font-semibold text-foreground text-lg mb-4">
                          {vehicle.name} ({vehicle.seating_capacity}+1)
                        </h3>

                        <div className="flex items-center gap-4">
                          <Button
                            onClick={() => handleBookNow(vehicle.id)}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6"
                          >
                            Book Now
                          </Button>

                          <button
                            onClick={() => handleWhatsApp(vehicle.name)}
                            className="flex items-center gap-2 text-foreground font-medium hover:text-primary transition-colors"
                          >
                            <span>Chat Now</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="#25D366"
                              className="w-7 h-7"
                            >
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TaxiHireSection;
