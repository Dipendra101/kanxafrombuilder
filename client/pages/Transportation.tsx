import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Bus,
  Truck,
  MapPin,
  Calendar,
  Clock,
  Users,
  Star,
  Filter,
  Search,
  ArrowRight,
  Route,
  CreditCard,
  CheckCircle,
  Lock,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
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
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Layout from "@/components/layout/Layout";
import { servicesAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast-simple";
import { SeatSelectionDialog } from "@/components/bus/SeatSelectionDialog";

export default function Transportation() {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("buses");
  const [selectedRoute, setSelectedRoute] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBus, setSelectedBus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch services from backend
  const fetchServices = async (type: string = "bus") => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      setError(null);

      const filters = {
        from:
          selectedRoute && selectedRoute !== "all"
            ? selectedRoute.split(" → ")[0]
            : undefined,
        to:
          selectedRoute && selectedRoute !== "all"
            ? selectedRoute.split(" → ")[1]
            : undefined,
        type,
        isActive: true,
      };

      let response;
      switch (type) {
        case "bus":
          response = await servicesAPI.getBuses(filters);
          setServices(response.buses || response.services || []);
          break;
        case "cargo":
          response = await servicesAPI.getCargo(filters);
          setServices(response.cargo || response.services || []);
          break;
        case "tours":
          response = await servicesAPI.getAllServices({
            ...filters,
            type: "tour",
          });
          setServices(response.services || []);
          break;
        default:
          response = await servicesAPI.getAllServices({
            ...filters,
            limit: 20,
          });
          setServices(response.services || []);
      }

      console.log(`✅ Loaded ${services.length} ${type} services`);
    } catch (error: any) {
      console.error(`Failed to fetch ${type} services:`, error);
      setError(`Failed to load ${type} services. Please try again.`);
      toast({
        title: "Error",
        description: `Failed to load ${type} services. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load services when tab or filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchServices(selectedTab === "buses" ? "bus" : selectedTab);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [selectedTab, selectedRoute]);

  // Filter services based on search query
  const filteredServices = services.filter((service) => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        service.name?.toLowerCase().includes(searchLower) ||
        service.description?.toLowerCase().includes(searchLower) ||
        service.busService?.route?.from?.toLowerCase().includes(searchLower) ||
        service.busService?.route?.to?.toLowerCase().includes(searchLower) ||
        service.cargoService?.routes?.some((route: string) =>
          route.toLowerCase().includes(searchLower),
        )
      );
    }
    return true;
  });

  // Get available routes from services for the dropdown
  const getAvailableRoutes = () => {
    const routes = new Set<string>();

    services.forEach((service) => {
      if (service.busService?.route) {
        const route = `${service.busService.route.from} → ${service.busService.route.to}`;
        routes.add(route);
      }
      if (service.cargoService?.routes) {
        service.cargoService.routes.forEach((route: string) =>
          routes.add(route),
        );
      }
    });

    return Array.from(routes);
  };

  const renderBusService = (service: any, index: number) => (
    <Card
      key={service._id || service.id || `bus-${index}`}
      className="hover:shadow-lg transition-shadow border-l-4 border-l-kanxa-blue"
    >
      <CardContent className="p-0">
        <div className="flex items-center">
          {/* Company Logo & Info */}
          <div className="flex items-center gap-4 p-6 flex-1">
            <div className="w-12 h-12 bg-kanxa-blue rounded-lg flex items-center justify-center text-white font-bold text-lg">
              {service.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="font-semibold text-kanxa-navy text-lg">
                {service.name}
              </div>
              <div className="text-sm text-gray-600">
                {service.busService?.vehicle?.busType || "Express"}
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-gray-600">
                  {service.rating?.average || "4.5"} (
                  {service.rating?.count || "0"} reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Route & Time Info */}
          <div className="px-6 py-4 border-l border-gray-200 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-kanxa-blue" />
              <span className="text-lg font-semibold text-kanxa-navy">
                {service.busService?.route?.from || "Departure"} →{" "}
                {service.busService?.route?.to || "Destination"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500">Duration</div>
                <div className="font-semibold text-lg">
                  {service.busService?.route?.duration || "N/A"}
                </div>
              </div>
              <div>
                <div className="text-gray-500">Distance</div>
                <div className="font-semibold text-lg">
                  {service.busService?.route?.distance
                    ? `${service.busService.route.distance} km`
                    : "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="px-6 py-4 border-l border-gray-200 flex-1">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Amenities:
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {(service.busService?.vehicle?.amenities || ["Standard Service"])
                .slice(0, 4)
                .map((amenity: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700"
                  >
                    {amenity}
                  </span>
                ))}
            </div>
            <div className="text-sm text-kanxa-green font-medium">
              Available Seats
            </div>
            <div className="text-lg font-bold text-kanxa-green">
              {service.busService?.vehicle?.totalSeats || "Available"}
            </div>
          </div>

          {/* Pricing & Booking */}
          <div className="px-6 py-4 text-right">
            <div className="text-2xl font-bold text-kanxa-navy mb-1">
              Rs {(service.pricing?.basePrice || 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 mb-4">per person</div>
            <Dialog onOpenChange={(open) => !open && setSelectedBus(null)}>
              <DialogTrigger asChild>
                {!isAuthenticated ? (
                  <Link to="/login">
                    <Button className="w-full bg-kanxa-blue hover:bg-kanxa-blue/90 text-white font-semibold py-2 px-6 rounded-lg">
                      <Lock className="mr-2 h-4 w-4" />
                      Login to Book
                    </Button>
                  </Link>
                ) : (
                  <Button
                    className="w-full bg-kanxa-blue hover:bg-kanxa-blue/90 text-white font-semibold py-2 px-6 rounded-lg"
                    onClick={() => setSelectedBus(service)}
                  >
                    Select Seats
                  </Button>
                )}
              </DialogTrigger>
              <SeatSelectionDialog bus={selectedBus || service} />
            </Dialog>
          </div>
        </div>

        {/* Additional Features Row */}
        <div className="px-6 py-3 bg-gray-50 border-t">
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Professional Service</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Insurance Covered</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderCargoService = (service: any, index: number) => (
    <Card key={service._id || service.id || `cargo-${index}`} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Truck className="w-6 h-6 text-kanxa-orange" />
          <CardTitle className="text-kanxa-navy">{service.name}</CardTitle>
        </div>
        <Badge className="w-fit bg-kanxa-orange/10 text-kanxa-orange">
          {service.cargoService?.capacity || "Available"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">{service.description}</p>

        {service.cargoService?.routes && (
          <div>
            <h4 className="font-medium text-kanxa-navy mb-2">
              Available Routes:
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {service.cargoService.routes.map(
                (route: string, index: number) => (
                  <li key={index}>• {route}</li>
                ),
              )}
            </ul>
          </div>
        )}

        {service.cargoService?.features && (
          <div>
            <h4 className="font-medium text-kanxa-navy mb-2">Features:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {service.cargoService.features.map(
                (feature: string, index: number) => (
                  <li key={index}>• {feature}</li>
                ),
              )}
            </ul>
          </div>
        )}

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Base Price:</span>
            <span className="font-medium">
              Rs {(service.pricing?.basePrice || 0).toLocaleString()}
            </span>
          </div>
          {service.pricing?.pricePerKm && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Per KM:</span>
              <span className="font-medium">
                Rs {service.pricing.pricePerKm}
              </span>
            </div>
          )}
        </div>

        {!isAuthenticated ? (
          <Link to="/login">
            <Button className="w-full bg-kanxa-orange hover:bg-kanxa-orange/90">
              <Lock className="mr-2 h-4 w-4" />
              Login to Book
            </Button>
          </Link>
        ) : (
          <Link
            to={`/payment?service=${service._id}&type=cargo&amount=${service.pricing?.basePrice || 0}`}
          >
            <Button className="w-full bg-kanxa-orange hover:bg-kanxa-orange/90">
              Book Service
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-kanxa-navy to-kanxa-blue text-white py-16">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Transportation Services
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Reliable, comfortable, and affordable transportation solutions
              connecting Lamjung to major cities across Nepal
            </p>
          </div>
        </div>
      </section>

      {/* Quick Booking Section */}
      <section className="py-12 bg-white">
        <div className="container px-4">
          <div className="max-w-6xl mx-auto">
            <Tabs
              value={selectedTab}
              onValueChange={setSelectedTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="buses" className="flex items-center gap-2">
                  <Bus className="w-4 h-4" />
                  Bus Services
                </TabsTrigger>
                <TabsTrigger value="cargo" className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  Cargo Services
                </TabsTrigger>
                <TabsTrigger value="tours" className="flex items-center gap-2">
                  <Route className="w-4 h-4" />
                  Custom Tours
                </TabsTrigger>
              </TabsList>

              <TabsContent value="buses" className="space-y-6">
                {/* Search and Filter */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="w-5 h-5" />
                      Find Your Bus
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor="search">Search</Label>
                        <Input
                          id="search"
                          placeholder="Search services..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="route">Select Route</Label>
                        <Select
                          value={selectedRoute}
                          onValueChange={setSelectedRoute}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose route" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Routes</SelectItem>
                            {getAvailableRoutes().map((route) => (
                              <SelectItem key={route} value={route}>
                                {route}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="date">Travel Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          className="w-full bg-kanxa-blue hover:bg-kanxa-blue/90"
                          onClick={() => fetchServices("bus")}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Searching...
                            </>
                          ) : (
                            "Search Buses"
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Available Services */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-kanxa-navy">
                      Available Buses ({filteredServices.length})
                    </h3>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {isLoading ? (
                    <div className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-kanxa-blue" />
                      <p className="mt-2 text-gray-600">Loading services...</p>
                    </div>
                  ) : filteredServices.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-8">
                        <Bus className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">
                          No bus services found. Please try different search
                          criteria.
                        </p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => {
                            setSearchQuery("");
                            setSelectedRoute("all");
                            fetchServices("bus");
                          }}
                        >
                          Clear Filters
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {filteredServices.map((service, index) => renderBusService(service, index))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="cargo" className="space-y-6">
                <h3 className="text-2xl font-bold text-kanxa-navy">
                  Cargo Services ({filteredServices.length})
                </h3>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {isLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-kanxa-blue" />
                    <p className="mt-2 text-gray-600">
                      Loading cargo services...
                    </p>
                  </div>
                ) : filteredServices.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Truck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">
                        No cargo services available at the moment.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices.map((service, index) => renderCargoService(service, index))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="tours" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Route className="w-6 h-6 text-kanxa-green" />
                      Custom Tour Services
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-gray-600">
                      Plan your perfect tour with our custom transportation
                      services. We provide flexible routing, comfortable
                      vehicles, and experienced drivers.
                    </p>

                    {filteredServices.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredServices.map((service, index) => (
                          <Card
                            key={service._id || service.id || `tour-${index}`}
                            className="hover:shadow-lg transition-shadow"
                          >
                            <CardHeader>
                              <CardTitle className="text-kanxa-navy">
                                {service.name}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-gray-600 mb-4">
                                {service.description}
                              </p>
                              <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-kanxa-green">
                                  Rs{" "}
                                  {(
                                    service.pricing?.basePrice || 0
                                  ).toLocaleString()}
                                </span>
                                {!isAuthenticated ? (
                                  <Link to="/login">
                                    <Button
                                      size="sm"
                                      className="bg-kanxa-green hover:bg-kanxa-green/90"
                                    >
                                      <Lock className="mr-2 h-4 w-4" />
                                      Login to Book
                                    </Button>
                                  </Link>
                                ) : (
                                  <Link
                                    to={`/payment?service=${service._id}&type=tour&amount=${service.pricing?.basePrice || 0}`}
                                  >
                                    <Button
                                      size="sm"
                                      className="bg-kanxa-green hover:bg-kanxa-green/90"
                                    >
                                      Book Tour
                                    </Button>
                                  </Link>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-kanxa-light-green p-4 rounded-lg">
                        <h4 className="font-medium text-kanxa-navy mb-2">
                          Get Custom Quote
                        </h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Contact us with your requirements for a personalized
                          quote
                        </p>
                        <div className="flex gap-2">
                          <Button className="bg-kanxa-green hover:bg-kanxa-green/90">
                            Call: +977-9800000000
                          </Button>
                          <Button variant="outline" asChild>
                            <Link to="/chat">Chat with Us</Link>
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-kanxa-navy mb-4">
              Why Choose Our Transportation?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-kanxa-blue rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-kanxa-navy mb-2">
                Reliable Service
              </h3>
              <p className="text-gray-600">
                On-time departures and arrivals with real-time tracking
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-kanxa-orange rounded-lg flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-kanxa-navy mb-2">
                Secure Payments
              </h3>
              <p className="text-gray-600">
                Multiple payment options with full security
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-kanxa-green rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-kanxa-navy mb-2">
                24/7 Support
              </h3>
              <p className="text-gray-600">
                Round-the-clock customer assistance
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
