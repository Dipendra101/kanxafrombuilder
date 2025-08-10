import {
  Award,
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Users,
  Truck,
  Building2,
  Wrench,
  Target,
  Eye,
  Heart,
  Shield,
  Star,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";

export default function About() {
  const stats = [
    { label: "Years of Service", value: "15+", icon: Calendar },
    { label: "Happy Customers", value: "10,000+", icon: Users },
    { label: "Projects Completed", value: "2,500+", icon: CheckCircle },
    { label: "Fleet Vehicles", value: "150+", icon: Truck },
  ];

  const values = [
    {
      icon: Shield,
      title: "Reliability",
      description:
        "We ensure dependable service delivery with punctuality and consistency in all our operations.",
    },
    {
      icon: Heart,
      title: "Customer First",
      description:
        "Our customers are at the heart of everything we do. We prioritize their needs and satisfaction.",
    },
    {
      icon: Award,
      title: "Quality Excellence",
      description:
        "We maintain the highest standards in service quality and continuously strive for improvement.",
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description:
        "We embrace technology and innovative solutions to enhance our service offerings.",
    },
  ];

  const teamMembers = [
    {
      name: "Rajesh Ghimire",
      position: "Founder & CEO",
      experience: "20+ years",
      specialty: "Transportation & Logistics",
      image: "👨‍💼",
    },
    {
      name: "Sita Sharma",
      position: "Operations Director",
      experience: "15+ years",
      specialty: "Fleet Management",
      image: "👩‍💼",
    },
    {
      name: "Kumar Tamang",
      position: "Construction Manager",
      experience: "18+ years",
      specialty: "Heavy Machinery",
      image: "👨‍🔧",
    },
    {
      name: "Anusha Regmi",
      position: "Customer Relations",
      experience: "10+ years",
      specialty: "Client Services",
      image: "👩‍💻",
    },
  ];

  const milestones = [
    {
      year: "2009",
      title: "Company Founded",
      description: "Started with a single bus route serving Lamjung district",
    },
    {
      year: "2012",
      title: "Fleet Expansion",
      description: "Expanded to 25 vehicles covering multiple routes",
    },
    {
      year: "2015",
      title: "Construction Division",
      description: "Launched construction materials and machinery services",
    },
    {
      year: "2018",
      title: "Digital Platform",
      description: "Introduced online booking and tracking systems",
    },
    {
      year: "2020",
      title: "Garage Services",
      description: "Added comprehensive vehicle maintenance services",
    },
    {
      year: "2024",
      title: "Technology Integration",
      description: "Full digital transformation with premium online platform",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-kanxa-blue to-kanxa-navy text-white py-16 sm:py-20">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              About Kanxa Safari
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Pioneering premium transportation, construction, and garage
              services across Nepal with over 15 years of trusted excellence and
              innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-4 sm:p-6">
                  <stat.icon className="h-8 w-8 sm:h-10 sm:w-10 text-kanxa-blue mx-auto mb-3" />
                  <div className="text-2xl sm:text-3xl font-bold text-kanxa-navy mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm sm:text-base text-gray-600">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-12 sm:py-16">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-kanxa-navy mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    Founded in 2009 in the heart of Lamjung, Nepal, Kanxa Safari
                    began as a vision to provide reliable and premium
                    transportation services to connect communities across the
                    beautiful landscapes of Nepal.
                  </p>
                  <p>
                    What started as a single bus route has evolved into a
                    comprehensive service provider offering transportation,
                    construction materials, heavy machinery rental, and
                    professional garage services. Our commitment to excellence
                    and customer satisfaction has made us a trusted name
                    throughout the region.
                  </p>
                  <p>
                    Today, we operate with a modern fleet of over 150 vehicles,
                    serve thousands of customers monthly, and continue to
                    embrace technology to enhance our service delivery while
                    maintaining the personal touch that defines our brand.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-kanxa-light-blue to-kanxa-light-orange rounded-2xl p-8 sm:p-12">
                  <div className="text-center">
                    <div className="text-6xl sm:text-8xl mb-4">🚌</div>
                    <h3 className="text-xl sm:text-2xl font-bold text-kanxa-navy mb-2">
                      Connecting Nepal
                    </h3>
                    <p className="text-gray-600">
                      Bridging distances, building relationships
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-kanxa-navy mb-4">
                Mission & Vision
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Driving our purpose and shaping our future in service excellence
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <Card className="border-2 border-kanxa-blue/20">
                <CardHeader className="text-center">
                  <Target className="h-12 w-12 text-kanxa-blue mx-auto mb-4" />
                  <CardTitle className="text-xl sm:text-2xl text-kanxa-navy">
                    Our Mission
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed text-center">
                    To provide premium, reliable, and innovative transportation,
                    construction, and garage services that exceed customer
                    expectations while contributing to the economic development
                    of Nepal through sustainable business practices.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-kanxa-orange/20">
                <CardHeader className="text-center">
                  <Eye className="h-12 w-12 text-kanxa-orange mx-auto mb-4" />
                  <CardTitle className="text-xl sm:text-2xl text-kanxa-navy">
                    Our Vision
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed text-center">
                    To be Nepal's leading integrated service provider in
                    transportation and construction, recognized for innovation,
                    reliability, and commitment to building stronger communities
                    across the nation.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-12 sm:py-16">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-kanxa-navy mb-4">
                Our Core Values
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                The principles that guide our decisions and define our culture
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <value.icon className="h-12 w-12 text-kanxa-blue mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-kanxa-navy mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-kanxa-navy mb-4">
                Our Services
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Comprehensive solutions across three major service sectors
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-kanxa-light-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <Truck className="h-8 w-8 text-kanxa-blue" />
                  </div>
                  <CardTitle className="text-xl text-kanxa-navy">
                    Transportation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Premium Bus Services
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Cargo Transportation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Custom Tours & Travel
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Online Booking System
                    </li>
                  </ul>
                  <div className="mt-6">
                    <Button asChild className="w-full">
                      <Link to="/transportation">Learn More</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-kanxa-light-orange rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-8 w-8 text-kanxa-orange" />
                  </div>
                  <CardTitle className="text-xl text-kanxa-navy">
                    Construction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Building Materials Supply
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Heavy Machinery Rental
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Equipment Delivery
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Project Consultation
                    </li>
                  </ul>
                  <div className="mt-6">
                    <Button asChild className="w-full" variant="outline">
                      <Link to="/construction">Learn More</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-kanxa-light-green rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wrench className="h-8 w-8 text-kanxa-green" />
                  </div>
                  <CardTitle className="text-xl text-kanxa-navy">
                    Garage Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Vehicle Maintenance
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Tractor Repairs
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Spare Parts Supply
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Expert Technicians
                    </li>
                  </ul>
                  <div className="mt-6">
                    <Button asChild className="w-full" variant="outline">
                      <Link to="/garage">Learn More</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-12 sm:py-16">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-kanxa-navy mb-4">
                Our Journey
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Key milestones in our growth and evolution
              </p>
            </div>

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-4 sm:gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-kanxa-blue rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {milestone.year}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-kanxa-navy mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-kanxa-navy mb-4">
                Leadership Team
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Meet the experienced professionals driving our success
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="text-4xl sm:text-5xl mb-4">
                      {member.image}
                    </div>
                    <h3 className="text-lg font-bold text-kanxa-navy mb-1">
                      {member.name}
                    </h3>
                    <p className="text-kanxa-blue font-medium mb-2">
                      {member.position}
                    </p>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>{member.experience}</p>
                      <Badge variant="secondary" className="text-xs">
                        {member.specialty}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-kanxa-blue to-kanxa-navy text-white">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Ready to Experience Kanxa Safari Services?
            </h2>
            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Join thousands of satisfied customers who trust us for their
              transportation, construction, and garage service needs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                <span>9856056782</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                <span>9856045678</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                <span>kanxasafari1@gmail.com</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-kanxa-blue hover:bg-gray-100"
              >
                <Link to="/booking">Book Now</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-kanxa-blue"
              >
                <Link to="/support">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
