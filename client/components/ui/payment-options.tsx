import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Shield, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Declare Khalti Checkout for TypeScript
declare global {
  interface Window {
    KhaltiCheckout: any;
  }
}

interface PaymentOptionsProps {
  amount: number;
  service: string;
  serviceId: string;
  onPaymentSelect?: (method: string) => void;
  className?: string;
  bookingId?: string;
}

export function PaymentOptions({
  amount,
  service,
  serviceId,
  onPaymentSelect,
  className = "",
  bookingId,
}: PaymentOptionsProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePaymentMethod = async (method: string) => {
    setSelectedMethod(method);
    setIsProcessing(true);

    try {
      const amountToPay = amount;

      if (method === "esewa") {
        try {
          const response = await fetch("/api/payments/esewa/initiate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            body: JSON.stringify({
              amount: amountToPay,
              service: service,
              serviceId: serviceId,
              bookingId: bookingId || `${service}-${Date.now()}`,
            }),
          });

          // Read response only once and handle both success and error cases
          let responseData;
          try {
            responseData = await response.json();
          } catch (parseError) {
            throw new Error("Invalid response from server");
          }

          if (!response.ok) {
            throw new Error(
              responseData?.message || `Server error: ${response.status}`,
            );
          }

          toast({
            title: "Redirecting to eSewa",
            description: "Please complete your payment on eSewa...",
          });

          // Create form for eSewa submission
          const form = document.createElement("form");
          form.setAttribute("method", "POST");
          form.setAttribute("action", responseData.ESEWA_URL);

          // Add all form fields
          for (const key in responseData) {
            if (key !== "ESEWA_URL" && key !== "success") {
              const hiddenField = document.createElement("input");
              hiddenField.setAttribute("type", "hidden");
              hiddenField.setAttribute("name", key);
              hiddenField.setAttribute("value", responseData[key]);
              form.appendChild(hiddenField);
            }
          }

          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        } catch (error: any) {
          console.error("eSewa payment error:", error);
          toast({
            title: "Payment Failed",
            description: error.message || "Error initiating eSewa payment.",
            variant: "destructive",
          });
        } finally {
          setIsProcessing(false);
          setSelectedMethod("");
        }
        return;
      }

      if (method === "khalti") {
        toast({
          title: "Opening Khalti",
          description: "Please complete your payment...",
        });

        // Load Khalti script if not already loaded
        if (typeof window.KhaltiCheckout === "undefined") {
          const script = document.createElement("script");
          script.src =
            "https://khalti.s3.ap-south-1.amazonaws.com/KPG/dist/2020.12.17.0.0.0/khalti-checkout.iffe.js";
          script.onload = () => initializeKhaltiPayment();
          document.head.appendChild(script);
        } else {
          initializeKhaltiPayment();
        }

        function initializeKhaltiPayment() {
          const khaltiConfig = {
            publicKey: "test_public_key_617c4c6fe77c441d88451ec1408a0c0e",
            productIdentity: bookingId || serviceId,
            productName: service,
            productUrl: window.location.href,
            eventHandler: {
              async onSuccess(payload: any) {
                try {
                  setIsProcessing(true);

                  toast({
                    title: "Verifying Payment...",
                    description: "Please wait while we verify your payment...",
                  });

                  const response = await fetch("/api/payments/khalti/verify", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                    body: JSON.stringify({
                      token: payload.token,
                      amount: payload.amount,
                      service: service,
                      serviceId: serviceId,
                      bookingId: bookingId || `${service}-${Date.now()}`,
                    }),
                  });

                  const result = await response.json();

                  if (result.success) {
                    toast({
                      title: "Payment Successful! 🎉",
                      description:
                        result.message || "Payment verified successfully!",
                    });

                    // Handle success based on service type
                    if (service === "Construction Materials") {
                      window.dispatchEvent(
                        new CustomEvent("paymentCompleted", {
                          detail: { method: "khalti", service },
                        }),
                      );
                    }

                    if (onPaymentSelect) {
                      onPaymentSelect("khalti");
                    }

                    // Redirect based on service
                    setTimeout(() => {
                      if (
                        service.includes("Bus") ||
                        service.includes("Transportation")
                      ) {
                        navigate("/bookings");
                      } else if (service === "Construction Materials") {
                        navigate("/materials");
                      } else {
                        navigate("/profile");
                      }
                    }, 2000);
                  } else {
                    throw new Error(
                      result.message || "Payment verification failed",
                    );
                  }
                } catch (error: any) {
                  console.error("Khalti verification error:", error);
                  toast({
                    title: "Payment Verification Failed",
                    description:
                      error.message || "Payment verification failed.",
                    variant: "destructive",
                  });
                } finally {
                  setIsProcessing(false);
                  setSelectedMethod("");
                }
              },
              onError: (error: any) => {
                console.error("Khalti payment error:", error);
                toast({
                  title: "Payment Failed",
                  description: "Payment process was interrupted.",
                  variant: "destructive",
                });
                setIsProcessing(false);
                setSelectedMethod("");
              },
              onClose: () => {
                console.log("Khalti widget closed");
                setIsProcessing(false);
                setSelectedMethod("");
              },
            },
            paymentPreference: [
              "KHALTI",
              "EBANKING",
              "MOBILE_BANKING",
              "CONNECT_IPS",
              "SCT",
            ],
          };

          const checkout = new window.KhaltiCheckout(khaltiConfig);
          checkout.show({ amount: amountToPay * 100 }); // Khalti expects amount in paisa
        }

        return;
      }

      // Handle COD method
      if (method === "cod") {
        try {
          toast({
            title: "Processing COD Order",
            description: "Confirming your cash on delivery order...",
          });

          // Simulate COD confirmation
          await new Promise((resolve) => setTimeout(resolve, 1500));

          toast({
            title: "Order Confirmed! 📦",
            description: "Your cash on delivery order has been confirmed.",
          });

          if (service === "Construction Materials") {
            window.dispatchEvent(
              new CustomEvent("paymentCompleted", {
                detail: { method: "cod", service },
              }),
            );
          }

          if (onPaymentSelect) {
            onPaymentSelect("cod");
          }
        } catch (error: any) {
          toast({
            title: "Order Failed",
            description: error.message || "Failed to confirm COD order.",
            variant: "destructive",
          });
        }

        setIsProcessing(false);
        setSelectedMethod("");
        return;
      }

      // Handle other payment methods
      if (onPaymentSelect) {
        onPaymentSelect(method);
      }
    } catch (error: any) {
      console.error("Payment method error:", error);
      toast({
        title: "Payment Failed",
        description:
          error.message || "Unable to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          {/* COD Option */}
          <Button
            variant="outline"
            className="relative h-24 flex flex-col gap-2 hover:bg-orange-50 hover:border-orange-200 transition-colors border-2"
            onClick={() => handlePaymentMethod("cod")}
            disabled={isProcessing}
          >
            <div className="w-14 h-14 bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl flex items-center justify-center shadow-lg">
              <div className="text-white font-bold text-lg">COD</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-orange-700 text-lg">Cash</div>
              <div className="text-xs text-orange-600 font-medium">
                On Delivery
              </div>
            </div>
            {selectedMethod === "cod" && isProcessing && (
              <div className="absolute inset-0 bg-orange-50 bg-opacity-90 flex items-center justify-center rounded-lg">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
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
            <strong>Secure Payment:</strong> All transactions are protected with
            industry-standard security measures. Choose your preferred payment
            method above.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
