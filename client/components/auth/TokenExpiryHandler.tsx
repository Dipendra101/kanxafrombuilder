import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Timer, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function TokenExpiryHandler() {
  const { toast } = useToast();

  useEffect(() => {
    const handleTokenExpiry = (event: CustomEvent) => {
      const { message } = event.detail;

      toast({
        title: "Session Expired",
        description: message || "Your login session has expired. You can continue browsing as a guest.",
        duration: 8000, // Show for 8 seconds
        action: (
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="outline">
              <Link to="/login">
                <LogIn className="h-3 w-3 mr-1" />
                Login
              </Link>
            </Button>
          </div>
        ),
        className: "border-orange-200 bg-orange-50",
      });

      // Also show console message for debugging
      console.log("🔄 User session expired - switched to guest mode");
    };

    // Listen for token expiry events
    window.addEventListener('tokenExpired', handleTokenExpiry as EventListener);

    // Cleanup
    return () => {
      window.removeEventListener('tokenExpired', handleTokenExpiry as EventListener);
    };
  }, [toast]);

  // This component doesn't render anything visible
  return null;
}
