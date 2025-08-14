import { useState, useEffect } from "react";
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
  AlertTriangle,
  RefreshCw,
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
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import Layout from "@/components/layout/Layout";
import { SeatSelectionDialog } from "@/components/bus/SeatSelectionDialog";
import { servicesAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast-simple";

interface BusService {
  _id: string;
  name: string;
  description: string;
  type: string;
  category: string;
  pricing: {
    basePrice: number;
    currency: string;
  };
  isActive: boolean;
  isFeatured: boolean;
  rating: {
    average: number;
    count: number;
  };
  routes?: Array<{
    from: string;
    to: string;
    departure: string;
    arrival: string;
    duration: string;
  }>;
  amenities?: string[];
  features?: string[];
  seatsAvailable?: number;
  totalSeats?: number;
  schedule?: Array<{
    departure: string;
    arrival: string;
    days: string[];
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function Buses() {
  const [selectedDate, setSelectedDate] = useState("today");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [selectedBus, setSelectedBus] = useState<any>(null);
  const [buses, setBuses] = useState<BusService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("departure");
  const { toast } = useToast();

  // Available routes from the seeded data
  const routes = [
    "Lamjung",
    "Kathmandu",
    "Pokhara",
    "Chitwan",
    "Butwal",
    "Dharan",
    "Biratnagar",
  ];

  // Load bus services from API
  useEffect(() => {
    const loadBuses = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch bus services from API
        const response = await servicesAPI.getBuses();
        const busServices = response.buses || [];
        
        // Transform API data to match UI expectations
        const transformedBuses = busServices.map((bus: any) => ({
          ...bus,
          id: bus._id,
          price: bus.pricing?.basePrice || 800,
          // Provide default values for UI
          route: bus.routes?.[0] ? `${bus.routes[0].from} → ${bus.routes[0].to}` : "Lamjung → Kathmandu",
          departure: bus.routes?.[0]?.departure || "6:00 AM",
          arrival: bus.routes?.[0]?.arrival || "12:00 PM",
          duration: bus.routes?.[0]?.duration || "6h 0m",
          amenities: bus.amenities || ["AC", "WiFi"],
          features: bus.features || ["Comfortable seating", "Professional service"],
          seatsAvailable: bus.seatsAvailable || Math.floor(Math.random() * 20) + 5,
          totalSeats: bus.totalSeats || 45,
          reviews: bus.rating?.count || Math.floor(Math.random() * 200) + 50,
        }));
        
        setBuses(transformedBuses);
      } catch (error: any) {
        console.error("Failed to load buses:", error);
        setError("Failed to load bus services. Please try again.");
        toast({
          title: "Error",
          description: "Failed to load bus services. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadBuses();
  }, [toast]);

  // Filter and sort buses
  const filteredBuses = buses.filter((bus) => {
    // Search term filter
    if (searchTerm && !bus.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !bus.route.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Route filters
    if (fromLocation && !bus.route.toLowerCase().includes(fromLocation.toLowerCase())) {
      return false;
    }
    if (toLocation && !bus.route.toLowerCase().includes(toLocation.toLowerCase())) {
      return false;
    }
    
    // Only show active buses
    return bus.isActive;
  }).sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.price - b.price;
      case "rating":
        return (b.rating?.average || 0) - (a.rating?.average || 0);
      case "duration":
        return a.duration.localeCompare(b.duration);
      default: // departure
        return a.departure.localeCompare(b.departure);
    }
  });

  const handleSearch = () => {
    // Search is already handled by the filter effect
    toast({
      title: "Search Complete",
      description: `Found ${filteredBuses.length} bus(es) matching your criteria.`,
    });
  };

  const clearFilters = () => {
    setFromLocation("");
    setToLocation("");
    setSearchTerm("");
    setSortBy("departure");
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kanxa-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bus services...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Buses</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </Layout>
    );
  }

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
                  <Button 
                    className="flex-1 bg-kanxa-blue hover:bg-kanxa-blue/90"
                    onClick={handleSearch}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Search Buses
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="sm:w-auto"
                    onClick={clearFilters}
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Additional search bar */}
              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by bus name or route..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
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
              <Select value={sortBy} onValueChange={setSortBy}>
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
              <Card key={bus._id} className="hover:shadow-lg transition-shadow">
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
                          <Badge variant="secondary">
                            {bus.type || "Bus Service"}
                          </Badge>
                          {bus.isFeatured && (
                            <Badge variant="default" className="ml-1 text-xs">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">
                          {bus.rating?.average?.toFixed(1) || "4.5"}
                        </span>
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
                              {(amenity === "Snacks" || amenity === "Meals") && (
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
                          ₨ {bus.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">per person</p>
                        <Dialog
                          onOpenChange={(open) => !open && setSelectedBus(null)}
                        >
                          <DialogTrigger asChild>
                            <Button
                              className="w-full bg-kanxa-blue hover:bg-kanxa-blue/90"
                              onClick={() => setSelectedBus(bus)}
                              disabled={bus.seatsAvailable === 0}
                            >
                              {bus.seatsAvailable === 0 ? "Sold Out" : "Select Seats"}
                            </Button>
                          </DialogTrigger>
                          {selectedBus && bus._id === selectedBus._id && (
                            <SeatSelectionDialog bus={selectedBus} />
                          )}
                        </Dialog>
                      </div>
                    </div>
                  </div>

                  {/* Features & Description */}
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    {bus.description && (
                      <p className="text-sm text-gray-600">{bus.description}</p>
                    )}
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredBuses.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Bus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                No buses found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search criteria or check back later
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
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
