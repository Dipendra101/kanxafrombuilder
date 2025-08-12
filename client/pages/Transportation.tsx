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
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
<<<<<<< HEAD
import { servicesAPI } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
=======
import { SeatSelectionDialog } from "@/components/bus/SeatSelectionDialog";

const busRoutes = [
  {
    id: 1,
    from: "Lamjung",
    to: "Kathmandu",
    departureTime: "06:00 AM",
    arrivalTime: "12:00 PM",
    duration: "6h 0m",
    price: 800,
    availableSeats: 12,
    totalSeats: 45,
    busType: "Deluxe AC",
    amenities: ["AC", "WiFi", "Charging Port", "Entertainment"],
    rating: 4.8,
    operator: "Kanxa Express",
  },
  {
    id: 2,
    from: "Lamjung",
    to: "Pokhara",
    departureTime: "08:30 AM",
    arrivalTime: "11:00 AM",
    duration: "2h 30m",
    price: 500,
    availableSeats: 8,
    totalSeats: 35,
    busType: "Standard",
    amenities: ["Comfortable Seats", "Music System"],
    rating: 4.6,
    operator: "Mountain Express",
  },
  {
    id: 3,
    from: "Kathmandu",
    to: "Lamjung",
    departureTime: "02:00 PM",
    arrivalTime: "08:00 PM",
    duration: "6h 0m",
    price: 800,
    availableSeats: 15,
    totalSeats: 45,
    busType: "Deluxe AC",
    amenities: ["AC", "WiFi", "Charging Port", "Entertainment"],
    rating: 4.9,
    operator: "Kanxa Express",
  },
  {
    id: 4,
    from: "Pokhara",
    to: "Lamjung",
    departureTime: "04:30 PM",
    arrivalTime: "07:00 PM",
    duration: "2h 30m",
    price: 500,
    availableSeats: 20,
    totalSeats: 35,
    busType: "Standard",
    amenities: ["Comfortable Seats", "Music System"],
    rating: 4.5,
    operator: "Lake City Transport",
  },
];

const cargoServices = [
  {
    id: 1,
    type: "Heavy Truck",
    capacity: "10 tons",
    routes: ["Lamjung → Kathmandu", "Kathmandu → Lamjung"],
    pricePerKm: 25,
    basePrice: 15000,
    features: ["GPS Tracking", "Insurance Covered", "24/7 Support"],
  },
  {
    id: 2,
    type: "Medium Truck",
    capacity: "5 tons",
    routes: ["Lamjung → Pokhara", "Pokhara → Lamjung"],
    pricePerKm: 18,
    basePrice: 8000,
    features: ["GPS Tracking", "Insurance Covered"],
  },
  {
    id: 3,
    type: "Light Truck",
    capacity: "2 tons",
    routes: ["Local Delivery", "Custom Routes"],
    pricePerKm: 12,
    basePrice: 3000,
    features: ["Flexible Routes", "Quick Delivery"],
  },
];
>>>>>>> 9e1a853b5a9934aaeb388675f6691d683261ed53

