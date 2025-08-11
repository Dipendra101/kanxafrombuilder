import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { paymentAPI } from "@/services/payment";
import { useToast } from "@/hooks/use-toast";
import KhaltiLogo from '/public/khalti.png';
import EsewaLogo from '/public/esewa.png';


declare global {
  interface Window {
    KhaltiCheckout: any;
  }
}

export const PaymentDialog = ({ bus, selectedSeats }: { bus: any; selectedSeats: number[] }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<"khalti" | "esewa" | null>(null);

  const totalAmount = bus.price * selectedSeats.length + 50;

  const handleEsewaPayment = async () => {
    setIsLoading("esewa");
    try {
      const bookingId = `kanxa-${Date.now()}`;
      const response = await paymentAPI.initiateEsewa({
        bookingId: bookingId,
        amount: totalAmount,
      });

      const form = document.createElement('form');
      form.setAttribute('method', 'POST');
      form.setAttribute('action', response.esewaUrl);

      for (const key in response.formData) {
        const hiddenField = document.createElement('input');
        hiddenField.setAttribute('type', 'hidden');
        hiddenField.setAttribute('name', key);
        hiddenField.setAttribute('value', response.formData[key]);
        form.appendChild(hiddenField);
      }

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      toast({
        title: "eSewa Payment Error",
        description: "Failed to initiate eSewa payment. Please try again.",
        variant: "destructive",
      });
      setIsLoading(null);
    }
  };
  
  const handleKhaltiPayment = () => {
    setIsLoading("khalti");
    const bookingId = `kanxa-${Date.now()}`;

    const config = {
      publicKey: "test_public_key_dc74e0fd57cb46cd9f8041a3642013da",
      productIdentity: bookingId,
      productName: `Bus Ticket: ${bus.route}`,
      productUrl: window.location.href,
      eventHandler: {
        onSuccess(payload: any) {
          toast({
            title: "Payment Successful!",
            description: "Your booking has been confirmed.",
          });
          console.log(payload);
          setIsLoading(null);
        },
        onError(error: any) {
          toast({
            title: "Payment Failed",
            description: error.message || "An error occurred with Khalti.",
            variant: "destructive",
          });
          setIsLoading(null);
        },
        onClose() {
          setIsLoading(null);
        },
      },
      paymentPreference: ["KHALTI", "EBANKING", "MOBILE_BANKING", "CONNECT_IPS", "SCT"],
    };
    
    const checkout = new window.KhaltiCheckout(config);
    checkout.show({ amount: totalAmount * 100 }); // Amount in paisa
  };


  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-kanxa-navy">Complete Your Payment</DialogTitle>
        <DialogDescription>
          Choose your preferred payment method to confirm your booking.
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Booking Summary */}
        <Card className="md:col-span-1">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-lg">Booking Summary</h3>
            <div className="flex justify-between text-sm">
              <span>Bus</span>
              <span className="font-medium">{bus.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Route</span>
              <span className="font-medium">{bus.route}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Selected Seats ({selectedSeats.length})</span>
              <span className="font-medium">NPR {(bus.price * selectedSeats.length).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Service Fee</span>
              <span className="font-medium">NPR 50</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-xl">
              <span>Total Amount</span>
              <span className="text-kanxa-blue">NPR {totalAmount.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Payment Options */}
        <div className="md:col-span-1 space-y-4">
          <Button
            onClick={handleKhaltiPayment}
            disabled={!!isLoading}
            className="w-full h-16 bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isLoading === 'khalti' ? "Processing..." : (
              <>
                <img src={KhaltiLogo} alt="Khalti" className="h-8 mr-2"/>
                Pay with Khalti
              </>
            )}
          </Button>
          <Button
            onClick={handleEsewaPayment}
            disabled={!!isLoading}
            className="w-full h-16 bg-green-600 hover:bg-green-700 text-white"
          >
            {isLoading === 'esewa' ? "Redirecting..." : (
              <>
                <img src={EsewaLogo} alt="eSewa" className="h-10 mr-2"/>
                Pay with eSewa
              </>
            )}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};