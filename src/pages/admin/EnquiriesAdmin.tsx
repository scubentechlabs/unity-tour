import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  Eye, 
  Trash2, 
  Phone, 
  Mail, 
  Calendar, 
  Users, 
  MapPin,
  MessageSquare,
  Search,
  Download,
  IndianRupee,
  Car,
  Plane,
  Globe,
  Home,
  ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface TourPackage {
  id: string;
  title: string;
  slug: string;
  tour_type: string;
}

interface TourEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  travel_date: string | null;
  adults: number | null;
  children: number | null;
  status: "pending" | "quoted" | "confirmed" | "completed" | "cancelled";
  quoted_price: number | null;
  admin_notes: string | null;
  tour_package_id: string | null;
  user_id: string | null;
  created_at: string;
  updated_at: string;
  tour_packages?: TourPackage | null;
}

interface TaxiEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  pickup_location: string;
  drop_location: string | null;
  pickup_date: string;
  pickup_time: string | null;
  return_date: string | null;
  trip_type: string;
  passengers: number | null;
  status: string;
  quoted_price: number | null;
  admin_notes: string | null;
  created_at: string;
  taxi_vehicles?: { name: string } | null;
}

interface FlightEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  trip_type: string;
  departure_city: string;
  arrival_city: string;
  departure_date: string;
  return_date: string | null;
  passengers: number;
  class: string;
  status: string;
  quoted_price: number | null;
  admin_notes: string | null;
  created_at: string;
}

