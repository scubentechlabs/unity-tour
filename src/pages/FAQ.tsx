import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, Phone } from "lucide-react";

const faqCategories = [
  {
    title: "Booking & Payments",
    faqs: [
      {
        question: "How do I book a tour package?",
        answer:
          "Booking is simple! Browse our tour packages, select your preferred tour, click on 'Enquire Now', and fill in your details. Our team will contact you within 24 hours to confirm availability and discuss your requirements.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept multiple payment methods including credit/debit cards, net banking, UPI, and bank transfers. For group bookings, we also offer EMI options through select banks.",
      },
      {
        question: "Is there a booking fee?",
        answer:
          "No, there's no additional booking fee. The price you see is the price you pay. However, a 20% advance payment is required to confirm your booking.",
      },
      {
        question: "Can I customize my tour package?",
        answer:
          "Absolutely! We specialize in customized tours. Tell us your preferences, budget, and travel dates, and we'll create a personalized itinerary just for you.",
      },
    ],
  },
  {
    title: "Cancellation & Refunds",
    faqs: [
      {
        question: "What is your cancellation policy?",
        answer:
          "Cancellation charges depend on how close to the departure date you cancel: 30+ days before: 10% of total cost, 15-29 days: 25%, 7-14 days: 50%, Less than 7 days: 75%, No-show: 100% charges apply.",
      },
      {
        question: "How long does it take to get a refund?",
        answer:
          "Refunds are processed within 7-10 business days after the cancellation is approved. The amount will be credited to your original payment method.",
      },
      {
        question: "Can I reschedule my trip instead of cancelling?",
        answer:
          "Yes! We offer free rescheduling up to 15 days before departure (subject to availability). Rescheduling within 15 days may incur a nominal fee.",
      },
    ],
  },
  {
    title: "Travel Requirements",
    faqs: [
      {
        question: "Do I need a visa for international tours?",
        answer:
          "Visa requirements vary by destination. We assist with visa applications and provide guidance, but obtaining the visa is the traveler's responsibility. We recommend applying at least 4-6 weeks before travel.",
      },
      {
        question: "What documents are required for domestic tours?",
        answer:
          "For domestic tours, you need a valid government-issued photo ID (Aadhar, PAN, Passport, Voter ID, or Driving License). For minors, a birth certificate is acceptable.",
      },
      {
        question: "Is travel insurance included?",
        answer:
          "Basic travel insurance is included in most international packages. For domestic tours, insurance is optional but recommended. We can arrange comprehensive coverage at additional cost.",
      },
    ],
  },
  {
    title: "Accommodations & Meals",
    faqs: [
      {
        question: "What type of hotels do you provide?",
        answer:
          "We partner with verified 3-star, 4-star, and 5-star hotels depending on your package. All accommodations are carefully selected for comfort, cleanliness, and location.",
      },
      {
        question: "Are meals included in the package?",
        answer:
          "Most packages include breakfast. Full meal plans (breakfast, lunch, dinner) are available and mentioned in the package details. We can accommodate dietary restrictions with advance notice.",
      },
      {
        question: "Can I upgrade my hotel?",
        answer:
          "Yes! Hotel upgrades are available at additional cost. Contact our team with your preferences, and we'll provide upgrade options and pricing.",
      },
    ],
  },
  {
    title: "Transportation",
    faqs: [
      {
        question: "What vehicles are used for tours?",
        answer:
          "We use well-maintained, air-conditioned vehicles appropriate for the group size - sedans for couples, SUVs for families, and tempo travelers or coaches for larger groups.",
      },
      {
        question: "Are flights included in tour packages?",
        answer:
          "Flight inclusions vary by package. Most international packages include flights, while domestic packages may offer them as an add-on. Check the specific package details for clarity.",
      },
      {
        question: "What about airport transfers?",
        answer:
          "All our packages include airport/railway station transfers at the destination. Pickup from your home city can be arranged at additional cost.",
      },
    ],
  },
  {
    title: "Taxi Services",
    faqs: [
      {
        question: "How is taxi fare calculated?",
        answer:
          "Fares are calculated based on the vehicle type, distance, and trip duration. For outstation trips, we charge per kilometer with a minimum daily running of 250 km. Local rentals are charged hourly.",
      },
      {
        question: "Are toll and parking charges extra?",
        answer:
          "Yes, toll charges, parking fees, and state entry taxes are borne by the customer and paid directly during the journey.",
      },
      {
        question: "Can I book a taxi for outstation one-way trips?",
        answer:
          "Yes, we offer one-way outstation trips. The fare includes a reasonable return allowance for the driver. Contact us for specific route pricing.",
      },
    ],
  },
];

const FAQ = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
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
              Help Center
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Frequently Asked <span className="text-primary">Questions</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Find answers to common questions about our tours, bookings, and
              services. Can't find what you're looking for? Contact us directly.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {faqCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4 pb-2 border-b border-border">
                  {category.title}
                </h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {category.faqs.map((faq, faqIndex) => (
                    <AccordionItem
                      key={faqIndex}
                      value={`${categoryIndex}-${faqIndex}`}
                      className="bg-card border border-border rounded-lg px-4"
                    >
                      <AccordionTrigger className="text-left text-foreground hover:text-primary py-4">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              Still Have Questions?
            </h2>
            <p className="text-muted-foreground mb-8">
              Our team is here to help. Reach out to us and we'll get back to
              you as soon as possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Us
                </Button>
              </Link>
              <a href="tel:+919876543210">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call +91 98765 43210
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default FAQ;
