import { Layout } from "@/components/layout/Layout";
import { Shield, Eye, Lock, Database, UserCheck, Globe, Phone, Mail, MapPin } from "lucide-react";

const Privacy = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-primary/10 via-background to-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Privacy <span className="text-primary">Policy</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Your privacy is important to us. Learn how we collect, use, and protect your data.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Last Updated: January 2026
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Introduction */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-sm border border-border mb-8">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Introduction
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Unity Global Tours ("we," "our," or "us") is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                when you visit our website or use our travel services. Please read this policy carefully 
                to understand our practices regarding your personal data.
              </p>
            </div>

            {/* Information We Collect */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-sm border border-border mb-8">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Information We Collect
              </h2>
              
              <h3 className="font-semibold text-foreground mt-4 mb-2">Personal Information</h3>
              <ul className="space-y-2 text-muted-foreground mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Full name, date of birth, and gender
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Contact information (email address, phone number, address)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Passport details and travel document information
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Payment information (credit/debit card details, bank account information)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Travel preferences and special requirements
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Emergency contact details
                </li>
              </ul>

              <h3 className="font-semibold text-foreground mt-4 mb-2">Automatically Collected Information</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  IP address and browser type
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Device information and operating system
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Pages visited and time spent on our website
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Cookies and similar tracking technologies
                </li>
              </ul>
            </div>

            {/* How We Use Your Information */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-sm border border-border mb-8">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                How We Use Your Information
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <strong>Booking Services:</strong> To process and manage your travel bookings, reservations, and inquiries.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <strong>Communication:</strong> To send booking confirmations, travel updates, and respond to your queries.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <strong>Payment Processing:</strong> To process payments and prevent fraudulent transactions.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <strong>Marketing:</strong> To send promotional offers and newsletters (with your consent).
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <strong>Legal Compliance:</strong> To comply with legal obligations and regulatory requirements.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <strong>Service Improvement:</strong> To analyze usage patterns and improve our services.
                </li>
              </ul>
            </div>

            {/* Information Sharing */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-sm border border-border mb-8">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Information Sharing
              </h2>
              <p className="text-muted-foreground mb-4">
                We may share your information with:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <strong>Travel Partners:</strong> Airlines, hotels, transport providers to fulfill your bookings.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <strong>Payment Processors:</strong> Secure payment gateways for transaction processing.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <strong>Government Authorities:</strong> Immigration, customs, or law enforcement when legally required.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <strong>Insurance Providers:</strong> For travel insurance claims processing.
                </li>
              </ul>
              <p className="text-muted-foreground mt-4">
                We do not sell, rent, or trade your personal information to third parties for marketing purposes.
              </p>
            </div>

            {/* Data Security */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-sm border border-border mb-8">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Data Security
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  We implement industry-standard encryption (SSL/TLS) to protect data transmission.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Access to personal data is restricted to authorized personnel only.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Regular security audits and vulnerability assessments are conducted.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Payment information is processed through PCI-DSS compliant systems.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  We maintain secure backup systems to prevent data loss.
                </li>
              </ul>
            </div>

            {/* Your Rights */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-sm border border-border mb-8">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                Your Rights
              </h2>
              <p className="text-muted-foreground mb-4">You have the right to:</p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <strong>Access:</strong> Request a copy of your personal data we hold.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <strong>Correction:</strong> Request correction of inaccurate or incomplete data.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <strong>Deletion:</strong> Request deletion of your data (subject to legal requirements).
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <strong>Opt-out:</strong> Unsubscribe from marketing communications at any time.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <strong>Portability:</strong> Request your data in a structured, machine-readable format.
                </li>
              </ul>
            </div>

            {/* Cookies Policy */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-sm border border-border mb-8">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                Cookies Policy
              </h2>
              <p className="text-muted-foreground mb-4">
                Our website uses cookies to enhance your browsing experience:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <strong>Essential Cookies:</strong> Required for website functionality and security.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <strong>Analytics Cookies:</strong> Help us understand how visitors interact with our site.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <strong>Preference Cookies:</strong> Remember your settings and preferences.
                </li>
              </ul>
              <p className="text-muted-foreground mt-4">
                You can manage cookie preferences through your browser settings.
              </p>
            </div>

            {/* Data Retention */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-sm border border-border mb-8">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                Data Retention
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Booking records are retained for 7 years for legal and accounting purposes.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Marketing preferences are kept until you opt out.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Inactive accounts may be deleted after 3 years of inactivity.
                </li>
              </ul>
            </div>

            {/* Children's Privacy */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-sm border border-border mb-8">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                Children's Privacy
              </h2>
              <p className="text-muted-foreground">
                Our services are not directed to children under 18. We do not knowingly collect 
                personal information from children without parental consent. For family bookings, 
                the parent or guardian is responsible for providing children's information.
              </p>
            </div>

            {/* Policy Updates */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-sm border border-border mb-8">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                Policy Updates
              </h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. Changes will be posted on this page 
                with an updated revision date. We encourage you to review this policy periodically. 
                Continued use of our services after changes constitutes acceptance of the updated policy.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-primary/5 rounded-xl p-6 md:p-8 border border-primary/20">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                Contact Us
              </h2>
              <p className="text-muted-foreground mb-4">
                For privacy-related inquiries or to exercise your rights, please contact us:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>4, Unique Plaza, Somnath Bypass Road, Bhalpara, Veraval - 362268</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="h-5 w-5 text-primary" />
                  <a href="tel:+917005050020" className="hover:text-primary transition-colors">
                    +91 70050 50020
                  </a>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="h-5 w-5 text-primary" />
                  <a href="mailto:booking@unityglobaltours.com" className="hover:text-primary transition-colors">
                    booking@unityglobaltours.com
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Privacy;
