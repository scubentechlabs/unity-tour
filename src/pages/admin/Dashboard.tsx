import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import {
  Image,
  Package,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  Car,
  Users,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Stats {
  totalSlides: number;
  totalPackages: number;
  totalEnquiries: number;
  pendingEnquiries: number;
  totalVehicles: number;
  taxiEnquiries: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalSlides: 0,
    totalPackages: 0,
    totalEnquiries: 0,
    pendingEnquiries: 0,
    totalVehicles: 0,
    taxiEnquiries: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [slidesRes, packagesRes, enquiriesRes, pendingRes, vehiclesRes, taxiEnquiriesRes] = await Promise.all([
        supabase.from("hero_slides").select("id", { count: "exact", head: true }),
        supabase.from("tour_packages").select("id", { count: "exact", head: true }),
        supabase.from("tour_enquiries").select("id", { count: "exact", head: true }),
        supabase.from("tour_enquiries").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("taxi_vehicles").select("id", { count: "exact", head: true }),
        supabase.from("taxi_enquiries").select("id", { count: "exact", head: true }),
      ]);

      setStats({
        totalSlides: slidesRes.count || 0,
        totalPackages: packagesRes.count || 0,
        totalEnquiries: enquiriesRes.count || 0,
        pendingEnquiries: pendingRes.count || 0,
        totalVehicles: vehiclesRes.count || 0,
        taxiEnquiries: taxiEnquiriesRes.count || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: "Tour Packages",
      value: stats.totalPackages,
      description: "Active packages available",
      icon: Package,
      link: "/admin/tours",
      color: "bg-blue-500",
    },
    {
      label: "Tour Enquiries",
      value: stats.totalEnquiries,
      description: `${stats.pendingEnquiries} pending`,
      icon: MessageSquare,
      link: "/admin/enquiries",
      color: "bg-orange-500",
    },
    {
      label: "Taxi Vehicles",
      value: stats.totalVehicles,
      description: "Vehicles in fleet",
      icon: Car,
      link: "/admin/taxi",
      color: "bg-purple-500",
    },
    {
      label: "Taxi Bookings",
      value: stats.taxiEnquiries,
      description: "Total bookings",
      icon: Activity,
      link: "/admin/taxi",
      color: "bg-teal-500",
    },
  ];

  const quickActions = [
    {
      title: "Add new tour package",
      description: "Create a new domestic or international tour",
      link: "/admin/tours",
      icon: Package,
    },
    {
      title: "Manage hero slides",
      description: "Update homepage carousel images",
      link: "/admin/hero-slides",
      icon: Image,
    },
    {
      title: "View enquiries",
      description: "Respond to customer enquiries",
      link: "/admin/enquiries",
      icon: MessageSquare,
    },
    {
      title: "Manage vehicles",
      description: "Add or update taxi fleet",
      link: "/admin/taxi",
      icon: Car,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[#303030]">
          Home
        </h1>
        <p className="text-[#637381] text-sm mt-1">
          Welcome to your admin dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} to={stat.link}>
              <Card className="bg-white border-[#e1e3e5] hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-[#637381]">{stat.label}</p>
                      <p className="text-3xl font-semibold text-[#303030]">
                        {loading ? "—" : stat.value}
                      </p>
                      <p className="text-xs text-[#8c9196]">{stat.description}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="bg-white border-[#e1e3e5]">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-[#303030]">Quick actions</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.title}
                  to={action.link}
                  className="flex items-center gap-4 p-4 rounded-lg border border-[#e1e3e5] hover:border-[#008060] hover:bg-[#f6f6f7] transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#f6f6f7] group-hover:bg-[#e3f1ee] flex items-center justify-center transition-colors">
                    <Icon className="h-5 w-5 text-[#637381] group-hover:text-[#008060]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#303030] text-sm">{action.title}</p>
                    <p className="text-xs text-[#8c9196] truncate">{action.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#8c9196] group-hover:text-[#008060] transition-colors" />
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Pending Tasks Banner */}
      {stats.pendingEnquiries > 0 && (
        <Card className="bg-[#fff8e5] border-[#ffcc00]">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#ffcc00] flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-[#7a5c00]" />
              </div>
              <div>
                <p className="font-medium text-[#303030]">
                  You have {stats.pendingEnquiries} pending {stats.pendingEnquiries === 1 ? 'enquiry' : 'enquiries'}
                </p>
                <p className="text-sm text-[#637381]">Respond to customers to improve conversion</p>
              </div>
            </div>
            <Button asChild className="bg-[#303030] hover:bg-[#1a1a1a] text-white">
              <Link to="/admin/enquiries">View enquiries</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
