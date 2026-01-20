import { Layout } from "@/components/layout/Layout";
import { FileText, AlertCircle, Shield, CreditCard, Users, MapPin, Phone, Mail } from "lucide-react";

const Terms = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-primary/10 via-background to-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Terms & <span className="text-primary">Conditions</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Please read these terms carefully before using our services
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
          <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
            
            {/* Introduction */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-sm border border-border mb-8">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                Introduction
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to Unity Global Tours. These Terms and Conditions govern your use of our website and services. 
                By accessing our website or booking any of our services, you agree to be bound by these terms. 
                If you do not agree with any part of these terms, please do not use our services.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Unity Global Tours is a registered travel agency operating from Veraval, Gujarat, India. 
                We specialize in domestic and international tour packages, taxi services, and train & flight ticket bookings.
              </p>
            </div>

            {/* Booking & Reservations */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-sm border border-border mb-8">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Booking & Reservations
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  All bookings are subject to availability and confirmation by Unity Global Tours.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  A minimum deposit of 30% of the total package cost is required to confirm your booking.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Full payment must be made at least 15 days before the departure date.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Booking confirmation will be sent via email within 24-48 hours of receiving the deposit.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Prices are subject to change without prior notice until booking is confirmed.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  All rates are quoted in Indian Rupees (INR) unless otherwise specified.
                </li>
              </ul>
            </div>

            {/* Payment Terms */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-sm border border-border mb-8">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Payment Terms
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  We accept payments via Bank Transfer, UPI, Credit/Debit Cards, and Cash.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  For international tours, payments may be accepted in USD or EUR at prevailing exchange rates.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Any bank charges or currency conversion fees are to be borne by the customer.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  GST and other applicable taxes will be charged as per government regulations.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Payment receipts will be provided for all transactions.
                </li>
              </ul>
            </div>

            {/* Travel Documents */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-sm border border-border mb-8">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Travel Documents
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  It is the traveler's responsibility to ensure valid travel documents (passport, visa, etc.).
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Passport must be valid for at least 6 months from the date of travel for international trips.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Unity Global Tours is not responsible for denied entry due to invalid documents.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  We can assist with visa applications but do not guarantee visa approval.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Original ID proof is mandatory for all domestic travel bookings.
                </li>
              </ul>
            </div>

            {/* Traveler Responsibilities */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-sm border border-border mb-8">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Traveler Responsibilities
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Travelers must follow the itinerary and instructions provided by tour guides.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Any deviation from the planned itinerary is at the traveler's own risk and expense.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Travelers are responsible for their personal belongings and valuables.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Consumption of alcohol or drugs during tours is strictly prohibited.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Travelers must respect local customs, traditions, and laws of visited destinations.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Any damage caused to hotel property or vehicles will be charged to the traveler.
                </li>
              </ul>
            </div>

            {/* Liability */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-sm border border-border mb-8">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Limitation of Liability
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Unity Global Tours acts as an intermediary between travelers and service providers.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  We are not liable for delays, cancellations, or changes caused by airlines, hotels, or other vendors.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  We are not responsible for loss, theft, or damage to personal belongings.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Force majeure events (natural disasters, pandemics, political unrest) are beyond our control.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  We strongly recommend purchasing comprehensive travel insurance.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Our liability is limited to the amount paid for the services booked.
                </li>
              </ul>
            </div>

            {/* Changes & Modifications */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-sm border border-border mb-8">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                Changes & Modifications
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  We reserve the right to modify itineraries due to unforeseen circumstances.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Alternative arrangements of similar standard will be provided when possible.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Traveler-requested changes may incur additional charges.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Name changes after booking confirmation may attract penalties.
                </li>
              </ul>
            </div>

            {/* Governing Law */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-sm border border-border mb-8">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                Governing Law
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms and Conditions are governed by the laws of India. Any disputes arising from 
                these terms or our services shall be subject to the exclusive jurisdiction of the courts 
                in Gir Somnath District, Gujarat, India.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-primary/5 rounded-xl p-6 md:p-8 border border-primary/20">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                Contact Us
              </h2>
              <p className="text-muted-foreground mb-4">
                For any questions regarding these Terms & Conditions, please contact us:
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

export default Terms;