export default function Transportation() {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("buses");
  const [selectedRoute, setSelectedRoute] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
<<<<<<< HEAD
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch services from backend
  const fetchServices = async (type: string = "bus") => {
    try {
      setIsLoading(true);
      const filters = {
        from: selectedRoute.split(' → ')[0] || undefined,
        to: selectedRoute.split(' → ')[1] || undefined,
        type
      };

      let response;
      switch (type) {
        case 'bus':
          response = await servicesAPI.getBusServices(filters);
          setServices(response.buses || []);
          break;
        case 'cargo':
          response = await servicesAPI.getCargoServices(filters);
          setServices(response.cargo || []);
          break;
        default:
          response = await servicesAPI.getAllServices({ type, limit: 20 });
          setServices(response.services || []);
      }
    } catch (error: any) {
      console.error('Failed to fetch services:', error);
      toast({
        title: "Error",
        description: "Failed to load services. Showing sample data.",
        variant: "destructive"
      });
      // Fallback to sample data
      loadSampleData(type);
    } finally {
      setIsLoading(false);
=======
  const [selectedBus, setSelectedBus] = useState<any>(null);

  const filteredBuses = busRoutes.filter((bus) => {
    if (selectedRoute && selectedRoute !== "all" && !`${bus.from} → ${bus.to}`.includes(selectedRoute)) {
      return false;
>>>>>>> 9e1a853b5a9934aaeb388675f6691d683261ed53
    }
  };

  const loadSampleData = (type: string) => {
    if (type === 'bus') {
      setServices([
        {
          id: '1',
          name: 'Kanxa Express',
          from: 'Lamjung',
          to: 'Kathmandu',
          departureTime: '06:00 AM',
          arrivalTime: '12:00 PM',
          duration: '6h 0m',
          pricing: { basePrice: 800 },
          vehicle: {
            busType: 'Deluxe AC',
            totalSeats: 45,
            amenities: ['AC', 'WiFi', 'Charging Port', 'Entertainment']
          },
          rating: { average: 4.8, count: 156 },
          operator: { name: 'Kanxa Express' }
        },
        {
          id: '2',
          name: 'Mountain Express',
          from: 'Lamjung',
          to: 'Pokhara',
          departureTime: '08:30 AM',
          arrivalTime: '11:00 AM',
          duration: '2h 30m',
          pricing: { basePrice: 500 },
          vehicle: {
            busType: 'Standard',
            totalSeats: 35,
            amenities: ['Comfortable Seats', 'Music System']
          },
          rating: { average: 4.6, count: 89 },
          operator: { name: 'Mountain Express' }
        }
      ]);
    }
  };

  useEffect(() => {
    fetchServices(selectedTab === 'buses' ? 'bus' : selectedTab);
  }, [selectedTab]);

  const filteredServices = services.filter((service) => {
    if (selectedRoute && service.from && service.to) {
      const routeMatch = `${service.from} → ${service.to}`.toLowerCase().includes(selectedRoute.toLowerCase());
      if (!routeMatch) return false;
    }
    if (searchQuery) {
      const searchMatch = 
        service.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.from?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.to?.toLowerCase().includes(searchQuery.toLowerCase());
      if (!searchMatch) return false;
    }
    return true;
  });

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
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
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
                        <Label htmlFor="search">Search Route</Label>
                        <Input
                          id="search"
                          placeholder="From / To city"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="route">Select Route</Label>
                        <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose route" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Routes</SelectItem>
                            <SelectItem value="Lamjung → Kathmandu">Lamjung → Kathmandu</SelectItem>
                            <SelectItem value="Lamjung → Pokhara">Lamjung → Pokhara</SelectItem>
                            <SelectItem value="Kathmandu → Lamjung">Kathmandu → Lamjung</SelectItem>
                            <SelectItem value="Pokhara → Lamjung">Pokhara → Lamjung</SelectItem>
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
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button 
                          className="w-full bg-kanxa-blue hover:bg-kanxa-blue/90"
                          onClick={() => fetchServices('bus')}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Searching...' : 'Search Buses'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Available Buses */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-kanxa-navy">Available Buses</h3>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kanxa-blue mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading buses...</p>
                    </div>
                  ) : filteredServices.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-8">
                        <Bus className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">No buses found for your search criteria.</p>
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedRoute('');
                            fetchServices('bus');
                          }}
                        >
                          Clear Filters
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredServices.map((bus) => (
                      <Card key={bus.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Bus className="w-5 h-5 text-kanxa-blue" />
                                <span className="font-medium text-kanxa-navy">{bus.operator?.name || bus.name}</span>
                                <Badge variant="outline">{bus.vehicle?.busType || 'Standard'}</Badge>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm text-gray-600">{bus.rating?.average || 4.5}</span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-lg font-semibold text-kanxa-navy">
                                <MapPin className="w-4 h-4" />
                                {bus.from} → {bus.to}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {bus.departureTime} - {bus.arrivalTime}
                                </div>
                                <span>({bus.duration})</span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-kanxa-green" />
                                <span className="text-sm">
                                  {Math.floor(Math.random() * 20) + 5} seats available
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {(bus.vehicle?.amenities || []).slice(0, 3).map((amenity: string, index: number) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {amenity}
                                  </Badge>
                                ))}
                                {(bus.vehicle?.amenities || []).length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{(bus.vehicle?.amenities || []).length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
<<<<<<< HEAD

                            <div className="text-center space-y-2">
                              <div className="text-2xl font-bold text-kanxa-navy">
                                NPR {(bus.pricing?.basePrice || 800).toLocaleString()}
                              </div>
                              <Link to={`/book?service=${bus.id}&type=bus`}>
                                <Button className="w-full bg-kanxa-orange hover:bg-kanxa-orange/90">
                                  Book Seats
                                </Button>
                              </Link>
                            </div>
=======
                            <Dialog onOpenChange={(open) => !open && setSelectedBus(null)}>
                              <DialogTrigger asChild>
                                <Button
                                  className="w-full bg-kanxa-orange hover:bg-kanxa-orange/90"
                                  onClick={() => setSelectedBus(bus)}
                                >
                                  Book Seats
                                </Button>
                              </DialogTrigger>
                              {selectedBus && bus.id === selectedBus.id && (
                                <SeatSelectionDialog bus={selectedBus} />
                              )}
                            </Dialog>
>>>>>>> 9e1a853b5a9934aaeb388675f6691d683261ed53
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="cargo" className="space-y-6">
                <h3 className="text-2xl font-bold text-kanxa-navy">Cargo Services</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      id: 'cargo1',
                      type: 'Heavy Truck',
                      capacity: '10 tons',
                      routes: ['Lamjung → Kathmandu', 'Kathmandu → Lamjung'],
                      basePrice: 15000,
                      pricePerKm: 25,
                      features: ['GPS Tracking', 'Insurance Covered', '24/7 Support']
                    },
                    {
                      id: 'cargo2',
                      type: 'Medium Truck',
                      capacity: '5 tons',
                      routes: ['Lamjung → Pokhara', 'Pokhara → Lamjung'],
                      basePrice: 8000,
                      pricePerKm: 18,
                      features: ['GPS Tracking', 'Insurance Covered']
                    },
                    {
                      id: 'cargo3',
                      type: 'Light Truck',
                      capacity: '2 tons',
                      routes: ['Local Delivery', 'Custom Routes'],
                      basePrice: 3000,
                      pricePerKm: 12,
                      features: ['Flexible Routes', 'Quick Delivery']
                    }
                  ].map((cargo) => (
                    <Card key={cargo.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Truck className="w-6 h-6 text-kanxa-orange" />
                          <CardTitle className="text-kanxa-navy">{cargo.type}</CardTitle>
                        </div>
                        <Badge className="w-fit bg-kanxa-orange/10 text-kanxa-orange">
                          {cargo.capacity}
                        </Badge>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-medium text-kanxa-navy mb-2">Available Routes:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {cargo.routes.map((route, index) => (
                              <li key={index}>• {route}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-kanxa-navy mb-2">Features:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {cargo.features.map((feature, index) => (
                              <li key={index}>• {feature}</li>
                            ))}
                          </ul>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Base Price:</span>
                            <span className="font-medium">NPR {cargo.basePrice.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Per KM:</span>
                            <span className="font-medium">NPR {cargo.pricePerKm}</span>
                          </div>
                        </div>
                        <Link to={`/book?service=${cargo.id}&type=cargo`}>
                          <Button className="w-full bg-kanxa-orange hover:bg-kanxa-orange/90">
                            Request Quote
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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
                      Plan your perfect tour with our custom transportation services. 
                      We provide flexible routing, comfortable vehicles, and experienced drivers.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-kanxa-navy">Tour Options:</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>• Day trips to popular destinations</li>
                          <li>• Multi-day tour packages</li>
                          <li>• Corporate transportation</li>
                          <li>• Event and wedding transport</li>
                          <li>• Airport transfers</li>
                          <li>• Custom route planning</li>
                        </ul>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-semibold text-kanxa-navy">Included Services:</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>• Professional drivers</li>
                          <li>• Fuel and maintenance</li>
                          <li>• Insurance coverage</li>
                          <li>• 24/7 customer support</li>
                          <li>• Flexible scheduling</li>
                          <li>• GPS tracking</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-kanxa-light-green p-4 rounded-lg">
                      <h4 className="font-medium text-kanxa-navy mb-2">Get Custom Quote</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Contact us with your requirements for a personalized quote
                      </p>
                      <div className="flex gap-2">
                        <Button className="bg-kanxa-green hover:bg-kanxa-green/90">
                          Call: 9856056782
                        </Button>
                        <Button variant="outline" asChild>
                          <Link to="/chat">Chat with Us</Link>
                        </Button>
                      </div>
                    </div>
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
              <h3 className="font-semibold text-kanxa-navy mb-2">Reliable Service</h3>
              <p className="text-gray-600">On-time departures and arrivals with real-time tracking</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-kanxa-orange rounded-lg flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-kanxa-navy mb-2">Secure Payments</h3>
              <p className="text-gray-600">Multiple payment options with full security</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-kanxa-green rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-kanxa-navy mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock customer assistance</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}