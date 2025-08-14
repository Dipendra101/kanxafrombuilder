import { useState } from "react";
import {
  Settings,
  Calendar,
  Clock,
  MapPin,
  Users,
  Fuel,
  Shield,
  CheckCircle,
  Star,
  Calculator,
  Phone,
  Mail,
  Truck,
  AlertCircle,
  Filter,
  Search,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import Layout from "@/components/layout/Layout";

export default function Machinery() {
  const [selectedMachinery, setSelectedMachinery] = useState<any>(null);
  const [rentalForm, setRentalForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    startDate: "",
    endDate: "",
    location: "",
    projectType: "",
    requirements: "",
    operatorNeeded: false,
  });

  const machineryCategories = [
    { id: "excavators", name: "Excavators & JCBs", icon: "🚜" },
    { id: "mixers", name: "Concrete Mixers", icon: "🥽" },
    { id: "tractors", name: "Tractors", icon: "��" },
    { id: "loaders", name: "Loaders", icon: "🏗️" },
    { id: "compactors", name: "Compactors", icon: "⚡" },
    { id: "generators", name: "Generators", icon: "🔌" },
  ];

  const machinery = [
    {
      id: "jcb-3dx",
      name: "JCB 3DX Eco Excavator",
      category: "excavators",
      type: "Backhoe Loader",
      image: "🚜",
      dailyRate: 8000,
      weeklyRate: 50000,
      monthlyRate: 180000,
      features: ["4WD", "AC Cabin", "Quick Hitch", "Extendable Dipper"],
      specifications: {
        engine: "74.5 HP",
        bucketCapacity: "1.0 m³",
        digDepth: "5.7 m",
        weight: "8.2 tons",
      },
      availability: "Available",
      location: "Lamjung Depot",
      rating: 4.8,
      reviews: 156,
      operatorIncluded: true,
      fuelIncluded: false,
    },
    {
      id: "jcb-4dx",
      name: "JCB 4DX Heavy Duty",
      category: "excavators",
      type: "Backhoe Loader",
      image: "🚜",
      dailyRate: 12000,
      weeklyRate: 75000,
      monthlyRate: 280000,
      features: ["4WD", "Heavy Duty", "Extended Reach", "Side Shift"],
      specifications: {
        engine: "109 HP",
        bucketCapacity: "1.2 m³",
        digDepth: "6.1 m",
        weight: "9.8 tons",
      },
      availability: "Available",
      location: "Kathmandu Branch",
      rating: 4.9,
      reviews: 203,
      operatorIncluded: true,
      fuelIncluded: false,
    },
    {
      id: "concrete-mixer-500l",
      name: "Concrete Mixer 500L",
      category: "mixers",
      type: "Drum Mixer",
      image: "🥽",
      dailyRate: 2500,
      weeklyRate: 15000,
      monthlyRate: 55000,
      features: ["Electric Motor", "Easy Pour", "Heavy Duty", "Mobile"],
      specifications: {
        capacity: "500 Liters",
        power: "3 HP Motor",
        mixingTime: "3-5 minutes",
        weight: "350 kg",
      },
      availability: "Available",
      location: "Pokhara Branch",
      rating: 4.6,
      reviews: 89,
      operatorIncluded: false,
      fuelIncluded: false,
    },
    {
      id: "concrete-mixer-750l",
      name: "Concrete Mixer 750L",
      category: "mixers",
      type: "Drum Mixer",
      image: "🥽",
      dailyRate: 3500,
      weeklyRate: 22000,
      monthlyRate: 80000,
      features: [
        "Diesel Engine",
        "High Output",
        "Self-Loading",
        "Hydraulic Tipping",
      ],
      specifications: {
        capacity: "750 Liters",
        engine: "10 HP Diesel",
        output: "25 m³/day",
        weight: "850 kg",
      },
      availability: "Rented",
      location: "Lamjung Depot",
      rating: 4.7,
      reviews: 134,
      operatorIncluded: false,
      fuelIncluded: true,
    },
    {
      id: "tractor-mt-285",
      name: "Mahindra Tractor 285 DI",
      category: "tractors",
      type: "Agricultural Tractor",
      image: "🚛",
      dailyRate: 4500,
      weeklyRate: 28000,
      monthlyRate: 100000,
      features: ["4WD", "Power Steering", "Multi-Speed PTO", "Hydraulic Lift"],
      specifications: {
        engine: "42 HP",
        transmission: "8F + 2R",
        liftCapacity: "1500 kg",
        fuelTank: "65 Liters",
      },
      availability: "Available",
      location: "Chitwan Branch",
      rating: 4.5,
      reviews: 178,
      operatorIncluded: true,
      fuelIncluded: false,
    },
    {
      id: "wheel-loader-cat",
      name: "CAT Wheel Loader 924K",
      category: "loaders",
      type: "Wheel Loader",
      image: "🏗️",
      dailyRate: 15000,
      weeklyRate: 95000,
      monthlyRate: 350000,
      features: [
        "High Lift",
        "Quick Coupler",
        "Joystick Control",
        "Load Sensing",
      ],
      specifications: {
        engine: "122 HP",
        bucketCapacity: "1.8 m³",
        liftCapacity: "3200 kg",
        weight: "8500 kg",
      },
      availability: "Available",
      location: "Kathmandu Branch",
      rating: 4.9,
      reviews: 92,
      operatorIncluded: true,
      fuelIncluded: false,
    },
    {
      id: "road-roller",
      name: "Vibratory Road Roller",
      category: "compactors",
      type: "Soil Compactor",
      image: "⚡",
      dailyRate: 6500,
      weeklyRate: 40000,
      monthlyRate: 145000,
      features: ["Vibratory", "Smooth Drum", "ROPS Cabin", "Water Sprinkler"],
      specifications: {
        engine: "55 HP",
        drumWidth: "1.68 m",
        compactionForce: "45 kN",
        weight: "4.2 tons",
      },
      availability: "Available",
      location: "Pokhara Branch",
      rating: 4.4,
      reviews: 67,
      operatorIncluded: true,
      fuelIncluded: true,
    },
    {
      id: "generator-125kva",
      name: "Diesel Generator 125 KVA",
      category: "generators",
      type: "Power Generator",
      image: "🔌",
      dailyRate: 3000,
      weeklyRate: 18000,
      monthlyRate: 65000,
      features: [
        "Auto Start",
        "Sound Proof",
        "Digital Panel",
        "Weather Protection",
      ],
      specifications: {
        power: "125 KVA",
        engine: "Perkins Diesel",
        fuelConsumption: "25 L/hour",
        noiseLevel: "68 dB",
      },
      availability: "Available",
      location: "Lamjung Depot",
      rating: 4.7,
      reviews: 145,
      operatorIncluded: false,
      fuelIncluded: false,
    },
  ];

  const filteredMachinery = machinery.filter((machine) => {
    // Add filtering logic here if needed
    return true;
  });

  const RentalDialog = ({ machine }: { machine: any }) => (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-kanxa-navy">
          Rent {machine.name}
        </DialogTitle>
        <DialogDescription>
          Complete the rental form to reserve {machine.name} for your project
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Machine Details */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="text-6xl">{machine.image}</div>
                <div>
                  <h3 className="text-xl font-bold text-kanxa-navy">
                    {machine.name}
                  </h3>
                  <p className="text-kanxa-gray">{machine.type}</p>
                  <Badge variant="secondary">{machine.category}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Features:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {machine.features.map((feature: string) => (
                    <div key={feature} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-kanxa-green" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Specifications:</h4>
                <div className="space-y-2">
                  {Object.entries(machine.specifications).map(
                    ([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-sm text-gray-600 capitalize">
                          {key}:
                        </span>
                        <span className="text-sm font-medium">
                          {String(value)}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Daily Rate:</span>
                  <span className="font-bold text-kanxa-orange">
                    Rs {machine.dailyRate.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Weekly Rate:</span>
                  <span className="font-bold text-kanxa-blue">
                    Rs {machine.weeklyRate.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Rate:</span>
                  <span className="font-bold text-kanxa-green">
                    Rs {machine.monthlyRate.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rental Form */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rental Request Form</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    value={rentalForm.name}
                    onChange={(e) =>
                      setRentalForm({ ...rentalForm, name: e.target.value })
                    }
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    value={rentalForm.company}
                    onChange={(e) =>
                      setRentalForm({ ...rentalForm, company: e.target.value })
                    }
                    placeholder="Company name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    type="email"
                    value={rentalForm.email}
                    onChange={(e) =>
                      setRentalForm({ ...rentalForm, email: e.target.value })
                    }
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    value={rentalForm.phone}
                    onChange={(e) =>
                      setRentalForm({ ...rentalForm, phone: e.target.value })
                    }
                    placeholder="+977-XXX-XXXXXX"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    type="date"
                    value={rentalForm.startDate}
                    onChange={(e) =>
                      setRentalForm({
                        ...rentalForm,
                        startDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    type="date"
                    value={rentalForm.endDate}
                    onChange={(e) =>
                      setRentalForm({ ...rentalForm, endDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Project Location *</Label>
                <Input
                  value={rentalForm.location}
                  onChange={(e) =>
                    setRentalForm({ ...rentalForm, location: e.target.value })
                  }
                  placeholder="Project site address"
                />
              </div>

              <div>
                <Label htmlFor="projectType">Project Type</Label>
                <Select
                  value={rentalForm.projectType}
                  onValueChange={(value) =>
                    setRentalForm({ ...rentalForm, projectType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="excavation">Excavation</SelectItem>
                    <SelectItem value="road">Road Work</SelectItem>
                    <SelectItem value="agriculture">Agriculture</SelectItem>
                    <SelectItem value="landscaping">Landscaping</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="operator"
                  checked={rentalForm.operatorNeeded}
                  onCheckedChange={(checked) =>
                    setRentalForm({
                      ...rentalForm,
                      operatorNeeded: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="operator">
                  Include experienced operator (+Rs 2,000/day)
                </Label>
              </div>

              <div>
                <Label htmlFor="requirements">Special Requirements</Label>
                <Textarea
                  value={rentalForm.requirements}
                  onChange={(e) =>
                    setRentalForm({
                      ...rentalForm,
                      requirements: e.target.value,
                    })
                  }
                  placeholder="Any special requirements, attachments needed, or additional information..."
                />
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  All equipment comes with insurance. Delivery and pickup
                  charges may apply based on location.
                </AlertDescription>
              </Alert>

              <div className="flex gap-4">
                <Button className="flex-1 bg-kanxa-orange hover:bg-kanxa-orange/90">
                  Submit Rental Request
                </Button>
                <Button variant="outline">Get Quote</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DialogContent>
  );

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-kanxa-orange to-kanxa-navy text-white py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Construction Machinery Rental
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Professional-grade construction equipment with experienced
              operators and full support
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-kanxa-orange hover:bg-white/90"
              >
                <Calculator className="mr-2 h-5 w-5" />
                Get Rental Quote
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-kanxa-orange"
              >
                <Phone className="mr-2 h-5 w-5" />
                Call for Availability
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Categories */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container px-4">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between mb-6">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search machinery..." className="pl-10" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {machineryCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select defaultValue="available">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category Tabs */}
          <Tabs defaultValue="all">
            <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 w-full overflow-x-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              {machineryCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="text-xs"
                >
                  <span className="mr-1">{category.icon}</span>
                  <span className="hidden sm:inline">{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Machinery Grid */}
      <section className="py-12">
        <div className="container px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-kanxa-navy">
              Available Machinery ({filteredMachinery.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {filteredMachinery.map((machine) => (
              <Card
                key={machine.id}
                className="hover:shadow-lg transition-all duration-300 group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="text-6xl mb-2">{machine.image}</div>
                    <div className="text-right">
                      {machine.availability === "Available" ? (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800"
                        >
                          Available
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Rented</Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-lg text-kanxa-navy leading-tight">
                    {machine.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{machine.type}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">
                        {machine.rating}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      ({machine.reviews} reviews)
                    </span>
                    <div className="flex items-center gap-1 ml-auto">
                      <MapPin className="h-4 w-4 text-kanxa-blue" />
                      <span className="text-xs">{machine.location}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">
                      Key Features:
                    </h4>
                    <div className="grid grid-cols-2 gap-1">
                      {machine.features.slice(0, 4).map((feature: string) => (
                        <div key={feature} className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-kanxa-green" />
                          <span className="text-xs text-gray-600">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    {Object.entries(machine.specifications)
                      .slice(0, 2)
                      .map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-600 capitalize">
                            {key}:
                          </span>
                          <span className="font-medium">{String(value)}</span>
                        </div>
                      ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Daily:</span>
                      <span className="font-bold text-kanxa-orange">
                        Rs {machine.dailyRate.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Weekly:</span>
                      <span className="font-bold text-kanxa-blue">
                        Rs {machine.weeklyRate.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Monthly:</span>
                      <span className="font-bold text-kanxa-green">
                        Rs {machine.monthlyRate.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 text-xs">
                    {machine.operatorIncluded && (
                      <Badge variant="outline" className="text-kanxa-blue">
                        <Users className="mr-1 h-3 w-3" />
                        Operator
                      </Badge>
                    )}
                    {machine.fuelIncluded && (
                      <Badge variant="outline" className="text-kanxa-green">
                        <Fuel className="mr-1 h-3 w-3" />
                        Fuel
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-kanxa-orange">
                      <Shield className="mr-1 h-3 w-3" />
                      Insured
                    </Badge>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="w-full bg-kanxa-orange hover:bg-kanxa-orange/90"
                        onClick={() => setSelectedMachinery(machine)}
                        disabled={machine.availability !== "Available"}
                      >
                        {machine.availability === "Available"
                          ? "Rent Now"
                          : "Currently Rented"}
                      </Button>
                    </DialogTrigger>
                    {selectedMachinery && (
                      <RentalDialog machine={selectedMachinery} />
                    )}
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-kanxa-navy mb-4">
              Our Rental Services
            </h2>
            <p className="text-lg text-gray-600">
              Complete machinery rental solutions
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              {
                icon: <Truck className="h-8 w-8 text-kanxa-orange" />,
                title: "Free Delivery",
                description: "Free delivery and pickup within city limits",
              },
              {
                icon: <Users className="h-8 w-8 text-kanxa-blue" />,
                title: "Skilled Operators",
                description:
                  "Experienced operators available for all equipment",
              },
              {
                icon: <Shield className="h-8 w-8 text-kanxa-green" />,
                title: "Full Insurance",
                description: "Comprehensive insurance coverage included",
              },
              {
                icon: <Clock className="h-8 w-8 text-kanxa-orange" />,
                title: "24/7 Support",
                description:
                  "Round-the-clock technical support and maintenance",
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

      {/* Rental Terms */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-kanxa-navy mb-8 text-center">
              Rental Terms & Conditions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-kanxa-blue">
                    Included in Rental
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    "Comprehensive insurance coverage",
                    "Regular maintenance and servicing",
                    "24/7 breakdown support",
                    "Safety equipment and manuals",
                    "Technical consultation",
                    "Delivery within city limits",
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-kanxa-green" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-kanxa-orange">
                    Additional Charges
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    "Fuel and consumables",
                    "Delivery beyond city limits",
                    "Operator services (+Rs 2,000/day)",
                    "Overtime charges (beyond 8 hours)",
                    "Damage repairs (if any)",
                    "Late return penalties",
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-kanxa-orange" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Alert className="mt-8">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Security Deposit:</strong> A refundable security deposit
                is required for all rentals. Amount varies by equipment type and
                rental duration. Contact us for specific details.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-kanxa-navy text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">
            Need Custom Equipment Solutions?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Contact our equipment specialists for custom rental packages and
            long-term contracts
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-kanxa-orange rounded-lg flex items-center justify-center">
                <Phone className="h-6 w-6" />
              </div>
              <div className="text-left">
                <p className="font-semibold">Equipment Hotline</p>
                <p className="text-white/90">+977-XXX-XXXXXX</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-kanxa-orange rounded-lg flex items-center justify-center">
                <Mail className="h-6 w-6" />
              </div>
              <div className="text-left">
                <p className="font-semibold">Equipment Email</p>
                <p className="text-white/90">machinery@kanxasafari.com</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-kanxa-orange hover:bg-kanxa-orange/90"
            >
              Request Equipment Quote
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-kanxa-navy"
            >
              View Equipment Catalog
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
