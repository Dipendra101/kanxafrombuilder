import { Link } from "react-router-dom";
import { 
  Phone, 
  Mail, 
  MessageCircle,
  Clock,
  MapPin,
  HelpCircle,
  BookOpen,
  Users,
  Shield,
  AlertCircle,
  CheckCircle,
  Search,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Layout from "@/components/layout/Layout";

export default function Support() {
  const contactMethods = [
    {
      icon: <Phone className="h-8 w-8 text-kanxa-blue" />,
      title: "Call Us",
      description: "Speak directly with our support team",
      info: "+977-XXX-XXXXXX",
      hours: "24/7 Available",
      response: "Immediate"
    },
    {
      icon: <Mail className="h-8 w-8 text-kanxa-orange" />,
      title: "Email Support", 
      description: "Send us your detailed queries",
      info: "support@kanxasafari.com",
      hours: "24/7 Available",
      response: "Within 2 hours"
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-kanxa-green" />,
      title: "Live Chat",
      description: "Chat with our AI assistant",
      info: "Available on website",
      hours: "24/7 Available", 
      response: "Instant"
    }
  ];

  const faqCategories = [
    {
      title: "Bus Booking",
      questions: [
        {
          q: "How can I book a bus ticket?",
          a: "You can book bus tickets online through our website, mobile app, or by calling our booking hotline. Simply select your route, choose your preferred time, select seats, and make payment."
        },
        {
          q: "Can I cancel or modify my booking?",
          a: "Yes, you can cancel or modify bookings up to 2 hours before departure. Cancellation charges may apply based on the timing of cancellation."
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept payments through Khalti, eSewa, bank transfer, and cash at our counters. Online payments are secure and processed instantly."
        },
        {
          q: "Do I need to print my ticket?",
          a: "No, you can show your digital ticket on your phone. However, carrying a printed copy is recommended as backup."
        }
      ]
    },
    {
      title: "Cargo Services",
      questions: [
        {
          q: "How do I calculate cargo charges?",
          a: "Cargo charges are calculated based on weight, volume, distance, and urgency. Use our online calculator or contact us for accurate quotes."
        },
        {
          q: "Is my cargo insured during transport?",
          a: "Yes, all cargo is covered under our comprehensive insurance policy. Additional insurance can be purchased for high-value items."
        },
        {
          q: "What items are prohibited for cargo transport?",
          a: "Prohibited items include hazardous materials, illegal substances, live animals, and perishable goods without proper packaging."
        }
      ]
    },
    {
      title: "Construction Services",
      questions: [
        {
          q: "Do you provide equipment operators?",
          a: "Yes, we provide skilled operators for all our machinery rentals. Operator charges are additional and vary by equipment type."
        },
        {
          q: "What is included in machinery rental?",
          a: "Rental includes insurance, maintenance, basic tools, and delivery within city limits. Fuel and operator services are charged separately."
        },
        {
          q: "How far in advance should I book machinery?",
          a: "We recommend booking at least 3-7 days in advance, especially during peak construction season. Emergency rentals subject to availability."
        }
      ]
    }
  ];

  const supportTeam = [
    {
      name: "Customer Support",
      role: "General Inquiries & Booking",
      phone: "+977-XXX-XXXXXX",
      email: "support@kanxasafari.com",
      hours: "24/7"
    },
    {
      name: "Technical Support", 
      role: "Website & App Issues",
      phone: "+977-XXX-XXXXXX",
      email: "tech@kanxasafari.com", 
      hours: "6 AM - 10 PM"
    },
    {
      name: "Emergency Support",
      role: "Breakdown & Emergency", 
      phone: "+977-XXX-XXXXXX",
      email: "emergency@kanxasafari.com",
      hours: "24/7"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-kanxa-blue to-kanxa-navy text-white py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Help & Support Center
            </h1>
            <p className="text-xl text-white/90 mb-8">
              We're here to help you with all your questions and concerns. Find answers, contact support, or browse our knowledge base.
            </p>
            
            {/* Quick Search */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input 
                  placeholder="Search for help..." 
                  className="pl-10 bg-white text-gray-900"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactMethods.map((method, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    {method.icon}
                  </div>
                  <h3 className="font-semibold text-kanxa-navy mb-2">{method.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                  <p className="font-medium text-kanxa-blue mb-1">{method.info}</p>
                  <p className="text-xs text-gray-500 mb-2">{method.hours}</p>
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    Response: {method.response}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Support Content */}
      <section className="py-16">
        <div className="container">
          <Tabs defaultValue="faq" className="w-full">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-kanxa-navy mb-4">How can we help you?</h2>
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3">
                <TabsTrigger value="faq">FAQs</TabsTrigger>
                <TabsTrigger value="contact">Contact Us</TabsTrigger>
                <TabsTrigger value="guides">Guides</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="faq" className="space-y-8">
              <div className="max-w-4xl mx-auto">
                {faqCategories.map((category, categoryIndex) => (
                  <Card key={categoryIndex} className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-xl text-kanxa-navy">{category.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {category.questions.map((faq, faqIndex) => (
                        <div key={faqIndex} className="border-b border-gray-200 pb-4 last:border-b-0">
                          <h4 className="font-semibold text-kanxa-navy mb-2 flex items-center gap-2">
                            <HelpCircle className="h-4 w-4 text-kanxa-blue" />
                            {faq.q}
                          </h4>
                          <p className="text-gray-600 text-sm pl-6">{faq.a}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-8">
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Contact Form */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Send us a message</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input placeholder="Your name" />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input type="email" placeholder="your.email@example.com" />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input placeholder="+977-XXX-XXXXXX" />
                      </div>
                      
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="booking">Booking Issues</SelectItem>
                            <SelectItem value="payment">Payment Problems</SelectItem>
                            <SelectItem value="technical">Technical Support</SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="message">Message</Label>
                        <Textarea 
                          placeholder="Describe your issue or question in detail..."
                          rows={5}
                        />
                      </div>
                      
                      <Button className="w-full bg-kanxa-blue hover:bg-kanxa-blue/90">
                        Send Message
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Support Team */}
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Our Support Team</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {supportTeam.map((team, index) => (
                          <div key={index} className="p-4 border rounded-lg">
                            <h4 className="font-semibold text-kanxa-navy">{team.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">{team.role}</p>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-kanxa-blue" />
                                <span>{team.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-kanxa-orange" />
                                <span>{team.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-kanxa-green" />
                                <span>{team.hours}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Visit Our Office</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-kanxa-blue mt-0.5" />
                            <div>
                              <p className="font-medium">Main Office</p>
                              <p className="text-sm text-gray-600">Lamjung, Nepal</p>
                              <p className="text-sm text-gray-600">Near Bus Park</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <Clock className="h-5 w-5 text-kanxa-orange mt-0.5" />
                            <div>
                              <p className="font-medium">Office Hours</p>
                              <p className="text-sm text-gray-600">Mon - Fri: 6 AM - 8 PM</p>
                              <p className="text-sm text-gray-600">Sat - Sun: 7 AM - 7 PM</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="guides" className="space-y-8">
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      title: "How to Book Bus Tickets",
                      description: "Step-by-step guide to booking your bus journey",
                      icon: <BookOpen className="h-6 w-6 text-kanxa-blue" />,
                      steps: ["Choose your route", "Select date & time", "Pick your seats", "Make payment"]
                    },
                    {
                      title: "Cargo Booking Process", 
                      description: "Complete guide to cargo transportation services",
                      icon: <BookOpen className="h-6 w-6 text-kanxa-orange" />,
                      steps: ["Get quote online", "Schedule pickup", "Prepare documentation", "Track shipment"]
                    },
                    {
                      title: "Machinery Rental Guide",
                      description: "How to rent construction equipment",
                      icon: <BookOpen className="h-6 w-6 text-kanxa-green" />,
                      steps: ["Browse equipment", "Check availability", "Request quote", "Confirm booking"]
                    },
                    {
                      title: "Payment Methods",
                      description: "All available payment options and procedures",
                      icon: <BookOpen className="h-6 w-6 text-kanxa-blue" />,
                      steps: ["Choose payment method", "Enter details", "Verify transaction", "Get confirmation"]
                    }
                  ].map((guide, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            {guide.icon}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{guide.title}</CardTitle>
                            <p className="text-sm text-gray-600">{guide.description}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {guide.steps.map((step, stepIndex) => (
                            <div key={stepIndex} className="flex items-center gap-3">
                              <div className="w-6 h-6 bg-kanxa-blue rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {stepIndex + 1}
                              </div>
                              <span className="text-sm">{step}</span>
                            </div>
                          ))}
                        </div>
                        <Button variant="outline" className="w-full mt-4">
                          Read Full Guide <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Emergency Support */}
      <section className="py-16 bg-red-50 border-t-4 border-red-500">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-800 mb-4">Emergency Support</h2>
            <p className="text-red-700 mb-6">
              For immediate assistance with breakdowns, accidents, or urgent issues:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-red-600 hover:bg-red-700">
                <Phone className="mr-2 h-5 w-5" />
                Call Emergency: +977-XXX-XXXXXX
              </Button>
              <Button size="lg" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                <MessageCircle className="mr-2 h-5 w-5" />
                Emergency Chat
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-kanxa-navy mb-4">Help Us Improve</h2>
            <p className="text-lg text-gray-600 mb-8">
              Your feedback helps us provide better service to all our customers
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-kanxa-green hover:bg-kanxa-green/90">
                <CheckCircle className="mr-2 h-5 w-5" />
                Leave Feedback
              </Button>
              <Button size="lg" variant="outline">
                <Star className="mr-2 h-5 w-5" />
                Rate Our Service
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
