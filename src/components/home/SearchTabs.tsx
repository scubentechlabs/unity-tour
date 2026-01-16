import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Users, Car, Plane, Mountain, Globe, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type TabType = "domestic" | "international" | "taxi";

const tabs = [
  { id: "taxi" as TabType, label: "Taxi Booking", icon: Car },
  { id: "domestic" as TabType, label: "Domestic Tours", icon: Mountain },
  { id: "international" as TabType, label: "International Tours", icon: Globe },
];

const domesticDestinations = [
  "Goa", "Kerala", "Rajasthan", "Kashmir", "Himachal", "Andaman", 
  "Uttarakhand", "Tamil Nadu", "Maharashtra", "Karnataka"
];

const internationalDestinations = [
  "Thailand", "Singapore", "Dubai", "Maldives", "Bali", "Malaysia",
  "Sri Lanka", "Vietnam", "Nepal", "Bhutan"
];

export const SearchTabs = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("taxi");
  
  // Domestic Tour State
  const [domesticDestination, setDomesticDestination] = useState("");
  const [domesticDate, setDomesticDate] = useState<Date>();
  const [domesticTravelers, setDomesticTravelers] = useState("2");

  // International Tour State
  const [internationalDestination, setInternationalDestination] = useState("");
  const [internationalDate, setInternationalDate] = useState<Date>();
  const [internationalTravelers, setInternationalTravelers] = useState("2");

  // Taxi State
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [taxiDate, setTaxiDate] = useState<Date>();
  const [tripType, setTripType] = useState("one-way");

  const handleDomesticSearch = () => {
    const params = new URLSearchParams();
    if (domesticDestination) params.set("destination", domesticDestination);
    if (domesticDate) params.set("date", format(domesticDate, "yyyy-MM-dd"));
    if (domesticTravelers) params.set("travelers", domesticTravelers);
    navigate(`/domestic-tours?${params.toString()}`);
  };

  const handleInternationalSearch = () => {
    const params = new URLSearchParams();
    if (internationalDestination) params.set("destination", internationalDestination);
    if (internationalDate) params.set("date", format(internationalDate, "yyyy-MM-dd"));
    if (internationalTravelers) params.set("travelers", internationalTravelers);
    navigate(`/international-tours?${params.toString()}`);
  };

  const handleTaxiSearch = () => {
    const params = new URLSearchParams();
    if (pickupLocation) params.set("pickup", pickupLocation);
    if (dropLocation) params.set("drop", dropLocation);
    if (taxiDate) params.set("date", format(taxiDate, "yyyy-MM-dd"));
    if (tripType) params.set("type", tripType);
    navigate(`/taxi?${params.toString()}`);
  };

  return (
    <section className="relative z-20 py-12 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden"
        >
          {/* Tabs */}
          <div className="flex border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <tab.icon className="h-5 w-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {/* Domestic Tours Tab */}
              {activeTab === "domestic" && (
                <motion.div
                  key="domestic"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4"
                >
                  {/* Destination */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      Destination
                    </label>
                    <Select value={domesticDestination} onValueChange={setDomesticDestination}>
                      <SelectTrigger className="bg-white text-gray-900 border-border">
                        <SelectValue placeholder="Select destination" />
                      </SelectTrigger>
                      <SelectContent>
                        {domesticDestinations.map((dest) => (
                          <SelectItem key={dest} value={dest}>{dest}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Travel Date */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Calendar className="h-4 w-4 text-primary" />
                      Travel Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-white text-gray-900 border-border",
                            !domesticDate && "text-gray-500"
                          )}
                        >
                          {domesticDate ? format(domesticDate, "dd/MM/yyyy") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={domesticDate}
                          onSelect={setDomesticDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Travelers */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Users className="h-4 w-4 text-primary" />
                      Travelers
                    </label>
                    <Select value={domesticTravelers} onValueChange={setDomesticTravelers}>
                      <SelectTrigger className="bg-white text-gray-900 border-border">
                        <SelectValue placeholder="Select travelers" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? "Traveler" : "Travelers"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Search Button */}
                  <div className="flex items-end">
                    <Button
                      onClick={handleDomesticSearch}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-10"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Search Tours
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* International Tours Tab */}
              {activeTab === "international" && (
                <motion.div
                  key="international"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4"
                >
                  {/* Destination */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Globe className="h-4 w-4 text-primary" />
                      Country
                    </label>
                    <Select value={internationalDestination} onValueChange={setInternationalDestination}>
                      <SelectTrigger className="bg-white text-gray-900 border-border">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {internationalDestinations.map((dest) => (
                          <SelectItem key={dest} value={dest}>{dest}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Travel Date */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Calendar className="h-4 w-4 text-primary" />
                      Travel Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-white text-gray-900 border-border",
                            !internationalDate && "text-gray-500"
                          )}
                        >
                          {internationalDate ? format(internationalDate, "dd/MM/yyyy") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={internationalDate}
                          onSelect={setInternationalDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Travelers */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Users className="h-4 w-4 text-primary" />
                      Travelers
                    </label>
                    <Select value={internationalTravelers} onValueChange={setInternationalTravelers}>
                      <SelectTrigger className="bg-white text-gray-900 border-border">
                        <SelectValue placeholder="Select travelers" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? "Traveler" : "Travelers"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Search Button */}
                  <div className="flex items-end">
                    <Button
                      onClick={handleInternationalSearch}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-10"
                    >
                      <Plane className="h-4 w-4 mr-2" />
                      Search Tours
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Taxi Booking Tab */}
              {activeTab === "taxi" && (
                <motion.div
                  key="taxi"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {/* Trip Type Selection */}
                  <div className="flex gap-4 mb-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="tripType"
                        value="one-way"
                        checked={tripType === "one-way"}
                        onChange={(e) => setTripType(e.target.value)}
                        className="text-primary"
                      />
                      <span className="text-sm text-foreground">One Way</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="tripType"
                        value="round-trip"
                        checked={tripType === "round-trip"}
                        onChange={(e) => setTripType(e.target.value)}
                        className="text-primary"
                      />
                      <span className="text-sm text-foreground">Round Trip</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="tripType"
                        value="local"
                        checked={tripType === "local"}
                        onChange={(e) => setTripType(e.target.value)}
                        className="text-primary"
                      />
                      <span className="text-sm text-foreground">Local Rental</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Pickup Location */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <MapPin className="h-4 w-4 text-primary" />
                        Pickup Location
                      </label>
                      <Input
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        placeholder="Enter pickup city"
                        className="bg-white text-gray-900 border-border placeholder:text-gray-500"
                      />
                    </div>

                    {/* Drop Location */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <MapPin className="h-4 w-4 text-primary" />
                        Drop Location
                      </label>
                      <Input
                        value={dropLocation}
                        onChange={(e) => setDropLocation(e.target.value)}
                        placeholder="Enter drop city"
                        className="bg-white text-gray-900 border-border placeholder:text-gray-500"
                        disabled={tripType === "local"}
                      />
                    </div>

                    {/* Travel Date */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <Calendar className="h-4 w-4 text-primary" />
                        Travel Date
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-white text-gray-900 border-border",
                              !taxiDate && "text-gray-500"
                            )}
                          >
                            {taxiDate ? format(taxiDate, "dd/MM/yyyy") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={taxiDate}
                            onSelect={setTaxiDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Search Button */}
                    <div className="flex items-end">
                      <Button
                        onClick={handleTaxiSearch}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-10"
                      >
                        <Car className="h-4 w-4 mr-2" />
                        Search Cabs
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
