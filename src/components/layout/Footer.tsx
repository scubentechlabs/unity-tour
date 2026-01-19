import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Facebook, 
  Instagram, 
  Send,
  CheckCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const quickLinks = [
  { name: "Our Services", path: "/services" },
  { name: "Domestic Tours", path: "/domestic-tours" },
  { name: "International Tours", path: "/international-tours" },
  { name: "Taxi Booking", path: "/taxi" },
  { name: "Flight Tickets", path: "/flights" },
  { name: "About Us", path: "/about" },
  { name: "Contact Us", path: "/contact" },
];

const supportLinks = [
  { name: "FAQ", path: "/faq" },
  { name: "Terms & Conditions", path: "/terms" },
  { name: "Privacy Policy", path: "/privacy" },
  { name: "Cancellation Policy", path: "/terms" },
  { name: "My Bookings", path: "/dashboard" },
];

const popularDestinations = [
  "Goa",
  "Kerala",
  "Rajasthan",
  "Kashmir",
  "Himachal",
  "Andaman",
];

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: insertError } = await supabase
        .from("newsletter_subscriptions")
        .insert({ email: email.trim().toLowerCase() });

      if (insertError) {
        if (insertError.code === "23505") {
          // Unique constraint violation - already subscribed
          setError("This email is already subscribed");
        } else {
          throw insertError;
        }
        setIsSubmitting(false);
        return;
      }

      setIsSubscribed(true);
      setEmail("");

      toast({
        title: "Successfully subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      });

      // Send welcome email (fire and forget - don't block UI)
      supabase.functions.invoke("send-newsletter-welcome", {
        body: { email: email.trim().toLowerCase() },
      }).catch((err) => {
        console.error("Failed to send welcome email:", err);
      });
    } catch (err) {
      console.error("Newsletter subscription error:", err);
      toast({
        title: "Subscription failed",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-secondary border-t border-border">
      {/* Newsletter Section */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
              Subscribe to Our <span className="text-primary">Newsletter</span>
            </h3>
            <p className="text-muted-foreground mb-6">
              Get exclusive deals, travel tips, and destination guides straight to your inbox.
            </p>
            
            {isSubscribed ? (
              <div className="flex items-center justify-center gap-2 text-primary">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">You're subscribed! Check your inbox for updates.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <Input 
                      type="email" 
                      placeholder="Enter your email" 
                      className={`bg-background border-border ${error ? 'border-destructive' : ''}`}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      disabled={isSubmitting}
                    />
                  </div>
                  <Button 
                    type="submit"
                    className="bg-gradient-gold hover:opacity-90 text-primary-foreground font-semibold shadow-gold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    {isSubmitting ? "Subscribing..." : "Subscribe"}
                  </Button>
                </div>
                {error && (
                  <p className="text-destructive text-sm mt-2 text-left">{error}</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-6">
              <img 
                src={logo} 
                alt="Unity Global Tours" 
                className="h-20 w-auto"
              />
            </div>
            <p className="text-muted-foreground text-sm mb-6">
              Your trusted partner for premium travel experiences. We curate unforgettable journeys 
              with luxury accommodations, expert guides, and personalized service.
            </p>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/unityglobaltours/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/unityglobaltours/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-6">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="font-display text-sm font-semibold text-foreground mt-6 mb-3">
              Popular Destinations
            </h4>
            <div className="flex flex-wrap gap-2">
              {popularDestinations.map((dest) => (
                <span 
                  key={dest}
                  className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground"
                >
                  {dest}
                </span>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=4+Unique+Plaza+Somnath+Bypass+Road+Bhalpara+Veraval+362268+Gir+Somnath"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  4, Unique Plaza, Somnath Bypass Road,<br />
                  Bhalpara, Veraval - 362268 (Gir-Somnath)
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <div className="flex flex-col">
                  <a href="tel:+917005050020" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    +91 70050 50020
                  </a>
                  <a href="tel:+917005050030" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    +91 70050 50030
                  </a>
                  <a href="tel:+917005050040" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    +91 70050 50040
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <a href="mailto:booking@unityglobaltours.com" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  booking@unityglobaltours.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground text-sm">
                  Daily: 9:00 AM - 9:00 PM
                </span>
              </li>
            </ul>
            
            {/* Social Media Links */}
            <div className="mt-6">
              <h4 className="font-display text-sm font-semibold text-foreground mb-3">Follow Us</h4>
              <div className="flex gap-3">
                <a 
                  href="https://www.facebook.com/unityglobaltours/"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-muted hover:bg-primary/10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a 
                  href="https://www.instagram.com/unityglobaltours/"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-muted hover:bg-primary/10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2026 Unity Global Tours. All rights reserved. | Crafted With ❤️ <a href="https://arsonsinformatique.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Arsons Informatique</a></p>
            <div className="flex gap-6">
              <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
              <Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
