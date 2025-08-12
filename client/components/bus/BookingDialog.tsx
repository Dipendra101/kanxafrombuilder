import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PaymentDialog } from '@/components/bus/PaymentDialog'; // We will still use this

export const BookingDialog = ({
  product,
  children,
}: {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    type: 'bus' | 'cargo' | 'other';
  };
  children: React.ReactNode;
}) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // A simplified "booking" for non-bus items for now
  const mockBooking = {
    ...product,
    route: product.description, // Use description as a mock route
  };

  // For bus bookings, we'd launch the seat selector here.
  // For others, we can go straight to payment.
  if (product.type !== 'bus') {
    return (
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        {isBookingOpen && (
          <PaymentDialog
            bus={mockBooking} // The payment dialog is flexible enough to take any product
            selectedSeats={[]} // Pass an empty array for non-seat-based items
            onPaymentSuccess={() => setIsBookingOpen(false)}
          />
        )}
      </Dialog>
    );
  }

  // If it's a bus, you would trigger the SeatSelectionDialog here.
  // For simplicity in this example, we'll keep it separate for now.
  return <>{children}</>;
};