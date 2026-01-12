import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DomesticTours from "./pages/DomesticTours";
import InternationalTours from "./pages/InternationalTours";
import TourDetail from "./pages/TourDetail";
import TaxiBooking from "./pages/TaxiBooking";
import Flights from "./pages/Flights";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Auth from "./pages/Auth";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import HeroSlidesAdmin from "./pages/admin/HeroSlidesAdmin";
import TourPackagesAdmin from "./pages/admin/TourPackagesAdmin";
import EnquiriesAdmin from "./pages/admin/EnquiriesAdmin";
import NewsletterAdmin from "./pages/admin/NewsletterAdmin";
import TaxiAdmin from "./pages/admin/TaxiAdmin";
import AdminUsersAdmin from "./pages/admin/AdminUsersAdmin";
import SettingsAdmin from "./pages/admin/SettingsAdmin";
import Unsubscribe from "./pages/Unsubscribe";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/domestic-tours" element={<DomesticTours />} />
          <Route path="/international-tours" element={<InternationalTours />} />
          <Route path="/domestic-tours/:slug" element={<TourDetail />} />
          <Route path="/international-tours/:slug" element={<TourDetail />} />
          <Route path="/taxi" element={<TaxiBooking />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/unsubscribe" element={<Unsubscribe />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="hero-slides" element={<HeroSlidesAdmin />} />
            <Route path="tours" element={<TourPackagesAdmin />} />
            <Route path="enquiries" element={<EnquiriesAdmin />} />
            <Route path="newsletter" element={<NewsletterAdmin />} />
            <Route path="taxi" element={<TaxiAdmin />} />
            <Route path="users" element={<AdminUsersAdmin />} />
            <Route path="settings" element={<SettingsAdmin />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
