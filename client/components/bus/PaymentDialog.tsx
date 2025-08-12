// import { useState } from "react";
// import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { paymentAPI } from "@/services/payment";
// import { useToast } from "@/hooks/use-toast";

// // REMOVE these incorrect import statements
// // import KhaltiLogo from '/public/khaltilogo.png'; 
// // import EsewaLogo from '/public/esewa_logo.png';

// declare global {
//   interface Window {
//     KhaltiCheckout: any;
//   }
// }

// export const PaymentDialog = ({ bus, selectedSeats }: { bus: any; selectedSeats: number[] }) => {
//   const { toast } = useToast();
//   const [isLoading, setIsLoading] = useState<"khalti" | "esewa" | null>(null);

//   const totalAmount = bus.price * selectedSeats.length + 50;

//   const handleEsewaPayment = async () => {
//     setIsLoading("esewa");
//     try {
//       const bookingId = `kanxa-${Date.now()}`;
//       const response = await paymentAPI.initiateEsewa({
//         bookingId: bookingId,
//         amount: totalAmount,
//       });

//       const form = document.createElement('form');
//       form.setAttribute('method', 'POST');
//       form.setAttribute('action', response.esewaUrl);

//       for (const key in response.formData) {
//         const hiddenField = document.createElement('input');
//         hiddenField.setAttribute('type', 'hidden');
//         hiddenField.setAttribute('name', key);
//         hiddenField.setAttribute('value', response.formData[key]);
//         form.appendChild(hiddenField);
//       }

//       document.body.appendChild(form);
//       form.submit();
//     } catch (error) {
//       toast({
//         title: "eSewa Payment Error",
//         description: "Failed to initiate eSewa payment. Please try again.",
//         variant: "destructive",
//       });
//       setIsLoading(null);
//     }
//   };
  
//   const handleKhaltiPayment = () => {
//     setIsLoading("khalti");
//     const bookingId = `kanxa-${Date.now()}`;

//     const config = {
//       publicKey: "test_public_key_dc74e0fd57cb46cd9f8041a3642013da",
//       productIdentity: bookingId,
//       productName: `Bus Ticket: ${bus.route}`,
//       productUrl: window.location.href,
//       eventHandler: {
//         onSuccess(payload: any) {
//           toast({
//             title: "Payment Successful!",
//             description: "Your booking has been confirmed.",
//           });
//           console.log(payload);
//           setIsLoading(null);
//         },
//         onError(error: any) {
//           toast({
//             title: "Payment Failed",
//             description: error.message || "An error occurred with Khalti.",
//             variant: "destructive",
//           });
//           setIsLoading(null);
//         },
//         onClose() {
//           setIsLoading(null);
//         },
//       },
//       paymentPreference: ["KHALTI", "EBANKING", "MOBILE_BANKING", "CONNECT_IPS", "SCT"],
//     };
    
//     const checkout = new window.KhaltiCheckout(config);
//     checkout.show({ amount: totalAmount * 100 }); // Amount in paisa
//   };


//   return (
//     <DialogContent className="max-w-2xl">
//       <DialogHeader>
//         <DialogTitle className="text-2xl font-bold text-kanxa-navy">Complete Your Payment</DialogTitle>
//         <DialogDescription>
//           Choose your preferred payment method to confirm your booking.
//         </DialogDescription>
//       </DialogHeader>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
//         {/* Booking Summary */}
//         <Card className="md:col-span-1">
//           <CardContent className="p-6 space-y-4">
//             <h3 className="font-semibold text-lg">Booking Summary</h3>
//             <div className="flex justify-between text-sm">
//               <span>Bus</span>
//               <span className="font-medium">{bus.name}</span>
//             </div>
//             <div className="flex justify-between text-sm">
//               <span>Route</span>
//               <span className="font-medium">{bus.route}</span>
//             </div>
//             <div className="flex justify-between text-sm">
//               <span>Selected Seats ({selectedSeats.length})</span>
//               <span className="font-medium">NPR {(bus.price * selectedSeats.length).toLocaleString()}</span>
//             </div>
//             <div className="flex justify-between text-sm">
//               <span>Service Fee</span>
//               <span className="font-medium">NPR 50</span>
//             </div>
//             <Separator />
//             <div className="flex justify-between font-bold text-xl">
//               <span>Total Amount</span>
//               <span className="text-kanxa-blue">NPR {totalAmount.toLocaleString()}</span>
//             </div>
//           </CardContent>
//         </Card>
        
