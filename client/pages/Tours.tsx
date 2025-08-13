import { useState } from "react";
import {
  MapPin,
  Calendar,
  Users,
  Clock,
  Star,
  Camera,
  Mountain,
  Sunset,
  TreePine,
  Send,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  Car,
  Bus,
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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Layout from "@/components/layout/Layout";

export default function Tours() {
  const [tourForm, setTourForm] = useState({
    name: "",
    email: "",
    phone: "",
    destination: "",
    startDate: "",
    endDate: "",
    groupSize: "",
    vehicleType: "",
    accommodation: "",
    mealPreference: "",
    specialRequests: "",
    budget: "",
    emergencyContact: "",
    previousExperience: "",
  });

  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const popularDestinations = [
    {
      id: "annapurna",
      name: "Annapurna Circuit",
      description: "Spectacular mountain views and diverse landscapes",
      duration: "12-15 days",
      difficulty: "Moderate",
      image: "🏔️",
      highlights: ["Thorong La Pass", "Diverse cultures", "Stunning views"],
      basePrice: 45000,
    },
    {
      id: "pokhara",
      name: "Pokhara Valley Tour",
      description: "Lakes, temples, and adventure activities",
      duration: "3-5 days",
      difficulty: "Easy",
      image: "🏞️",
      highlights: ["Phewa Lake", "World Peace Pagoda", "Adventure sports"],
      basePrice: 15000,
    },
    {
      id: "chitwan",
      name: "Chitwan Safari",
      description: "Wildlife safari and jungle experiences",
      duration: "2-4 days",
      difficulty: "Easy",
      image: "🐘",
      highlights: ["Elephant safari", "Bird watching", "Cultural shows"],
      basePrice: 12000,
    },
    {
      id: "everest",
      name: "Everest Base Camp",
      description: "Journey to the base of the world's highest peak",
      duration: "12-16 days",
      difficulty: "Challenging",
      image: "⛰️",
      highlights: ["Everest Base Camp", "Sherpa culture", "Kala Patthar"],
      basePrice: 65000,
    },
    {
      id: "lumbini",
      name: "Lumbini Pilgrimage",
      description: "Birthplace of Buddha spiritual journey",
      duration: "2-3 days",
      difficulty: "Easy",
      image: "🛕",
      highlights: ["Maya Devi Temple", "Monasteries", "Peace gardens"],
      basePrice: 8000,
    },
    {
      id: "kathmandu",
      name: "Kathmandu Heritage",
      description: "UNESCO World Heritage sites exploration",
      duration: "2-4 days",
      difficulty: "Easy",
      image: "🏛️",
      highlights: ["Durbar squares", "Ancient temples", "Local culture"],
      basePrice: 10000,
    },
  ];

  const vehicleOptions = [
    {
      id: "car",
      name: "Private Car",
      capacity: "1-4 people",
      icon: "🚗",
      price: 5000,
    },
    {
      id: "suv",
      name: "SUV/Jeep",
      capacity: "1-7 people",
      icon: "🚙",
      price: 8000,
    },
    {
      id: "van",
      name: "Tourist Van",
      capacity: "8-12 people",
      icon: "🚐",
      price: 12000,
    },
    {
      id: "bus",
      name: "Tourist Bus",
      capacity: "13-25 people",
      icon: "🚌",
      price: 20000,
    },
    {
      id: "luxury",
      name: "Luxury Coach",
      capacity: "20-45 people",
      icon: "🚎",
      price: 35000,
    },
  ];

  const additionalServices = [
    "Professional Guide",
    "Photography Service",
    "Equipment Rental",
    "Travel Insurance",
    "Airport Transfer",
    "Hotel Booking",
    "Meal Planning",
    "Emergency Support",
  ];

  const handleServiceChange = (service: string, checked: boolean) => {
    if (checked) {
      setSelectedServices([...selectedServices, service]);
    } else {
      setSelectedServices(selectedServices.filter((s) => s !== service));
    }
  };

  const TourRequestDialog = () => (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-kanxa-navy">
          Custom Tour Request
        </DialogTitle>
        <DialogDescription>
          Fill out this form to request a customized tour package tailored to your preferences
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  value={tourForm.name}
                  onChange={(e) =>
                    setTourForm({ ...tourForm, name: e.target.value })
                  }
                  placeholder="Your full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  type="email"
                  value={tourForm.email}
                  onChange={(e) =>
                    setTourForm({ ...tourForm, email: e.target.value })
                  }
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  value={tourForm.phone}
                  onChange={(e) =>
                    setTourForm({ ...tourForm, phone: e.target.value })
                  }
                  placeholder="+977-XXX-XXXXXX"
                />
              </div>
              <div>
                <Label htmlFor="emergency">Emergency Contact</Label>
                <Input
                  value={tourForm.emergencyContact}
                  onChange={(e) =>
                    setTourForm({
                      ...tourForm,
                      emergencyContact: e.target.value,
                    })
                  }
                  placeholder="Emergency contact number"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tour Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tour Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="destination">Destination *</Label>
                <Select
                  value={tourForm.destination}
                  onValueChange={(value) =>
                    setTourForm({ ...tourForm, destination: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {popularDestinations.map((dest) => (
                      <SelectItem key={dest.id} value={dest.id}>
                        {dest.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">Custom Destination</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="groupSize">Group Size *</Label>
                <Select
                  value={tourForm.groupSize}
                  onValueChange={(value) =>
                    setTourForm({ ...tourForm, groupSize: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Number of people" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 person</SelectItem>
                    <SelectItem value="2-4">2-4 people</SelectItem>
                    <SelectItem value="5-10">5-10 people</SelectItem>
                    <SelectItem value="11-20">11-20 people</SelectItem>
                    <SelectItem value="20+">20+ people</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  type="date"
                  value={tourForm.startDate}
                  onChange={(e) =>
                    setTourForm({ ...tourForm, startDate: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  type="date"
                  value={tourForm.endDate}
                  onChange={(e) =>
                    setTourForm({ ...tourForm, endDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="budget">Budget Range (NPR)</Label>
              <Select
                value={tourForm.budget}
                onValueChange={(value) =>
                  setTourForm({ ...tourForm, budget: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-20k">Under NPR 20,000</SelectItem>
                  <SelectItem value="20k-50k">NPR 20,000 - 50,000</SelectItem>
                  <SelectItem value="50k-100k">NPR 50,000 - 100,000</SelectItem>
                  <SelectItem value="100k-200k">
                    NPR 100,000 - 200,000
                  </SelectItem>
                  <SelectItem value="200k+">NPR 200,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle & Services */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vehicle & Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Vehicle Type *</Label>
              <RadioGroup
                value={tourForm.vehicleType}
                onValueChange={(value) =>
                  setTourForm({ ...tourForm, vehicleType: value })
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vehicleOptions.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className="flex items-center space-x-2 p-3 border rounded-lg"
                    >
                      <RadioGroupItem value={vehicle.id} id={vehicle.id} />
                      <Label
                        htmlFor={vehicle.id}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{vehicle.icon}</span>
                          <div>
                            <p className="font-medium">{vehicle.name}</p>
                            <p className="text-sm text-gray-600">
                              {vehicle.capacity}
                            </p>
                          </div>
                        </div>
                      </Label>
                      <span className="text-sm font-medium text-kanxa-blue">
                        NPR {vehicle.price.toLocaleString()}/day
                      </span>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Additional Services</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {additionalServices.map((service) => (
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox
                      id={service}
                      checked={selectedServices.includes(service)}
                      onCheckedChange={(checked) =>
                        handleServiceChange(service, checked as boolean)
                      }
                    />
                    <Label htmlFor={service} className="text-sm cursor-pointer">
                      {service}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Special Requirements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Special Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="accommodation">Accommodation Preference</Label>
                <Select
                  value={tourForm.accommodation}
                  onValueChange={(value) =>
                    setTourForm({ ...tourForm, accommodation: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="budget">Budget (Guesthouses)</SelectItem>
                    <SelectItem value="standard">
                      Standard (3-star hotels)
                    </SelectItem>
                    <SelectItem value="luxury">
                      Luxury (4-5 star hotels)
                    </SelectItem>
                    <SelectItem value="camping">Camping/Trekking</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="meals">Meal Preference</Label>
                <Select
                  value={tourForm.mealPreference}
                  onValueChange={(value) =>
                    setTourForm({ ...tourForm, mealPreference: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="non-vegetarian">
                      Non-Vegetarian
                    </SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="halal">Halal</SelectItem>
                    <SelectItem value="mixed">Mixed Group</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="experience">Previous Travel Experience</Label>
              <Textarea
                value={tourForm.previousExperience}
                onChange={(e) =>
                  setTourForm({
                    ...tourForm,
                    previousExperience: e.target.value,
                  })
                }
                placeholder="Tell us about your previous travel or trekking experience..."
              />
            </div>

            <div>
              <Label htmlFor="special">Special Requests</Label>
              <Textarea
                value={tourForm.specialRequests}
                onChange={(e) =>
                  setTourForm({ ...tourForm, specialRequests: e.target.value })
                }
                placeholder="Any special requirements, medical conditions, dietary restrictions, or specific interests..."
              />
            </div>
          </CardContent>
        </Card>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Our team will review your request and get back to you within 24
            hours with a detailed proposal and quote.
          </AlertDescription>
        </Alert>

        <div className="flex gap-4">
          <Button
            className="flex-1 bg-kanxa-blue hover:bg-kanxa-blue/90"
            size="lg"
          >
            <Send className="mr-2 h-4 w-4" />
            Submit Request
          </Button>
          <Button variant="outline" size="lg">
            Save as Draft
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
              Custom Tour Experiences
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Personalized journeys crafted just for you. Explore Nepal your way
              with our custom tour services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="bg-white text-kanxa-green hover:bg-white/90"
                  >
                    <MapPin className="mr-2 h-5 w-5" />
                    Plan Your Tour
                  </Button>
                </DialogTrigger>
                <TourRequestDialog />
              </Dialog>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-kanxa-green"
              >
                <Phone className="mr-2 h-5 w-5" />
                Speak to Expert
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-kanxa-navy mb-4">
              Popular Destinations
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover Nepal's most sought-after destinations with our expertly
              crafted tour packages
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularDestinations.map((destination) => (
              <Card
                key={destination.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                <div className="aspect-video bg-gradient-to-br from-kanxa-light-blue to-kanxa-light-green flex items-center justify-center text-6xl">
                  {destination.image}
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-kanxa-navy">
                      {destination.name}
                    </h3>
                    <Badge variant="outline">{destination.difficulty}</Badge>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">
                    {destination.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-kanxa-green" />
                        <span>{destination.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span>4.8</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-700">
                        Highlights:
                      </p>
                      {destination.highlights.map((highlight) => (
                        <div
                          key={highlight}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="h-3 w-3 text-kanxa-green" />
                          <span className="text-xs text-gray-600">
                            {highlight}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Starting from</p>
                        <p className="text-lg font-bold text-kanxa-green">
                          NPR {destination.basePrice.toLocaleString()}
                        </p>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            className="bg-kanxa-green hover:bg-kanxa-green/90"
                          >
                            Customize
                          </Button>
                        </DialogTrigger>
                        <TourRequestDialog />
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-kanxa-navy mb-4">
              How Custom Tours Work
            </h2>
            <p className="text-lg text-gray-600">
              Simple steps to create your perfect Nepal adventure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Submit Request",
                description:
                  "Fill out our detailed tour request form with your preferences",
                icon: <Send className="h-8 w-8 text-kanxa-blue" />,
              },
              {
                step: "2",
                title: "Expert Review",
                description:
                  "Our tour specialists review and craft a personalized itinerary",
                icon: <Users className="h-8 w-8 text-kanxa-orange" />,
              },
              {
                step: "3",
                title: "Approval Process",
                description:
                  "Review the proposal, make adjustments, and approve the final plan",
                icon: <CheckCircle className="h-8 w-8 text-kanxa-green" />,
              },
              {
                step: "4",
                title: "Adventure Begins",
                description:
                  "Enjoy your customized Nepal experience with full support",
                icon: <Mountain className="h-8 w-8 text-kanxa-blue" />,
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

      {/* Service Features */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-kanxa-navy mb-4">
              Why Choose Our Custom Tours?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="h-8 w-8 text-kanxa-blue" />,
                title: "Expert Local Guides",
                description:
                  "Experienced guides with deep knowledge of local culture and terrain",
              },
              {
                icon: <Camera className="h-8 w-8 text-kanxa-orange" />,
                title: "Photography Support",
                description:
                  "Professional photography services to capture your memories",
              },
              {
                icon: <Mountain className="h-8 w-8 text-kanxa-green" />,
                title: "Flexible Itineraries",
                description:
                  "Completely customizable plans that match your interests and timeline",
              },
              {
                icon: <CheckCircle className="h-8 w-8 text-kanxa-blue" />,
                title: "All-Inclusive Packages",
                description:
                  "Transport, accommodation, meals, and activities included",
              },
              {
                icon: <Clock className="h-8 w-8 text-kanxa-orange" />,
                title: "24/7 Support",
                description:
                  "Round-the-clock assistance throughout your journey",
              },
              {
                icon: <Star className="h-8 w-8 text-kanxa-green" />,
                title: "Premium Experience",
                description:
                  "High-quality services and attention to every detail",
              },
            ].map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-kanxa-navy mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-kanxa-navy mb-4">
              What Our Travelers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Johnson",
                location: "Australia",
                rating: 5,
                comment:
                  "The custom Annapurna trek was absolutely perfect. Every detail was planned to perfection and our guide was incredible!",
              },
              {
                name: "David Kumar",
                location: "India",
                rating: 5,
                comment:
                  "Family tour to Pokhara and Chitwan was amazing. The team accommodated all our special requests beautifully.",
              },
              {
                name: "Lisa Zhang",
                location: "Singapore",
                rating: 5,
                comment:
                  "Professional service from start to finish. The Everest Base Camp trek exceeded all expectations!",
              },
            ].map((review, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">
                    "{review.comment}"
                  </p>
                  <div>
                    <p className="font-semibold text-kanxa-navy">
                      {review.name}
                    </p>
                    <p className="text-sm text-gray-500">{review.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-kanxa-navy text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Planning?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Let our experts create the perfect Nepal adventure tailored just for
            you
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="bg-kanxa-green hover:bg-kanxa-green/90"
                >
                  <MapPin className="mr-2 h-5 w-5" />
                  Submit Tour Request
                </Button>
              </DialogTrigger>
              <TourRequestDialog />
            </Dialog>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-kanxa-navy"
            >
              <Phone className="mr-2 h-5 w-5" />
              Call +977-XXX-XXXXXX
            </Button>
          </div>

          <p className="text-white/80 text-sm">
            Response time: Within 24 hours | Free consultation and quote
          </p>
        </div>
      </section>
    </Layout>
  );
}
