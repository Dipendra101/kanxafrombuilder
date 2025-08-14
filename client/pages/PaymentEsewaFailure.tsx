import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { XCircle, ArrowLeft, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast-simple";
import Layout from "@/components/layout/Layout";

export default function PaymentEsewaFailure() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    // Show failure notification
    toast({
      title: "Payment Failed",
      description: "Your eSewa payment was cancelled or failed.",
      variant: "destructive",
    });
  }, [toast]);

  const error = searchParams.get("error") || "Payment was cancelled or failed";
  const transactionId = searchParams.get("transaction_uuid") || "Unknown";

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-16">
        <div className="container max-w-2xl mx-auto px-4">
          <Card className="border-red-200 bg-red-50">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-12 w-12 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-red-700">
                Payment Failed
              </CardTitle>
              <p className="text-red-600">
                Unfortunately, your eSewa payment could not be processed.
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold text-red-700 mb-3">
                  Payment Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <Badge
                      variant="destructive"
                      className="bg-red-100 text-red-800"
                    >
                      eSewa
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge variant="destructive">Failed</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-mono text-xs">{transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Error:</span>
                    <span className="text-red-600 text-xs">{error}</span>
                  </div>
                </div>
              </div>

              <div className="bg-orange-100 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">
                  Possible Reasons
                </h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Payment was cancelled by user</li>
                  <li>• Insufficient balance in eSewa account</li>
                  <li>• Network connectivity issues</li>
                  <li>• Technical error during processing</li>
                </ul>
              </div>

              <div className="bg-blue-100 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">
                  What You Can Do
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>
                    • Try the payment again with the same or different method
                  </li>
                  <li>• Check your eSewa account balance</li>
                  <li>• Contact our customer support for assistance</li>
                  <li>• Use alternative payment methods (Khalti, COD)</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <Button asChild className="flex-1">
                  <Link to="/materials">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Link>
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <Link to="/support">Contact Support</Link>
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Need immediate help? Our customer support team is available
                  24/7.
                </p>
                <div className="flex justify-center gap-4">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="tel:+977-XXX-XXXXXX">📞 Call Support</Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/chat">💬 Live Chat</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

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
