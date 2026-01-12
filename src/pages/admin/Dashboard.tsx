import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import {
  Image,
  Package,
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

interface Stats {
  totalSlides: number;
  totalPackages: number;
  totalEnquiries: number;
  pendingEnquiries: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalSlides: 0,
    totalPackages: 0,
    totalEnquiries: 0,
    pendingEnquiries: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [slidesRes, packagesRes, enquiriesRes, pendingRes] = await Promise.all([
        supabase.from("hero_slides").select("id", { count: "exact", head: true }),
        supabase.from("tour_packages").select("id", { count: "exact", head: true }),
        supabase.from("tour_enquiries").select("id", { count: "exact", head: true }),
        supabase.from("tour_enquiries").select("id", { count: "exact", head: true }).eq("status", "pending"),
      ]);

      setStats({
        totalSlides: slidesRes.count || 0,
        totalPackages: packagesRes.count || 0,
        totalEnquiries: enquiriesRes.count || 0,
        pendingEnquiries: pendingRes.count || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: "Hero Slides",
      value: stats.totalSlides,
      icon: Image,
      link: "/admin/hero-slides",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Tour Packages",
      value: stats.totalPackages,
      icon: Package,
      link: "/admin/tours",
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "Total Enquiries",
      value: stats.totalEnquiries,
      icon: MessageSquare,
      link: "/admin/enquiries",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      label: "Pending Enquiries",
      value: stats.pendingEnquiries,
      icon: TrendingUp,
      link: "/admin/enquiries",
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Welcome to your admin panel
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={stat.link}
                className="block bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg ${stat.bg}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="mt-4 text-3xl font-display font-bold text-foreground">
                  {loading ? "—" : stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/admin/hero-slides"
            className="flex items-center gap-3 p-4 rounded-lg bg-secondary hover:bg-primary/10 transition-colors"
          >
            <Image className="h-5 w-5 text-primary" />
            <span className="text-foreground font-medium">Manage Hero Slides</span>
          </Link>
          <Link
            to="/admin/tours"
            className="flex items-center gap-3 p-4 rounded-lg bg-secondary hover:bg-primary/10 transition-colors"
          >
            <Package className="h-5 w-5 text-primary" />
            <span className="text-foreground font-medium">Manage Tour Packages</span>
          </Link>
          <Link
            to="/admin/enquiries"
            className="flex items-center gap-3 p-4 rounded-lg bg-secondary hover:bg-primary/10 transition-colors"
          >
            <MessageSquare className="h-5 w-5 text-primary" />
            <span className="text-foreground font-medium">View Enquiries</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
