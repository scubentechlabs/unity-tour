import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard,
  Image,
  Package,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Car,
  ChevronLeft,
  Store,
  Bell,
  Search,
  CircleUser,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const sidebarLinks = [
  { name: "Home", path: "/admin", icon: LayoutDashboard },
  { name: "Hero Slides", path: "/admin/hero-slides", icon: Image },
  { name: "Tour Packages", path: "/admin/tours", icon: Package },
  { name: "Enquiries", path: "/admin/enquiries", icon: MessageSquare },
  { name: "Newsletter", path: "/admin/newsletter", icon: Mail },
  { name: "Taxi Management", path: "/admin/taxi", icon: Car },
  { name: "Admin Users", path: "/admin/users", icon: Users },
  { name: "Settings", path: "/admin/settings", icon: Settings },
];

const AdminLayout = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      setUserEmail(user.email || "");

      const { data: adminUser } = await supabase
        .from("admin_users")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!adminUser) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      navigate("/auth");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
    toast({ title: "Logged out successfully" });
  };

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-[#f6f6f7] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#008060] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f6f7] flex">
      {/* Desktop Sidebar - Shopify Dark Style */}
      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-[#1a1a1a] transition-all duration-200 z-40 ${
          isSidebarOpen ? "w-60" : "w-[58px]"
        }`}
      >
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-[#333]">
          <Link to="/" className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 bg-[#008060] rounded-md flex items-center justify-center flex-shrink-0">
              <Store className="h-5 w-5 text-white" />
            </div>
            {isSidebarOpen && (
              <span className="font-semibold text-white text-sm truncate">Unity Global Tours</span>
            )}
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm ${
                  isActive
                    ? "bg-[#333] text-white"
                    : "text-[#b5b5b5] hover:bg-[#2a2a2a] hover:text-white"
                }`}
                title={!isSidebarOpen ? link.name : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {isSidebarOpen && <span className="font-medium">{link.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="p-2 border-t border-[#333]">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center gap-3 px-3 py-2 rounded-md w-full text-[#b5b5b5] hover:bg-[#2a2a2a] hover:text-white transition-all text-sm"
          >
            <ChevronLeft className={`h-5 w-5 flex-shrink-0 transition-transform ${!isSidebarOpen ? "rotate-180" : ""}`} />
            {isSidebarOpen && <span className="font-medium">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-[#e1e3e5] z-40 flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-2 -ml-2 text-[#303030] hover:bg-[#f6f6f7] rounded-md"
          >
            {isMobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#008060] rounded-md flex items-center justify-center">
              <Store className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-[#303030] text-sm">Unity Tours</span>
          </Link>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-8 h-8 rounded-full bg-[#008060] flex items-center justify-center text-white font-medium text-sm">
              {userEmail.charAt(0).toUpperCase()}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-[#303030]">{userEmail}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50"
          onClick={() => setIsMobileSidebarOpen(false)}
        >
          <div
            className="w-60 h-full bg-[#1a1a1a] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Logo */}
            <div className="h-14 flex items-center px-4 border-b border-[#333]">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#008060] rounded-md flex items-center justify-center">
                  <Store className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold text-white text-sm">Unity Global Tours</span>
              </Link>
            </div>

            {/* Mobile Nav Links */}
            <nav className="py-3 px-2 space-y-0.5">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm ${
                      isActive
                        ? "bg-[#333] text-white"
                        : "text-[#b5b5b5] hover:bg-[#2a2a2a] hover:text-white"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Logout */}
            <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-[#333]">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 rounded-md w-full text-[#b5b5b5] hover:bg-[#2a2a2a] hover:text-red-400 transition-all text-sm"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Log out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div
        className={`flex-1 min-h-screen transition-all duration-200 ${
          isSidebarOpen ? "lg:ml-60" : "lg:ml-[58px]"
        }`}
      >
        {/* Top Header Bar - Desktop */}
        <header className="hidden lg:flex h-14 bg-white border-b border-[#e1e3e5] items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8c9196]" />
              <Input
                placeholder="Search"
                className="pl-10 h-9 bg-[#f6f6f7] border-[#e1e3e5] focus:bg-white focus:border-[#008060] text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-[#637381] hover:text-[#303030]">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-8 h-8 rounded-full bg-[#008060] flex items-center justify-center text-white font-medium text-sm hover:bg-[#006e52] transition-colors">
                  {userEmail.charAt(0).toUpperCase()}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-[#303030]">{userEmail}</p>
                  <p className="text-xs text-[#637381]">Administrator</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/" className="cursor-pointer">
                    <Store className="h-4 w-4 mr-2" />
                    View website
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6 pt-16 lg:pt-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
