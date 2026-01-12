import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const adminEmail = Deno.env.get("ADMIN_EMAIL") || "admin@example.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EnquiryNotification {
  type: "tour" | "taxi" | "contact" | "flight";
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
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Received enquiry notification request");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: EnquiryNotification = await req.json();
    console.log("Enquiry data:", JSON.stringify(data, null, 2));

    let subject = "";
    let htmlContent = "";

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
      </style>
    `;

    switch (data.type) {
      case "tour":
        subject = `🏖️ New Tour Enquiry: ${data.tourName || "Tour Package"}`;
        htmlContent = `
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
        break;

      case "taxi":
        subject = `🚕 New Taxi Booking Enquiry: ${data.tripType}`;
        htmlContent = `
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
        break;

      case "flight":
        subject = `✈️ New Flight Enquiry: ${data.from} → ${data.to}`;
        htmlContent = `
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
        break;

      case "contact":
        subject = `📧 New Contact Message: ${data.subject || "General Inquiry"}`;
        htmlContent = `
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
        break;

      default:
        throw new Error("Invalid enquiry type");
    }

    console.log(`Sending email to: ${adminEmail}`);
    
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Unity Global Tours <onboarding@resend.dev>",
        to: [adminEmail],
        subject: subject,
        html: htmlContent,
      }),
    });

    const emailResponse = await res.json();
    console.log("Email response:", emailResponse);

    if (!res.ok) {
      throw new Error(emailResponse.message || "Failed to send email");
    }

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
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
