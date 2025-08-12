import { Link } from "react-router-dom";
import {
  Bus,
  Truck,
  MapPin,
  Calendar,
  Users,
  Wrench,
  Building,
  Settings,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  Shield,
  Clock,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/layout/Layout";

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-kanxa-navy via-kanxa-blue to-kanxa-navy text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container relative z-10 py-16 lg:py-32 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-kanxa-orange/20 text-kanxa-orange border-kanxa-orange/30">
              Premium Transportation & Construction Services
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Your Gateway to Reliable
              <span className="text-kanxa-orange"> Transportation</span> &
              <span className="text-kanxa-blue"> Construction</span>
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed">
              From Lamjung to Kathmandu and beyond - experience premium bus
              services, construction supplies, and professional garage solutions
              all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="bg-kanxa-orange hover:bg-kanxa-orange/90 text-white"
              >
                <Link to="/transportation">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Transportation
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-white text-white hover:bg-white hover:text-kanxa-navy"
              >
                <Link to="/construction">
                  <Building className="mr-2 h-5 w-5" />
                  Browse Materials
                </Link>
              </Button>
            </div>
          </div>
        </div>
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-kanxa-orange/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-kanxa-blue/20 rounded-full blur-xl"></div>
      </section>

      {/* Quick Action Cards */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-kanxa-light-blue to-white"></div>
              <CardHeader className="relative z-10">
                <div className="w-12 h-12 bg-kanxa-blue rounded-lg flex items-center justify-center mb-4">
                  <Bus className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-kanxa-navy">
                  Transportation Hub
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-kanxa-gray mb-4">
                  Book buses, trucks, and custom tours with real-time
                  availability
                </p>
                <Button
                  asChild
                  className="w-full bg-kanxa-blue hover:bg-kanxa-blue/90"
                >
                  <Link to="/transportation">
                    Explore Services <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-kanxa-light-orange to-white"></div>
              <CardHeader className="relative z-10">
                <div className="w-12 h-12 bg-kanxa-orange rounded-lg flex items-center justify-center mb-4">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-kanxa-navy">
                  Construction Supply
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-kanxa-gray mb-4">
                  Premium building materials and heavy machinery at competitive
                  prices
                </p>
                <Button
                  asChild
                  className="w-full bg-kanxa-orange hover:bg-kanxa-orange/90"
                >
                  <Link to="/construction">
                    Browse Catalog <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-kanxa-light-green to-white"></div>
              <CardHeader className="relative z-10">
                <div className="w-12 h-12 bg-kanxa-green rounded-lg flex items-center justify-center mb-4">
                  <Wrench className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-kanxa-navy">
                  Garage & Workshop
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-kanxa-gray mb-4">
                  Professional maintenance and repair services for heavy
                  machinery
                </p>
                <Button
                  asChild
                  className="w-full bg-kanxa-green hover:bg-kanxa-green/90"
                >
                  <Link to="/garage">
                    Schedule Service <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Live Transportation Board */}
      <section className="py-16">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-kanxa-navy mb-4">
              Live Transportation Board
            </h2>
            <p className="text-lg text-kanxa-gray max-w-2xl mx-auto">
              Real-time availability for today and the next two days
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <h3 className="font-semibold text-kanxa-navy mb-4">
                  Available Today
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      route: "Lamjung → Kathmandu",
                      time: "6:00 AM",
                      seats: "12 available",
                      type: "Bus",
                      price: "NPR 800",
                    },
                    {
                      route: "Lamjung → Pokhara",
                      time: "8:30 AM",
                      seats: "8 available",
                      type: "Bus",
                      price: "NPR 500",
                    },
                    {
                      route: "Kathmandu → Lamjung",
                      time: "2:00 PM",
                      seats: "15 available",
                      type: "Bus",
                      price: "NPR 800",
                    },
                  ].map((trip, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-kanxa-blue rounded-lg flex items-center justify-center">
                          <Bus className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-kanxa-navy">
                            {trip.route}
                          </p>
                          <p className="text-sm text-kanxa-gray">
                            {trip.time} • {trip.seats}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-kanxa-navy">
                          {trip.price}
                        </p>
                        <Button
                          size="sm"
                          asChild
                          className="mt-1 bg-kanxa-blue hover:bg-kanxa-blue/90"
                        >
                          <Link to="/buses">Book Now</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-kanxa-navy mb-4">
                  Cargo Services
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      route: "Lamjung → Kathmandu",
                      type: "Heavy Truck",
                      capacity: "10 tons",
                      price: "NPR 15,000",
                    },
                    {
                      route: "Pokhara → Lamjung",
                      type: "Medium Truck",
                      capacity: "5 tons",
                      price: "NPR 8,000",
                    },
                    {
                      route: "Custom Route",
                      type: "Available",
                      capacity: "Various",
                      price: "Quote on demand",
                    },
                  ].map((cargo, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-kanxa-orange rounded-lg flex items-center justify-center">
                          <Truck className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-kanxa-navy">
                            {cargo.route}
                          </p>
                          <p className="text-sm text-kanxa-gray">
                            {cargo.type} • {cargo.capacity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-kanxa-navy">
                          {cargo.price}
                        </p>
                        <Button size="sm" variant="outline" asChild className="mt-1">
                          <Link to="/cargo">Request Quote</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Construction Materials */}
      <section className="py-16 bg-gradient-to-br from-kanxa-light-orange to-white">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-kanxa-navy mb-4">
              Premium Construction Materials
            </h2>
            <p className="text-lg text-kanxa-gray max-w-2xl mx-auto">
              Quality materials and machinery for all your construction needs
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Cement",
                description: "High-grade Portland cement",
                price: "From NPR 850/bag",
                icon: "🏗️",
              },
              {
                name: "Steel Rebars",
                description: "Grade 60 reinforcement bars",
                price: "From NPR 85/kg",
                icon: "🔗",
              },
              {
                name: "Concrete Blocks",
                description: "Standard & custom sizes",
                price: "From NPR 45/piece",
                icon: "🧱",
              },
              {
                name: "JCB Excavator",
                description: "Daily rental available",
                price: "From NPR 8,000/day",
                icon: "🚜",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="text-4xl mb-2">{item.icon}</div>
                  <CardTitle className="text-kanxa-navy">{item.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-kanxa-gray mb-3">
                    {item.description}
                  </p>
                  <p className="font-semibold text-kanxa-orange mb-4">
                    {item.price}
                  </p>
                  <Button size="sm" variant="outline" asChild className="w-full">
                    <Link to="/materials">Get Quote</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose कान्छा सफारी */}
      <section className="py-16">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-kanxa-navy mb-4">
              Why Choose कान्छा सफारी?
            </h2>
            <p className="text-lg text-kanxa-gray max-w-2xl mx-auto">
              Experience the difference with our premium, technology-driven
              approach
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              {
                icon: <Shield className="h-8 w-8 text-kanxa-blue" />,
                title: "Secure Payments",
                description: "Khalti & eSewa integration for safe transactions",
              },
              {
                icon: <Clock className="h-8 w-8 text-kanxa-orange" />,
                title: "Real-time Updates",
                description: "Live notifications and booking confirmations",
              },
              {
                icon: <Award className="h-8 w-8 text-kanxa-green" />,
                title: "Premium Quality",
                description: "Top-grade materials and professional services",
              },
              {
                icon: <Settings className="h-8 w-8 text-kanxa-navy" />,
                title: "AI-Powered Support",
                description: "24/7 intelligent customer assistance",
              },
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-kanxa-navy mb-2">
                  {feature.title}
                </h3>
                <p className="text-kanxa-gray">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-kanxa-navy mb-4">
              What Our Customers Say
            </h2>
            <div className="flex items-center justify-center space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-6 w-6 fill-yellow-400 text-yellow-400"
                />
              ))}
              <span className="ml-2 text-lg font-medium text-kanxa-gray">
                4.9/5 from 2,500+ reviews
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Raj Kumar Sharma",
                role: "Construction Business Owner",
                content:
                  "कान्छा सफारी has been our go-to partner for construction materials. Their quality is unmatched and delivery is always on time.",
                rating: 5,
              },
              {
                name: "Sita Devi Thapa",
                role: "Daily Commuter",
                content:
                  "The bus booking system is so convenient! I can easily reserve my seat and the payment through Khalti is seamless.",
                rating: 5,
              },
              {
                name: "Bikram Ale",
                role: "Farm Equipment Owner",
                content:
                  "Their garage services saved my tractor during harvest season. Professional staff and genuine parts. Highly recommended!",
                rating: 5,
              },
            ].map((review, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-kanxa-gray mb-4 italic">
                    "{review.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-kanxa-navy">
                      {review.name}
                    </p>
                    <p className="text-sm text-kanxa-gray">{review.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-kanxa-navy to-kanxa-blue text-white">
        <div className="container text-center px-4">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Experience Premium Service?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust कान्छा सफारी for
            their transportation and construction needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              asChild
              className="bg-kanxa-orange hover:bg-kanxa-orange/90"
            >
              <Link to="/transportation">Start Booking Now</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white text-white hover:bg-white hover:text-kanxa-navy"
            >
              <Link to="/support">Contact Support</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