//         {/* Payment Options */}
//         <div className="md:col-span-1 space-y-4">
//           <Button
//             onClick={handleKhaltiPayment}
//             disabled={!!isLoading}
//             className="w-full h-16 bg-purple-600 hover:bg-purple-700 text-white"
//           >
//             {isLoading === 'khalti' ? "Processing..." : (
//               <>
//                 {/* Use a direct string path for the src */}
//                 <img src="/khalti.png" alt="Khalti" className="h-8 mr-2"/>
//                 Pay with Khalti
//               </>
//             )}
//           </Button>
//           <Button
//             onClick={handleEsewaPayment}
//             disabled={!!isLoading}
//             className="w-full h-16 bg-green-600 hover:bg-green-700 text-white"
//           >
//             {isLoading === 'esewa' ? "Redirecting..." : (
//               <>
//                 {/* Use a direct string path for the src */}
//                 <img src="/esewa.png" alt="eSewa" className="h-10 mr-2"/>
//                 Pay with eSewa
//               </>
//             )}
//           </Button>
//         </div>
//       </div>
//     </DialogContent>
//   );
// };
import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { paymentAPI } from "@/services/payment";
import { apiRequest } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    KhaltiCheckout: any;
  }
}

export const PaymentDialog = ({ bus, selectedSeats, onPaymentSuccess }: { bus: any; selectedSeats: number[], onPaymentSuccess: () => void }) => {
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
    } catch (error: any) {
      toast({
        title: "eSewa Payment Error",
        description: error.message || "Failed to initiate eSewa payment.",
        variant: "destructive",
      });
      setIsLoading(null);
    }
  };
  
  const handleKhaltiPayment = () => {
    if (typeof window.KhaltiCheckout === 'undefined') {
      toast({
        title: "Khalti Not Ready",
        description: "The Khalti payment script has not loaded yet. Please wait a moment or refresh the page.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading("khalti");
    const bookingId = `kanxa-${Date.now()}`;

    const config = {
      // Using the public key from your motofix project
      publicKey: "test_public_key_617c4c6fe77c441d88451ec1408a0c0e",
      productIdentity: bookingId,
      productName: `Bus Ticket: ${bus.route || `${bus.from} → ${bus.to}`}`,
      productUrl: window.location.href,
      eventHandler: {
        async onSuccess(payload: any) {
          try {
            // This is the crucial verification step from your motofix code
            await apiRequest('/payment/khalti/verify', {
              method: 'POST',
              body: JSON.stringify({
                token: payload.token,
                amount: payload.amount,
              })
            });
            toast({
              title: "Payment Successful!",
              description: "Your booking has been confirmed and verified.",
            });
            onPaymentSuccess();
          } catch (error: any) {
            toast({
              title: "Verification Failed",
              description: error.message || 'Your payment was successful but server verification failed. Please contact support.',
              variant: "destructive",
            });
          } finally {
            setIsLoading(null);
          }
        },
        onError(error: any) {
          toast({
            title: "Payment Failed",
            description: "The payment process was interrupted or failed.",
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
    checkout.show({ amount: totalAmount * 100 }); // Amount is in paisa for Khalti
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
              <span className="font-medium">{bus.name || bus.operator}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Route</span>
              <span className="font-medium">{bus.route || `${bus.from} → ${bus.to}`}</span>
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
              <div className="flex items-center"><img src="/khaltilogo.png" alt="Khalti" className="h-8 mr-2"/> Pay with Khalti</div>
            )}
          </Button>
          <Button
            onClick={handleEsewaPayment}
            disabled={!!isLoading}
            className="w-full h-16 bg-green-600 hover:bg-green-700 text-white"
          >
            {isLoading === 'esewa' ? "Redirecting..." : (
              <div className="flex items-center"><img src="/esewa_logo.png" alt="eSewa" className="h-10 mr-2"/> Pay with eSewa</div>
            )}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};