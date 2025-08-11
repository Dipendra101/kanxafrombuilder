import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Smartphone, DollarSign, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { paymentAPI } from '@/services/api';
import { toast } from 'sonner';

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
}

interface PaymentData {
  amount: number;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceName: string;
  serviceType: string;
}

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  useEffect(() => {
    loadPaymentMethods();
    if (location.state?.paymentData) {
      setPaymentData(location.state.paymentData);
    } else {
      // Demo data if no payment data provided
      setPaymentData({
        amount: 1500,
        orderId: `ORD-${Date.now()}`,
        customerName: 'Demo Customer',
        customerEmail: 'demo@example.com',
        customerPhone: '9800000000',
        serviceName: 'Bus Service - Kathmandu to Pokhara',
        serviceType: 'transportation'
      });
    }
  }, [location.state]);

  const loadPaymentMethods = async () => {
    try {
      const response = await paymentAPI.getPaymentMethods();
      setPaymentMethods(response.data || []);
    } catch (error) {
      console.error('Error loading payment methods:', error);
      toast.error('Failed to load payment methods');
    }
  };

  const handlePayment = async () => {
    if (!selectedMethod || !paymentData) {
      toast.error('Please select a payment method');
      return;
    }

    setProcessing(true);

    try {
      let response;
      const paymentPayload = {
        amount: paymentData.amount,
        orderId: paymentData.orderId,
        customerName: paymentData.customerName,
        customerEmail: paymentData.customerEmail,
        customerPhone: paymentData.customerPhone
      };

      switch (selectedMethod) {
        case 'khalti':
          response = await paymentAPI.initKhaltiPayment(paymentPayload);
          if (response.success) {
            // Redirect to Khalti payment page
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = response.data.payment_url;
            
            Object.entries(response.data.payload).forEach(([key, value]) => {
              const input = document.createElement('input');
              input.type = 'hidden';
              input.name = key;
              input.value = value as string;
              form.appendChild(input);
            });
            
            document.body.appendChild(form);
            form.submit();
          }
          break;

        case 'esewa':
          response = await paymentAPI.initEsewaPayment(paymentPayload);
          if (response.success) {
            // Redirect to Esewa payment page
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = response.data.payment_url;
            
            Object.entries(response.data.payload).forEach(([key, value]) => {
              const input = document.createElement('input');
              input.type = 'hidden';
              input.name = key;
              input.value = value as string;
              form.appendChild(input);
            });
            
            document.body.appendChild(form);
            form.submit();
          }
          break;

        case 'cod':
          response = await paymentAPI.processCOD({
            orderId: paymentData.orderId,
            amount: paymentData.amount
          });
          if (response.success) {
            toast.success('Order placed successfully! Pay on delivery.');
            navigate('/orders');
          }
          break;

        default:
          toast.error('Invalid payment method');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const getPaymentMethodIcon = (methodId: string) => {
    switch (methodId) {
      case 'khalti':
        return <CreditCard className="h-6 w-6 text-purple-600" />;
      case 'esewa':
        return <Smartphone className="h-6 w-6 text-green-600" />;
      case 'cod':
        return <DollarSign className="h-6 w-6 text-orange-600" />;
      default:
        return <CreditCard className="h-6 w-6 text-gray-600" />;
    }
  };

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Payment</h1>
          <p className="text-gray-600">Choose your preferred payment method</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedMethod === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${!method.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => method.enabled && setSelectedMethod(method.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getPaymentMethodIcon(method.id)}
                        <div>
                          <h3 className="font-semibold text-gray-900">{method.name}</h3>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                      </div>
                      {selectedMethod === method.id && (
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-medium">{paymentData.serviceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-mono text-sm">{paymentData.orderId}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total Amount:</span>
                    <span className="text-green-600">₹{paymentData.amount}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <div className="text-sm text-gray-600">
                    <h4 className="font-medium mb-2">Customer Details:</h4>
                    <p>{paymentData.customerName}</p>
                    <p>{paymentData.customerEmail}</p>
                    <p>{paymentData.customerPhone}</p>
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={!selectedMethod || processing}
                  className="w-full"
                  size="lg"
                >
                  {processing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    `Pay ₹${paymentData.amount}`
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="w-full"
                  disabled={processing}
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Payment Security Info */}
        <div className="mt-8">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-800">Secure Payment</h3>
              </div>
              <p className="text-sm text-green-700">
                Your payment information is encrypted and secure. We use industry-standard SSL encryption to protect your data.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payment;
