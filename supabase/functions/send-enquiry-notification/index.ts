import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const adminEmail = Deno.env.get("ADMIN_EMAIL") || "admin@example.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EnquiryNotification {
  type: "tour" | "taxi" | "contact" | "flight" | "taxi-status-update" | "tour-status-update" | "booking";
  name: string;
  email: string;
  phone: string;
  message?: string;
  tourName?: string;
  travelDate?: string;
  adults?: number;
  children?: number;
  pickupLocation?: string;
  dropLocation?: string;
  tripType?: string;
  vehicleName?: string;
  from?: string;
  to?: string;
  departDate?: string;
  returnDate?: string;
  passengers?: string;
  travelClass?: string;
  subject?: string;
  // Status update fields
  oldStatus?: string;
  newStatus?: string;
  quotedPrice?: number;
  // Booking page fields
  serviceType?: string;
  destination?: string;
  travelers?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Received enquiry notification request");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: EnquiryNotification = await req.json();
    console.log("Enquiry data:", JSON.stringify(data, null, 2));

    const baseStyles = `
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #c9a84c, #d4b85c); color: #1a1a1a; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .footer { background: #1a1a1a; color: #888; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 10px; }
        .label { font-weight: bold; color: #555; }
        .value { color: #333; }
        h1 { margin: 0; font-size: 24px; }
        h2 { color: #c9a84c; border-bottom: 2px solid #c9a84c; padding-bottom: 10px; }
        .highlight { background: #fff8e7; padding: 15px; border-radius: 8px; border-left: 4px solid #c9a84c; margin: 15px 0; }
      </style>
    `;

    let adminSubject = "";
    let adminHtml = "";
    let userSubject = "";
    let userHtml = "";

    switch (data.type) {
      case "tour":
        // Admin notification
        adminSubject = `🏖️ New Tour Enquiry: ${data.tourName || "Tour Package"}`;
        adminHtml = `
          ${baseStyles}
          <div class="container">
            <div class="header"><h1>🏖️ New Tour Enquiry</h1></div>
            <div class="content">
              <h2>Customer Details</h2>
              <div class="field"><span class="label">Name:</span> <span class="value">${data.name}</span></div>
              <div class="field"><span class="label">Email:</span> <span class="value">${data.email}</span></div>
              <div class="field"><span class="label">Phone:</span> <span class="value">${data.phone}</span></div>
              <h2>Tour Details</h2>
              <div class="field"><span class="label">Tour Package:</span> <span class="value">${data.tourName || "Not specified"}</span></div>
              <div class="field"><span class="label">Travel Date:</span> <span class="value">${data.travelDate || "Not specified"}</span></div>
              <div class="field"><span class="label">Adults:</span> <span class="value">${data.adults || 1}</span></div>
              <div class="field"><span class="label">Children:</span> <span class="value">${data.children || 0}</span></div>
              ${data.message ? `<h2>Message</h2><p>${data.message}</p>` : ""}
            </div>
            <div class="footer">Unity Global Tours - Admin Notification</div>
          </div>
        `;
        
        // User confirmation
        userSubject = `✅ Enquiry Received - ${data.tourName || "Tour Package"}`;
        userHtml = `
          ${baseStyles}
          <div class="container">
            <div class="header"><h1>🏖️ Thank You for Your Enquiry!</h1></div>
            <div class="content">
              <p>Dear <strong>${data.name}</strong>,</p>
              <p>Thank you for your interest in our tour package. We have received your enquiry and our team will get back to you within 24 hours.</p>
              
              <div class="highlight">
                <h2 style="margin-top: 0;">Your Enquiry Summary</h2>
                <div class="field"><span class="label">Tour Package:</span> <span class="value">${data.tourName || "Not specified"}</span></div>
                <div class="field"><span class="label">Travel Date:</span> <span class="value">${data.travelDate || "Flexible"}</span></div>
                <div class="field"><span class="label">Travelers:</span> <span class="value">${data.adults || 1} Adult(s)${data.children ? `, ${data.children} Child(ren)` : ""}</span></div>
              </div>
              
              <p>If you have any urgent questions, feel free to call us or reach out via WhatsApp.</p>
              <p>We look forward to helping you plan an unforgettable trip!</p>
              <p>Best regards,<br><strong>Unity Global Tours Team</strong></p>
            </div>
            <div class="footer">
              Unity Global Tours | Your Journey, Our Passion<br>
              This is an automated confirmation email. Please do not reply directly.
            </div>
          </div>
        `;
        break;

      case "tour-status-update":
        // Tour status update - only send to user
        const tourStatusMessages: Record<string, { emoji: string; title: string; message: string }> = {
          quoted: { 
            emoji: "💰", 
            title: "Quote Ready for Your Tour Package", 
            message: `Great news! We have prepared a customized quote for your tour.${data.quotedPrice ? ` The quoted price is <strong>₹${data.quotedPrice.toLocaleString()}</strong>.` : ''} Please review and confirm your booking.`
          },
          confirmed: { 
            emoji: "✅", 
            title: "Your Tour Booking is Confirmed!", 
            message: "Congratulations! Your tour booking has been confirmed. We'll send you the detailed itinerary and travel documents soon."
          },
          completed: { 
            emoji: "🎉", 
            title: "Trip Completed - Thank You!", 
            message: "Thank you for traveling with Unity Global Tours! We hope you had an amazing experience. We'd love to help you plan your next adventure."
          },
          cancelled: { 
            emoji: "❌", 
            title: "Booking Cancelled", 
            message: "Your tour booking has been cancelled. If you did not request this cancellation, please contact us immediately."
          }
        };

        const tourStatusInfo = tourStatusMessages[data.newStatus || ""] || { 
          emoji: "📝", 
          title: "Booking Status Update", 
          message: `Your booking status has been updated to: ${data.newStatus}`
        };

        userSubject = `${tourStatusInfo.emoji} ${tourStatusInfo.title}`;
        userHtml = `
          ${baseStyles}
          <div class="container">
            <div class="header"><h1>${tourStatusInfo.emoji} ${tourStatusInfo.title}</h1></div>
            <div class="content">
              <p>Dear <strong>${data.name}</strong>,</p>
              <p>${tourStatusInfo.message}</p>
              
              <div class="highlight">
                <h2 style="margin-top: 0;">Your Tour Details</h2>
                ${data.tourName ? `<div class="field"><span class="label">Tour Package:</span> <span class="value">${data.tourName}</span></div>` : ""}
                <div class="field"><span class="label">Travel Date:</span> <span class="value">${data.travelDate || "Flexible"}</span></div>
                <div class="field"><span class="label">Travelers:</span> <span class="value">${data.adults || 1} Adult(s)${data.children ? `, ${data.children} Child(ren)` : ""}</span></div>
                ${data.quotedPrice ? `<div class="field"><span class="label">Quote:</span> <span class="value" style="color: #008060; font-weight: bold;">₹${data.quotedPrice.toLocaleString()}</span></div>` : ""}
                <div class="field"><span class="label">Status:</span> <span class="value" style="text-transform: capitalize; font-weight: bold;">${data.newStatus}</span></div>
              </div>
              
              <p>If you have any questions, feel free to contact us anytime.</p>
              <p>Best regards,<br><strong>Unity Global Tours Team</strong></p>
            </div>
            <div class="footer">
              Unity Global Tours | Your Journey, Our Passion<br>
              This is an automated notification. Please do not reply directly.
            </div>
          </div>
        `;

        // Only send to user for status updates
        console.log(`Sending tour status update email to: ${data.email}`);
        
        const tourStatusUserRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Unity Global Tours <noreply@unity.scubentechlabs.in>",
            to: [data.email],
            subject: userSubject,
            html: userHtml,
          }),
        });

        const tourStatusEmailResponse = await tourStatusUserRes.json();
        console.log("Tour status update email response:", tourStatusEmailResponse);

        return new Response(JSON.stringify({ 
          success: tourStatusUserRes.ok, 
          userEmail: tourStatusEmailResponse 
        }), {
          status: tourStatusUserRes.ok ? 200 : 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });

      case "taxi":
        // Admin notification
        adminSubject = `🚕 New Taxi Booking Enquiry: ${data.tripType}`;
        adminHtml = `
          ${baseStyles}
          <div class="container">
            <div class="header"><h1>🚕 New Taxi Booking</h1></div>
            <div class="content">
              <h2>Customer Details</h2>
              <div class="field"><span class="label">Name:</span> <span class="value">${data.name}</span></div>
              <div class="field"><span class="label">Email:</span> <span class="value">${data.email}</span></div>
              <div class="field"><span class="label">Phone:</span> <span class="value">${data.phone}</span></div>
              <h2>Trip Details</h2>
              <div class="field"><span class="label">Trip Type:</span> <span class="value">${data.tripType || "One Way"}</span></div>
              <div class="field"><span class="label">Pickup Location:</span> <span class="value">${data.pickupLocation}</span></div>
              <div class="field"><span class="label">Drop Location:</span> <span class="value">${data.dropLocation || "Local"}</span></div>
              <div class="field"><span class="label">Travel Date:</span> <span class="value">${data.travelDate || "Not specified"}</span></div>
              ${data.vehicleName ? `<div class="field"><span class="label">Vehicle:</span> <span class="value">${data.vehicleName}</span></div>` : ""}
              ${data.message ? `<h2>Message</h2><p>${data.message}</p>` : ""}
            </div>
            <div class="footer">Unity Global Tours - Admin Notification</div>
          </div>
        `;
        
        // User confirmation
        userSubject = `✅ Taxi Enquiry Received - ${data.tripType || "Booking"}`;
        userHtml = `
          ${baseStyles}
          <div class="container">
            <div class="header"><h1>🚕 Thank You for Your Taxi Enquiry!</h1></div>
            <div class="content">
              <p>Dear <strong>${data.name}</strong>,</p>
              <p>Thank you for choosing Unity Global Tours for your taxi service. We have received your enquiry and our team will contact you shortly with the best rates.</p>
              
              <div class="highlight">
                <h2 style="margin-top: 0;">Your Trip Summary</h2>
                <div class="field"><span class="label">Trip Type:</span> <span class="value">${data.tripType || "One Way"}</span></div>
                <div class="field"><span class="label">Pickup:</span> <span class="value">${data.pickupLocation || "Not specified"}</span></div>
                <div class="field"><span class="label">Drop:</span> <span class="value">${data.dropLocation || "Local"}</span></div>
                <div class="field"><span class="label">Date:</span> <span class="value">${data.travelDate || "Flexible"}</span></div>
                ${data.vehicleName ? `<div class="field"><span class="label">Vehicle:</span> <span class="value">${data.vehicleName}</span></div>` : ""}
              </div>
              
              <p>Our team will reach out to you within a few hours to confirm availability and provide a quote.</p>
              <p>For immediate assistance, feel free to call us directly.</p>
              <p>Best regards,<br><strong>Unity Global Tours Team</strong></p>
            </div>
            <div class="footer">
              Unity Global Tours | Your Journey, Our Passion<br>
              This is an automated confirmation email. Please do not reply directly.
            </div>
          </div>
        `;
        break;

      case "flight":
        // Admin notification
        adminSubject = `✈️ New Flight Enquiry: ${data.from} → ${data.to}`;
        adminHtml = `
          ${baseStyles}
          <div class="container">
            <div class="header"><h1>✈️ New Flight Enquiry</h1></div>
            <div class="content">
              <h2>Customer Details</h2>
              <div class="field"><span class="label">Name:</span> <span class="value">${data.name}</span></div>
              <div class="field"><span class="label">Email:</span> <span class="value">${data.email}</span></div>
              <div class="field"><span class="label">Phone:</span> <span class="value">${data.phone}</span></div>
              <h2>Flight Details</h2>
              <div class="field"><span class="label">From:</span> <span class="value">${data.from}</span></div>
              <div class="field"><span class="label">To:</span> <span class="value">${data.to}</span></div>
              <div class="field"><span class="label">Departure:</span> <span class="value">${data.departDate || "Not specified"}</span></div>
              <div class="field"><span class="label">Return:</span> <span class="value">${data.returnDate || "N/A"}</span></div>
              <div class="field"><span class="label">Passengers:</span> <span class="value">${data.passengers || 1}</span></div>
              <div class="field"><span class="label">Class:</span> <span class="value">${data.travelClass || "Economy"}</span></div>
            </div>
            <div class="footer">Unity Global Tours - Admin Notification</div>
          </div>
        `;
        
        // User confirmation
        userSubject = `✅ Flight Enquiry Received - ${data.from} to ${data.to}`;
        userHtml = `
          ${baseStyles}
          <div class="container">
            <div class="header"><h1>✈️ Thank You for Your Flight Enquiry!</h1></div>
            <div class="content">
              <p>Dear <strong>${data.name}</strong>,</p>
              <p>Thank you for your flight enquiry. We have received your request and our travel experts will find the best deals for you.</p>
              
              <div class="highlight">
                <h2 style="margin-top: 0;">Your Flight Request</h2>
                <div class="field"><span class="label">Route:</span> <span class="value">${data.from} → ${data.to}</span></div>
                <div class="field"><span class="label">Departure:</span> <span class="value">${data.departDate || "Flexible"}</span></div>
                <div class="field"><span class="label">Return:</span> <span class="value">${data.returnDate || "One Way"}</span></div>
                <div class="field"><span class="label">Passengers:</span> <span class="value">${data.passengers || 1}</span></div>
                <div class="field"><span class="label">Class:</span> <span class="value">${data.travelClass || "Economy"}</span></div>
              </div>
              
              <p>We'll get back to you with the best flight options and prices within 24 hours.</p>
              <p>Best regards,<br><strong>Unity Global Tours Team</strong></p>
            </div>
            <div class="footer">
              Unity Global Tours | Your Journey, Our Passion<br>
              This is an automated confirmation email. Please do not reply directly.
            </div>
          </div>
        `;
        break;

      case "taxi-status-update":
        // Status update - only send to user
        const statusMessages: Record<string, { emoji: string; title: string; message: string }> = {
          quoted: { 
            emoji: "💰", 
            title: "Quote Ready for Your Taxi Booking", 
            message: `Great news! We have prepared a quote for your taxi booking.${data.quotedPrice ? ` The quoted price is <strong>₹${data.quotedPrice.toLocaleString()}</strong>.` : ''} Please review and confirm your booking.`
          },
          confirmed: { 
            emoji: "✅", 
            title: "Your Taxi Booking is Confirmed!", 
            message: "Your taxi booking has been confirmed. Our driver will be ready at the scheduled time. We'll send you the driver details closer to your travel date."
          },
          completed: { 
            emoji: "🎉", 
            title: "Trip Completed - Thank You!", 
            message: "Thank you for traveling with Unity Global Tours! We hope you had a pleasant journey. We'd love to serve you again."
          },
          cancelled: { 
            emoji: "❌", 
            title: "Booking Cancelled", 
            message: "Your taxi booking has been cancelled. If you did not request this cancellation, please contact us immediately."
          }
        };

        const statusInfo = statusMessages[data.newStatus || ""] || { 
          emoji: "📝", 
          title: "Booking Status Update", 
          message: `Your booking status has been updated to: ${data.newStatus}`
        };

        userSubject = `${statusInfo.emoji} ${statusInfo.title}`;
        userHtml = `
          ${baseStyles}
          <div class="container">
            <div class="header"><h1>${statusInfo.emoji} ${statusInfo.title}</h1></div>
            <div class="content">
              <p>Dear <strong>${data.name}</strong>,</p>
              <p>${statusInfo.message}</p>
              
              <div class="highlight">
                <h2 style="margin-top: 0;">Your Trip Details</h2>
                <div class="field"><span class="label">Trip Type:</span> <span class="value">${data.tripType || "One Way"}</span></div>
                <div class="field"><span class="label">Pickup:</span> <span class="value">${data.pickupLocation || "Not specified"}</span></div>
                <div class="field"><span class="label">Drop:</span> <span class="value">${data.dropLocation || "Local"}</span></div>
                <div class="field"><span class="label">Date:</span> <span class="value">${data.travelDate || "Not specified"}</span></div>
                ${data.vehicleName ? `<div class="field"><span class="label">Vehicle:</span> <span class="value">${data.vehicleName}</span></div>` : ""}
                ${data.quotedPrice ? `<div class="field"><span class="label">Quote:</span> <span class="value" style="color: #008060; font-weight: bold;">₹${data.quotedPrice.toLocaleString()}</span></div>` : ""}
                <div class="field"><span class="label">Status:</span> <span class="value" style="text-transform: capitalize; font-weight: bold;">${data.newStatus}</span></div>
              </div>
              
              <p>If you have any questions, feel free to contact us anytime.</p>
              <p>Best regards,<br><strong>Unity Global Tours Team</strong></p>
            </div>
            <div class="footer">
              Unity Global Tours | Your Journey, Our Passion<br>
              This is an automated notification. Please do not reply directly.
            </div>
          </div>
        `;

        // Only send to user for status updates (no admin notification needed)
        console.log(`Sending status update email to: ${data.email}`);
        
        const statusUserRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Unity Global Tours <noreply@unity.scubentechlabs.in>",
            to: [data.email],
            subject: userSubject,
            html: userHtml,
          }),
        });

        const statusEmailResponse = await statusUserRes.json();
        console.log("Status update email response:", statusEmailResponse);

        return new Response(JSON.stringify({ 
          success: statusUserRes.ok, 
          userEmail: statusEmailResponse 
        }), {
          status: statusUserRes.ok ? 200 : 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });

      case "contact":
        // Admin notification
        adminSubject = `📧 New Contact Message: ${data.subject || "General Inquiry"}`;
        adminHtml = `
          ${baseStyles}
          <div class="container">
            <div class="header"><h1>📧 New Contact Message</h1></div>
            <div class="content">
              <h2>Contact Details</h2>
              <div class="field"><span class="label">Name:</span> <span class="value">${data.name}</span></div>
              <div class="field"><span class="label">Email:</span> <span class="value">${data.email}</span></div>
              <div class="field"><span class="label">Phone:</span> <span class="value">${data.phone || "Not provided"}</span></div>
              <div class="field"><span class="label">Subject:</span> <span class="value">${data.subject || "General Inquiry"}</span></div>
              <h2>Message</h2>
              <p>${data.message || "No message provided"}</p>
            </div>
            <div class="footer">Unity Global Tours - Admin Notification</div>
          </div>
        `;
        
        // User confirmation
        userSubject = `✅ Message Received - Unity Global Tours`;
        userHtml = `
          ${baseStyles}
          <div class="container">
            <div class="header"><h1>📧 Thank You for Contacting Us!</h1></div>
            <div class="content">
              <p>Dear <strong>${data.name}</strong>,</p>
              <p>Thank you for reaching out to Unity Global Tours. We have received your message and will respond as soon as possible.</p>
              
              <div class="highlight">
                <h2 style="margin-top: 0;">Your Message</h2>
                <div class="field"><span class="label">Subject:</span> <span class="value">${data.subject || "General Inquiry"}</span></div>
                <p style="margin-top: 10px;">${data.message || "No message provided"}</p>
              </div>
              
              <p>Our team typically responds within 24 hours during business days.</p>
              <p>Best regards,<br><strong>Unity Global Tours Team</strong></p>
            </div>
            <div class="footer">
              Unity Global Tours | Your Journey, Our Passion<br>
              This is an automated confirmation email. Please do not reply directly.
            </div>
          </div>
        `;
        break;

      case "booking":
        // Admin notification for booking request
        const serviceLabels: Record<string, string> = {
          "domestic-tour": "Domestic Tour Package",
          "international-tour": "International Tour Package",
          "taxi-booking": "Taxi/Car Rental",
          "flight-booking": "Flight Booking",
          "hotel-booking": "Hotel Booking",
          "visa-services": "Visa Services",
          "group-booking": "Group Booking",
          "custom-package": "Custom Package",
        };
        const serviceLabel = serviceLabels[data.serviceType || ""] || data.serviceType || "General Enquiry";
        
        adminSubject = `📋 New Booking Request: ${serviceLabel}`;
        adminHtml = `
          ${baseStyles}
          <div class="container">
            <div class="header"><h1>📋 New Booking Request</h1></div>
            <div class="content">
              <h2>Customer Details</h2>
              <div class="field"><span class="label">Name:</span> <span class="value">${data.name}</span></div>
              <div class="field"><span class="label">Email:</span> <span class="value">${data.email}</span></div>
              <div class="field"><span class="label">Phone:</span> <span class="value">${data.phone}</span></div>
              <h2>Booking Details</h2>
              <div class="field"><span class="label">Service Type:</span> <span class="value">${serviceLabel}</span></div>
              <div class="field"><span class="label">Destination:</span> <span class="value">${data.destination || "Not specified"}</span></div>
              <div class="field"><span class="label">Travel Date:</span> <span class="value">${data.travelDate || "Flexible"}</span></div>
              <div class="field"><span class="label">Travelers:</span> <span class="value">${data.travelers || "Not specified"}</span></div>
              ${data.message ? `<h2>Additional Requirements</h2><p>${data.message}</p>` : ""}
            </div>
            <div class="footer">Unity Global Tours - Admin Notification</div>
          </div>
        `;
        
        // User confirmation for booking
        userSubject = `✅ Booking Request Received - ${serviceLabel}`;
        userHtml = `
          ${baseStyles}
          <div class="container">
            <div class="header"><h1>📋 Thank You for Your Booking Request!</h1></div>
            <div class="content">
              <p>Dear <strong>${data.name}</strong>,</p>
              <p>Thank you for choosing Unity Global Tours! We have received your booking request and our travel experts will get back to you within 24 hours with the best options tailored to your needs.</p>
              
              <div class="highlight">
                <h2 style="margin-top: 0;">Your Booking Summary</h2>
                <div class="field"><span class="label">Service:</span> <span class="value">${serviceLabel}</span></div>
                <div class="field"><span class="label">Destination:</span> <span class="value">${data.destination || "To be discussed"}</span></div>
                <div class="field"><span class="label">Travel Date:</span> <span class="value">${data.travelDate || "Flexible"}</span></div>
                <div class="field"><span class="label">Travelers:</span> <span class="value">${data.travelers || "To be confirmed"}</span></div>
              </div>
              
              <h2>What Happens Next?</h2>
              <ol style="color: #555; padding-left: 20px;">
                <li>Our travel expert will review your request</li>
                <li>We'll prepare customized options and quotes</li>
                <li>You'll receive a call/email within 24 hours</li>
                <li>Once confirmed, we'll handle all arrangements</li>
              </ol>
              
              <p>For urgent assistance, feel free to call us at <strong>+91 70050 50020</strong> or reach out via WhatsApp.</p>
              <p>We look forward to making your travel dreams come true!</p>
              <p>Best regards,<br><strong>Unity Global Tours Team</strong></p>
            </div>
            <div class="footer">
              Unity Global Tours | Your Journey, Our Passion<br>
              📞 +91 70050 50020 | ✉️ booking@unityglobaltours.com<br>
              This is an automated confirmation email. Please do not reply directly.
            </div>
          </div>
        `;
        break;

      default:
        throw new Error("Invalid enquiry type");
    }

    console.log(`Sending admin email to: ${adminEmail}`);
    console.log(`Sending user confirmation to: ${data.email}`);
    
    // Send admin notification
    const adminRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Unity Global Tours <noreply@unity.scubentechlabs.in>",
        to: [adminEmail],
        subject: adminSubject,
        html: adminHtml,
      }),
    });

    const adminEmailResponse = await adminRes.json();
    console.log("Admin email response:", adminEmailResponse);

    if (!adminRes.ok) {
      console.error("Failed to send admin email:", adminEmailResponse);
    }

    // Send user confirmation email
    const userRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Unity Global Tours <noreply@unity.scubentechlabs.in>",
        to: [data.email],
        subject: userSubject,
        html: userHtml,
      }),
    });

    const userEmailResponse = await userRes.json();
    console.log("User confirmation email response:", userEmailResponse);

    if (!userRes.ok) {
      console.error("Failed to send user confirmation email:", userEmailResponse);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      adminEmail: adminEmailResponse,
      userEmail: userEmailResponse 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error sending notification email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
