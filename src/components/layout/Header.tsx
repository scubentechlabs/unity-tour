import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Mail, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WishlistSheet } from "@/components/WishlistSheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import logo from "@/assets/logo.png";
import upiQrCode from "@/assets/upi-qr-code.jpeg";

const navLinks = [
  { name: "Taxi Booking", path: "/taxi" },
  { name: "Domestic Tours", path: "/domestic-tours" },
  { name: "International Tours", path: "/international-tours" },
  { name: "Flights", path: "/flights" },
  { name: "Services", path: "/services" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Top Bar */}
      <div className="hidden lg:block bg-secondary border-b border-border">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <a href="tel:+917005050020" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <Phone className="h-4 w-4" />
              +91 70050 50020
            </a>
            <a href="mailto:booking@unityglobaltours.com" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <Mail className="h-4 w-4" />
              booking@unityglobaltours.com
            </a>
          </div>
          {/* UPI Payment Button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="border-primary/30 hover:bg-primary/10">
                <IndianRupee className="h-4 w-4 mr-2 text-primary" />
                <span className="text-primary font-medium">Pay via UPI</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-center text-xl font-display">Pay via UPI</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center space-y-4 py-4">
                <p className="text-2xl font-bold text-foreground">UNITY GLOBAL TOURS</p>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="font-semibold text-primary">UPI ID:</span>
                  <a 
                    href="upi://pay?pa=unityglobaltours@idfcbank" 
                    className="text-primary hover:underline"
                  >
                    unityglobaltours@idfcbank
                  </a>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Scan this QR code with any UPI app to transfer
                </p>
                <div className="bg-white p-4 rounded-xl shadow-md">
                  <img 
                    src={upiQrCode} 
                    alt="Unity Global Tours UPI QR Code" 
                    className="w-64 h-64 object-contain"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Powered by</span>
                  <span className="font-semibold text-red-600">IDFC FIRST Bank</span>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md shadow-lg border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img 
                src={logo} 
                alt="Unity Global Tours" 
                className="h-16 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.path
                      ? "text-primary bg-primary/10"
                      : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-2">
              <WishlistSheet />
              <Button 
                onClick={() => navigate("/booking")}
                className="bg-gradient-gold hover:opacity-90 text-primary-foreground font-semibold shadow-gold"
              >
                Book Now
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-foreground"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-background border-t border-border"
            >
              <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      location.pathname === link.path
                        ? "text-primary bg-primary/10"
                        : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-4 border-t border-border mt-2">
                  <Button 
                    onClick={() => navigate("/booking")}
                    className="w-full mt-2 bg-gradient-gold hover:opacity-90 text-primary-foreground font-semibold"
                  >
                    Book Now
                  </Button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
