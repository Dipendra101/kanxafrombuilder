import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bus,
  Calendar,
  MapPin,
  Clock,
  Users,
  Star,
  Filter,
  Search,
  ArrowRight,
  Wifi,
  Coffee,
  Snowflake,
  Shield,
  CreditCard,
  CheckCircle,
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
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import Layout from "@/components/layout/Layout";
import { SeatSelectionDialog } from "@/components/bus/SeatSelectionDialog";

export default function Buses() {
  const [selectedDate, setSelectedDate] = useState("today");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [selectedBus, setSelectedBus] = useState<any>(null);

  const routes = [
    "Lamjung",
    "Kathmandu",
    "Pokhara",
    "Chitwan",
    "Butwal",
    "Dharan",
    "Biratnagar",
  ];

  const buses = [
    {
      id: 1,
      name: "Kanxa Express",
      route: "Lamjung → Kathmandu",
      departure: "6:00 AM",
      arrival: "12:00 PM",
      duration: "6h 0m",
      price: 800,
      type: "Express",
      amenities: ["AC", "WiFi", "Snacks"],
      seatsAvailable: 12,
      totalSeats: 45,
      rating: 4.8,
      reviews: 156,
      features: ["Premium seats", "USB charging", "Entertainment system"],
    },
    {
      id: 2,
      name: "Safari Deluxe",
      route: "Lamjung → Kathmandu",
      departure: "8:30 AM",
      arrival: "2:30 PM",
      duration: "6h 0m",
      price: 950,
      type: "Deluxe",
      amenities: ["AC", "WiFi", "Meals", "Blanket"],
      seatsAvailable: 8,
      totalSeats: 40,
      rating: 4.9,
      reviews: 203,
      features: [
        "Reclining seats",
        "Personal entertainment",
        "Complimentary meals",
      ],
    },
    {
      id: 3,
      name: "Night Express",
      route: "Lamjung → Kathmandu",
      departure: "10:00 PM",
      arrival: "4:00 AM +1",
      duration: "6h 0m",
      price: 750,
      type: "Night Service",
      amenities: ["AC", "Blanket", "Pillow"],
      seatsAvailable: 15,
      totalSeats: 45,
      rating: 4.7,
      reviews: 134,
      features: ["Sleeper seats", "Night travel comfort", "Security patrol"],
    },
    {
      id: 4,
      name: "Pokhara Express",
      route: "Lamjung → Pokhara",
      departure: "7:00 AM",
      arrival: "10:30 AM",
      duration: "3h 30m",
      price: 500,
      type: "Express",
      amenities: ["AC", "WiFi"],
      seatsAvailable: 20,
      totalSeats: 45,
      rating: 4.6,
      reviews: 89,
      features: ["Scenic route", "Comfortable seating", "Local guide info"],
    },
    {
      id: 5,
      name: "Return Express",
      route: "Kathmandu → Lamjung",
      departure: "2:00 PM",
      arrival: "8:00 PM",
      duration: "6h 0m",
      price: 800,
      type: "Express",
      amenities: ["AC", "WiFi", "Snacks"],
      seatsAvailable: 18,
      totalSeats: 45,
      rating: 4.8,
      reviews: 167,
      features: ["Return journey", "Evening departure", "Comfortable ride"],
    },
  ];

  const filteredBuses = buses.filter((bus) => {
    if (
      fromLocation &&
      !bus.route.toLowerCase().includes(fromLocation.toLowerCase())
    )
      return false;
    if (
      toLocation &&
      !bus.route.toLowerCase().includes(toLocation.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-kanxa-blue to-kanxa-navy text-white py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Book Your Bus Journey
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Comfortable, reliable, and safe bus services across Nepal
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container px-4">
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <Label htmlFor="from">From</Label>
                  <Select value={fromLocation} onValueChange={setFromLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select departure" />
                    </SelectTrigger>
                    <SelectContent>
                      {routes.map((route) => (
                        <SelectItem key={route} value={route}>
                          {route}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="to">To</Label>
                  <Select value={toLocation} onValueChange={setToLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {routes.map((route) => (
                        <SelectItem key={route} value={route}>
                          {route}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="date">Date</Label>
                  <Select value={selectedDate} onValueChange={setSelectedDate}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="tomorrow">Tomorrow</SelectItem>
                      <SelectItem value="day-after">
                        Day After Tomorrow
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="sm:col-span-2 lg:col-span-2 flex flex-col sm:flex-row items-stretch sm:items-end gap-2">
                  <Button className="flex-1 bg-kanxa-blue hover:bg-kanxa-blue/90">
                    <Search className="mr-2 h-4 w-4" />
                    Search Buses
                  </Button>
                  <Button variant="outline" size="icon" className="sm:w-auto">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12">
        <div className="container px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-kanxa-navy">
              Available Buses ({filteredBuses.length})
            </h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Sort by:</span>
              <Select defaultValue="departure">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="departure">Departure Time</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredBuses.map((bus) => (
              <Card key={bus.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start lg:items-center">
                    {/* Bus Info */}
                    <div className="lg:col-span-3">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-kanxa-blue rounded-lg flex items-center justify-center">
                          <Bus className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-kanxa-navy">
                            {bus.name}
                          </h3>
                          <Badge variant="secondary">{bus.type}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{bus.rating}</span>
                        <span className="text-gray-500">
                          ({bus.reviews} reviews)
                        </span>
                      </div>
                    </div>

                    {/* Route & Time */}
                    <div className="lg:col-span-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-kanxa-blue" />
                          <span>{bus.route}</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4">
                          <div className="text-center flex-1">
                            <p className="text-base sm:text-lg font-bold text-kanxa-navy">
                              {bus.departure}
                            </p>
                            <p className="text-xs text-gray-500">Departure</p>
                          </div>
                          <div className="flex-shrink-0 mx-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                          </div>
                          <div className="text-center flex-1">
                            <p className="text-base sm:text-lg font-bold text-kanxa-navy">
                              {bus.arrival}
                            </p>
                            <p className="text-xs text-gray-500">Arrival</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 text-center">
                          {bus.duration}
                        </p>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="lg:col-span-2">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">
                          Amenities:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {bus.amenities.map((amenity) => (
                            <Badge
                              key={amenity}
                              variant="outline"
                              className="text-xs"
                            >
                              {amenity === "AC" && (
                                <Snowflake className="mr-1 h-3 w-3" />
                              )}
                              {amenity === "WiFi" && (
                                <Wifi className="mr-1 h-3 w-3" />
                              )}
                              {amenity === "Snacks" && (
                                <Coffee className="mr-1 h-3 w-3" />
                              )}
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Seats & Price */}
                    <div className="lg:col-span-2">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Seats Available</p>
                        <p className="text-lg font-bold text-kanxa-green">
                          {bus.seatsAvailable}/{bus.totalSeats}
                        </p>
                      </div>
                    </div>

                    {/* Booking */}
                    <div className="lg:col-span-2">
                      <div className="text-center space-y-2">
                        <p className="text-2xl font-bold text-kanxa-blue">
                          NPR {bus.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">per person</p>
                        <Dialog onOpenChange={(open) => !open && setSelectedBus(null)}>
                          <DialogTrigger asChild>
                            <Button
                              className="w-full bg-kanxa-blue hover:bg-kanxa-blue/90"
                              onClick={() => setSelectedBus(bus)}
                            >
                              Select Seats
                            </Button>
                          </DialogTrigger>
                          {selectedBus && bus.id === selectedBus.id && (
                            <SeatSelectionDialog bus={selectedBus} />
                          )}
                        </Dialog>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <Separator className="my-4" />
                  <div className="flex flex-wrap gap-2">
                    {bus.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-1 text-sm text-gray-600"
                      >
                        <CheckCircle className="h-3 w-3 text-kanxa-green" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredBuses.length === 0 && (
            <div className="text-center py-12">
              <Bus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                No buses found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search criteria
              </p>
              <Button variant="outline">Clear Filters</Button>
            </div>
          )}
        </div>
      </section>

      {/* Safety & Trust Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-kanxa-navy mb-4">
              Your Safety is Our Priority
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Travel with confidence knowing we maintain the highest safety
              standards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: <Shield className="h-8 w-8 text-kanxa-blue" />,
                title: "COVID-19 Safety",
                description: "Regular sanitization and health protocols",
              },
              {
                icon: <CheckCircle className="h-8 w-8 text-kanxa-green" />,
                title: "Licensed Drivers",
                description: "Experienced and certified professional drivers",
              },
              {
                icon: <Clock className="h-8 w-8 text-kanxa-orange" />,
                title: "24/7 Support",
                description: "Round-the-clock customer assistance",
              },
              {
                icon: <CreditCard className="h-8 w-8 text-kanxa-blue" />,
                title: "Secure Payments",
                description: "Safe transactions via Khalti & eSewa",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-kanxa-navy mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}