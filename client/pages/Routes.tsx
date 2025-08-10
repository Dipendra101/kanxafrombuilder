import { useState } from "react";
import { 
  MapPin, 
  Clock, 
  Bus, 
  Truck,
  Star,
  Navigation,
  AlertCircle,
  Info,
  Calendar,
  Users,
  Shield,
  Coffee,
  Wifi,
  Snowflake
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Layout from "@/components/layout/Layout";

export default function Routes() {
  const [selectedRoute, setSelectedRoute] = useState("all");
  
  const routes = [
    {
      id: "lamjung-kathmandu",
      name: "Lamjung ↔ Kathmandu",
      distance: "200 km",
      duration: "6-8 hours",
      type: "Major Route",
      description: "Our most popular route connecting Lamjung with the capital city",
      highlights: ["Scenic mountain views", "Modern highway", "Regular stops"],
      services: {
        bus: {
          available: true,
          frequency: "6 daily services",
          firstBus: "5:30 AM",
          lastBus: "10:00 PM",
          fare: "NPR 800-950",
          amenities: ["AC", "WiFi", "Snacks", "Entertainment"]
        },
        cargo: {
          available: true,
          capacity: "Up to 15 tons",
          rate: "NPR 15,000",
          deliveryTime: "Same day"
        }
      },
      stops: [
        { name: "Lamjung Bus Park", time: "Departure", facilities: ["Parking", "Restaurant", "Toilet"] },
        { name: "Besisahar", time: "+45 min", facilities: ["Tea stall", "Toilet"] },
        { name: "Dumre", time: "+1.5 hrs", facilities: ["Restaurant", "Fuel", "Toilet"] },
        { name: "Mugling", time: "+3 hrs", facilities: ["Restaurant", "Shopping", "Toilet"] },
        { name: "Bharatpur", time: "+4 hrs", facilities: ["Restaurant", "Hospital", "ATM"] },
        { name: "Hetauda", time: "+5 hrs", facilities: ["Restaurant", "Fuel", "Toilet"] },
        { name: "Kathmandu", time: "+6-8 hrs", facilities: ["All amenities"] }
      ],
      conditions: "Good road condition, occasional traffic in Kathmandu",
      weather: "Clear year-round, monsoon delays possible",
      safety: "Well-maintained route with regular patrol"
    },
    {
      id: "lamjung-pokhara",
      name: "Lamjung ↔ Pokhara",
      distance: "120 km", 
      duration: "3-4 hours",
      type: "Tourist Route",
      description: "Scenic route to the beautiful lake city of Pokhara",
      highlights: ["Lake views", "Mountain scenery", "Tourist attractions"],
      services: {
        bus: {
          available: true,
          frequency: "8 daily services",
          firstBus: "6:00 AM",
          lastBus: "9:00 PM",
          fare: "NPR 500-650",
          amenities: ["AC", "WiFi", "Scenic views"]
        },
        cargo: {
          available: true,
          capacity: "Up to 10 tons",
          rate: "NPR 8,000",
          deliveryTime: "Same day"
        }
      },
      stops: [
        { name: "Lamjung Bus Park", time: "Departure", facilities: ["Parking", "Restaurant"] },
        { name: "Besisahar", time: "+30 min", facilities: ["Tea stall"] },
        { name: "Khudi", time: "+1 hr", facilities: ["Restaurant", "Toilet"] },
        { name: "Bhulbhule", time: "+1.5 hrs", facilities: ["Tea stall"] },
        { name: "Sundarbazar", time: "+2.5 hrs", facilities: ["Market", "Restaurant"] },
        { name: "Pokhara", time: "+3-4 hrs", facilities: ["All amenities"] }
      ],
      conditions: "Excellent road condition",
      weather: "Pleasant climate, clear mountain views",
      safety: "Very safe route with regular maintenance"
    },
    {
      id: "lamjung-chitwan",
      name: "Lamjung ↔ Chitwan", 
      distance: "180 km",
      duration: "5-6 hours",
      type: "Wildlife Route",
      description: "Route to famous Chitwan National Park",
      highlights: ["National park access", "Wildlife viewing", "River crossings"],
      services: {
        bus: {
          available: true,
          frequency: "4 daily services",
          firstBus: "6:30 AM",
          lastBus: "6:00 PM",
          fare: "NPR 700-850",
          amenities: ["AC", "WiFi"]
        },
        cargo: {
          available: true,
          capacity: "Up to 12 tons",
          rate: "NPR 12,000",
          deliveryTime: "Same day"
        }
      },
      stops: [
        { name: "Lamjung Bus Park", time: "Departure", facilities: ["Parking", "Restaurant"] },
        { name: "Besisahar", time: "+45 min", facilities: ["Tea stall"] },
        { name: "Dumre", time: "+1.5 hrs", facilities: ["Restaurant", "Fuel"] },
        { name: "Mugling", time: "+3 hrs", facilities: ["Restaurant", "Shopping"] },
        { name: "Bharatpur", time: "+4 hrs", facilities: ["Restaurant", "Hospital"] },
        { name: "Sauraha", time: "+5-6 hrs", facilities: ["Hotels", "Park entry"] }
      ],
      conditions: "Good condition, some rough patches near park",
      weather: "Hot in summer, pleasant in winter",
      safety: "Safe route with wildlife crossing areas"
    },
    {
      id: "kathmandu-lamjung",
      name: "Kathmandu → Lamjung",
      distance: "200 km",
      duration: "6-8 hours", 
      type: "Return Route",
      description: "Return journey from capital to Lamjung",
      highlights: ["City exit", "Mountain approach", "Rural landscapes"],
      services: {
        bus: {
          available: true,
          frequency: "6 daily services",
          firstBus: "6:00 AM",
          lastBus: "8:00 PM",
          fare: "NPR 800-950",
          amenities: ["AC", "WiFi", "Snacks"]
        },
        cargo: {
          available: true,
          capacity: "Up to 15 tons", 
          rate: "NPR 15,000",
          deliveryTime: "Same day"
        }
      },
      stops: [
        { name: "Kathmandu Bus Park", time: "Departure", facilities: ["All amenities"] },
        { name: "Thankot", time: "+1 hr", facilities: ["Restaurant", "Toll"] },
        { name: "Naubise", time: "+1.5 hrs", facilities: ["Tea stall"] },
        { name: "Hetauda", time: "+3 hrs", facilities: ["Restaurant", "Fuel"] },
        { name: "Bharatpur", time: "+4 hrs", facilities: ["Restaurant", "Hospital"] },
        { name: "Mugling", time: "+5 hrs", facilities: ["Restaurant", "Shopping"] },
        { name: "Dumre", time: "+6 hrs", facilities: ["Restaurant", "Fuel"] },
        { name: "Lamjung", time: "+6-8 hrs", facilities: ["Parking", "Restaurant"] }
      ],
      conditions: "Good condition, traffic delays possible in Kathmandu",
      weather: "Variable based on season",
      safety: "Well-patrolled route with security checkpoints"
    }
  ];

  const filteredRoutes = routes.filter(route => {
    if (selectedRoute === "all") return true;
    return route.id === selectedRoute;
  });

  const travelTips = [
    {
      icon: <Clock className="h-6 w-6 text-kanxa-blue" />,
      title: "Best Travel Times",
      content: "Early morning (6-8 AM) for avoiding traffic and enjoying scenic views. Evening departures (6-8 PM) for overnight journeys."
    },
    {
      icon: <Shield className="h-6 w-6 text-kanxa-green" />,
      title: "Safety Guidelines", 
      content: "Keep valuables secure, wear seatbelts, carry ID documents, and inform family about travel plans."
    },
    {
      icon: <AlertCircle className="h-6 w-6 text-kanxa-orange" />,
      title: "Weather Considerations",
      content: "Monsoon season (June-August) may cause delays. Winter fog (December-January) can affect visibility."
    },
    {
      icon: <Users className="h-6 w-6 text-kanxa-blue" />,
      title: "Booking Advice",
      content: "Book in advance during festivals and peak seasons. Group bookings get special rates and priority seating."
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-kanxa-blue to-kanxa-navy text-white py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Route Information
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Comprehensive information about all our transportation routes across Nepal
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-kanxa-blue hover:bg-white/90">
                <Bus className="mr-2 h-5 w-5" />
                View Bus Routes
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-kanxa-blue">
                <Truck className="mr-2 h-5 w-5" />
                Cargo Routes
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Route Filter */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <h2 className="text-2xl font-bold text-kanxa-navy">Our Routes</h2>
            
            <div className="flex gap-4">
              <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select a route" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Routes</SelectItem>
                  {routes.map(route => (
                    <SelectItem key={route.id} value={route.id}>{route.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Routes List */}
      <section className="py-12">
        <div className="container">
          <div className="space-y-8">
            {filteredRoutes.map(route => (
              <Card key={route.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-kanxa-light-blue to-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-kanxa-navy flex items-center gap-2">
                        <Navigation className="h-6 w-6" />
                        {route.name}
                      </CardTitle>
                      <p className="text-kanxa-gray mt-2">{route.description}</p>
                    </div>
                    <Badge variant="secondary" className="bg-kanxa-blue text-white">
                      {route.type}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-kanxa-blue" />
                      <span className="font-medium">{route.distance}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-kanxa-orange" />
                      <span className="font-medium">{route.duration}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {route.highlights.map(highlight => (
                        <Badge key={highlight} variant="outline" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <Tabs defaultValue="services" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="services">Services</TabsTrigger>
                      <TabsTrigger value="stops">Stops</TabsTrigger>
                      <TabsTrigger value="conditions">Conditions</TabsTrigger>
                      <TabsTrigger value="booking">Booking</TabsTrigger>
                    </TabsList>

                    <TabsContent value="services" className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Bus Services */}
                        {route.services.bus.available && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Bus className="h-5 w-5 text-kanxa-blue" />
                                Bus Services
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-600">Frequency:</span>
                                  <p className="font-medium">{route.services.bus.frequency}</p>
                                </div>
                                <div>
                                  <span className="text-gray-600">Fare Range:</span>
                                  <p className="font-medium text-kanxa-blue">{route.services.bus.fare}</p>
                                </div>
                                <div>
                                  <span className="text-gray-600">First Bus:</span>
                                  <p className="font-medium">{route.services.bus.firstBus}</p>
                                </div>
                                <div>
                                  <span className="text-gray-600">Last Bus:</span>
                                  <p className="font-medium">{route.services.bus.lastBus}</p>
                                </div>
                              </div>
                              
                              <Separator />
                              
                              <div>
                                <p className="text-sm font-medium text-gray-700 mb-2">Amenities:</p>
                                <div className="flex flex-wrap gap-2">
                                  {route.services.bus.amenities.map(amenity => (
                                    <Badge key={amenity} variant="outline" className="text-xs">
                                      {amenity === "AC" && <Snowflake className="mr-1 h-3 w-3" />}
                                      {amenity === "WiFi" && <Wifi className="mr-1 h-3 w-3" />}
                                      {amenity === "Snacks" && <Coffee className="mr-1 h-3 w-3" />}
                                      {amenity}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {/* Cargo Services */}
                        {route.services.cargo.available && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Truck className="h-5 w-5 text-kanxa-orange" />
                                Cargo Services
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="grid grid-cols-1 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-600">Capacity:</span>
                                  <p className="font-medium">{route.services.cargo.capacity}</p>
                                </div>
                                <div>
                                  <span className="text-gray-600">Standard Rate:</span>
                                  <p className="font-medium text-kanxa-orange">{route.services.cargo.rate}</p>
                                </div>
                                <div>
                                  <span className="text-gray-600">Delivery Time:</span>
                                  <p className="font-medium">{route.services.cargo.deliveryTime}</p>
                                </div>
                              </div>
                              
                              <Alert>
                                <Info className="h-4 w-4" />
                                <AlertDescription className="text-xs">
                                  Cargo rates vary by weight and volume. Contact for custom quotes.
                                </AlertDescription>
                              </Alert>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="stops" className="space-y-4">
                      <div className="space-y-4">
                        {route.stops.map((stop, index) => (
                          <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-kanxa-blue rounded-full flex items-center justify-center text-white text-sm font-bold">
                                {index + 1}
                              </div>
                            </div>
                            
                            <div className="flex-1">
                              <h4 className="font-semibold text-kanxa-navy">{stop.name}</h4>
                              <p className="text-sm text-kanxa-orange font-medium">{stop.time}</p>
                            </div>
                            
                            <div className="flex flex-wrap gap-1">
                              {stop.facilities.map(facility => (
                                <Badge key={facility} variant="outline" className="text-xs">
                                  {facility}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="conditions" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Road Conditions</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-600">{route.conditions}</p>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Weather Info</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-600">{route.weather}</p>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Safety Status</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-600">{route.safety}</p>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="booking" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle>Book Bus Ticket</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <p className="text-sm text-gray-600">Reserve your seat on this route</p>
                            <Button className="w-full bg-kanxa-blue hover:bg-kanxa-blue/90">
                              <Bus className="mr-2 h-4 w-4" />
                              Book Bus Ticket
                            </Button>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle>Request Cargo Service</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <p className="text-sm text-gray-600">Get a quote for cargo transport</p>
                            <Button className="w-full bg-kanxa-orange hover:bg-kanxa-orange/90">
                              <Truck className="mr-2 h-4 w-4" />
                              Request Quote
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Travel Tips */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-kanxa-navy mb-4">Travel Tips & Guidelines</h2>
            <p className="text-lg text-gray-600">Important information for a safe and comfortable journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {travelTips.map((tip, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      {tip.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-kanxa-navy mb-2">{tip.title}</h3>
                      <p className="text-sm text-gray-600">{tip.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="py-16 bg-kanxa-navy text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Emergency & Support Contacts</h2>
          <p className="text-xl text-white/90 mb-8">
            24/7 assistance for all your travel needs
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Emergency Helpline</h3>
              <p className="text-2xl font-bold text-kanxa-orange">+977-XXX-XXXXXX</p>
              <p className="text-white/80 text-sm">24/7 Emergency Support</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Booking Support</h3>
              <p className="text-2xl font-bold text-kanxa-blue">+977-XXX-XXXXXX</p>
              <p className="text-white/80 text-sm">6 AM - 10 PM Daily</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Customer Service</h3>
              <p className="text-2xl font-bold text-kanxa-green">+977-XXX-XXXXXX</p>
              <p className="text-white/80 text-sm">General Inquiries</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
