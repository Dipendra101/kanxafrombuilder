import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PaymentStatus() {
  const location = useLocation();
  const { toast } = useToast();

  const params = new URLSearchParams(location.search);
  const status = location.pathname.includes('success') ? 'success' : 'failure';
  
  useEffect(() => {
    if (status === 'success') {
      const data = params.get('data');
      if (data) {
        toast({
          title: "eSewa Payment Successful",
          description: "Your payment has been received. Thank you!",
        });
      }
    } else {
      toast({
        title: "Payment Failed",
        description: "Your payment could not be processed. Please try again.",
        variant: "destructive",
      });
    }
    // Clean the URL to prevent re-triggering the toast on refresh
    window.history.replaceState({}, document.title, "/");
  }, [status, params, toast]);

  return (
    <Layout>
      <div className="container py-20 flex justify-center items-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className={`mx-auto w-24 h-24 flex items-center justify-center rounded-full ${status === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                {status === 'success' ? (
                    <CheckCircle className="w-16 h-16 text-green-500" />
                ) : (
                    <XCircle className="w-16 h-16 text-red-500" />
                )}
            </div>
            <CardTitle className="mt-6 text-3xl">
              {status === 'success' ? 'Payment Successful!' : 'Payment Failed'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              {status === 'success' 
                ? "Your booking is confirmed. You can view your booking details in your profile."
                : "We were unable to process your payment. Please go back and try again."
              }
            </p>
            <Button asChild className="w-full">
              <Link to="/bookings">
                {status === 'success' ? 'View My Bookings' : 'Try Again'}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}