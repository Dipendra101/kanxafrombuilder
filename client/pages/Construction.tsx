import { Link } from "react-router-dom";
import {
  Building,
  Settings,
  ShoppingCart,
  Calculator,
  Truck,
  Shield,
  CheckCircle,
  Star,
  ArrowRight,
  Package,
  Wrench,
  Users,
  Clock,
  Award,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Layout from "@/components/layout/Layout";

export default function Construction() {
  const featuredMaterials = [
    {
      id: "cement-opc-53",
      name: "OPC 53 Grade Cement",
      price: 850,
      unit: "50kg bag",
      image: "🧱",
      inStock: true,
      rating: 4.8,
      category: "cement",
    },
    {
      id: "rebar-12mm",
      name: "TMT Steel Rebar 12mm",
      price: 85,
      unit: "per kg",
      image: "🔗",
      inStock: true,
      rating: 4.9,
      category: "steel",
    },
    {
      id: "concrete-blocks",
      name: "Concrete Hollow Blocks",
      price: 45,
      unit: "per piece",
      image: "🟤",
      inStock: true,
      rating: 4.5,
      category: "blocks",
    },
    {
      id: "pvc-pipe-4inch",
      name: "PVC Pipe 4 inch",
      price: 450,
      unit: "per meter",
      image: "🚰",
      inStock: true,
      rating: 4.7,
      category: "pipes",
    },
  ];

  const featuredMachinery = [
    {
      id: "jcb-3dx",
      name: "JCB 3DX Eco Excavator",
      dailyRate: 8000,
      image: "🚜",
      availability: "Available",
      location: "Lamjung Depot",
      rating: 4.8,
    },
    {
      id: "concrete-mixer-500l",
      name: "Concrete Mixer 500L",
      dailyRate: 2500,
      image: "🥽",
      availability: "Available",
      location: "Pokhara Branch",
      rating: 4.6,
    },
    {
      id: "tractor-mt-285",
      name: "Mahindra Tractor 285 DI",
      dailyRate: 4500,
      image: "🚛",
      availability: "Available",
      location: "Chitwan Branch",
      rating: 4.5,
    },
    {
      id: "generator-125kva",
      name: "Diesel Generator 125 KVA",
      dailyRate: 3000,
      image: "🔌",
      availability: "Available",
      location: "Lamjung Depot",
      rating: 4.7,
    },
  ];

  const projectTypes = [
    {
      name: "Residential Construction",
      description: "Complete materials and equipment for home building",
      icon: "🏠",
      materials: ["Cement", "Blocks", "Steel", "Pipes"],
      machinery: ["Mixers", "Tractors", "Generators"],
    },
    {
      name: "Commercial Buildings",
      description: "Heavy-duty materials and machinery for large projects",
      icon: "🏢",
      materials: ["High-grade Cement", "Steel Beams", "Glass", "Hardware"],
      machinery: ["JCBs", "Cranes", "Concrete Pumps"],
    },
    {
      name: "Road Construction",
      description: "Specialized equipment and materials for road work",
      icon: "🛣️",
      materials: ["Asphalt", "Aggregates", "Cement", "Road Markers"],
      machinery: ["Road Rollers", "Pavers", "Excavators"],
    },
    {
      name: "Infrastructure Projects",
      description: "Large-scale construction materials and heavy machinery",
      icon: "🌉",
      materials: ["Concrete", "Steel", "Cables", "Reinforcement"],
      machinery: ["Heavy Cranes", "Pile Drivers", "Concrete Mixers"],
    },
  ];

  const statistics = [
    { number: "10,000+", label: "Projects Completed", icon: "🏗️" },
    { number: "500+", label: "Active Clients", icon: "👥" },
    { number: "50+", label: "Equipment Fleet", icon: "🚜" },
    { number: "24/7", label: "Support Available", icon: "🕒" },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-kanxa-orange to-kanxa-navy text-white py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Construction Solutions Hub
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Everything you need for your construction projects - premium
              materials and professional-grade machinery
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-kanxa-orange hover:bg-white/90"
              >
                <Link to="/materials">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Browse Materials
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-kanxa-orange"
              >
                <Link to="/machinery">
                  <Settings className="mr-2 h-5 w-5" />
                  Rent Equipment
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-kanxa-light-orange rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Building className="h-8 w-8 text-kanxa-orange" />
                </div>
                <h3 className="font-semibold text-kanxa-navy mb-2">
                  Building Materials
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Cement, blocks, steel, pipes, and more
                </p>
                <Button
                  asChild
                  size="sm"
                  className="bg-kanxa-orange hover:bg-kanxa-orange/90"
                >
                  <Link to="/materials">Shop Now</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-kanxa-light-blue rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Settings className="h-8 w-8 text-kanxa-blue" />
                </div>
                <h3 className="font-semibold text-kanxa-navy mb-2">
                  Machinery Rental
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  JCBs, mixers, tractors, and generators
                </p>
                <Button asChild size="sm" variant="outline">
                  <Link to="/machinery">Rent Equipment</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-kanxa-light-green rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Calculator className="h-8 w-8 text-kanxa-green" />
                </div>
                <h3 className="font-semibold text-kanxa-navy mb-2">
                  Project Calculator
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Estimate costs for your project
                </p>
                <Button size="sm" variant="outline">
                  Calculate Now
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-kanxa-light-blue rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-kanxa-blue" />
                </div>
                <h3 className="font-semibold text-kanxa-navy mb-2">
                  Expert Consultation
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Free technical advice and planning
                </p>
                <Button size="sm" variant="outline">
                  Get Advice
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container">
          <Tabs defaultValue="materials" className="w-full">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-kanxa-navy mb-4">
                Featured Products
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Popular items from our inventory
              </p>
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                <TabsTrigger value="materials">Materials</TabsTrigger>
                <TabsTrigger value="machinery">Machinery</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="materials">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredMaterials.map((material) => (
                  <Card
                    key={material.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="text-4xl mb-2">{material.image}</div>
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800"
                        >
                          In Stock
                        </Badge>
                      </div>
                      <CardTitle className="text-lg text-kanxa-navy leading-tight">
                        {material.name}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {material.rating}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-2xl font-bold text-kanxa-orange">
                              NPR {material.price.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {material.unit}
                            </p>
                          </div>
                        </div>

                        <Button
                          asChild
                          className="w-full bg-kanxa-orange hover:bg-kanxa-orange/90"
                        >
                          <Link to="/materials">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-8">
                <Button asChild size="lg" variant="outline">
                  <Link to="/materials">
                    View All Materials <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="machinery">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredMachinery.map((machine) => (
                  <Card
                    key={machine.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="text-4xl mb-2">{machine.image}</div>
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800"
                        >
                          Available
                        </Badge>
                      </div>
                      <CardTitle className="text-lg text-kanxa-navy leading-tight">
                        {machine.name}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {machine.rating}
                        </span>
                        <span className="text-xs text-gray-500 ml-auto">
                          {machine.location}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-2xl font-bold text-kanxa-blue">
                              NPR {machine.dailyRate.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">per day</p>
                          </div>
                        </div>

                        <Button
                          asChild
                          className="w-full bg-kanxa-blue hover:bg-kanxa-blue/90"
                        >
                          <Link to="/machinery">
                            <Settings className="mr-2 h-4 w-4" />
                            Rent Now
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-8">
                <Button asChild size="lg" variant="outline">
                  <Link to="/machinery">
                    View All Equipment <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Project Types */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-kanxa-navy mb-4">
              Project-Based Solutions
            </h2>
            <p className="text-lg text-gray-600">
              Tailored packages for different construction projects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projectTypes.map((project, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{project.icon}</div>
                    <div>
                      <CardTitle className="text-kanxa-navy">
                        {project.name}
                      </CardTitle>
                      <p className="text-gray-600">{project.description}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-sm text-kanxa-orange mb-2">
                        Materials Needed:
                      </h4>
                      <ul className="space-y-1">
                        {project.materials.map((material) => (
                          <li
                            key={material}
                            className="text-sm text-gray-600 flex items-center gap-2"
                          >
                            <CheckCircle className="h-3 w-3 text-kanxa-green" />
                            {material}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-kanxa-blue mb-2">
                        Equipment Needed:
                      </h4>
                      <ul className="space-y-1">
                        {project.machinery.map((machine) => (
                          <li
                            key={machine}
                            className="text-sm text-gray-600 flex items-center gap-2"
                          >
                            <CheckCircle className="h-3 w-3 text-kanxa-green" />
                            {machine}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Button className="w-full bg-kanxa-orange hover:bg-kanxa-orange/90">
                    Get Project Quote
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-kanxa-navy mb-4">
              Our Track Record
            </h2>
            <p className="text-lg text-gray-600">
              Trusted by construction professionals across Nepal
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statistics.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-kanxa-blue mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-kanxa-navy mb-4">
              Why Choose Kanxa Safari Construction?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Shield className="h-8 w-8 text-kanxa-blue" />,
                title: "Quality Guarantee",
                description:
                  "All materials certified and equipment fully insured",
              },
              {
                icon: <Truck className="h-8 w-8 text-kanxa-orange" />,
                title: "Reliable Delivery",
                description:
                  "On-time delivery and pickup with professional service",
              },
              {
                icon: <Clock className="h-8 w-8 text-kanxa-green" />,
                title: "Flexible Scheduling",
                description:
                  "Equipment rental and delivery as per your timeline",
              },
              {
                icon: <Award className="h-8 w-8 text-kanxa-blue" />,
                title: "Expert Support",
                description:
                  "Technical consultation and project planning assistance",
              },
            ].map((service, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-4">
                  {service.icon}
                </div>
                <h3 className="font-semibold text-kanxa-navy mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-kanxa-navy text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Get everything you need for your construction project in one place
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-kanxa-orange rounded-lg flex items-center justify-center">
                <Phone className="h-6 w-6" />
              </div>
              <div className="text-left">
                <p className="font-semibold">Construction Hotline</p>
                <p className="text-white/90">+977-XXX-XXXXXX</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-kanxa-orange rounded-lg flex items-center justify-center">
                <Mail className="h-6 w-6" />
              </div>
              <div className="text-left">
                <p className="font-semibold">Project Email</p>
                <p className="text-white/90">construction@kanxasafari.com</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-kanxa-orange hover:bg-kanxa-orange/90"
            >
              <Link to="/materials">
                <Package className="mr-2 h-5 w-5" />
                Browse Materials
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-kanxa-navy"
            >
              <Link to="/machinery">
                <Wrench className="mr-2 h-5 w-5" />
                Rent Equipment
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
