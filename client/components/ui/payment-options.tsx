import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Shield, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentOptionsProps {
  amount: number;
  service: string;
  serviceId: string;
  onPaymentSelect?: (method: string) => void;
  className?: string;
}

export function PaymentOptions({
  amount,
  service,
  serviceId,
  onPaymentSelect,
  className = "",
}: PaymentOptionsProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePaymentMethod = async (method: string) => {
    setSelectedMethod(method);
    setIsProcessing(true);

    try {
      // If parent component wants to handle payment selection
      if (onPaymentSelect) {
        onPaymentSelect(method);
        setIsProcessing(false);
        setSelectedMethod("");
        return;
      }

      // Generate unique transaction ID
      const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      toast({
        title: "Initiating Payment...",
        description: `Connecting to ${method} payment gateway...`,
      });

      console.log("Initiating payment with:", { amount, service, method, transactionId });

      // Check if we're in demo mode (development environment)
      const isDemoMode = window.location.hostname === 'localhost' ||
                        window.location.hostname.includes('fly.dev') ||
                        !window.location.hostname.includes('production');

      if (isDemoMode) {
        // Use demo mode simulation instead of API call
        console.log("Demo mode detected - simulating payment...");

        toast({
          title: `Initiating ${method.charAt(0).toUpperCase() + method.slice(1)} Payment`,
          description: "Processing your payment request...",
        });

        // Simulate payment delay
        setTimeout(() => {
          toast({
            title: "Payment Successful!",
            description: "Your order has been processed successfully.",
          });

          // Call parent callback if provided
          if (onPaymentSelect) {
            onPaymentSelect(method);
          }

          // Clear materials cart if on materials page
          if (service === "Construction Materials") {
            window.dispatchEvent(new CustomEvent('paymentCompleted', {
              detail: { method, service }
            }));
          }

          setIsProcessing(false);
          setSelectedMethod("");
        }, 2000);
        return;
      }

      // Call payment initiation API for production
      let response;
      try {
        response = await fetch("/api/payments/initiate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: amount,
            productName: service,
            transactionId: transactionId,
            method: method,
            customerInfo: {
              name: "Customer Name",
              email: "customer@example.com",
              phone: "9800000000",
            },
          }),
        });
      } catch (fetchError) {
        console.error("Fetch error:", fetchError);
        throw new Error("Network error: Unable to connect to payment service");
      }

      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));

      // Check if response is ok before reading body
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorText = await response.text();
          if (errorText) {
            errorMessage += ` - ${errorText}`;
          }
        } catch {
          // Ignore error reading error message
        }
        throw new Error(errorMessage);
      }

      // Clone response to avoid "body stream already read" error
      const responseClone = response.clone();

      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        // Try to get the raw text for debugging
        try {
          const rawText = await responseClone.text();
          console.error("Raw response text:", rawText);
        } catch {
          // Ignore
        }
        throw new Error("Invalid response format from payment service");
      }

      console.log("Payment initiation result:", result);

      if (!result.success) {
        throw new Error(result.error || "Payment initiation failed");
      }

      toast({
        title: "Redirecting to Payment Gateway",
        description: `Opening ${method} payment page...`,
      });

      // Handle different payment methods
      if (method === "khalti") {
        // Redirect to Khalti payment URL
        if (result.paymentUrl) {
          window.location.href = result.paymentUrl;
        } else {
          throw new Error("No payment URL received from Khalti");
        }
      } else if (method === "esewa") {
        // Create form and submit to eSewa
        if (result.paymentUrl && result.config) {
          const form = document.createElement("form");
          form.method = "POST";
          form.action = result.paymentUrl;

          // Add all required fields for eSewa
          Object.entries(result.config).forEach(([key, value]) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = value as string;
            form.appendChild(input);
          });

          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        } else {
          throw new Error("No payment URL or config received from eSewa");
        }
      }
    } catch (error: any) {
      console.error("Payment initiation error:", error);
      toast({
        title: "Payment Failed",
        description:
          error.message || "Unable to process payment. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
      setSelectedMethod("");
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-kanxa-blue" />
          Choose Payment Method
        </CardTitle>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Service: {service}</span>
          <Badge
            variant="secondary"
            className="bg-kanxa-light-green text-kanxa-navy"
          >
            Rs {amount.toLocaleString()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Khalti Option */}
          <Button
            variant="outline"
            className="relative h-24 flex flex-col gap-2 hover:bg-purple-50 hover:border-purple-200 transition-colors border-2"
            onClick={() => handlePaymentMethod("khalti")}
            disabled={isProcessing}
          >
            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
              <div className="text-white font-bold text-xl tracking-wider">
                K
              </div>
            </div>
            <div className="text-center">
              <div className="font-bold text-purple-700 text-lg">Khalti</div>
              <div className="text-xs text-purple-600 font-medium">
                Digital Wallet
              </div>
            </div>
            {selectedMethod === "khalti" && isProcessing && (
              <div className="absolute inset-0 bg-purple-50 bg-opacity-90 flex items-center justify-center rounded-lg">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
              </div>
            )}
          </Button>

          {/* Esewa Option */}
          <Button
            variant="outline"
            className="relative h-24 flex flex-col gap-2 hover:bg-green-50 hover:border-green-200 transition-colors border-2"
            onClick={() => handlePaymentMethod("esewa")}
            disabled={isProcessing}
          >
            <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
              <div className="text-white font-bold text-lg">
                <span className="text-xl">e</span>
                <span className="text-sm">SEWA</span>
              </div>
            </div>
            <div className="text-center">
              <div className="font-bold text-green-700 text-lg">eSewa</div>
              <div className="text-xs text-green-600 font-medium">
                Digital Payment
              </div>
            </div>
            {selectedMethod === "esewa" && isProcessing && (
              <div className="absolute inset-0 bg-green-50 bg-opacity-90 flex items-center justify-center rounded-lg">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              </div>
            )}
          </Button>
        </div>

        {/* Payment Features */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield className="w-4 h-4 text-green-500" />
            <span>256-bit SSL encryption</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Instant payment confirmation</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>24/7 customer support</span>
          </div>
        </div>

        {/* Payment Note */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Test Environment:</strong> You are using test payment
            gateways. Use test credentials provided by Khalti and eSewa for
            testing.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
