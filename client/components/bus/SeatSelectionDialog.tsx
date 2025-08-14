import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Armchair, Gauge, X, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const Seat = ({
  seatNumber,
  status,
  onClick,
}: {
  seatNumber: number;
  status: "available" | "selected" | "occupied";
  onClick: () => void;
}) => {
  const statusClasses = {
    available:
      "bg-gray-200 hover:bg-kanxa-blue hover:text-white hover:scale-105",
    selected: "bg-kanxa-orange text-white scale-105",
    occupied: "bg-gray-400 text-white cursor-not-allowed",
  };

  return (
    <button
      onClick={onClick}
      disabled={status === "occupied"}
      className={cn(
        "relative w-10 h-10 rounded flex items-center justify-center transition-transform duration-200 text-xs font-semibold shadow-sm",
        statusClasses[status],
      )}
      aria-label={`Seat ${seatNumber}`}
    >
      {seatNumber}
    </button>
  );
};

export const SeatSelectionDialog = ({ bus }: { bus: any }) => {
  const { isAuthenticated, isGuest } = useAuth();
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const occupiedSeats = [2, 5, 8, 12, 15, 23, 28, 31, 37, 42];
  const navigate = useNavigate();

  // Get price with fallback
  const busPrice = bus?.price || bus?.pricing?.basePrice || 800;

  // Safety check to ensure we have bus data
  if (!bus) {
    return (
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-kanxa-navy">
            Select Your Seats
          </DialogTitle>
          <DialogDescription>Loading bus information...</DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kanxa-blue"></div>
        </div>
      </DialogContent>
    );
  }

  const toggleSeat = (seatNumber: number) => {
    if (occupiedSeats.includes(seatNumber)) return;
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber],
    );
  };

  const getSeatStatus = (seatNumber: number) => {
    if (occupiedSeats.includes(seatNumber)) return "occupied";
    if (selectedSeats.includes(seatNumber)) return "selected";
    return "available";
  };

  const totalSeats = 44;
  const seatRows = Array.from(
    { length: Math.ceil(totalSeats / 4) },
    (_, i) => i,
  );

  return (
    <DialogContent className="max-w-4xl">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-kanxa-navy">
          Select Your Seats
        </DialogTitle>
        <DialogDescription>
          {bus.operator || bus.name || "Bus Service"} | {bus.from} → {bus.to}
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Seat Map */}
        <div className="lg:col-span-2">
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            {/* Driver */}
            <div className="flex justify-end mb-4 pr-4">
              <Gauge className="w-8 h-8 text-gray-500" />
            </div>

            {/* Seat Rows */}
            <div className="space-y-3">
              {seatRows.map((rowIndex) => (
                <div
                  key={rowIndex}
                  className="flex justify-center items-center gap-6"
                >
                  {/* Left side */}
                  <div className="flex gap-2">
                    {[1, 2].map((seatIndex) => {
                      const seatNumber = rowIndex * 4 + seatIndex;
                      if (seatNumber > totalSeats) return null;
                      return (
                        <Seat
                          key={seatNumber}
                          seatNumber={seatNumber}
                          status={getSeatStatus(seatNumber)}
                          onClick={() => toggleSeat(seatNumber)}
                        />
                      );
                    })}
                  </div>

                  {/* Aisle */}
                  <div className="w-6"></div>

                  {/* Right side */}
                  <div className="flex gap-2">
                    {[3, 4].map((seatIndex) => {
                      const seatNumber = rowIndex * 4 + seatIndex;
                      if (seatNumber > totalSeats) return null;
                      return (
                        <Seat
                          key={seatNumber}
                          seatNumber={seatNumber}
                          status={getSeatStatus(seatNumber)}
                          onClick={() => toggleSeat(seatNumber)}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-8 mt-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-200 rounded" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-kanxa-orange rounded" />
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-400 rounded" />
                <span>Occupied</span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-medium text-kanxa-navy">Selected Seats:</p>
              {selectedSeats.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedSeats
                    .sort((a, b) => a - b)
                    .map((seat) => (
                      <Badge
                        key={seat}
                        variant="secondary"
                        className="text-base"
                      >
                        {seat}
                      </Badge>
                    ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Please select one or more seats.
                </p>
              )}

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Seat(s) ({selectedSeats.length})</span>
                  <span>
                    Rs {(busPrice * selectedSeats.length).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <span>Rs 50</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-kanxa-blue">
                    Rs{" "}
                    {(busPrice * selectedSeats.length + 50 > 50
                      ? busPrice * selectedSeats.length + 50
                      : 0
                    ).toLocaleString()}
                  </span>
                </div>
              </div>

              <Button
                className="w-full bg-kanxa-green hover:bg-kanxa-green/90"
                disabled={selectedSeats.length === 0}
                onClick={() => {
                  if (!isAuthenticated || isGuest) {
                    navigate("/login");
                    return;
                  }
                  const totalAmount = busPrice * selectedSeats.length + 50;
                  const serviceName = `${bus.operator?.name || bus.name || "Bus Service"} - ${selectedSeats.length} seat${selectedSeats.length > 1 ? "s" : ""}`;
                  navigate(
                    `/payment?service=${bus.id}&type=bus&amount=${totalAmount}&seats=${selectedSeats.join(",")}&serviceName=${encodeURIComponent(serviceName)}`,
                  );
                }}
              >
                {!isAuthenticated || isGuest ? (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Login to Pay
                  </>
                ) : (
                  "Proceed to Payment"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DialogContent>
  );
};
