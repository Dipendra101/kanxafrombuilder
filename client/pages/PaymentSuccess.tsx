import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle, ArrowRight, Download, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";

interface PaymentVerificationResult {
  success: boolean;
  verified?: boolean;
  transaction_id?: string;
  amount?: number;
  reference_id?: string;
  status?: string;
  error?: string;
}

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationResult, setVerificationResult] =
    useState<PaymentVerificationResult | null>(null);

  const method = searchParams.get("method");
  const transactionUuid = searchParams.get("transaction_uuid");
  const pidx = searchParams.get("pidx");
  const oid = searchParams.get("oid");
  const amt = searchParams.get("amt");
  const refId = searchParams.get("refId");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!method) {
        toast({
          title: "Invalid Payment",
          description: "Payment method not specified",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      try {
        let verificationResponse;

        if (method === "khalti") {
          if (!pidx) {
            throw new Error("Missing pidx parameter for Khalti verification");
          }

          verificationResponse = await fetch("/api/payments/verify/khalti", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ pidx }),
          });
        } else if (method === "esewa") {
          if (!oid || !amt || !refId) {
            throw new Error("Missing parameters for eSewa verification");
          }

          verificationResponse = await fetch("/api/payments/verify/esewa", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ oid, amt, refId }),
          });
        } else {
          throw new Error("Unknown payment method");
        }

        const result = await verificationResponse.json();
        console.log("Payment verification result:", result);

        setVerificationResult(result);

        if (result.success && result.verified) {
          toast({
            title: "Payment Successful! 🎉",
            description: `Your payment via ${method} has been verified successfully.`,
          });
        } else {
          toast({
            title: "Payment Verification Failed",
            description:
              result.error ||
              "Unable to verify payment. Please contact support.",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        console.error("Payment verification error:", error);
        setVerificationResult({
          success: false,
          error: error.message || "Verification failed",
        });
        toast({
          title: "Verification Error",
          description: error.message || "Failed to verify payment",
          variant: "destructive",
        });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [method, pidx, oid, amt, refId, toast, navigate]);

  if (isVerifying) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kanxa-blue mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-kanxa-navy mb-2">
                Verifying Payment...
              </h3>
              <p className="text-gray-600">
                Please wait while we confirm your {method} payment.
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const isPaymentSuccessful =
    verificationResult?.success && verificationResult?.verified;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container px-4">
          <div className="max-w-2xl mx-auto">
            {isPaymentSuccessful ? (
              <Card className="border-green-200 bg-green-50">
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-green-700">
                    Payment Successful!
                  </CardTitle>
                  <p className="text-green-600">
                    Your payment has been processed successfully.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-semibold text-kanxa-navy mb-3">
                      Payment Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method:</span>
                        <Badge variant="secondary" className="capitalize">
                          {method}
                        </Badge>
                      </div>
                      {verificationResult?.transaction_id && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Transaction ID:</span>
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                            {verificationResult.transaction_id}
                          </span>
                        </div>
                      )}
                      {verificationResult?.amount && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-semibold text-kanxa-navy">
                            Rs {verificationResult.amount.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {verificationResult?.reference_id && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Reference ID:</span>
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                            {verificationResult.reference_id}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <Badge className="bg-green-500 text-white">
                          Completed
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-semibold text-kanxa-navy">
                      What's Next?
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Booking confirmation sent to your email</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>SMS notification sent to your phone</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Booking details available in your account</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      className="flex-1 bg-kanxa-blue hover:bg-kanxa-blue/90"
                      asChild
                    >
                      <Link to="/orders">
                        View My Bookings
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/">
                        <Home className="w-4 h-4 mr-2" />
                        Home
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-red-200 bg-red-50">
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">✕</span>
                  </div>
                  <CardTitle className="text-2xl text-red-700">
                    Payment Verification Failed
                  </CardTitle>
                  <p className="text-red-600">
                    We couldn't verify your payment. Please try again or contact
                    support.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {verificationResult?.error && (
                    <div className="bg-white p-4 rounded-lg border border-red-200">
                      <h3 className="font-semibold text-red-700 mb-2">
                        Error Details
                      </h3>
                      <p className="text-sm text-red-600">
                        {verificationResult.error}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      className="flex-1 bg-kanxa-blue hover:bg-kanxa-blue/90"
                      asChild
                    >
                      <Link to="/payment">
                        Try Again
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/support">Contact Support</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
