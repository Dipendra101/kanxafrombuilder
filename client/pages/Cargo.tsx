import { useState } from "react";
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

  const truckTypes = [
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
      image: "���",
      features: ["Industrial cargo", "Long distance", "Full security"],
    },
  ];

  const routes = [
    {
      from: "Lamjung",
      to: "Kathmandu",
      distance: "200 km",
      duration: "6-8 hours",
      price: 15000,
    },
    {
      from: "Lamjung",
      to: "Pokhara",
      distance: "120 km",
      duration: "3-4 hours",
      price: 8000,
    },
    {
      from: "Lamjung",
      to: "Chitwan",
      distance: "180 km",
      duration: "5-6 hours",
      price: 12000,
    },
    {
      from: "Kathmandu",
      to: "Lamjung",
      distance: "200 km",
      duration: "6-8 hours",
      price: 15000,
    },
    {
      from: "Pokhara",
      to: "Lamjung",
      distance: "120 km",
      duration: "3-4 hours",
      price: 8000,
    },
  ];

  const cargoTypes = [
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

      {/* Quick Quote Calculator */}
      <section className="py-12 bg-gray-50">
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
                            <SelectValue placeholder="Select origin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Lamjung">Lamjung</SelectItem>
                            <SelectItem value="Kathmandu">Kathmandu</SelectItem>
                            <SelectItem value="Pokhara">Pokhara</SelectItem>
                            <SelectItem value="Chitwan">Chitwan</SelectItem>
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
                            <SelectItem value="Lamjung">Lamjung</SelectItem>
                            <SelectItem value="Kathmandu">Kathmandu</SelectItem>
                            <SelectItem value="Pokhara">Pokhara</SelectItem>
                            <SelectItem value="Chitwan">Chitwan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="weight">Weight (tons)</Label>
                        <Input
                          type="number"
                          placeholder="e.g., 2.5"
                          value={quoteForm.weight}
                          onChange={(e) =>
                            setQuoteForm({
                              ...quoteForm,
                              weight: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="urgency">Service Type</Label>
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
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="urgent">
                              Urgent (+50%)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
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

                    <div>
                      <Label htmlFor="description">Cargo Description</Label>
                      <Textarea
                        placeholder="Describe your cargo, dimensions, special requirements..."
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

                  <div className="space-y-4">
                    <Card className="bg-kanxa-light-blue">
                      <CardHeader>
                        <CardTitle className="text-kanxa-blue">
                          Estimated Quote
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-kanxa-blue mb-2">
                            NPR {calculateQuote().toLocaleString()}
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                            Estimated total cost
                          </p>

                          {quoteForm.from && quoteForm.to && (
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Route:</span>
                                <span>
                                  {quoteForm.from} → {quoteForm.to}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Weight:</span>
                                <span>{quoteForm.weight || 0} tons</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Service:</span>
                                <span className="capitalize">
                                  {quoteForm.urgency}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        This is an estimated quote. Final pricing may vary based
                        on actual cargo inspection and route conditions.
                      </AlertDescription>
                    </Alert>

                    <Button
                      className="w-full bg-kanxa-orange hover:bg-kanxa-orange/90"
                      size="lg"
                    >
                      Request Detailed Quote
                    </Button>

                    <div className="text-center text-sm text-gray-600">
                      Or call us directly: <strong>+977-XXX-XXXXXX</strong>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Truck Types */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-kanxa-navy mb-4">
              Our Fleet
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from our diverse fleet of trucks to match your cargo
              requirements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {truckTypes.map((truck) => (
              <Card
                key={truck.id}
                className="hover:shadow-lg transition-all duration-300 border-2 hover:border-kanxa-orange"
              >
                <CardHeader className="text-center">
                  <div className="text-6xl mb-4">{truck.image}</div>
                  <CardTitle className="text-kanxa-navy">
                    {truck.name}
                  </CardTitle>
                  <Badge variant="secondary" className="mx-auto">
                    {truck.capacity}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 text-center">
                    {truck.description}
                  </p>

                  <div className="space-y-2">
                    {truck.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-kanxa-green" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="text-center">
                    <p className="text-sm text-gray-600">Starting from</p>
                    <p className="text-2xl font-bold text-kanxa-orange">
                      NPR {truck.basePrice.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">per trip</p>
                  </div>

                  <Button className="w-full" variant="outline">
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
            <p className="text-lg text-gray-600">
              Our most requested cargo routes with competitive pricing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routes.map((route, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-kanxa-orange" />
                      <span className="font-semibold text-kanxa-navy">
                        {route.from} → {route.to}
                      </span>
                    </div>
                    <Badge variant="outline">{route.distance}</Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Duration: {route.duration}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Starting from:
                      </span>
                      <span className="text-lg font-bold text-kanxa-orange">
                        NPR {route.price.toLocaleString()}
                      </span>
                    </div>

                    <Button className="w-full bg-kanxa-orange hover:bg-kanxa-orange/90">
                      Book This Route
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services & Features */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-kanxa-navy mb-4">
              Why Choose Our Cargo Services?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Shield className="h-8 w-8 text-kanxa-blue" />,
                title: "Insured Cargo",
                description: "Full insurance coverage for your valuable cargo",
              },
              {
                icon: <MapPin className="h-8 w-8 text-kanxa-orange" />,
                title: "Real-time Tracking",
                description:
                  "GPS tracking for complete visibility of your shipment",
              },
              {
                icon: <Clock className="h-8 w-8 text-kanxa-green" />,
                title: "On-time Delivery",
                description: "Reliable delivery schedules you can count on",
              },
              {
                icon: <CheckCircle className="h-8 w-8 text-kanxa-blue" />,
                title: "Professional Handling",
                description: "Experienced drivers and careful cargo handling",
              },
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-kanxa-navy mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-kanxa-navy text-white">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Need Custom Cargo Solutions?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Contact our cargo specialists for personalized quotes and
              specialized transport solutions
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 bg-kanxa-orange rounded-lg flex items-center justify-center">
                  <Phone className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Call Us</p>
                  <p className="text-white/90">+977-XXX-XXXXXX</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 bg-kanxa-orange rounded-lg flex items-center justify-center">
                  <Mail className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Email Us</p>
                  <p className="text-white/90">cargo@kanxasafari.com</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-kanxa-orange hover:bg-kanxa-orange/90"
              >
                Request Custom Quote
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-kanxa-navy"
              >
                Download Rate Card
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
