import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import {
  Package,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Car,
  Users,
  Calendar,
  Clock,
  ArrowUpRight,
  Phone,
  Mail,
  MapPin,
  Eye,
  ChevronRight,
  Plane,
  CheckCircle2,
  AlertCircle,
  XCircle,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, subDays, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
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
} from "recharts";

interface TourEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  created_at: string;
  travel_date: string | null;
  adults: number | null;
  children: number | null;
  quoted_price: number | null;
  tour_packages?: { title: string } | null;
}

interface TaxiEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  created_at: string;
  pickup_location: string;
  drop_location: string | null;
  pickup_date: string;
  trip_type: string;
  estimated_price: number | null;
  taxi_vehicles?: { name: string } | null;
}

interface Stats {
  totalPackages: number;
  totalTourEnquiries: number;
  totalTaxiEnquiries: number;
  pendingTour: number;
  pendingTaxi: number;
  confirmedTour: number;
  confirmedTaxi: number;
  totalVehicles: number;
  newsletterSubs: number;
}

const COLORS = ["#c9a84c", "#008060", "#3b82f6", "#ef4444", "#8b5cf6"];

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalPackages: 0,
    totalTourEnquiries: 0,
    totalTaxiEnquiries: 0,
    pendingTour: 0,
    pendingTaxi: 0,
    confirmedTour: 0,
    confirmedTaxi: 0,
    totalVehicles: 0,
    newsletterSubs: 0,
  });
  const [tourEnquiries, setTourEnquiries] = useState<TourEnquiry[]>([]);
  const [taxiEnquiries, setTaxiEnquiries] = useState<TaxiEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [
        packagesRes,
        tourEnqRes,
        taxiEnqRes,
        pendingTourRes,
        pendingTaxiRes,
        confirmedTourRes,
        confirmedTaxiRes,
        vehiclesRes,
        newsletterRes,
        tourEnquiriesData,
        taxiEnquiriesData,
      ] = await Promise.all([
        supabase.from("tour_packages").select("id", { count: "exact", head: true }),
        supabase.from("tour_enquiries").select("id", { count: "exact", head: true }),
        supabase.from("taxi_enquiries").select("id", { count: "exact", head: true }),
        supabase.from("tour_enquiries").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("taxi_enquiries").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("tour_enquiries").select("id", { count: "exact", head: true }).eq("status", "confirmed"),
        supabase.from("taxi_enquiries").select("id", { count: "exact", head: true }).eq("status", "confirmed"),
        supabase.from("taxi_vehicles").select("id", { count: "exact", head: true }),
        supabase.from("newsletter_subscriptions").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("tour_enquiries").select("*, tour_packages(title)").order("created_at", { ascending: false }).limit(50),
        supabase.from("taxi_enquiries").select("*, taxi_vehicles(name)").order("created_at", { ascending: false }).limit(50),
      ]);

      setStats({
        totalPackages: packagesRes.count || 0,
        totalTourEnquiries: tourEnqRes.count || 0,
        totalTaxiEnquiries: taxiEnqRes.count || 0,
        pendingTour: pendingTourRes.count || 0,
        pendingTaxi: pendingTaxiRes.count || 0,
        confirmedTour: confirmedTourRes.count || 0,
        confirmedTaxi: confirmedTaxiRes.count || 0,
        totalVehicles: vehiclesRes.count || 0,
        newsletterSubs: newsletterRes.count || 0,
      });

      setTourEnquiries((tourEnquiriesData.data as TourEnquiry[]) || []);
      setTaxiEnquiries((taxiEnquiriesData.data as TaxiEnquiry[]) || []);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Combine all enquiries
  const allEnquiries = [
    ...tourEnquiries.map((e) => ({ ...e, type: "tour" as const })),
    ...taxiEnquiries.map((e) => ({ ...e, type: "taxi" as const })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const filteredEnquiries = activeTab === "all" 
    ? allEnquiries 
    : activeTab === "tour" 
      ? allEnquiries.filter(e => e.type === "tour")
      : allEnquiries.filter(e => e.type === "taxi");

  // Generate chart data for last 7 days
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateStr = format(date, "yyyy-MM-dd");
    const tourCount = tourEnquiries.filter(e => format(new Date(e.created_at), "yyyy-MM-dd") === dateStr).length;
    const taxiCount = taxiEnquiries.filter(e => format(new Date(e.created_at), "yyyy-MM-dd") === dateStr).length;
    return {
      name: format(date, "EEE"),
      tour: tourCount,
      taxi: taxiCount,
      total: tourCount + taxiCount,
    };
  });

  // Status distribution for pie chart
  const statusData = [
    { name: "Pending", value: stats.pendingTour + stats.pendingTaxi, color: "#f59e0b" },
    { name: "Confirmed", value: stats.confirmedTour + stats.confirmedTaxi, color: "#10b981" },
    { name: "Quoted", value: allEnquiries.filter(e => e.status === "quoted").length, color: "#3b82f6" },
    { name: "Completed", value: allEnquiries.filter(e => e.status === "completed").length, color: "#8b5cf6" },
    { name: "Cancelled", value: allEnquiries.filter(e => e.status === "cancelled").length, color: "#ef4444" },
  ].filter(s => s.value > 0);

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

  const totalPending = stats.pendingTour + stats.pendingTaxi;
  const totalEnquiries = stats.totalTourEnquiries + stats.totalTaxiEnquiries;
  const conversionRate = totalEnquiries > 0 
    ? Math.round(((stats.confirmedTour + stats.confirmedTaxi) / totalEnquiries) * 100) 
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back! Here's what's happening with your business.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1.5 bg-white border-gray-200">
            <Calendar className="h-3.5 w-3.5 mr-1.5" />
            {format(new Date(), "MMMM yyyy")}
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-[#c9a84c] to-[#a88a3d] border-0 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Total Enquiries</p>
                <p className="text-3xl font-bold mt-1">{totalEnquiries}</p>
                <p className="text-white/70 text-xs mt-2 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {totalPending} pending
                </p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <MessageSquare className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#008060] to-[#006e52] border-0 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Confirmed</p>
                <p className="text-3xl font-bold mt-1">{stats.confirmedTour + stats.confirmedTaxi}</p>
                <p className="text-white/70 text-xs mt-2 flex items-center">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {conversionRate}% conversion
                </p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Tour Packages</p>
                <p className="text-3xl font-bold mt-1">{stats.totalPackages}</p>
                <p className="text-white/70 text-xs mt-2 flex items-center">
                  <Package className="h-3 w-3 mr-1" />
                  Active packages
                </p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Plane className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Taxi Fleet</p>
                <p className="text-3xl font-bold mt-1">{stats.totalVehicles}</p>
                <p className="text-white/70 text-xs mt-2 flex items-center">
                  <Car className="h-3 w-3 mr-1" />
                  {stats.totalTaxiEnquiries} bookings
                </p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Car className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart */}
        <Card className="lg:col-span-2 bg-white border-gray-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">Enquiries Overview</CardTitle>
              <Badge variant="outline" className="text-xs">Last 7 days</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="tourGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c9a84c" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#c9a84c" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="taxiGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#008060" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#008060" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Area type="monotone" dataKey="tour" stroke="#c9a84c" strokeWidth={2} fillOpacity={1} fill="url(#tourGradient)" name="Tour Enquiries" />
                  <Area type="monotone" dataKey="taxi" stroke="#008060" strokeWidth={2} fillOpacity={1} fill="url(#taxiGradient)" name="Taxi Bookings" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#c9a84c]" />
                <span className="text-sm text-gray-600">Tour Enquiries</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#008060]" />
                <span className="text-sm text-gray-600">Taxi Bookings</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-900">Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {statusData.map((status) => (
                <div key={status.name} className="flex items-center gap-2 text-sm">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: status.color }} />
                  <span className="text-gray-600">{status.name}</span>
                  <span className="text-gray-900 font-medium ml-auto">{status.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Alert */}
      {totalPending > 0 && (
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {totalPending} Pending {totalPending === 1 ? "Enquiry" : "Enquiries"} Need Attention
                </p>
                <p className="text-sm text-gray-600">
                  {stats.pendingTour} tour • {stats.pendingTaxi} taxi bookings waiting for response
                </p>
              </div>
            </div>
            <Button className="bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/25">
              Review Now
            </Button>
          </CardContent>
        </Card>
      )}

      {/* All Enquiries Section */}
      <Card className="bg-white border-gray-200">
        <CardHeader className="border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">All Enquiries</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Tour and taxi enquiries in one place</p>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList className="bg-gray-100">
                <TabsTrigger value="all" className="data-[state=active]:bg-white">
                  All ({allEnquiries.length})
                </TabsTrigger>
                <TabsTrigger value="tour" className="data-[state=active]:bg-white">
                  <Plane className="h-3.5 w-3.5 mr-1.5" />
                  Tours ({tourEnquiries.length})
                </TabsTrigger>
                <TabsTrigger value="taxi" className="data-[state=active]:bg-white">
                  <Car className="h-3.5 w-3.5 mr-1.5" />
                  Taxi ({taxiEnquiries.length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {filteredEnquiries.length === 0 ? (
              <div className="p-12 text-center">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No enquiries yet</p>
                <p className="text-sm text-gray-400">Enquiries will appear here when customers submit them</p>
              </div>
            ) : (
              filteredEnquiries.slice(0, 10).map((enquiry) => (
                <div
                  key={enquiry.id}
                  className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4"
                >
                  {/* Type Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    enquiry.type === "tour" 
                      ? "bg-[#c9a84c]/10 text-[#c9a84c]" 
                      : "bg-[#008060]/10 text-[#008060]"
                  }`}>
                    {enquiry.type === "tour" ? <Plane className="h-5 w-5" /> : <Car className="h-5 w-5" />}
                  </div>

                  {/* Customer Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 truncate">{enquiry.name}</p>
                      <Badge variant="outline" className={`text-xs ${getStatusBadge(enquiry.status)}`}>
                        {enquiry.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                      {enquiry.type === "tour" ? (
                        <>
                          <span className="truncate max-w-[200px]">
                            {(enquiry as TourEnquiry).tour_packages?.title || "General Enquiry"}
                          </span>
                          <span>•</span>
                          <span>{(enquiry as TourEnquiry).adults || 1} travelers</span>
                        </>
                      ) : (
                        <>
                          <span className="truncate">
                            {(enquiry as TaxiEnquiry).pickup_location} → {(enquiry as TaxiEnquiry).drop_location || "Local"}
                          </span>
                          <span>•</span>
                          <span className="capitalize">{(enquiry as TaxiEnquiry).trip_type}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Contact & Time */}
                  <div className="hidden md:flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{enquiry.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span>{format(new Date(enquiry.created_at), "dd MMM, hh:mm a")}</span>
                    </div>
                  </div>

                  {/* Action */}
                  <Link
                    to={enquiry.type === "tour" ? "/admin/enquiries" : "/admin/taxi"}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Link>
                </div>
              ))
            )}
          </div>

          {filteredEnquiries.length > 10 && (
            <div className="p-4 border-t border-gray-100 text-center">
              <Link
                to={activeTab === "taxi" ? "/admin/taxi" : "/admin/enquiries"}
                className="text-sm font-medium text-[#008060] hover:text-[#006e52] inline-flex items-center gap-1"
              >
                View all {filteredEnquiries.length} enquiries
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.newsletterSubs}</p>
                <p className="text-xs text-gray-500">Newsletter Subscribers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{conversionRate}%</p>
                <p className="text-xs text-gray-500">Conversion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingTour}</p>
                <p className="text-xs text-gray-500">Pending Tour Enquiries</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <Car className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingTaxi}</p>
                <p className="text-xs text-gray-500">Pending Taxi Bookings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;