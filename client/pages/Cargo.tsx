import { useState, useEffect } from "react";
import {
  Truck,
  Package,
  MapPin,
  Calendar,
  Clock,
  Weight,
  Calculator,
  Shield,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  Star,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Layout from "@/components/layout/Layout";
import { servicesAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast-simple";

interface CargoService {
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
    distance?: string;
    duration?: string;
    basePrice?: number;
  }>;
  truckTypes?: Array<{
    id: string;
    name: string;
    capacity: string;
    basePrice: number;
    features: string[];
  }>;
  cargoTypes?: string[];
  createdAt: string;
  updatedAt: string;
}

export default function Cargo() {
  const [quoteForm, setQuoteForm] = useState({
    from: "",
    to: "",
    weight: "",
    cargoType: "",
    pickupDate: "",
    description: "",
    urgency: "standard",
  });

  const [cargoServices, setCargoServices] = useState<CargoService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Default truck types with fallback data
  const defaultTruckTypes = [
    {
      id: "light",
      name: "Light Truck",
      capacity: "Up to 2 tons",
      description: "Perfect for small cargo and city deliveries",
      basePrice: 3000,
      image: "🚐",
      features: ["City delivery", "Quick loading", "Fuel efficient"],
    },
    {
      id: "medium",
      name: "Medium Truck",
      capacity: "2-5 tons",
      description: "Ideal for medium-sized cargo and intercity transport",
      basePrice: 6000,
      image: "🚚",
      features: ["Intercity transport", "Secure loading", "GPS tracking"],
    },
    {
      id: "heavy",
      name: "Heavy Truck",
      capacity: "5-15 tons",
      description: "For large cargo and construction materials",
      basePrice: 12000,
      image: "🚛",
      features: ["Heavy cargo", "Professional drivers", "Insurance covered"],
    },
    {
      id: "trailer",
      name: "Truck Trailer",
      capacity: "15+ tons",
      description: "Maximum capacity for industrial cargo",
      basePrice: 20000,
      image: "🚚",
      features: ["Industrial cargo", "Long distance", "Full security"],
    },
  ];

  // Default routes with fallback data
  const defaultRoutes = [
    {
      from: "Lamjung",
      to: "Kathmandu",
      distance: "200 km",
      duration: "6-8 hours",
      basePrice: 15000,
    },
    {
      from: "Lamjung",
      to: "Pokhara", 
      distance: "120 km",
      duration: "3-4 hours",
      basePrice: 8000,
    },
    {
      from: "Lamjung",
      to: "Chitwan",
      distance: "180 km",
      duration: "5-6 hours",
      basePrice: 12000,
    },
    {
      from: "Kathmandu",
      to: "Lamjung",
      distance: "200 km",
      duration: "6-8 hours",
      basePrice: 15000,
    },
    {
      from: "Pokhara",
      to: "Lamjung",
      distance: "120 km",
      duration: "3-4 hours",
      basePrice: 8000,
    },
  ];

  // Default cargo types
  const defaultCargoTypes = [
    "Construction Materials",
    "Household Items",
    "Electronics",
    "Furniture",
    "Food & Beverages",
    "Machinery",
    "Raw Materials",
    "Personal Belongings",
    "Other",
  ];

  // Load cargo services from API
  useEffect(() => {
    const loadCargoServices = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch cargo services from API
        const response = await servicesAPI.getCargo();
        const services = response.cargo || [];
        
        setCargoServices(services);
        console.log("Cargo services loaded successfully:", services.length);
      } catch (error: any) {
        console.error("Failed to load cargo services:", error);
        setError("Failed to load cargo services. Using default options.");
        toast({
          title: "Notice",
          description: "Loading cargo services from cache. Some features may be limited.",
          variant: "default",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCargoServices();
  }, [toast]);

  // Get available truck types (from API or defaults)
  const truckTypes = cargoServices.length > 0 && cargoServices[0].truckTypes 
    ? cargoServices[0].truckTypes.map(truck => ({
        ...truck,
        description: `Perfect for ${truck.capacity} cargo`,
        image: truck.id === 'light' ? '🚐' : truck.id === 'medium' ? '🚚' : truck.id === 'heavy' ? '🚛' : '🚚',
        features: truck.features || ["Professional service", "GPS tracking", "Insurance covered"]
      }))
    : defaultTruckTypes;

  // Get available routes (from API or defaults)
  const routes = cargoServices.length > 0 && cargoServices[0].routes 
    ? cargoServices[0].routes.map(route => ({
        from: route.from,
        to: route.to,
        distance: route.distance || "Distance varies",
        duration: route.duration || "Duration varies",
        price: route.basePrice || 10000
      }))
    : defaultRoutes;

  // Get available cargo types (from API or defaults)
  const cargoTypes = cargoServices.length > 0 && cargoServices[0].cargoTypes 
    ? cargoServices[0].cargoTypes 
    : defaultCargoTypes;

  const calculateQuote = () => {
    if (!quoteForm.from || !quoteForm.to || !quoteForm.weight) return 0;

    const route = routes.find(
      (r) =>
        r.from.toLowerCase() === quoteForm.from.toLowerCase() &&
        r.to.toLowerCase() === quoteForm.to.toLowerCase(),
    );

    const basePrice = route?.price || 10000;
    const weight = parseFloat(quoteForm.weight) || 1;
    const urgencyMultiplier = quoteForm.urgency === "urgent" ? 1.5 : 1;

    return Math.round(basePrice * weight * urgencyMultiplier);
  };

  const handleQuoteSubmit = () => {
    const quote = calculateQuote();
    if (quote > 0) {
      toast({
        title: "Quote Calculated",
        description: `Estimated cost: ₨ ${quote.toLocaleString()} for ${quoteForm.weight} tons from ${quoteForm.from} to ${quoteForm.to}`,
      });
    } else {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all required fields to calculate quote.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kanxa-orange mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cargo services...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-kanxa-orange to-kanxa-navy text-white py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Reliable Cargo Services
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Safe and efficient transportation for all your cargo needs across
              Nepal
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-kanxa-orange hover:bg-white/90"
                onClick={() => document.getElementById('quote-calculator')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Calculator className="mr-2 h-5 w-5" />
                Get Instant Quote
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-kanxa-orange"
              >
                <Phone className="mr-2 h-5 w-5" />
                Call for Booking
              </Button>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="container px-4 py-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error} You can still use the quote calculator with available routes.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Quick Quote Calculator */}
      <section id="quote-calculator" className="py-12 bg-gray-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-kanxa-navy flex items-center gap-2">
                  <Calculator className="h-6 w-6" />
                  Instant Quote Calculator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="from">From</Label>
                        <Select
                          value={quoteForm.from}
                          onValueChange={(value) =>
                            setQuoteForm({ ...quoteForm, from: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select pickup location" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from(new Set(routes.map(r => r.from))).map((location) => (
                              <SelectItem key={location} value={location}>
                                {location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="to">To</Label>
                        <Select
                          value={quoteForm.to}
                          onValueChange={(value) =>
                            setQuoteForm({ ...quoteForm, to: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select destination" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from(new Set(routes.map(r => r.to))).map((location) => (
                              <SelectItem key={location} value={location}>
                                {location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="weight">Weight (tons)</Label>
                        <Input
                          id="weight"
                          type="number"
                          placeholder="e.g. 2.5"
                          value={quoteForm.weight}
                          onChange={(e) =>
                            setQuoteForm({ ...quoteForm, weight: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="cargoType">Cargo Type</Label>
                        <Select
                          value={quoteForm.cargoType}
                          onValueChange={(value) =>
                            setQuoteForm({ ...quoteForm, cargoType: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select cargo type" />
                          </SelectTrigger>
                          <SelectContent>
                            {cargoTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="pickupDate">Pickup Date</Label>
                        <Input
                          id="pickupDate"
                          type="date"
                          value={quoteForm.pickupDate}
                          onChange={(e) =>
                            setQuoteForm({
                              ...quoteForm,
                              pickupDate: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="urgency">Urgency</Label>
                        <Select
                          value={quoteForm.urgency}
                          onValueChange={(value) =>
                            setQuoteForm({ ...quoteForm, urgency: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">
                              Standard (3-5 days)
                            </SelectItem>
                            <SelectItem value="urgent">
                              Urgent (+50% charge)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your cargo..."
                        value={quoteForm.description}
                        onChange={(e) =>
                          setQuoteForm({
                            ...quoteForm,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Quote Display */}
                  <div className="flex flex-col justify-center">
                    <Card className="border-kanxa-orange">
                      <CardHeader>
                        <CardTitle className="text-kanxa-orange text-center">
                          Estimated Quote
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-center">
                        <div className="text-4xl font-bold text-kanxa-navy mb-4">
                          ₨ {calculateQuote().toLocaleString()}
                        </div>
                        <p className="text-gray-600 mb-6">
                          Based on {quoteForm.weight || "1"} tons
                          {quoteForm.from && quoteForm.to
                            ? ` from ${quoteForm.from} to ${quoteForm.to}`
                            : ""}
                        </p>
                        <Button 
                          className="w-full bg-kanxa-orange hover:bg-kanxa-orange/90"
                          onClick={handleQuoteSubmit}
                        >
                          Get Detailed Quote
                        </Button>
                        <p className="text-xs text-gray-500 mt-2">
                          Final price may vary based on exact requirements
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Truck Types Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-kanxa-navy mb-4">
              Our Fleet
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from our wide range of trucks suitable for different cargo
              sizes and requirements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {truckTypes.map((truck) => (
              <Card key={truck.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{truck.image}</div>
                  <h3 className="text-xl font-bold text-kanxa-navy mb-2">
                    {truck.name}
                  </h3>
                  <p className="text-kanxa-orange font-semibold mb-2">
                    {truck.capacity}
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    {truck.description}
                  </p>
                  <div className="text-2xl font-bold text-kanxa-navy mb-4">
                    ₨ {truck.basePrice.toLocaleString()}
                  </div>
                  <div className="space-y-2">
                    {truck.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle className="h-4 w-4 text-kanxa-green" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4 bg-kanxa-orange hover:bg-kanxa-orange/90">
                    Select This Truck
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-kanxa-navy mb-4">
              Popular Routes
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Frequently traveled cargo routes with competitive pricing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routes.map((route, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-kanxa-navy">
                        {route.from} → {route.to}
                      </h3>
                      <p className="text-gray-600 text-sm">{route.distance}</p>
                    </div>
                    <Truck className="h-8 w-8 text-kanxa-orange" />
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{route.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{route.distance}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-kanxa-orange">
                        ₨ {route.price.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">starting from</p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-kanxa-orange hover:bg-kanxa-orange/90"
                    >
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features & Benefits */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-kanxa-navy mb-4">
              Why Choose Our Cargo Services?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Trusted by thousands of customers across Nepal for safe and
              reliable cargo transportation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Shield className="h-8 w-8 text-kanxa-blue" />,
                title: "Insured Cargo",
                description: "Full insurance coverage for your valuable cargo",
              },
              {
                icon: <CheckCircle className="h-8 w-8 text-kanxa-green" />,
                title: "On-Time Delivery",
                description: "98% on-time delivery rate with real-time tracking",
              },
              {
                icon: <Star className="h-8 w-8 text-kanxa-orange" />,
                title: "Professional Drivers",
                description: "Experienced and trained professional drivers",
              },
              {
                icon: <Phone className="h-8 w-8 text-kanxa-blue" />,
                title: "24/7 Support",
                description: "Round-the-clock customer support for assistance",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-xl shadow-sm flex items-center justify-center mx-auto mb-4">
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

      {/* CTA Section */}
      <section className="py-16 bg-kanxa-navy text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Ship Your Cargo?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Get started with our easy booking process or contact us for custom
            requirements
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-kanxa-orange hover:bg-kanxa-orange/90"
            >
              <Calculator className="mr-2 h-5 w-5" />
              Calculate Quote
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-kanxa-navy"
            >
              <Phone className="mr-2 h-5 w-5" />
              Call: +977-980-123456
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