const statusOptions = [
  { value: "pending", label: "Pending", color: "bg-amber-100 text-amber-800 border-amber-200" },
  { value: "quoted", label: "Quoted", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { value: "confirmed", label: "Confirmed", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  { value: "completed", label: "Completed", color: "bg-green-100 text-green-800 border-green-200" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800 border-red-200" },
];

const EnquiriesAdmin = () => {
  const [domesticEnquiries, setDomesticEnquiries] = useState<TourEnquiry[]>([]);
  const [internationalEnquiries, setInternationalEnquiries] = useState<TourEnquiry[]>([]);
  const [taxiEnquiries, setTaxiEnquiries] = useState<TaxiEnquiry[]>([]);
  const [flightEnquiries, setFlightEnquiries] = useState<FlightEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<string>("");
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false);
  const [quoteEnquiry, setQuoteEnquiry] = useState<any>(null);
  const [quoteType, setQuoteType] = useState<string>("");
  const [quotePrice, setQuotePrice] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("taxi");
  
  const [editStatus, setEditStatus] = useState<string>("");
  const [editQuotedPrice, setEditQuotedPrice] = useState<string>("");
  const [editAdminNotes, setEditAdminNotes] = useState<string>("");
  
  const { toast } = useToast();

  useEffect(() => {
    fetchAllEnquiries();
  }, []);

  const fetchAllEnquiries = async () => {
    try {
      const [tourRes, taxiRes, flightRes] = await Promise.all([
        supabase
          .from("tour_enquiries")
          .select(`*, tour_packages (id, title, slug, tour_type)`)
          .order("created_at", { ascending: false }),
        supabase
          .from("taxi_enquiries")
          .select(`*, taxi_vehicles(name)`)
          .order("created_at", { ascending: false }),
        supabase
          .from("flight_enquiries")
          .select(`*`)
          .order("created_at", { ascending: false }),
      ]);

      if (tourRes.error) throw tourRes.error;
      if (taxiRes.error) throw taxiRes.error;
      if (flightRes.error) throw flightRes.error;

      const allTourEnquiries = (tourRes.data as unknown as TourEnquiry[]) || [];
      setDomesticEnquiries(allTourEnquiries.filter(e => e.tour_packages?.tour_type === "domestic"));
      setInternationalEnquiries(allTourEnquiries.filter(e => e.tour_packages?.tour_type === "international"));
      setTaxiEnquiries((taxiRes.data as unknown as TaxiEnquiry[]) || []);
      setFlightEnquiries((flightRes.data as unknown as FlightEnquiry[]) || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (enquiry: any, type: string) => {
    setSelectedEnquiry(enquiry);
    setSelectedType(type);
    setEditStatus(enquiry.status);
    setEditQuotedPrice(enquiry.quoted_price?.toString() || "");
    setEditAdminNotes(enquiry.admin_notes || "");
    setIsDetailOpen(true);
  };

  const getTableName = (type: string) => {
    switch (type) {
      case "taxi": return "taxi_enquiries";
      case "flight": return "flight_enquiries";
      default: return "tour_enquiries";
    }
  };

  const handleUpdateEnquiry = async () => {
    if (!selectedEnquiry) return;
    setSaving(true);

    const tableName = getTableName(selectedType);
    const statusChanged = editStatus !== selectedEnquiry.status;

    try {
      const { error } = await supabase
        .from(tableName)
        .update({
          status: editStatus,
          quoted_price: editQuotedPrice ? parseFloat(editQuotedPrice) : null,
          admin_notes: editAdminNotes || null,
        })
        .eq("id", selectedEnquiry.id);

      if (error) throw error;
      
      if (statusChanged && editStatus !== "pending") {
        await sendStatusNotification(selectedEnquiry, selectedType, editStatus, editQuotedPrice ? parseFloat(editQuotedPrice) : null);
      }
      
      toast({ title: "Success", description: "Enquiry updated successfully" });
      setIsDetailOpen(false);
      fetchAllEnquiries();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const sendStatusNotification = async (enquiry: any, type: string, newStatus: string, quotedPrice?: number | null) => {
    try {
      const notificationType = type === "taxi" ? "taxi-status-update" : type === "flight" ? "flight-status-update" : "tour-status-update";
      
      const body: any = {
        type: notificationType,
        name: enquiry.name,
        email: enquiry.email,
        phone: enquiry.phone,
        oldStatus: enquiry.status,
        newStatus: newStatus,
        quotedPrice: quotedPrice || enquiry.quoted_price
      };

      if (type === "taxi") {
        body.pickupLocation = enquiry.pickup_location;
        body.dropLocation = enquiry.drop_location;
        body.tripType = enquiry.trip_type;
        body.travelDate = enquiry.pickup_date ? format(new Date(enquiry.pickup_date), "dd MMM yyyy") : undefined;
        body.vehicleName = enquiry.taxi_vehicles?.name;
      } else if (type === "flight") {
        body.departureCity = enquiry.departure_city;
        body.arrivalCity = enquiry.arrival_city;
        body.travelDate = enquiry.departure_date ? format(new Date(enquiry.departure_date), "dd MMM yyyy") : undefined;
        body.passengers = enquiry.passengers;
        body.flightClass = enquiry.class;
      } else {
        body.tourName = enquiry.tour_packages?.title;
        body.travelDate = enquiry.travel_date ? format(new Date(enquiry.travel_date), "dd MMM yyyy") : undefined;
        body.adults = enquiry.adults;
        body.children = enquiry.children;
      }

      await supabase.functions.invoke("send-enquiry-notification", { body });
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
  };

  const handleQuickStatusUpdate = async (id: string, newStatus: string, type: string, enquiry: any) => {
    if (newStatus === "quoted") {
      setQuoteEnquiry(enquiry);
      setQuoteType(type);
      setQuotePrice(enquiry.quoted_price?.toString() || "");
      setIsQuoteDialogOpen(true);
      return;
    }
    
    const tableName = getTableName(type);
    
    try {
      const { error } = await supabase
        .from(tableName)
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      
      if (newStatus !== "pending") {
        await sendStatusNotification(enquiry, type, newStatus);
        toast({ title: "Status updated", description: "Customer notified via email" });
      } else {
        toast({ title: "Status updated" });
      }
      
      fetchAllEnquiries();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleSubmitQuote = async () => {
    if (!quoteEnquiry) return;
    
    const price = quotePrice ? parseFloat(quotePrice) : null;
    
    if (!price || price <= 0) {
      toast({ title: "Error", description: "Please enter a valid quoted price", variant: "destructive" });
      return;
    }
    
    setSaving(true);
    const tableName = getTableName(quoteType);
    
    try {
      const { error } = await supabase
        .from(tableName)
        .update({ status: "quoted", quoted_price: price })
        .eq("id", quoteEnquiry.id);

      if (error) throw error;
      
      await sendStatusNotification(quoteEnquiry, quoteType, "quoted", price);
      toast({ title: "Quote sent!", description: `₹${price.toLocaleString()} quote sent to ${quoteEnquiry.email}` });
      
      setIsQuoteDialogOpen(false);
      setQuoteEnquiry(null);
      setQuotePrice("");
      fetchAllEnquiries();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, type: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;

    const tableName = getTableName(type);

    try {
      const { error } = await supabase.from(tableName).delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Deleted", description: "Enquiry deleted successfully" });
      fetchAllEnquiries();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const getStatusColor = (status: string) => {
    return statusOptions.find(s => s.value === status)?.color || "bg-gray-100 text-gray-600";
  };

  const filterEnquiries = (enquiries: any[]) => {
    return enquiries.filter(e => {
      const matchesStatus = filterStatus === "all" || e.status === filterStatus;
      const matchesSearch = searchQuery === "" || 
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.phone.includes(searchQuery);
      return matchesStatus && matchesSearch;
    });
  };

  const stats = {
    taxi: taxiEnquiries.length,
    domestic: domesticEnquiries.length,
    international: internationalEnquiries.length,
    flight: flightEnquiries.length,
    total: taxiEnquiries.length + domesticEnquiries.length + internationalEnquiries.length + flightEnquiries.length,
    pending: [...taxiEnquiries, ...domesticEnquiries, ...internationalEnquiries, ...flightEnquiries].filter(e => e.status === "pending").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#008060]" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">All Enquiries</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Manage all booking enquiries in one place
          </p>
        </div>
        {stats.pending > 0 && (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 px-2 sm:px-3 py-1 sm:py-1.5 text-xs self-start sm:self-auto">
            {stats.pending} pending
          </Badge>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl sm:text-3xl font-bold">{stats.taxi}</p>
                <p className="text-[10px] sm:text-sm text-orange-100">Taxi</p>
              </div>
              <Car className="h-6 w-6 sm:h-8 sm:w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl sm:text-3xl font-bold">{stats.domestic}</p>
                <p className="text-[10px] sm:text-sm text-emerald-100">Domestic</p>
              </div>
              <Home className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl sm:text-3xl font-bold">{stats.international}</p>
                <p className="text-[10px] sm:text-sm text-purple-100">International</p>
              </div>
              <Globe className="h-6 w-6 sm:h-8 sm:w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-sky-500 to-sky-600 text-white border-0">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl sm:text-3xl font-bold">{stats.flight}</p>
                <p className="text-[10px] sm:text-sm text-sky-100">Flight</p>
              </div>
              <Plane className="h-6 w-6 sm:h-8 sm:w-8 text-sky-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="pl-10 border-gray-300 focus:border-[#008060] bg-white text-sm"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-40 border-gray-300 bg-white text-sm">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statusOptions.map(s => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-3 sm:space-y-4">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-gray-100">
          <TabsTrigger value="taxi" className="flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            <Car className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Taxi</span>
            <Badge variant="secondary" className="ml-0.5 sm:ml-1 bg-gray-200 text-gray-700 text-[10px] sm:text-xs px-1 sm:px-1.5">{stats.taxi}</Badge>
          </TabsTrigger>
          <TabsTrigger value="domestic" className="flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
            <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Dom</span>
            <Badge variant="secondary" className="ml-0.5 sm:ml-1 bg-gray-200 text-gray-700 text-[10px] sm:text-xs px-1 sm:px-1.5">{stats.domestic}</Badge>
          </TabsTrigger>
          <TabsTrigger value="international" className="flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 data-[state=active]:bg-purple-500 data-[state=active]:text-white">
            <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Intl</span>
            <Badge variant="secondary" className="ml-0.5 sm:ml-1 bg-gray-200 text-gray-700 text-[10px] sm:text-xs px-1 sm:px-1.5">{stats.international}</Badge>
          </TabsTrigger>
          <TabsTrigger value="flight" className="flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 data-[state=active]:bg-sky-500 data-[state=active]:text-white">
            <Plane className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Train/Flight</span>
            <Badge variant="secondary" className="ml-0.5 sm:ml-1 bg-gray-200 text-gray-700 text-[10px] sm:text-xs px-1 sm:px-1.5">{stats.flight}</Badge>
          </TabsTrigger>
        </TabsList>

        {/* Taxi Tab */}
        <TabsContent value="taxi" className="mt-4">
          <Card className="bg-white border-gray-200">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 border-gray-200">
                    <TableHead className="text-gray-600 font-medium">Customer</TableHead>
                    <TableHead className="hidden md:table-cell text-gray-600 font-medium">Trip Details</TableHead>
                    <TableHead className="hidden lg:table-cell text-gray-600 font-medium">Date</TableHead>
                    <TableHead className="text-gray-600 font-medium">Status</TableHead>
                    <TableHead className="hidden sm:table-cell text-gray-600 font-medium">Quote</TableHead>
                    <TableHead className="text-right text-gray-600 font-medium">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterEnquiries(taxiEnquiries).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                        <Car className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p className="font-medium text-gray-900">No taxi enquiries found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filterEnquiries(taxiEnquiries).map((enquiry) => (
                      <TableRow key={enquiry.id} className="border-gray-100 hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{enquiry.name}</p>
                            <p className="text-sm text-gray-500">{enquiry.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="max-w-[200px]">
                            <p className="text-sm text-gray-900 truncate">{enquiry.pickup_location}</p>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <ArrowRight className="h-3 w-3" />
                              <span className="truncate">{enquiry.drop_location || "Local"}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-gray-700">
                          {format(new Date(enquiry.pickup_date), "dd MMM yyyy")}
                        </TableCell>
                        <TableCell>
                          <Select value={enquiry.status} onValueChange={(v) => handleQuickStatusUpdate(enquiry.id, v, "taxi", enquiry)}>
                            <SelectTrigger className={`h-8 w-28 text-xs border ${getStatusColor(enquiry.status)}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map(s => (
                                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {enquiry.quoted_price ? (
                            <span className="text-[#008060] font-semibold">₹{enquiry.quoted_price.toLocaleString()}</span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="hover:bg-gray-100" onClick={() => handleViewDetails(enquiry, "taxi")}>
                              <Eye className="h-4 w-4 text-gray-500" />
                            </Button>
                            <Button variant="ghost" size="icon" className="hover:bg-red-50" onClick={() => handleDelete(enquiry.id, "taxi")}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Domestic Tours Tab */}
        <TabsContent value="domestic" className="mt-4">
          <Card className="bg-white border-gray-200">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 border-gray-200">
                    <TableHead className="text-gray-600 font-medium">Customer</TableHead>
                    <TableHead className="hidden md:table-cell text-gray-600 font-medium">Tour Package</TableHead>
                    <TableHead className="hidden lg:table-cell text-gray-600 font-medium">Travel Date</TableHead>
                    <TableHead className="hidden sm:table-cell text-gray-600 font-medium">Travelers</TableHead>
                    <TableHead className="text-gray-600 font-medium">Status</TableHead>
                    <TableHead className="hidden md:table-cell text-gray-600 font-medium">Quote</TableHead>
                    <TableHead className="text-right text-gray-600 font-medium">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterEnquiries(domesticEnquiries).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                        <Home className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p className="font-medium text-gray-900">No domestic tour enquiries found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filterEnquiries(domesticEnquiries).map((enquiry) => (
                      <TableRow key={enquiry.id} className="border-gray-100 hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{enquiry.name}</p>
                            <p className="text-sm text-gray-500">{enquiry.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <p className="text-sm text-gray-700 line-clamp-1">{enquiry.tour_packages?.title || "—"}</p>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-gray-700">
                          {enquiry.travel_date ? format(new Date(enquiry.travel_date), "dd MMM yyyy") : "—"}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span>{(enquiry.adults || 0) + (enquiry.children || 0)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select value={enquiry.status} onValueChange={(v) => handleQuickStatusUpdate(enquiry.id, v, "domestic", enquiry)}>
                            <SelectTrigger className={`h-8 w-28 text-xs border ${getStatusColor(enquiry.status)}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map(s => (
                                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {enquiry.quoted_price ? (
                            <span className="text-[#008060] font-semibold">₹{enquiry.quoted_price.toLocaleString()}</span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="hover:bg-gray-100" onClick={() => handleViewDetails(enquiry, "domestic")}>
                              <Eye className="h-4 w-4 text-gray-500" />
                            </Button>
                            <Button variant="ghost" size="icon" className="hover:bg-red-50" onClick={() => handleDelete(enquiry.id, "domestic")}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* International Tours Tab */}
        <TabsContent value="international" className="mt-4">
          <Card className="bg-white border-gray-200">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 border-gray-200">
                    <TableHead className="text-gray-600 font-medium">Customer</TableHead>
                    <TableHead className="hidden md:table-cell text-gray-600 font-medium">Tour Package</TableHead>
                    <TableHead className="hidden lg:table-cell text-gray-600 font-medium">Travel Date</TableHead>
                    <TableHead className="hidden sm:table-cell text-gray-600 font-medium">Travelers</TableHead>
                    <TableHead className="text-gray-600 font-medium">Status</TableHead>
                    <TableHead className="hidden md:table-cell text-gray-600 font-medium">Quote</TableHead>
                    <TableHead className="text-right text-gray-600 font-medium">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterEnquiries(internationalEnquiries).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                        <Globe className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p className="font-medium text-gray-900">No international tour enquiries found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filterEnquiries(internationalEnquiries).map((enquiry) => (
                      <TableRow key={enquiry.id} className="border-gray-100 hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{enquiry.name}</p>
                            <p className="text-sm text-gray-500">{enquiry.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <p className="text-sm text-gray-700 line-clamp-1">{enquiry.tour_packages?.title || "—"}</p>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-gray-700">
                          {enquiry.travel_date ? format(new Date(enquiry.travel_date), "dd MMM yyyy") : "—"}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span>{(enquiry.adults || 0) + (enquiry.children || 0)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select value={enquiry.status} onValueChange={(v) => handleQuickStatusUpdate(enquiry.id, v, "international", enquiry)}>
                            <SelectTrigger className={`h-8 w-28 text-xs border ${getStatusColor(enquiry.status)}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map(s => (
                                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {enquiry.quoted_price ? (
                            <span className="text-[#008060] font-semibold">₹{enquiry.quoted_price.toLocaleString()}</span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="hover:bg-gray-100" onClick={() => handleViewDetails(enquiry, "international")}>
                              <Eye className="h-4 w-4 text-gray-500" />
                            </Button>
                            <Button variant="ghost" size="icon" className="hover:bg-red-50" onClick={() => handleDelete(enquiry.id, "international")}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Flight Tab */}
        <TabsContent value="flight" className="mt-4">
          <Card className="bg-white border-gray-200">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 border-gray-200">
                    <TableHead className="text-gray-600 font-medium">Customer</TableHead>
                    <TableHead className="hidden md:table-cell text-gray-600 font-medium">Route</TableHead>
                    <TableHead className="hidden lg:table-cell text-gray-600 font-medium">Date</TableHead>
                    <TableHead className="hidden sm:table-cell text-gray-600 font-medium">Class</TableHead>
                    <TableHead className="text-gray-600 font-medium">Status</TableHead>
                    <TableHead className="hidden md:table-cell text-gray-600 font-medium">Quote</TableHead>
                    <TableHead className="text-right text-gray-600 font-medium">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterEnquiries(flightEnquiries).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                        <Plane className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p className="font-medium text-gray-900">No flight enquiries found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filterEnquiries(flightEnquiries).map((enquiry) => (
                      <TableRow key={enquiry.id} className="border-gray-100 hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{enquiry.name}</p>
                            <p className="text-sm text-gray-500">{enquiry.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-1">
                            <span className="font-medium text-gray-900">{enquiry.departure_city}</span>
                            <ArrowRight className="h-3 w-3 text-gray-400" />
                            <span className="font-medium text-gray-900">{enquiry.arrival_city}</span>
                          </div>
                          <Badge variant="outline" className="text-xs mt-1 capitalize border-gray-300 text-gray-600">{enquiry.trip_type}</Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-gray-700">
                          {format(new Date(enquiry.departure_date), "dd MMM yyyy")}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="secondary" className="capitalize bg-gray-100 text-gray-700">{enquiry.class}</Badge>
                        </TableCell>
                        <TableCell>
                          <Select value={enquiry.status} onValueChange={(v) => handleQuickStatusUpdate(enquiry.id, v, "flight", enquiry)}>
                            <SelectTrigger className={`h-8 w-28 text-xs border ${getStatusColor(enquiry.status)}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map(s => (
                                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {enquiry.quoted_price ? (
                            <span className="text-[#008060] font-semibold">₹{enquiry.quoted_price.toLocaleString()}</span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="hover:bg-gray-100" onClick={() => handleViewDetails(enquiry, "flight")}>
                              <Eye className="h-4 w-4 text-gray-500" />
                            </Button>
                            <Button variant="ghost" size="icon" className="hover:bg-red-50" onClick={() => handleDelete(enquiry.id, "flight")}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quote Dialog */}
      <Dialog open={isQuoteDialogOpen} onOpenChange={setIsQuoteDialogOpen}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-900">
              <IndianRupee className="h-5 w-5 text-[#008060]" />
              Enter Quote Price
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {quoteEnquiry && (
              <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-1 text-gray-700">
                <p><strong>Customer:</strong> {quoteEnquiry.name}</p>
                <p><strong>Email:</strong> {quoteEnquiry.email}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-gray-700">Quoted Price (₹)</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="number"
                  value={quotePrice}
                  onChange={(e) => setQuotePrice(e.target.value)}
                  placeholder="Enter price"
                  className="pl-10 border-gray-300"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsQuoteDialogOpen(false)} className="flex-1 border-gray-300">
              Cancel
            </Button>
            <Button onClick={handleSubmitQuote} disabled={saving} className="flex-1 bg-[#008060] hover:bg-[#006e52]">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Send Quote
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Enquiry Details</DialogTitle>
          </DialogHeader>
          {selectedEnquiry && (
            <div className="space-y-6 py-4">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-500 text-xs">Customer Name</Label>
                    <p className="font-medium text-gray-900">{selectedEnquiry.name}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs">Email</Label>
                    <p className="flex items-center gap-2 text-gray-700">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {selectedEnquiry.email}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs">Phone</Label>
                    <p className="flex items-center gap-2 text-gray-700">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {selectedEnquiry.phone}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {selectedType === "taxi" && (
                    <>
                      <div>
                        <Label className="text-gray-500 text-xs">Pickup</Label>
                        <p className="flex items-center gap-2 text-gray-700">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          {selectedEnquiry.pickup_location}
                        </p>
                      </div>
                      <div>
                        <Label className="text-gray-500 text-xs">Drop</Label>
                        <p className="text-gray-700">{selectedEnquiry.drop_location || "Local"}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500 text-xs">Date</Label>
                        <p className="flex items-center gap-2 text-gray-700">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {format(new Date(selectedEnquiry.pickup_date), "dd MMM yyyy")}
                        </p>
                      </div>
                    </>
                  )}
                  {(selectedType === "domestic" || selectedType === "international") && (
                    <>
                      <div>
                        <Label className="text-gray-500 text-xs">Tour Package</Label>
                        <p className="text-gray-700">{selectedEnquiry.tour_packages?.title || "—"}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500 text-xs">Travel Date</Label>
                        <p className="flex items-center gap-2 text-gray-700">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {selectedEnquiry.travel_date ? format(new Date(selectedEnquiry.travel_date), "dd MMM yyyy") : "—"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-gray-500 text-xs">Travelers</Label>
                        <p className="flex items-center gap-2 text-gray-700">
                          <Users className="h-4 w-4 text-gray-400" />
                          {selectedEnquiry.adults || 0} Adults, {selectedEnquiry.children || 0} Children
                        </p>
                      </div>
                    </>
                  )}
                  {selectedType === "flight" && (
                    <>
                      <div>
                        <Label className="text-gray-500 text-xs">Route</Label>
                        <p className="flex items-center gap-2 text-gray-700">
                          <Plane className="h-4 w-4 text-gray-400" />
                          {selectedEnquiry.departure_city} → {selectedEnquiry.arrival_city}
                        </p>
                      </div>
                      <div>
                        <Label className="text-gray-500 text-xs">Departure Date</Label>
                        <p className="flex items-center gap-2 text-gray-700">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {format(new Date(selectedEnquiry.departure_date), "dd MMM yyyy")}
                        </p>
                      </div>
                      <div>
                        <Label className="text-gray-500 text-xs">Passengers / Class</Label>
                        <p className="flex items-center gap-2 text-gray-700">
                          <Users className="h-4 w-4 text-gray-400" />
                          {selectedEnquiry.passengers} • <span className="capitalize">{selectedEnquiry.class}</span>
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {selectedEnquiry.message && (
                <div>
                  <Label className="text-gray-500 text-xs">Message</Label>
                  <p className="bg-gray-50 p-3 rounded-lg text-sm mt-1 text-gray-700">{selectedEnquiry.message}</p>
                </div>
              )}

              <div className="border-t border-gray-200 pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Status</Label>
                    <Select value={editStatus} onValueChange={setEditStatus}>
                      <SelectTrigger className="border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(s => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">Quoted Price (₹)</Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="number"
                        value={editQuotedPrice}
                        onChange={(e) => setEditQuotedPrice(e.target.value)}
                        placeholder="Enter price"
                        className="pl-10 border-gray-300"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">Admin Notes</Label>
                  <Textarea
                    value={editAdminNotes}
                    onChange={(e) => setEditAdminNotes(e.target.value)}
                    placeholder="Internal notes..."
                    rows={3}
                    className="border-gray-300"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsDetailOpen(false)} className="flex-1 border-gray-300">
                  Cancel
                </Button>
                <Button onClick={handleUpdateEnquiry} disabled={saving} className="flex-1 bg-[#008060] hover:bg-[#006e52]">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnquiriesAdmin;
