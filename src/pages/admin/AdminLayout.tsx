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
  UserCheck,
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
  { name: "Driver Partners", path: "/admin/drivers", icon: UserCheck },
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar - Clean Light Style */}
      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-white border-r border-slate-200 transition-all duration-200 z-40 ${
          isSidebarOpen ? "w-60" : "w-[58px]"
        }`}
      >
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-slate-200">
          <Link to="/" className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
              <Store className="h-5 w-5 text-white" />
            </div>
            {isSidebarOpen && (
              <span className="font-semibold text-slate-800 text-sm truncate">Unity Global Tours</span>
            )}
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 font-medium border border-emerald-200"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                }`}
                title={!isSidebarOpen ? link.name : undefined}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-emerald-600" : ""}`} />
                {isSidebarOpen && <span>{link.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="p-2 border-t border-slate-200">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg w-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all text-sm"
          >
            <ChevronLeft className={`h-5 w-5 flex-shrink-0 transition-transform ${!isSidebarOpen ? "rotate-180" : ""}`} />
            {isSidebarOpen && <span className="font-medium">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-slate-200 z-40 flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            {isMobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
              <Store className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-slate-800 text-sm">Unity Tours</span>
          </Link>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-medium text-sm shadow-sm">
              {userEmail.charAt(0).toUpperCase()}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white border-slate-200">
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-slate-800">{userEmail}</p>
            </div>
            <DropdownMenuSeparator className="bg-slate-200" />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-slate-900/50"
          onClick={() => setIsMobileSidebarOpen(false)}
        >
          <div
            className="w-60 h-full bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Logo */}
            <div className="h-14 flex items-center px-4 border-b border-slate-200">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
                  <Store className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold text-slate-800 text-sm">Unity Global Tours</span>
              </Link>
            </div>

            {/* Mobile Nav Links */}
            <nav className="py-3 px-2 space-y-1">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700 font-medium border border-emerald-200"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? "text-emerald-600" : ""}`} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Logout */}
            <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-slate-200">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 rounded-lg w-full text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all text-sm"
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
        <header className="hidden lg:flex h-14 bg-white border-b border-slate-200 items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search..."
                className="pl-10 h-9 bg-slate-50 border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-emerald-500 text-sm text-slate-800 placeholder:text-slate-400"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:text-slate-700 hover:bg-slate-100">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-medium text-sm hover:from-emerald-600 hover:to-emerald-700 transition-colors shadow-sm">
                  {userEmail.charAt(0).toUpperCase()}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border-slate-200">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-slate-800">{userEmail}</p>
                  <p className="text-xs text-slate-500">Administrator</p>
                </div>
                <DropdownMenuSeparator className="bg-slate-200" />
                <DropdownMenuItem asChild className="text-slate-700 focus:text-slate-800 focus:bg-slate-100">
                  <Link to="/" className="cursor-pointer">
                    <Store className="h-4 w-4 mr-2" />
                    View website
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-200" />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-3 sm:p-4 lg:p-6 pt-16 lg:pt-6 min-h-[calc(100vh-3.5rem)] lg:min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
