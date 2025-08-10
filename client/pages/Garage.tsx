import { useState } from "react";
import {
  Wrench,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Star,
  Settings,
  Truck,
  AlertCircle,
  User,
  Package,
  Shield,
  Award,
  Search,
  Filter,
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import Layout from "@/components/layout/Layout";

export default function Garage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    name: "",
    email: "",
    phone: "",
    vehicleType: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    registrationNumber: "",
    serviceType: "",
    preferredDate: "",
    preferredTime: "",
    issueDescription: "",
    urgencyLevel: "normal",
    pickupNeeded: false,
  });

  const services = [
    {
      id: "engine-repair",
      name: "Engine Repair & Overhaul",
      category: "major-repair",
      description: "Complete engine diagnostics, repair, and overhaul services",
      estimatedTime: "3-7 days",
      priceRange: "NPR 25,000 - 150,000",
      icon: "⚙️",
      features: [
        "Engine diagnostics",
        "Complete overhaul",
        "Parts replacement",
        "Performance testing",
      ],
    },
    {
      id: "hydraulic-repair",
      name: "Hydraulic System Repair",
      category: "major-repair",
      description: "Hydraulic pump, cylinder, and system maintenance",
      estimatedTime: "1-3 days",
      priceRange: "NPR 15,000 - 80,000",
      icon: "🔧",
      features: [
        "Hydraulic diagnostics",
        "Pump repair",
        "Seal replacement",
        "System flushing",
      ],
    },
    {
      id: "transmission-service",
      name: "Transmission Service",
      category: "major-repair",
      description: "Gearbox repair and transmission maintenance",
      estimatedTime: "2-5 days",
      priceRange: "NPR 20,000 - 100,000",
      icon: "⚙️",
      features: [
        "Transmission diagnostics",
        "Gear replacement",
        "Oil change",
        "Clutch repair",
      ],
    },
    {
      id: "electrical-repair",
      name: "Electrical System Repair",
      category: "electrical",
      description: "Complete electrical diagnostics and wiring services",
      estimatedTime: "1-2 days",
      priceRange: "NPR 5,000 - 35,000",
      icon: "⚡",
      features: [
        "Electrical diagnostics",
        "Wiring repair",
        "Battery service",
        "Alternator repair",
      ],
    },
    {
      id: "preventive-maintenance",
      name: "Preventive Maintenance",
      category: "maintenance",
      description: "Regular maintenance to prevent major breakdowns",
      estimatedTime: "4-8 hours",
      priceRange: "NPR 3,000 - 15,000",
      icon: "🛠️",
      features: [
        "Oil change",
        "Filter replacement",
        "Lubrication",
        "Safety inspection",
      ],
    },
    {
      id: "brake-service",
      name: "Brake System Service",
      category: "safety",
      description: "Brake inspection, repair, and replacement",
      estimatedTime: "2-6 hours",
      priceRange: "NPR 8,000 - 25,000",
      icon: "🛑",
      features: [
        "Brake inspection",
        "Pad replacement",
        "Fluid change",
        "System bleeding",
      ],
    },
    {
      id: "ac-repair",
      name: "AC System Repair",
      category: "comfort",
      description: "Air conditioning system diagnosis and repair",
      estimatedTime: "2-4 hours",
      priceRange: "NPR 5,000 - 20,000",
      icon: "❄️",
      features: [
        "AC diagnostics",
        "Gas refilling",
        "Compressor repair",
        "Filter cleaning",
      ],
    },
    {
      id: "body-work",
      name: "Body Work & Painting",
      category: "bodywork",
      description: "Dent repair, painting, and body restoration",
      estimatedTime: "1-5 days",
      priceRange: "NPR 10,000 - 80,000",
      icon: "🎨",
      features: [
        "Dent repair",
        "Rust treatment",
        "Painting",
        "Body restoration",
      ],
    },
  ];

  const vehicleTypes = [
    "Tractor",
    "JCB/Excavator",
    "Truck",
    "Bus",
    "Car",
    "Motorcycle",
    "Other Heavy Machinery",
  ];

  const timeSlots = [
    "8:00 AM - 10:00 AM",
    "10:00 AM - 12:00 PM",
    "12:00 PM - 2:00 PM",
    "2:00 PM - 4:00 PM",
    "4:00 PM - 6:00 PM",
  ];

  const technicians = [
    {
      id: "ram-mechanics",
      name: "Ram Bahadur Thapa",
      specialization: "Engine & Transmission",
      experience: "15 years",
      rating: 4.9,
      image: "👨‍🔧",
      certifications: ["Diesel Engine Specialist", "Hydraulic Systems Expert"],
    },
    {
      id: "shyam-electrical",
      name: "Shyam Kumar Rai",
      specialization: "Electrical Systems",
      experience: "12 years",
      rating: 4.8,
      image: "👨‍🔧",
      certifications: ["Auto Electrician", "ECU Programming"],
    },
    {
      id: "hari-bodywork",
      name: "Hari Prasad Sharma",
      specialization: "Body Work & Painting",
      experience: "10 years",
      rating: 4.7,
      image: "👨‍🔧",
      certifications: ["Paint Specialist", "Dent Repair Expert"],
    },
  ];

  const AppointmentDialog = () => (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-kanxa-navy">
          Book Service Appointment
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  value={appointmentForm.name}
                  onChange={(e) =>
                    setAppointmentForm({
                      ...appointmentForm,
                      name: e.target.value,
                    })
                  }
                  placeholder="Your full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  type="email"
                  value={appointmentForm.email}
                  onChange={(e) =>
                    setAppointmentForm({
                      ...appointmentForm,
                      email: e.target.value,
                    })
                  }
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  value={appointmentForm.phone}
                  onChange={(e) =>
                    setAppointmentForm({
                      ...appointmentForm,
                      phone: e.target.value,
                    })
                  }
                  placeholder="+977-XXX-XXXXXX"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vehicleType">Vehicle Type *</Label>
                <Select
                  value={appointmentForm.vehicleType}
                  onValueChange={(value) =>
                    setAppointmentForm({
                      ...appointmentForm,
                      vehicleType: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="vehicleMake">Make/Brand</Label>
                <Input
                  value={appointmentForm.vehicleMake}
                  onChange={(e) =>
                    setAppointmentForm({
                      ...appointmentForm,
                      vehicleMake: e.target.value,
                    })
                  }
                  placeholder="e.g., Mahindra, JCB, Toyota"
                />
              </div>
              <div>
                <Label htmlFor="vehicleModel">Model</Label>
                <Input
                  value={appointmentForm.vehicleModel}
                  onChange={(e) =>
                    setAppointmentForm({
                      ...appointmentForm,
                      vehicleModel: e.target.value,
                    })
                  }
                  placeholder="e.g., 3DX, 285 DI"
                />
              </div>
              <div>
                <Label htmlFor="vehicleYear">Year</Label>
                <Input
                  value={appointmentForm.vehicleYear}
                  onChange={(e) =>
                    setAppointmentForm({
                      ...appointmentForm,
                      vehicleYear: e.target.value,
                    })
                  }
                  placeholder="e.g., 2020"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="registrationNumber">Registration Number</Label>
              <Input
                value={appointmentForm.registrationNumber}
                onChange={(e) =>
                  setAppointmentForm({
                    ...appointmentForm,
                    registrationNumber: e.target.value,
                  })
                }
                placeholder="e.g., BA 12 PA 1234"
              />
            </div>
          </CardContent>
        </Card>

        {/* Service Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Service Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="serviceType">Service Type *</Label>
              <Select
                value={appointmentForm.serviceType}
                onValueChange={(value) =>
                  setAppointmentForm({ ...appointmentForm, serviceType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="preferredDate">Preferred Date *</Label>
                <Input
                  type="date"
                  value={appointmentForm.preferredDate}
                  onChange={(e) =>
                    setAppointmentForm({
                      ...appointmentForm,
                      preferredDate: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="preferredTime">Preferred Time *</Label>
                <Select
                  value={appointmentForm.preferredTime}
                  onValueChange={(value) =>
                    setAppointmentForm({
                      ...appointmentForm,
                      preferredTime: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="urgencyLevel">Urgency Level</Label>
                <Select
                  value={appointmentForm.urgencyLevel}
                  onValueChange={(value) =>
                    setAppointmentForm({
                      ...appointmentForm,
                      urgencyLevel: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="issueDescription">Issue Description *</Label>
              <Textarea
                value={appointmentForm.issueDescription}
                onChange={(e) =>
                  setAppointmentForm({
                    ...appointmentForm,
                    issueDescription: e.target.value,
                  })
                }
                placeholder="Describe the problem or service needed in detail..."
                rows={4}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="pickup"
                checked={appointmentForm.pickupNeeded}
                onCheckedChange={(checked) =>
                  setAppointmentForm({
                    ...appointmentForm,
                    pickupNeeded: checked as boolean,
                  })
                }
              />
              <Label htmlFor="pickup">
                Vehicle pickup and delivery service needed (+NPR 2,000)
              </Label>
            </div>
          </CardContent>
        </Card>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            We'll confirm your appointment within 2 hours and provide an
            estimated quote based on the initial assessment.
          </AlertDescription>
        </Alert>

        <div className="flex gap-4">
          <Button
            className="flex-1 bg-kanxa-green hover:bg-kanxa-green/90"
            size="lg"
            onClick={() => {
              // Handle form submission
              console.log('Appointment Form:', appointmentForm);
              // Reset form
              setAppointmentForm({
                name: "",
                email: "",
                phone: "",
                vehicleType: "",
                vehicleMake: "",
                vehicleModel: "",
                vehicleYear: "",
                registrationNumber: "",
                serviceType: "",
                preferredDate: "",
                preferredTime: "",
                issueDescription: "",
                urgencyLevel: "normal",
                pickupNeeded: false,
              });
              // Close dialog
              setIsDialogOpen(false);
              // Show success message (you can add toast notification here)
              alert('Appointment booked successfully!');
            }}
          >
            Book Appointment
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setIsDialogOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </div>
    </DialogContent>
  );

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-kanxa-green to-kanxa-navy text-white py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Professional Garage & Workshop
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Expert maintenance and repair services for tractors, heavy
              machinery, and all vehicle types
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="bg-white text-kanxa-green hover:bg-white/90"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Appointment
                  </Button>
                </DialogTrigger>
                <AppointmentDialog />
              </Dialog>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-kanxa-green"
              >
                <Phone className="mr-2 h-5 w-5" />
                Emergency Service
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 bg-gray-50">
        <div className="container px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-kanxa-light-green rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-kanxa-green" />
                </div>
                <h3 className="font-semibold text-kanxa-navy mb-2">
                  Book Service
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Schedule your vehicle service
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="bg-kanxa-green hover:bg-kanxa-green/90"
                    >
                      Book Now
                    </Button>
                  </DialogTrigger>
                  <AppointmentDialog />
                </Dialog>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-kanxa-light-orange rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-kanxa-orange" />
                </div>
                <h3 className="font-semibold text-kanxa-navy mb-2">
                  Emergency Repair
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  24/7 emergency service
                </p>
                <Button size="sm" variant="outline">
                  Call Now
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-kanxa-light-blue rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-kanxa-blue" />
                </div>
                <h3 className="font-semibold text-kanxa-navy mb-2">
                  Spare Parts
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Genuine parts available
                </p>
                <Button size="sm" variant="outline">
                  Browse Parts
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-kanxa-light-orange rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-kanxa-orange" />
                </div>
                <h3 className="font-semibold text-kanxa-navy mb-2">
                  Pickup Service
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Vehicle pickup & delivery
                </p>
                <Button size="sm" variant="outline">
                  Request Pickup
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-kanxa-navy mb-4">
              Our Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive maintenance and repair services for all types of
              vehicles and machinery
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <Card
                key={service.id}
                className="hover:shadow-lg transition-all duration-300 group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="text-4xl mb-2">{service.icon}</div>
                    <Badge variant="outline">{service.category}</Badge>
                  </div>
                  <CardTitle className="text-lg text-kanxa-navy leading-tight">
                    {service.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">
                        {service.estimatedTime}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Price Range:</span>
                      <span className="font-medium text-kanxa-green">
                        {service.priceRange}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">
                      Includes:
                    </h4>
                    {service.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-kanxa-green" />
                        <span className="text-xs text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-kanxa-green hover:bg-kanxa-green/90">
                        Book This Service
                      </Button>
                    </DialogTrigger>
                    <AppointmentDialog />
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technicians Section */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-kanxa-navy mb-4">
              Our Expert Technicians
            </h2>
            <p className="text-lg text-gray-600">
              Experienced professionals with specialized expertise
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {technicians.map((tech) => (
              <Card
                key={tech.id}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="text-6xl mb-4">{tech.image}</div>
                  <CardTitle className="text-kanxa-navy">{tech.name}</CardTitle>
                  <p className="text-gray-600">{tech.specialization}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{tech.rating}</span>
                    <span className="text-gray-500">• {tech.experience}</span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">
                      Certifications:
                    </h4>
                    {tech.certifications.map((cert) => (
                      <Badge key={cert} variant="outline" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full">
                    Request This Technician
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Workshop Features */}
      <section className="py-16">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-kanxa-navy mb-4">
              State-of-the-Art Workshop
            </h2>
            <p className="text-lg text-gray-600">
              Modern equipment and facilities for all repair needs
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              {
                icon: <Settings className="h-8 w-8 text-kanxa-blue" />,
                title: "Advanced Diagnostics",
                description:
                  "Computer-based diagnostic equipment for accurate problem detection",
              },
              {
                icon: <Shield className="h-8 w-8 text-kanxa-green" />,
                title: "Genuine Parts",
                description:
                  "Original manufacturer parts and quality aftermarket alternatives",
              },
              {
                icon: <Award className="h-8 w-8 text-kanxa-orange" />,
                title: "Certified Service",
                description:
                  "Authorized service center for major machinery brands",
              },
              {
                icon: <Clock className="h-8 w-8 text-kanxa-blue" />,
                title: "Quick Turnaround",
                description:
                  "Efficient service with minimal downtime for your equipment",
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

      {/* Service Process */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-kanxa-navy mb-4">
              Our Service Process
            </h2>
            <p className="text-lg text-gray-600">
              Simple steps to get your vehicle serviced
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              {
                step: "1",
                title: "Book Appointment",
                description: "Schedule online or call us for immediate service",
                icon: <Calendar className="h-8 w-8 text-kanxa-green" />,
              },
              {
                step: "2",
                title: "Vehicle Inspection",
                description: "Thorough diagnosis and assessment by our experts",
                icon: <Search className="h-8 w-8 text-kanxa-blue" />,
              },
              {
                step: "3",
                title: "Repair & Service",
                description:
                  "Professional repair using genuine parts and tools",
                icon: <Wrench className="h-8 w-8 text-kanxa-orange" />,
              },
              {
                step: "4",
                title: "Quality Check",
                description:
                  "Final testing and quality assurance before delivery",
                icon: <CheckCircle className="h-8 w-8 text-kanxa-green" />,
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-kanxa-orange rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-kanxa-navy mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Emergency */}
      <section className="py-16 bg-kanxa-navy text-white">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              24/7 Emergency Service Available
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Breakdown assistance and emergency repairs whenever you need them
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <Phone className="h-12 w-12 text-kanxa-orange mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Emergency Hotline</h3>
                <p className="text-white/90 mb-4">24/7 breakdown assistance</p>
                <p className="text-2xl font-bold text-kanxa-orange">
                  +977-XXX-XXXXXX
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <MapPin className="h-12 w-12 text-kanxa-green mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Workshop Location</h3>
                <p className="text-white/90 mb-4">Main service center</p>
                <p className="text-kanxa-green">Lamjung, Nepal</p>
                <p className="text-white/80 text-sm">Open 7 AM - 7 PM</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <Mail className="h-12 w-12 text-kanxa-blue mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Email Support</h3>
                <p className="text-white/90 mb-4">Technical consultations</p>
                <p className="text-kanxa-blue">garage@kanxasafari.com</p>
                <p className="text-white/80 text-sm">Response within 2 hours</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="bg-kanxa-green hover:bg-kanxa-green/90"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Service Appointment
                  </Button>
                </DialogTrigger>
                <AppointmentDialog />
              </Dialog>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-kanxa-navy"
              >
                <Phone className="mr-2 h-5 w-5" />
                Call Emergency Service
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
