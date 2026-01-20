import { Layout } from "@/components/layout/Layout";
import { XCircle, Clock, RefreshCw, AlertTriangle, CreditCard, Phone, Mail, MapPin, Info } from "lucide-react";

const CancellationPolicy = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-primary/10 via-background to-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <XCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Cancellation <span className="text-primary">Policy</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Understand our cancellation and refund policies before booking
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
            
            {/* Tour Package Cancellation */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-sm border border-border mb-8">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Tour Package Cancellation Charges
              </h2>
              <p className="text-muted-foreground mb-6">
                Cancellation charges are calculated based on how many days before departure you cancel:
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <span className="font-medium text-green-900 dark:text-green-100">30+ days before departure</span>
                  <span className="text-green-600 dark:text-green-400 font-semibold">10% of total cost</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <span className="font-medium text-yellow-900 dark:text-yellow-100">15-29 days before departure</span>
                  <span className="text-yellow-600 dark:text-yellow-400 font-semibold">25% of total cost</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <span className="font-medium text-orange-900 dark:text-orange-100">7-14 days before departure</span>
                  <span className="text-orange-600 dark:text-orange-400 font-semibold">50% of total cost</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                  <span className="font-medium text-red-900 dark:text-red-100">Less than 7 days before departure</span>
                  <span className="text-red-600 dark:text-red-400 font-semibold">75% of total cost</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-100 dark:bg-red-950/40 rounded-lg border border-red-300 dark:border-red-700">
                  <span className="font-medium text-red-900 dark:text-red-100">No-show / Day of departure</span>
                  <span className="text-red-700 dark:text-red-300 font-semibold">100% charges apply</span>
                </div>
              </div>
            </div>

            {/* Taxi Service Cancellation */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-sm border border-border mb-8">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Taxi Service Cancellation Charges
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <span className="font-medium text-green-900 dark:text-green-100">24+ hours before pickup</span>
                  <span className="text-green-600 dark:text-green-400 font-semibold">Free cancellation</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <span className="font-medium text-yellow-900 dark:text-yellow-100">12-24 hours before pickup</span>
                  <span className="text-yellow-600 dark:text-yellow-400 font-semibold">25% of booking amount</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <span className="font-medium text-orange-900 dark:text-orange-100">6-12 hours before pickup</span>
                  <span className="text-orange-600 dark:text-orange-400 font-semibold">50% of booking amount</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                  <span className="font-medium text-red-900 dark:text-red-100">Less than 6 hours / No-show</span>
                  <span className="text-red-600 dark:text-red-400 font-semibold">100% charges apply</span>
                </div>
              </div>
            </div>

            {/* Flight Booking Cancellation */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-sm border border-border mb-8">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Flight Booking Cancellation
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Flight cancellation charges are subject to airline policies and fare rules.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Non-refundable tickets cannot be cancelled or refunded.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Refundable tickets attract airline cancellation fees + our service charge of ₹500 per passenger.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  International flight cancellations may have higher charges based on airline policy.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Airline schedule changes or cancellations are eligible for full refund.
                </li>
              </ul>
            </div>

            {/* Refund Process */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-sm border border-border mb-8">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Refund Process
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <strong>Processing Time:</strong> Refunds are processed within 7-10 business days after cancellation approval.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <strong>Payment Method:</strong> Refunds will be credited to the original payment method used.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <strong>Bank Processing:</strong> Additional 3-5 business days may be required for bank processing.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <strong>Documentation:</strong> Original booking confirmation and ID proof required for refund.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <strong>Partial Refunds:</strong> Available for partially utilized services (pro-rated calculation).
                </li>
              </ul>
            </div>

            {/* Rescheduling Policy */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-sm border border-border mb-8">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-primary" />
                Rescheduling Policy
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <strong>Free Rescheduling:</strong> Available up to 15 days before departure (subject to availability).
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <strong>Late Rescheduling:</strong> Within 15 days of departure - 10% rescheduling fee applies.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <strong>Price Difference:</strong> Any increase in package cost must be paid; decreases are non-refundable.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <strong>One-time Rescheduling:</strong> Only one free rescheduling allowed per booking.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <strong>Peak Season:</strong> Rescheduling during peak seasons may attract additional charges.
                </li>
              </ul>
            </div>

            {/* Non-Refundable Items */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-sm border border-border mb-8">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <XCircle className="h-5 w-5 text-primary" />
                Non-Refundable Items
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Visa processing fees and documentation charges
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Travel insurance premiums (once policy is issued)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Special event tickets or attraction bookings
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Non-refundable airline tickets or hotel bookings
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Administrative and service charges
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Peak season or festive period surcharges
                </li>
              </ul>
            </div>

            {/* Force Majeure */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-sm border border-border mb-8">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Force Majeure & Extraordinary Circumstances
              </h2>
              <p className="text-muted-foreground mb-4">
                In case of cancellations due to circumstances beyond our control:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <strong>Natural Disasters:</strong> Earthquakes, floods, cyclones, etc.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <strong>Political Events:</strong> War, terrorism, civil unrest, government travel advisories.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <strong>Health Emergencies:</strong> Pandemics, quarantine requirements, health advisories.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <strong>Resolution:</strong> We will offer rescheduling or credit for future bookings.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <strong>Partial Refunds:</strong> May be available after deducting non-recoverable costs.
                </li>
              </ul>
            </div>

            {/* How to Cancel */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-sm border border-border mb-8">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                How to Cancel Your Booking
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold flex-shrink-0">1</div>
                  <div>
                    <strong className="text-foreground">Contact Us</strong>
                    <p className="text-sm mt-1">Call our customer service at +91 70050 50020 or email booking@unityglobaltours.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold flex-shrink-0">2</div>
                  <div>
                    <strong className="text-foreground">Provide Details</strong>
                    <p className="text-sm mt-1">Share your booking reference number, registered name, and reason for cancellation</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold flex-shrink-0">3</div>
                  <div>
                    <strong className="text-foreground">Confirmation</strong>
                    <p className="text-sm mt-1">You'll receive a cancellation confirmation with refund details within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold flex-shrink-0">4</div>
                  <div>
                    <strong className="text-foreground">Receive Refund</strong>
                    <p className="text-sm mt-1">Applicable refund will be processed within 7-10 business days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-primary/5 rounded-xl p-6 md:p-8 border border-primary/20">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                Contact Us for Cancellations
              </h2>
              <p className="text-muted-foreground mb-4">
                For cancellation requests or queries, please contact us:
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
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>Available: 9:00 AM - 9:00 PM (All Days)</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CancellationPolicy;
