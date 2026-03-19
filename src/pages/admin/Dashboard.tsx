import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import {
  Package,
  MessageSquare,
  TrendingUp,
  Car,
  Users,
  Calendar,
  Clock,
  ArrowUpRight,
  Phone,
  ChevronRight,
  Plane,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Mail,
  IndianRupee,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, subDays } from "date-fns";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

interface EnquiryBase {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  created_at: string;
  quoted_price: number | null;
}

interface TourEnquiry extends EnquiryBase {
  travel_date: string | null;
  adults: number | null;
  children: number | null;
  tour_packages?: { title: string } | null;
}

interface TaxiEnquiry extends EnquiryBase {
  pickup_location: string;
  drop_location: string | null;
  pickup_date: string;
  trip_type: string;
  estimated_price: number | null;
  taxi_vehicles?: { name: string } | null;
}

interface FlightEnquiry extends EnquiryBase {
  departure_city: string;
  arrival_city: string;
  departure_date: string;
  trip_type: string;
  passengers: number;
}

interface Stats {
  totalPackages: number;
  totalTourEnquiries: number;
  totalTaxiEnquiries: number;
  totalFlightEnquiries: number;
  pendingTour: number;
  pendingTaxi: number;
  pendingFlight: number;
  confirmedTour: number;
  confirmedTaxi: number;
  confirmedFlight: number;
  totalVehicles: number;
  newsletterSubs: number;
  totalDrivers: number;
  pendingDrivers: number;
  totalRevenue: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalPackages: 0,
    totalTourEnquiries: 0,
    totalTaxiEnquiries: 0,
    totalFlightEnquiries: 0,
    pendingTour: 0,
    pendingTaxi: 0,
    pendingFlight: 0,
    confirmedTour: 0,
    confirmedTaxi: 0,
    confirmedFlight: 0,
    totalVehicles: 0,
    newsletterSubs: 0,
    totalDrivers: 0,
    pendingDrivers: 0,
    totalRevenue: 0,
  });
  const [tourEnquiries, setTourEnquiries] = useState<TourEnquiry[]>([]);
  const [taxiEnquiries, setTaxiEnquiries] = useState<TaxiEnquiry[]>([]);
  const [flightEnquiries, setFlightEnquiries] = useState<FlightEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const [
        packagesRes,
        tourEnqCountRes,
        taxiEnqCountRes,
        flightEnqCountRes,
        pendingTourRes,
        pendingTaxiRes,
        pendingFlightRes,
        confirmedTourRes,
        confirmedTaxiRes,
        confirmedFlightRes,
        vehiclesRes,
        newsletterRes,
        driversRes,
        pendingDriversRes,
        tourEnquiriesData,
        taxiEnquiriesData,
        flightEnquiriesData,
      ] = await Promise.all([
        supabase.from("tour_packages").select("id", { count: "exact", head: true }),
        supabase.from("tour_enquiries").select("id", { count: "exact", head: true }),
        supabase.from("taxi_enquiries").select("id", { count: "exact", head: true }),
        supabase.from("flight_enquiries").select("id", { count: "exact", head: true }),
        supabase.from("tour_enquiries").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("taxi_enquiries").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("flight_enquiries").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("tour_enquiries").select("id", { count: "exact", head: true }).eq("status", "confirmed"),
        supabase.from("taxi_enquiries").select("id", { count: "exact", head: true }).eq("status", "confirmed"),
        supabase.from("flight_enquiries").select("id", { count: "exact", head: true }).eq("status", "confirmed"),
        supabase.from("taxi_vehicles").select("id", { count: "exact", head: true }),
        supabase.from("newsletter_subscriptions").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("driver_registrations").select("id", { count: "exact", head: true }),
        supabase.from("driver_registrations").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("tour_enquiries").select("*, tour_packages(title)").order("created_at", { ascending: false }).limit(50),
        supabase.from("taxi_enquiries").select("*, taxi_vehicles(name)").order("created_at", { ascending: false }).limit(50),
        supabase.from("flight_enquiries").select("*").order("created_at", { ascending: false }).limit(50),
      ]);

      // Calculate revenue from quoted prices
      const tourRevenue = ((tourEnquiriesData.data || []) as TourEnquiry[])
        .filter(e => e.quoted_price && (e.status === "confirmed" || e.status === "completed"))
        .reduce((sum, e) => sum + (e.quoted_price || 0), 0);
      const taxiRevenue = ((taxiEnquiriesData.data || []) as TaxiEnquiry[])
        .filter(e => e.quoted_price && (e.status === "confirmed" || e.status === "completed"))
        .reduce((sum, e) => sum + (e.quoted_price || 0), 0);
      const flightRevenue = ((flightEnquiriesData.data || []) as FlightEnquiry[])
        .filter(e => e.quoted_price && (e.status === "confirmed" || e.status === "completed"))
        .reduce((sum, e) => sum + (e.quoted_price || 0), 0);

      setStats({
        totalPackages: packagesRes.count || 0,
        totalTourEnquiries: tourEnqCountRes.count || 0,
        totalTaxiEnquiries: taxiEnqCountRes.count || 0,
        totalFlightEnquiries: flightEnqCountRes.count || 0,
        pendingTour: pendingTourRes.count || 0,
        pendingTaxi: pendingTaxiRes.count || 0,
        pendingFlight: pendingFlightRes.count || 0,
        confirmedTour: confirmedTourRes.count || 0,
        confirmedTaxi: confirmedTaxiRes.count || 0,
        confirmedFlight: confirmedFlightRes.count || 0,
        totalVehicles: vehiclesRes.count || 0,
        newsletterSubs: newsletterRes.count || 0,
        totalDrivers: driversRes.count || 0,
        pendingDrivers: pendingDriversRes.count || 0,
        totalRevenue: tourRevenue + taxiRevenue + flightRevenue,
      });

      setTourEnquiries((tourEnquiriesData.data as TourEnquiry[]) || []);
      setTaxiEnquiries((taxiEnquiriesData.data as TaxiEnquiry[]) || []);
      setFlightEnquiries((flightEnquiriesData.data as FlightEnquiry[]) || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Real-time subscriptions
    const channel = supabase
      .channel("dashboard-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "tour_enquiries" }, () => fetchData())
      .on("postgres_changes", { event: "*", schema: "public", table: "taxi_enquiries" }, () => fetchData())
      .on("postgres_changes", { event: "*", schema: "public", table: "flight_enquiries" }, () => fetchData())
      .on("postgres_changes", { event: "*", schema: "public", table: "driver_registrations" }, () => fetchData())
      .on("postgres_changes", { event: "*", schema: "public", table: "newsletter_subscriptions" }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData]);

  // Combined enquiries
  const allEnquiries = [
    ...tourEnquiries.map((e) => ({ ...e, type: "tour" as const })),
    ...taxiEnquiries.map((e) => ({ ...e, type: "taxi" as const })),
    ...flightEnquiries.map((e) => ({ ...e, type: "flight" as const })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const filteredEnquiries =
    activeTab === "all"
      ? allEnquiries
      : allEnquiries.filter((e) => e.type === activeTab);

  // Chart data - last 7 days
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateStr = format(date, "yyyy-MM-dd");
    const tourCount = tourEnquiries.filter((e) => format(new Date(e.created_at), "yyyy-MM-dd") === dateStr).length;
    const taxiCount = taxiEnquiries.filter((e) => format(new Date(e.created_at), "yyyy-MM-dd") === dateStr).length;
    const flightCount = flightEnquiries.filter((e) => format(new Date(e.created_at), "yyyy-MM-dd") === dateStr).length;
    return {
      name: format(date, "EEE"),
      tour: tourCount,
      taxi: taxiCount,
      flight: flightCount,
      total: tourCount + taxiCount + flightCount,
    };
  });

  // Monthly comparison bar chart - last 6 months
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const monthStr = format(date, "yyyy-MM");
    const tourCount = tourEnquiries.filter((e) => format(new Date(e.created_at), "yyyy-MM") === monthStr).length;
    const taxiCount = taxiEnquiries.filter((e) => format(new Date(e.created_at), "yyyy-MM") === monthStr).length;
    const flightCount = flightEnquiries.filter((e) => format(new Date(e.created_at), "yyyy-MM") === monthStr).length;
    return {
      name: format(date, "MMM"),
      Tour: tourCount,
      Taxi: taxiCount,
      Flight: flightCount,
    };
  });

  // Status distribution
  const totalPending = stats.pendingTour + stats.pendingTaxi + stats.pendingFlight;
  const totalConfirmed = stats.confirmedTour + stats.confirmedTaxi + stats.confirmedFlight;
  const totalEnquiries = stats.totalTourEnquiries + stats.totalTaxiEnquiries + stats.totalFlightEnquiries;
  const conversionRate = totalEnquiries > 0 ? Math.round((totalConfirmed / totalEnquiries) * 100) : 0;

  const statusData = [
    { name: "Pending", value: totalPending, color: "#f59e0b" },
    { name: "Confirmed", value: totalConfirmed, color: "#10b981" },
    { name: "Quoted", value: allEnquiries.filter((e) => e.status === "quoted").length, color: "#3b82f6" },
    { name: "Completed", value: allEnquiries.filter((e) => e.status === "completed").length, color: "#8b5cf6" },
    { name: "Cancelled", value: allEnquiries.filter((e) => e.status === "cancelled").length, color: "#ef4444" },
  ].filter((s) => s.value > 0);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      quoted: "bg-blue-100 text-blue-700 border-blue-200",
      confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
      completed: "bg-purple-100 text-purple-700 border-purple-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "tour": return <Package className="h-4 w-4 sm:h-5 sm:w-5" />;
      case "taxi": return <Car className="h-4 w-4 sm:h-5 sm:w-5" />;
      case "flight": return <Plane className="h-4 w-4 sm:h-5 sm:w-5" />;
      default: return <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "tour": return "bg-violet-100 text-violet-600";
      case "taxi": return "bg-emerald-100 text-emerald-600";
      case "flight": return "bg-sky-100 text-sky-600";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  const getEnquiryLabel = (enquiry: (typeof allEnquiries)[0]) => {
    switch (enquiry.type) {
      case "tour":
        return (enquiry as TourEnquiry & { type: "tour" }).tour_packages?.title || "General Tour Enquiry";
      case "taxi":
        return (enquiry as TaxiEnquiry & { type: "taxi" }).pickup_location || "-";
      case "flight":
        return `${(enquiry as FlightEnquiry & { type: "flight" }).departure_city} → ${(enquiry as FlightEnquiry & { type: "flight" }).arrival_city}`;
      default:
        return "-";
    }
  };

  const getEnquiryLink = (type: string) => {
    switch (type) {
      case "tour": return "/admin/enquiries";
      case "taxi": return "/admin/taxi";
      case "flight": return "/admin/enquiries";
      default: return "/admin/enquiries";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Welcome back! Here's what's happening with your business.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white border-slate-200 text-slate-600 text-xs">
            <Clock className="h-3 w-3 mr-1 text-slate-500" />
            {format(lastUpdated, "hh:mm a")}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="border-slate-200 text-slate-600 hover:bg-slate-100 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards - 2 rows of 4 */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {/* Total Enquiries */}
        <Card className="bg-white border-slate-200 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 w-16 sm:w-20 h-16 sm:h-20 bg-emerald-50 rounded-full -mr-8 sm:-mr-10 -mt-8 sm:-mt-10" />
          <CardContent className="p-3 sm:p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 text-xs sm:text-sm font-medium">Total Enquiries</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1 text-slate-800">{totalEnquiries}</p>
                <p className="text-emerald-600 text-[10px] sm:text-xs mt-1.5 flex items-center font-medium">
                  <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                  {totalPending} pending
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Confirmed Leads */}
        <Card className="bg-white border-slate-200 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 w-16 sm:w-20 h-16 sm:h-20 bg-blue-50 rounded-full -mr-8 sm:-mr-10 -mt-8 sm:-mt-10" />
          <CardContent className="p-3 sm:p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 text-xs sm:text-sm font-medium">Confirmed Leads</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1 text-slate-800">{totalConfirmed}</p>
                <p className="text-blue-600 text-[10px] sm:text-xs mt-1.5 flex items-center font-medium">
                  <CheckCircle2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                  {conversionRate}% conversion
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Packages */}
        <Card className="bg-white border-slate-200 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 w-16 sm:w-20 h-16 sm:h-20 bg-violet-50 rounded-full -mr-8 sm:-mr-10 -mt-8 sm:-mt-10" />
          <CardContent className="p-3 sm:p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 text-xs sm:text-sm font-medium">Active Packages</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1 text-slate-800">{stats.totalPackages}</p>
                <p className="text-violet-600 text-[10px] sm:text-xs mt-1.5 flex items-center font-medium">
                  <Package className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                  Tour packages
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-violet-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Taxi Fleet */}
        <Card className="bg-white border-slate-200 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 w-16 sm:w-20 h-16 sm:h-20 bg-amber-50 rounded-full -mr-8 sm:-mr-10 -mt-8 sm:-mt-10" />
          <CardContent className="p-3 sm:p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 text-xs sm:text-sm font-medium">Taxi Fleet</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1 text-slate-800">{stats.totalVehicles}</p>
                <p className="text-amber-600 text-[10px] sm:text-xs mt-1.5 flex items-center font-medium">
                  <Car className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                  {stats.totalTaxiEnquiries} bookings
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <Car className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0">
                <Plane className="h-4 w-4 sm:h-5 sm:w-5 text-sky-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-slate-800">{stats.totalFlightEnquiries}</p>
                <p className="text-[10px] sm:text-xs text-slate-500 truncate">Flight Enquiries</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 text-teal-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-slate-800">{stats.totalDrivers}</p>
                <p className="text-[10px] sm:text-xs text-slate-500 truncate">
                  Drivers {stats.pendingDrivers > 0 && <span className="text-amber-600">({stats.pendingDrivers} new)</span>}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-slate-800">{stats.newsletterSubs}</p>
                <p className="text-[10px] sm:text-xs text-slate-500 truncate">Subscribers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                <IndianRupee className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-slate-800">
                  {stats.totalRevenue > 0 ? `₹${stats.totalRevenue.toLocaleString()}` : "₹0"}
                </p>
                <p className="text-[10px] sm:text-xs text-slate-500 truncate">Revenue (Quoted)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Alert */}
      {totalPending > 0 && (
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-sm">
          <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm sm:text-base">
                  {totalPending} Pending {totalPending === 1 ? "Enquiry" : "Enquiries"}
                </p>
                <p className="text-xs sm:text-sm text-slate-600">
                  {stats.pendingTour > 0 && `${stats.pendingTour} tour`}
                  {stats.pendingTaxi > 0 && `${stats.pendingTour > 0 ? " • " : ""}${stats.pendingTaxi} taxi`}
                  {stats.pendingFlight > 0 && `${(stats.pendingTour + stats.pendingTaxi) > 0 ? " • " : ""}${stats.pendingFlight} flight`}
                  {stats.pendingDrivers > 0 && ` • ${stats.pendingDrivers} driver`}
                </p>
              </div>
            </div>
            <Link to="/admin/enquiries">
              <Button className="bg-amber-500 hover:bg-amber-600 text-white shadow-md w-full sm:w-auto text-sm">
                Review Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Area Chart - Enquiries Overview */}
        <Card className="lg:col-span-2 bg-white border-slate-200 shadow-sm">
          <CardHeader className="pb-2 px-3 sm:px-6 pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base sm:text-lg font-semibold text-slate-800">Enquiries Overview</CardTitle>
              <Badge variant="outline" className="text-[10px] sm:text-xs bg-slate-50 text-slate-600 border-slate-200">Last 7 days</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0 px-2 sm:px-6 pb-4">
            <div className="h-[200px] sm:h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="tourGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="taxiGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="flightGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Area type="monotone" dataKey="tour" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#tourGrad)" name="Tour" />
                  <Area type="monotone" dataKey="taxi" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#taxiGrad)" name="Taxi" />
                  <Area type="monotone" dataKey="flight" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#flightGrad)" name="Flight" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-4 sm:gap-6 mt-3 sm:mt-4">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-violet-500" /><span className="text-xs text-slate-600">Tour</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /><span className="text-xs text-slate-600">Taxi</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-sky-500" /><span className="text-xs text-slate-600">Flight</span></div>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart - Status Distribution */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="pb-2 px-3 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-base sm:text-lg font-semibold text-slate-800">Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-4">
            {statusData.length === 0 ? (
              <div className="h-[200px] flex items-center justify-center text-slate-400 text-sm">No data yet</div>
            ) : (
              <>
                <div className="h-[160px] sm:h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={statusData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={2} dataKey="value">
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mt-2">
                  {statusData.map((status) => (
                    <div key={status.name} className="flex items-center gap-1.5 text-xs sm:text-sm">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: status.color }} />
                      <span className="text-slate-600 truncate">{status.name}</span>
                      <span className="text-slate-800 font-medium ml-auto">{status.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Comparison Bar Chart */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader className="pb-2 px-3 sm:px-6 pt-4 sm:pt-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base sm:text-lg font-semibold text-slate-800">Monthly Comparison</CardTitle>
            <Badge variant="outline" className="text-[10px] sm:text-xs bg-slate-50 text-slate-600 border-slate-200">Last 6 months</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-2 sm:px-6 pb-4">
          <div className="h-[200px] sm:h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="Tour" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Taxi" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Flight" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* All Enquiries - Recent Activity */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div>
              <CardTitle className="text-base sm:text-lg font-semibold text-slate-800">Recent Activity</CardTitle>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">All enquiries across tour, taxi & flight</p>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-slate-100 w-full grid grid-cols-4 h-9 sm:h-10">
                <TabsTrigger value="all" className="text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-slate-800 text-slate-600">
                  All ({allEnquiries.length})
                </TabsTrigger>
                <TabsTrigger value="tour" className="text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-slate-800 text-slate-600">
                  Tour ({tourEnquiries.length})
                </TabsTrigger>
                <TabsTrigger value="taxi" className="text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-slate-800 text-slate-600">
                  Taxi ({taxiEnquiries.length})
                </TabsTrigger>
                <TabsTrigger value="flight" className="text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-slate-800 text-slate-600">
                  Flight ({flightEnquiries.length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {filteredEnquiries.length === 0 ? (
              <div className="p-8 sm:p-12 text-center">
                <MessageSquare className="h-10 w-10 sm:h-12 sm:w-12 text-slate-300 mx-auto mb-2 sm:mb-3" />
                <p className="text-slate-500 font-medium text-sm sm:text-base">No enquiries yet</p>
                <p className="text-xs sm:text-sm text-slate-400">Enquiries will appear here when customers submit them</p>
              </div>
            ) : (
              filteredEnquiries.slice(0, 15).map((enquiry) => (
                <div key={enquiry.id} className="p-3 sm:p-4 hover:bg-slate-50 transition-colors flex items-center gap-3 sm:gap-4">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${getTypeColor(enquiry.type)}`}>
                    {getTypeIcon(enquiry.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <p className="font-medium text-slate-800 truncate text-sm sm:text-base">{enquiry.name || "-"}</p>
                      <Badge variant="outline" className={`text-[10px] sm:text-xs ${getStatusBadge(enquiry.status)}`}>
                        {enquiry.status}
                      </Badge>
                      {enquiry.quoted_price && (
                        <Badge variant="outline" className="text-[10px] sm:text-xs bg-green-50 text-green-700 border-green-200">
                          ₹{enquiry.quoted_price.toLocaleString()}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 truncate mt-0.5">{getEnquiryLabel(enquiry)}</p>
                  </div>
                  <div className="hidden md:flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{enquiry.phone || "-"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Clock className="h-3 w-3" />
                      <span>{format(new Date(enquiry.created_at), "dd MMM, hh:mm a")}</span>
                    </div>
                  </div>
                  <Link to={getEnquiryLink(enquiry.type)} className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                  </Link>
                </div>
              ))
            )}
          </div>

          {filteredEnquiries.length > 15 && (
            <div className="p-3 sm:p-4 border-t border-slate-100 text-center">
              <Link
                to="/admin/enquiries"
                className="text-xs sm:text-sm font-medium text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
              >
                View all {filteredEnquiries.length} enquiries
                <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
