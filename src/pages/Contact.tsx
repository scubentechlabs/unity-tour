import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { nameSchema, emailSchema, phoneSchema, onlyNumbers, getValidationErrors } from "@/lib/validation";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  CheckCircle,
  Star,
  ExternalLink,
} from "lucide-react";

const contactInfo = [
  {
    icon: Phone,
    title: "Phone",
    details: ["+91 70050 50020", "+91 70050 50030", "+91 70050 50040"],
    action: "tel:+917005050020",
  },
  {
    icon: Mail,
    title: "Email",
    details: ["booking@unityglobaltours.com"],
    action: "mailto:booking@unityglobaltours.com",
  },
  {
    icon: MapPin,
    title: "Address",
    details: ["4, Unique Plaza, Somnath Bypass Road, Bhalpara", "Veraval, Gujarat 362268 (India)"],
    action: "https://maps.google.com/?q=Unique+Plaza+Somnath+Bypass+Road+Veraval+Gujarat",
  },
  {
    icon: Clock,
    title: "Working Hours",
    details: ["Daily: 9:00 AM - 9:00 PM"],
  },
];

const socialLinks = [
  { icon: Facebook, href: "https://www.facebook.com/unityglobaltours/", label: "Facebook" },
  { icon: Instagram, href: "https://www.instagram.com/unityglobaltours/", label: "Instagram" },
  { icon: Twitter, href: "https://x.com/unityglobaltour", label: "Twitter" },
  { icon: Youtube, href: "https://www.youtube.com/channel/UChDOlfxoo0jB5OKWNJfnyNQ", label: "YouTube" },
];

const Contact = () => {
  const contactSchema = z.object({
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    subject: z.string().trim().min(2, "Subject is required").max(200, "Subject is too long"),
    message: z.string().trim().min(5, "Message must be at least 5 characters").max(1000, "Message is too long"),
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      setErrors(getValidationErrors(result));
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke("send-enquiry-notification", {
        body: {
          type: "contact",
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
        },
      });

      if (error) throw error;

      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours.",
      });

      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setErrors({});
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Failed to send message",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <SEOHead
        title="Contact Unity Global Tours - Veraval Travel Agency | Call +91 70050 50020"
        description="Contact Unity Global Tours for tour bookings, taxi services, and travel inquiries. Visit our Veraval office or call +91 70050 50020. We're available 24/7."
        canonicalPath="/contact"
        keywords="Unity Global Tours contact, Veraval travel agency contact, taxi booking Veraval, travel enquiry Gujarat"
      />
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-primary text-sm font-medium mb-6">
              Get In Touch
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Contact <span className="text-primary">Us</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Have questions about our tours? Need help planning your trip?
              We're here to assist you every step of the way.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-1 space-y-6"
            >
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                  Contact Information
                </h2>
                <p className="text-muted-foreground">
                  Reach out to us through any of these channels.
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <motion.div
                      key={info.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">
                            {info.title}
                          </h3>
                          {info.details.map((detail, i) => (
                            <p key={i} className="text-sm text-muted-foreground">
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Social Links */}
              <div className="pt-6">
                <h3 className="font-semibold text-foreground mb-4">
                  Follow Us
                </h3>
                <div className="flex gap-3">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        className="w-10 h-10 bg-secondary hover:bg-primary/10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                        aria-label={social.label}
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-foreground">
                      Send us a Message
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Fill out the form and we'll respond within 24 hours.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Enter your name"
                        className={`bg-white text-gray-900 placeholder:text-gray-500 ${errors.name ? "border-destructive" : ""}`}
                      />
                      {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Enter your email"
                        className={`bg-white text-gray-900 placeholder:text-gray-500 ${errors.email ? "border-destructive" : ""}`}
                      />
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", onlyNumbers(e.target.value))}
                        placeholder="Enter 10-digit phone number"
                        maxLength={10}
                        className={`bg-white text-gray-900 placeholder:text-gray-500 ${errors.phone ? "border-destructive" : ""}`}
                      />
                      {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        placeholder="What's this about?"
                        className={`bg-white text-gray-900 placeholder:text-gray-500 ${errors.subject ? "border-destructive" : ""}`}
                      />
                      {errors.subject && <p className="text-sm text-destructive">{errors.subject}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Tell us how we can help..."
                      rows={5}
                      className={`bg-white text-gray-900 placeholder:text-gray-500 ${errors.message ? "border-destructive" : ""}`}
                    />
                    {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={submitting}
                  >
                    {submitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Google Business Profile & Map Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Visit Our Office
            </h2>
            <p className="text-muted-foreground mt-2">
              Come meet us in person at our Veraval office.
            </p>
          </motion.div>

          {/* Google Business Profile Verification Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <a
              href="https://g.co/kgs/8VqBPQz"
              target="_blank"
              rel="noopener noreferrer"
              className="max-w-xl mx-auto flex items-center justify-between bg-card border border-border rounded-xl p-4 md:p-6 hover:border-primary/50 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-display font-bold text-foreground">Unity Global Tours</span>
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    ))}
                    <span className="text-sm text-muted-foreground ml-1">4.8 (250+ reviews)</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Verified Business on Google</p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2 text-primary group-hover:translate-x-1 transition-transform">
                <span className="text-sm font-medium">View on Google</span>
                <ExternalLink className="w-4 h-4" />
              </div>
            </a>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-2xl overflow-hidden h-96 relative"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3726.642455710976!2d70.39297549999999!3d20.926699799999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bfd33ca6c3ce013%3A0x1988cccbc00d0f03!2sUnity%20Global%20Tours!5e0!3m2!1sen!2sin!4v1768826633003!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Unity Global Tours - Veraval Office Location"
              className="w-full h-full"
            />
            <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
              <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg px-4 py-2">
                <p className="text-sm font-medium text-foreground">Unity Global Tours</p>
                <p className="text-xs text-muted-foreground">4, Unique Plaza, Somnath Bypass Road, Veraval</p>
              </div>
              <a
                href="https://maps.app.goo.gl/1zULepz8UYyf2mQo9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg"
              >
                <MapPin className="h-4 w-4" />
                Get Directions
              </a>
            </div>
          </motion.div>

          {/* Additional Trust Signals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {[
              { label: "Established", value: "2014" },
              { label: "Google Rating", value: "4.8 ★" },
              { label: "Reviews", value: "250+" },
              { label: "Response Time", value: "< 1 Hour" },
            ].map((item, index) => (
              <div key={index} className="text-center bg-card border border-border rounded-lg p-3">
                <p className="text-lg md:text-xl font-bold text-primary">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
