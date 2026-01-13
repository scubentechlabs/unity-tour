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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">All Enquiries</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage all booking enquiries in one place
          </p>
        </div>
        {stats.pending > 0 && (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 px-3 py-1.5">
            {stats.pending} pending enquiries
          </Badge>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{stats.taxi}</p>
                <p className="text-sm text-orange-100">Taxi Bookings</p>
              </div>
              <Car className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{stats.domestic}</p>
                <p className="text-sm text-emerald-100">Domestic Tours</p>
              </div>
              <Home className="h-8 w-8 text-emerald-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{stats.international}</p>
                <p className="text-sm text-purple-100">International Tours</p>
              </div>
              <Globe className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-sky-500 to-sky-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{stats.flight}</p>
                <p className="text-sm text-sky-100">Flight Bookings</p>
              </div>
              <Plane className="h-8 w-8 text-sky-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted">
          <TabsTrigger value="taxi" className="flex items-center gap-2 py-3 data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            <Car className="h-4 w-4" />
            <span className="hidden sm:inline">Taxi</span>
            <Badge variant="secondary" className="ml-1">{stats.taxi}</Badge>
          </TabsTrigger>
          <TabsTrigger value="domestic" className="flex items-center gap-2 py-3 data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Domestic</span>
            <Badge variant="secondary" className="ml-1">{stats.domestic}</Badge>
          </TabsTrigger>
          <TabsTrigger value="international" className="flex items-center gap-2 py-3 data-[state=active]:bg-purple-500 data-[state=active]:text-white">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">International</span>
            <Badge variant="secondary" className="ml-1">{stats.international}</Badge>
          </TabsTrigger>
          <TabsTrigger value="flight" className="flex items-center gap-2 py-3 data-[state=active]:bg-sky-500 data-[state=active]:text-white">
            <Plane className="h-4 w-4" />
            <span className="hidden sm:inline">Flight</span>
            <Badge variant="secondary" className="ml-1">{stats.flight}</Badge>
          </TabsTrigger>
        </TabsList>

        {/* Taxi Tab */}
        <TabsContent value="taxi" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden md:table-cell">Trip Details</TableHead>
                    <TableHead className="hidden lg:table-cell">Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Quote</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterEnquiries(taxiEnquiries).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                        <Car className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No taxi enquiries found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filterEnquiries(taxiEnquiries).map((enquiry) => (
                      <TableRow key={enquiry.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{enquiry.name}</p>
                            <p className="text-sm text-muted-foreground">{enquiry.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="max-w-[200px]">
                            <p className="text-sm truncate">{enquiry.pickup_location}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <ArrowRight className="h-3 w-3" />
                              <span className="truncate">{enquiry.drop_location || "Local"}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
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
                            <span className="text-primary font-semibold">₹{enquiry.quoted_price.toLocaleString()}</span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleViewDetails(enquiry, "taxi")}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(enquiry.id, "taxi")}>
                              <Trash2 className="h-4 w-4 text-destructive" />
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
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden md:table-cell">Tour Package</TableHead>
                    <TableHead className="hidden lg:table-cell">Travel Date</TableHead>
                    <TableHead className="hidden sm:table-cell">Travelers</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Quote</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterEnquiries(domesticEnquiries).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                        <Home className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No domestic tour enquiries found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filterEnquiries(domesticEnquiries).map((enquiry) => (
                      <TableRow key={enquiry.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{enquiry.name}</p>
                            <p className="text-sm text-muted-foreground">{enquiry.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <p className="text-sm line-clamp-1">{enquiry.tour_packages?.title || "—"}</p>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {enquiry.travel_date ? format(new Date(enquiry.travel_date), "dd MMM yyyy") : "—"}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
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
                            <span className="text-primary font-semibold">₹{enquiry.quoted_price.toLocaleString()}</span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleViewDetails(enquiry, "domestic")}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(enquiry.id, "domestic")}>
                              <Trash2 className="h-4 w-4 text-destructive" />
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
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden md:table-cell">Tour Package</TableHead>
                    <TableHead className="hidden lg:table-cell">Travel Date</TableHead>
                    <TableHead className="hidden sm:table-cell">Travelers</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Quote</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterEnquiries(internationalEnquiries).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                        <Globe className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No international tour enquiries found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filterEnquiries(internationalEnquiries).map((enquiry) => (
                      <TableRow key={enquiry.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{enquiry.name}</p>
                            <p className="text-sm text-muted-foreground">{enquiry.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <p className="text-sm line-clamp-1">{enquiry.tour_packages?.title || "—"}</p>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {enquiry.travel_date ? format(new Date(enquiry.travel_date), "dd MMM yyyy") : "—"}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
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
                            <span className="text-primary font-semibold">₹{enquiry.quoted_price.toLocaleString()}</span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleViewDetails(enquiry, "international")}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(enquiry.id, "international")}>
                              <Trash2 className="h-4 w-4 text-destructive" />
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
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden md:table-cell">Route</TableHead>
                    <TableHead className="hidden lg:table-cell">Date</TableHead>
                    <TableHead className="hidden sm:table-cell">Class</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Quote</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterEnquiries(flightEnquiries).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                        <Plane className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No flight enquiries found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filterEnquiries(flightEnquiries).map((enquiry) => (
                      <TableRow key={enquiry.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{enquiry.name}</p>
                            <p className="text-sm text-muted-foreground">{enquiry.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{enquiry.departure_city}</span>
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium">{enquiry.arrival_city}</span>
                          </div>
                          <Badge variant="outline" className="text-xs mt-1 capitalize">{enquiry.trip_type}</Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {format(new Date(enquiry.departure_date), "dd MMM yyyy")}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="secondary" className="capitalize">{enquiry.class}</Badge>
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
                            <span className="text-primary font-semibold">₹{enquiry.quoted_price.toLocaleString()}</span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleViewDetails(enquiry, "flight")}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(enquiry.id, "flight")}>
                              <Trash2 className="h-4 w-4 text-destructive" />
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-primary" />
              Enter Quote Price
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {quoteEnquiry && (
              <div className="bg-muted p-3 rounded-lg text-sm space-y-1">
                <p><strong>Customer:</strong> {quoteEnquiry.name}</p>
                <p><strong>Email:</strong> {quoteEnquiry.email}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label>Quoted Price (₹)</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  value={quotePrice}
                  onChange={(e) => setQuotePrice(e.target.value)}
                  placeholder="Enter price"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsQuoteDialogOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmitQuote} disabled={saving} className="flex-1">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Send Quote
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Enquiry Details</DialogTitle>
          </DialogHeader>
          {selectedEnquiry && (
            <div className="space-y-6 py-4">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground text-xs">Customer Name</Label>
                    <p className="font-medium">{selectedEnquiry.name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Email</Label>
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {selectedEnquiry.email}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Phone</Label>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {selectedEnquiry.phone}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {selectedType === "taxi" && (
                    <>
                      <div>
                        <Label className="text-muted-foreground text-xs">Pickup</Label>
                        <p className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {selectedEnquiry.pickup_location}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">Drop</Label>
                        <p>{selectedEnquiry.drop_location || "Local"}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">Date</Label>
                        <p className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {format(new Date(selectedEnquiry.pickup_date), "dd MMM yyyy")}
                        </p>
                      </div>
                    </>
                  )}
                  {(selectedType === "domestic" || selectedType === "international") && (
                    <>
                      <div>
                        <Label className="text-muted-foreground text-xs">Tour Package</Label>
                        <p>{selectedEnquiry.tour_packages?.title || "—"}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">Travel Date</Label>
                        <p className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {selectedEnquiry.travel_date ? format(new Date(selectedEnquiry.travel_date), "dd MMM yyyy") : "—"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">Travelers</Label>
                        <p className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {selectedEnquiry.adults || 0} Adults, {selectedEnquiry.children || 0} Children
                        </p>
                      </div>
                    </>
                  )}
                  {selectedType === "flight" && (
                    <>
                      <div>
                        <Label className="text-muted-foreground text-xs">Route</Label>
                        <p className="flex items-center gap-2">
                          <Plane className="h-4 w-4 text-muted-foreground" />
                          {selectedEnquiry.departure_city} → {selectedEnquiry.arrival_city}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">Departure Date</Label>
                        <p className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {format(new Date(selectedEnquiry.departure_date), "dd MMM yyyy")}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">Passengers / Class</Label>
                        <p className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {selectedEnquiry.passengers} • <span className="capitalize">{selectedEnquiry.class}</span>
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {selectedEnquiry.message && (
                <div>
                  <Label className="text-muted-foreground text-xs">Message</Label>
                  <p className="bg-muted p-3 rounded-lg text-sm mt-1">{selectedEnquiry.message}</p>
                </div>
              )}

              <div className="border-t pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={editStatus} onValueChange={setEditStatus}>
                      <SelectTrigger>
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
                    <Label>Quoted Price (₹)</Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={editQuotedPrice}
                        onChange={(e) => setEditQuotedPrice(e.target.value)}
                        placeholder="Enter price"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Admin Notes</Label>
                  <Textarea
                    value={editAdminNotes}
                    onChange={(e) => setEditAdminNotes(e.target.value)}
                    placeholder="Internal notes..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsDetailOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleUpdateEnquiry} disabled={saving} className="flex-1">
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
