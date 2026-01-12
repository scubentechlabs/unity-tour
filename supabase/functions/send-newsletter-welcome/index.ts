import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL");
const SITE_URL = Deno.env.get("SUPABASE_URL")?.replace('.supabase.co', '') || "https://unityglobaltours.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NewsletterSubscription {
  email: string;
}

async function sendEmail(to: string, subject: string, html: string): Promise<any> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "Unity Global Tours <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to send email: ${error}`);
  }

  return res.json();
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: NewsletterSubscription = await req.json();
    console.log("Processing newsletter welcome email for:", email);

    if (!email) {
      throw new Error("Email is required");
    }

    // Send welcome email to subscriber
    const subscriberEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #b8860b 0%, #daa520 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Unity Global Tours</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Premium Travel Experiences</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 24px;">Welcome to Our Newsletter! 🎉</h2>
              
              <p style="color: #666666; line-height: 1.6; margin: 0 0 20px 0;">
                Thank you for subscribing to the Unity Global Tours newsletter! You're now part of our exclusive community of travel enthusiasts.
              </p>
              
              <p style="color: #666666; line-height: 1.6; margin: 0 0 20px 0;">
                Here's what you can expect from us:
              </p>
              
              <ul style="color: #666666; line-height: 1.8; margin: 0 0 30px 0; padding-left: 20px;">
                <li>✨ Exclusive travel deals and discounts</li>
                <li>🗺️ Curated destination guides</li>
                <li>💡 Travel tips from our experts</li>
                <li>🎁 Early access to new tour packages</li>
                <li>📸 Inspiring travel stories and photos</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://unityglobaltours.com/domestic-tours" 
                   style="display: inline-block; background: linear-gradient(135deg, #b8860b 0%, #daa520 100%); 
                          color: #ffffff; text-decoration: none; padding: 14px 35px; border-radius: 8px; 
                          font-weight: 600; font-size: 16px;">
                  Explore Our Tours
                </a>
              </div>
              
              <p style="color: #666666; line-height: 1.6; margin: 30px 0 0 0;">
                Have questions? Feel free to reply to this email or call us at <strong>+91 92270 26000</strong>.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #1a1a1a; padding: 30px; text-align: center;">
              <p style="color: #999999; margin: 0 0 10px 0; font-size: 14px;">
                Unity Global Tours | Premium Travel Experiences
              </p>
              <p style="color: #666666; margin: 0 0 15px 0; font-size: 12px;">
                You're receiving this because you subscribed at ${email}
              </p>
              <p style="margin: 0;">
                <a href="https://unityglobaltours.com/unsubscribe?email=${encodeURIComponent(email)}" 
                   style="color: #888888; font-size: 11px; text-decoration: underline;">
                  Unsubscribe from this newsletter
                </a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const subscriberEmailResponse = await sendEmail(
      email,
      "Welcome to Unity Global Tours Newsletter! 🌍",
      subscriberEmailHtml
    );

    console.log("Subscriber welcome email sent:", subscriberEmailResponse);

    // Send notification to admin
    if (ADMIN_EMAIL) {
      const adminEmailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
          </head>
          <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
            <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <div style="background: linear-gradient(135deg, #b8860b 0%, #daa520 100%); padding: 25px; text-align: center;">
                <h2 style="color: #ffffff; margin: 0; font-size: 20px;">New Newsletter Subscriber 📧</h2>
              </div>
              <div style="padding: 25px;">
                <p style="color: #666666; margin: 0 0 15px 0; font-size: 14px;">A new user has subscribed to your newsletter:</p>
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #b8860b;">
                  <p style="color: #1a1a1a; margin: 0; font-size: 16px; font-weight: 600;">${email}</p>
                </div>
                <p style="color: #999999; margin: 20px 0 0 0; font-size: 12px;">
                  Subscribed at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                </p>
              </div>
            </div>
          </body>
        </html>
      `;

      const adminEmailResponse = await sendEmail(
        ADMIN_EMAIL,
        `New Newsletter Subscriber: ${email}`,
        adminEmailHtml
      );

      console.log("Admin notification email sent:", adminEmailResponse);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Welcome email sent successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-newsletter-welcome function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
