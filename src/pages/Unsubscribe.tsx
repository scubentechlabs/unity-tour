import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, XCircle, Loader2, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const [status, setStatus] = useState<"loading" | "success" | "error" | "not-found" | "already-unsubscribed">("loading");

  useEffect(() => {
    const handleUnsubscribe = async () => {
      if (!email) {
        setStatus("error");
        return;
      }

      try {
        // Check if subscription exists
        const { data: subscription, error: fetchError } = await supabase
          .from("newsletter_subscriptions")
          .select("is_active")
          .eq("email", email.toLowerCase())
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (!subscription) {
          setStatus("not-found");
          return;
        }

        if (!subscription.is_active) {
          setStatus("already-unsubscribed");
          return;
        }

        // Update subscription status
        const { error: updateError } = await supabase
          .from("newsletter_subscriptions")
          .update({ 
            is_active: false, 
            unsubscribed_at: new Date().toISOString() 
          })
          .eq("email", email.toLowerCase());

        if (updateError) throw updateError;

        setStatus("success");
      } catch (err) {
        console.error("Unsubscribe error:", err);
        setStatus("error");
      }
    };

    handleUnsubscribe();
  }, [email]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {status === "loading" && (
          <div className="space-y-4">
            <Loader2 className="h-16 w-16 text-primary mx-auto animate-spin" />
            <h1 className="text-2xl font-display font-bold text-foreground">
              Processing your request...
            </h1>
            <p className="text-muted-foreground">
              Please wait while we update your subscription preferences.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground mb-2">
                Successfully Unsubscribed
              </h1>
              <p className="text-muted-foreground">
                You've been removed from our newsletter. We're sorry to see you go!
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>{email}</strong> will no longer receive our newsletters.
              </p>
            </div>
            <Button asChild className="bg-gradient-gold hover:opacity-90">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Return to Homepage
              </Link>
            </Button>
          </div>
        )}

        {status === "already-unsubscribed" && (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Mail className="h-10 w-10 text-muted-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground mb-2">
                Already Unsubscribed
              </h1>
              <p className="text-muted-foreground">
                This email address is already unsubscribed from our newsletter.
              </p>
            </div>
            <Button asChild className="bg-gradient-gold hover:opacity-90">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Return to Homepage
              </Link>
            </Button>
          </div>
        )}

        {status === "not-found" && (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
              <XCircle className="h-10 w-10 text-muted-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground mb-2">
                Email Not Found
              </h1>
              <p className="text-muted-foreground">
                We couldn't find this email address in our newsletter subscribers.
              </p>
            </div>
            <Button asChild className="bg-gradient-gold hover:opacity-90">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Return to Homepage
              </Link>
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="h-10 w-10 text-destructive" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground mb-2">
                Something Went Wrong
              </h1>
              <p className="text-muted-foreground">
                We couldn't process your unsubscribe request. Please try again or contact support.
              </p>
            </div>
            <Button asChild className="bg-gradient-gold hover:opacity-90">
              <Link to="/contact">
                Contact Support
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Unsubscribe;
