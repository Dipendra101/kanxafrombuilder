import { useSearchParams, Link } from "react-router-dom";
import { AlertCircle, ArrowRight, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/layout/Layout";

export default function PaymentFailure() {
  const [searchParams] = useSearchParams();
  const method = searchParams.get('method') || 'Unknown';
  const error = searchParams.get('error') || 'Payment was cancelled or failed';

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-red-700">
                  Payment Failed
                </CardTitle>
                <p className="text-red-600">
                  Unfortunately, your payment could not be processed.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-white p-4 rounded-lg border border-red-200">
                  <h3 className="font-semibold text-red-700 mb-3">Payment Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <Badge variant="destructive" className="capitalize">
                        {method}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge variant="destructive">
                        Failed
                      </Badge>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600">Reason:</span>
                      <span className="text-red-600 text-right max-w-xs">
                        {error}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-kanxa-navy">What can you do?</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-kanxa-blue" />
                      <span>Try the payment again with the same or different method</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-kanxa-orange" />
                      <span>Check your account balance and payment details</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-kanxa-orange" />
                      <span>Contact your bank if the problem persists</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-kanxa-orange" />
                      <span>Reach out to our support team for assistance</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Need Help?</h4>
                  <p className="text-blue-800 text-sm mb-3">
                    Our customer support team is available 24/7 to help you with payment issues.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-blue-700 border-blue-300" asChild>
                      <Link to="/chat">
                        Live Chat
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" className="text-blue-700 border-blue-300" asChild>
                      <Link to="/support">
                        Support Center
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1 bg-kanxa-blue hover:bg-kanxa-blue/90" asChild>
                    <Link to="/payment">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
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
          </div>
        </div>
      </div>
    </Layout>
  );
}
