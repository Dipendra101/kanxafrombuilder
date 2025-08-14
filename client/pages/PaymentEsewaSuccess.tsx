import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle, ArrowLeft, Gift, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";

export default function PaymentEsewaSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const data = searchParams.get('data');
        
        if (!data) {
          throw new Error('No payment data received');
        }

        // Verify payment with backend
        const response = await fetch(`/api/payments/esewa/verify?data=${data}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        const result = await response.json();
        setVerificationResult(result);

        if (result.success) {
          toast({
            title: "Payment Successful! 🎉",
            description: result.message || "Your eSewa payment has been verified successfully.",
          });

          // Dispatch payment completion event
          window.dispatchEvent(new CustomEvent("paymentCompleted", {
            detail: { method: 'esewa', service: 'eSewa Payment' }
          }));
        } else {
          toast({
            title: "Payment Verification Failed",
            description: result.message || "Unable to verify your payment.",
            variant: "destructive",
          });
        }

      } catch (error: any) {
        console.error('Payment verification error:', error);
        setVerificationResult({
          success: false,
          message: error.message || 'Failed to verify payment'
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
  }, [searchParams, toast]);

  if (isVerifying) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-kanxa-navy mb-2">
                Verifying Payment...
              </h3>
              <p className="text-gray-600">
                Please wait while we confirm your eSewa payment.
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const isPaymentSuccessful = verificationResult?.success;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-16">
        <div className="container max-w-2xl mx-auto px-4">
          {isPaymentSuccessful ? (
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-green-700">
                  Payment Successful!
                </CardTitle>
                <p className="text-green-600">
                  Your eSewa payment has been processed successfully.
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="bg-white p-4 rounded-lg">
                  <h3 className="font-semibold text-kanxa-navy mb-3">
                    Payment Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        eSewa
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className="bg-green-600">Verified</Badge>
                    </div>
                    {verificationResult?.points && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Loyalty Points Earned:</span>
                        <div className="flex items-center gap-1">
                          <Gift className="h-4 w-4 text-purple-600" />
                          <span className="font-semibold text-purple-600">
                            {verificationResult.points} points
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-green-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">What's Next?</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Your order is being processed</li>
                    <li>• You'll receive confirmation via email</li>
                    <li>• Track your order in your profile</li>
                    <li>• Enjoy your purchase!</li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <Button asChild className="flex-1">
                    <Link to="/profile">
                      View Orders
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="flex-1">
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
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-12 w-12 text-red-600" />
                </div>
                <CardTitle className="text-2xl text-red-700">
                  Payment Verification Failed
                </CardTitle>
                <p className="text-red-600">
                  We couldn't verify your payment. Please try again or contact support.
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="bg-white p-4 rounded-lg">
                  <h3 className="font-semibold text-red-800 mb-2">Error Details</h3>
                  <p className="text-sm text-red-700">
                    {verificationResult?.message || 'Payment verification failed'}
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button variant="destructive" asChild className="flex-1">
                    <Link to="/materials">
                      Try Again
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="flex-1">
                    <Link to="/support">
                      Contact Support
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="text-center mt-8">
            <Button variant="ghost" asChild>
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
