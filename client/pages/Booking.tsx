import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import GuestRestriction from "@/components/auth/GuestRestriction";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  Star,
  Download,
  Eye,
  Edit,
  Trash2,
  Bus,
  Truck,
  Settings,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Layout from "@/components/layout/Layout";

export default function Booking() {
  const { isGuest, isAuthenticated } = useAuth();
  const [bookingFilter, setBookingFilter] = useState("all");

  // Show guest restriction if user is in guest mode
  if (isGuest || !isAuthenticated) {
    return (
      <GuestRestriction
        action="view your bookings"
        description="You need to be logged in to view and manage your bookings. Create an account to track your transportation and service bookings."
      />
    );
  }

  const bookings = [
    {
      id: "BUS-2024-001",
      type: "bus",
      service: "Bus Booking",
      route: "Lamjung → Kathmandu",
      date: "2024-01-15",
      time: "6:00 AM",
      status: "confirmed",
      passenger: "John Doe",
      seats: ["12A", "12B"],
      amount: 1600,
      bookingDate: "2024-01-10",
      busName: "Kanxa Express",
      contactPhone: "+977-XXX-XXXXXX",
    },
    {
      id: "CAR-2024-002",
      type: "cargo",
      service: "Cargo Transport",
      route: "Pokhara → Lamjung",
      date: "2024-01-18",
      time: "8:00 AM",
      status: "pending",
      customer: "Ram Construction",
      weight: "5 tons",
      amount: 25000,
      bookingDate: "2024-01-12",
      truckType: "Medium Truck",
      contactPhone: "+977-XXX-XXXXXX",
    },
    {
      id: "MAC-2024-003",
      type: "machinery",
      service: "Machinery Rental",
      equipment: "JCB 3DX Excavator",
      startDate: "2024-01-20",
      endDate: "2024-01-25",
      status: "active",
      customer: "Highway Project Ltd",
      dailyRate: 8000,
      totalAmount: 40000,
      bookingDate: "2024-01-08",
      location: "Kathmandu Construction Site",
      contactPhone: "+977-XXX-XXXXXX",
    },
    {
      id: "GAR-2024-004",
      type: "garage",
      service: "Vehicle Service",
      vehicleType: "Tractor",
      serviceType: "Engine Repair",
      appointmentDate: "2024-01-22",
      appointmentTime: "10:00 AM",
      status: "scheduled",
      customer: "Farmer Cooperative",
      estimatedCost: 35000,
      bookingDate: "2024-01-14",
      technician: "Ram Bahadur Thapa",
      contactPhone: "+977-XXX-XXXXXX",
    },
    {
      id: "TOU-2024-005",
      type: "tour",
      service: "Custom Tour",
      destination: "Annapurna Circuit",
      startDate: "2024-02-01",
      endDate: "2024-02-15",
      status: "approved",
      customer: "Adventure Group",
      groupSize: "8 people",
      totalAmount: 120000,
      bookingDate: "2024-01-05",
      tourGuide: "Experienced Guide",
      contactPhone: "+977-XXX-XXXXXX",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      case "scheduled":
        return "bg-purple-100 text-purple-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case "bus":
        return <Bus className="h-5 w-5 text-kanxa-blue" />;
      case "cargo":
        return <Truck className="h-5 w-5 text-kanxa-orange" />;
      case "machinery":
        return <Settings className="h-5 w-5 text-kanxa-orange" />;
      case "garage":
        return <Settings className="h-5 w-5 text-kanxa-green" />;
      case "tour":
        return <MapPin className="h-5 w-5 text-kanxa-green" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (bookingFilter === "all") return true;
    return booking.type === bookingFilter;
  });

  const BookingDetails = ({ booking }: { booking: any }) => (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          {getServiceIcon(booking.type)}
          Booking Details - {booking.id}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-600">
              Service Type
            </Label>
            <p className="font-semibold">{booking.service}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Status</Label>
            <Badge className={getStatusColor(booking.status)}>
              {booking.status}
            </Badge>
          </div>
        </div>

        {booking.type === "bus" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Route
                </Label>
                <p className="font-semibold">{booking.route}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Bus</Label>
                <p className="font-semibold">{booking.busName}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Date & Time
                </Label>
                <p className="font-semibold">
                  {booking.date} at {booking.time}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Seats
                </Label>
                <p className="font-semibold">{booking.seats?.join(", ")}</p>
              </div>
            </div>
          </div>
        )}

        {booking.type === "cargo" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Route
                </Label>
                <p className="font-semibold">{booking.route}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Truck Type
                </Label>
                <p className="font-semibold">{booking.truckType}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Weight
                </Label>
                <p className="font-semibold">{booking.weight}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Pickup Date
                </Label>
                <p className="font-semibold">
                  {booking.date} at {booking.time}
                </p>
              </div>
            </div>
          </div>
        )}

        {booking.type === "machinery" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Equipment
                </Label>
                <p className="font-semibold">{booking.equipment}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Location
                </Label>
                <p className="font-semibold">{booking.location}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Rental Period
                </Label>
                <p className="font-semibold">
                  {booking.startDate} to {booking.endDate}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Daily Rate
                </Label>
                <p className="font-semibold">
                  NPR {booking.dailyRate?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {booking.type === "garage" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Vehicle Type
                </Label>
                <p className="font-semibold">{booking.vehicleType}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Service Type
                </Label>
                <p className="font-semibold">{booking.serviceType}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Appointment
                </Label>
                <p className="font-semibold">
                  {booking.appointmentDate} at {booking.appointmentTime}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Technician
                </Label>
                <p className="font-semibold">{booking.technician}</p>
              </div>
            </div>
          </div>
        )}

        {booking.type === "tour" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Destination
                </Label>
                <p className="font-semibold">{booking.destination}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Group Size
                </Label>
                <p className="font-semibold">{booking.groupSize}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Tour Duration
                </Label>
                <p className="font-semibold">
                  {booking.startDate} to {booking.endDate}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Tour Guide
                </Label>
                <p className="font-semibold">{booking.tourGuide}</p>
              </div>
            </div>
          </div>
        )}

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-600">
              Customer
            </Label>
            <p className="font-semibold">
              {booking.customer || booking.passenger}
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Contact</Label>
            <p className="font-semibold">{booking.contactPhone}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">
              Booking Date
            </Label>
            <p className="font-semibold">{booking.bookingDate}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">
              Total Amount
            </Label>
            <p className="font-semibold text-kanxa-green">
              NPR{" "}
              {(
                booking.amount ||
                booking.totalAmount ||
                booking.estimatedCost
              )?.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <Button className="flex-1 bg-kanxa-blue hover:bg-kanxa-blue/90">
            <Download className="mr-2 h-4 w-4" />
            Download Receipt
          </Button>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Modify Booking
          </Button>
        </div>
      </div>
    </DialogContent>
  );

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-kanxa-blue to-kanxa-navy text-white py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">My Bookings</h1>
            <p className="text-xl text-white/90 mb-8">
              Manage all your transportation, construction, and service bookings
              in one place
            </p>
          </div>
        </div>
      </section>

      {/* Booking Summary */}
      <section className="py-12 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-kanxa-blue mb-2">
                  {bookings.length}
                </div>
                <div className="text-sm text-gray-600">Total Bookings</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-kanxa-green mb-2">
                  {
                    bookings.filter(
                      (b) =>
                        b.status === "confirmed" || b.status === "approved",
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-600">Confirmed</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-kanxa-orange mb-2">
                  {bookings.filter((b) => b.status === "pending").length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-kanxa-blue mb-2">
                  {
                    bookings.filter(
                      (b) => b.status === "active" || b.status === "scheduled",
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-600">Active</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-kanxa-navy mb-2">
                  NPR{" "}
                  {bookings
                    .reduce(
                      (sum, b) =>
                        sum +
                        (b.amount || b.totalAmount || b.estimatedCost || 0),
                      0,
                    )
                    .toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Value</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Bookings List */}
      <section className="py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-kanxa-navy">
              Your Bookings
            </h2>

            <div className="flex gap-4">
              <Select value={bookingFilter} onValueChange={setBookingFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="bus">Bus Bookings</SelectItem>
                  <SelectItem value="cargo">Cargo Transport</SelectItem>
                  <SelectItem value="machinery">Machinery Rental</SelectItem>
                  <SelectItem value="garage">Garage Services</SelectItem>
                  <SelectItem value="tour">Custom Tours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <Card
                key={booking.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getServiceIcon(booking.type)}
                      <div>
                        <h3 className="font-bold text-kanxa-navy">
                          {booking.service}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Booking ID: {booking.id}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                      <div className="text-right">
                        <p className="font-bold text-kanxa-green">
                          NPR{" "}
                          {(
                            booking.amount ||
                            booking.totalAmount ||
                            booking.estimatedCost
                          )?.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          Booked: {booking.bookingDate}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Service Details
                      </Label>
                      {booking.type === "bus" && (
                        <p className="font-semibold">
                          {booking.route} • {booking.date}
                        </p>
                      )}
                      {booking.type === "cargo" && (
                        <p className="font-semibold">
                          {booking.route} • {booking.weight}
                        </p>
                      )}
                      {booking.type === "machinery" && (
                        <p className="font-semibold">{booking.equipment}</p>
                      )}
                      {booking.type === "garage" && (
                        <p className="font-semibold">
                          {booking.vehicleType} • {booking.serviceType}
                        </p>
                      )}
                      {booking.type === "tour" && (
                        <p className="font-semibold">
                          {booking.destination} • {booking.groupSize}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Customer
                      </Label>
                      <p className="font-semibold">
                        {booking.customer || booking.passenger}
                      </p>
                      <p className="text-sm text-gray-600">
                        {booking.contactPhone}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <BookingDetails booking={booking} />
                      </Dialog>

                      <Button size="sm" variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Receipt
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                No bookings found
              </h3>
              <p className="text-gray-500 mb-4">
                You don't have any bookings for the selected filter
              </p>
              <Button variant="outline">Browse Services</Button>
            </div>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-2xl font-bold text-kanxa-navy text-center mb-8">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <Bus className="h-12 w-12 text-kanxa-blue mx-auto mb-4" />
                <h3 className="font-semibold text-kanxa-navy mb-2">
                  Book Bus Ticket
                </h3>
                <p className="text-sm text-gray-600">Reserve your seat now</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <Truck className="h-12 w-12 text-kanxa-orange mx-auto mb-4" />
                <h3 className="font-semibold text-kanxa-navy mb-2">
                  Request Cargo
                </h3>
                <p className="text-sm text-gray-600">Transport your goods</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <Settings className="h-12 w-12 text-kanxa-orange mx-auto mb-4" />
                <h3 className="font-semibold text-kanxa-navy mb-2">
                  Rent Machinery
                </h3>
                <p className="text-sm text-gray-600">Professional equipment</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <MapPin className="h-12 w-12 text-kanxa-green mx-auto mb-4" />
                <h3 className="font-semibold text-kanxa-navy mb-2">
                  Plan Tour
                </h3>
                <p className="text-sm text-gray-600">Custom tour packages</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}
