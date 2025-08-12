import { useState, useEffect } from "react";
import GuestRestriction from "@/components/auth/GuestRestriction";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Calendar,
  Users,
  MapPin,
  Clock,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Star,
  Phone,
  Mail,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { servicesAPI, bookingsAPI } from "@/services/api";

interface ServiceData {
  id: string;
  name: string;
  type: string;
  description: string;
  images: string[];
  pricing: {
    basePrice: number;
    currency: string;
    taxes?: {
      vat: number;
      serviceTax: number;
    };
  };
  rating: {
    average: number;
    count: number;
  };
  busService?: {
    route: {
      from: string;
      to: string;
      duration: string;
    };
    schedule: Array<{
      departureTime: string;
      arrivalTime: string;
    }>;
    vehicle: {
      busType: string;
      totalSeats: number;
      amenities: string[];
    };
  };
}

export default function EnhancedBooking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated, isGuest } = useAuth();
  const { toast } = useToast();

  // Show guest restriction if user is in guest mode
  if (isGuest || !isAuthenticated) {
    return (
      <GuestRestriction
        action="make a booking"
        description="You need to be logged in to make bookings. Create an account to book transportation services, tours, and more."
      />
    );
  }

  const serviceId = searchParams.get('service');
  const serviceType = searchParams.get('type') || 'bus';

  const [service, setService] = useState<ServiceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const [bookingData, setBookingData] = useState({
    // Contact Information
    contactInfo: {
      name: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || '',
      alternatePhone: ''
    },
    
    // Service Details
    serviceDetails: {
      busDetails: {
        route: { from: '', to: '' },
        schedule: { departureTime: '', arrivalTime: '', date: '' },
        passengers: [{
          name: '',
          age: 25,
          gender: 'male' as const,
          seatNumber: ''
        }],
        totalSeats: 1,
        boardingPoint: '',
        droppingPoint: ''
      }
    },
    
    // Payment
    paymentMethod: 'khalti',
    specialRequirements: '',
    notes: ''
  });

  const [pricing, setPricing] = useState({
    baseAmount: 0,
    vatAmount: 0,
    serviceTaxAmount: 0,
    discountAmount: 0,
    totalAmount: 0
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to make a booking",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    if (serviceId) {
      fetchServiceDetails();
    } else {
      toast({
        title: "Service Not Found",
        description: "Please select a service to book",
        variant: "destructive"
      });
      navigate('/transportation');
    }
  }, [serviceId, isAuthenticated]);

  const fetchServiceDetails = async () => {
    try {
      setIsLoading(true);
      const response = await servicesAPI.getServiceById(serviceId!);
      
      if (response.success) {
        setService(response.service);
        
        // Initialize booking data with service details
        if (response.service.busService) {
          setBookingData(prev => ({
            ...prev,
            serviceDetails: {
              busDetails: {
                ...prev.serviceDetails.busDetails,
                route: response.service.busService.route,
                schedule: {
                  ...prev.serviceDetails.busDetails.schedule,
                  departureTime: response.service.busService.schedule[0]?.departureTime || '',
                  arrivalTime: response.service.busService.schedule[0]?.arrivalTime || ''
                }
              }
            }
          }));
        }
        
        calculatePricing(response.service, 1);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch service details",
        variant: "destructive"
      });
      navigate('/transportation');
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePricing = (serviceData: ServiceData, passengers: number = 1) => {
    const baseAmount = serviceData.pricing.basePrice * passengers;
    const vatRate = serviceData.pricing.taxes?.vat || 13;
    const serviceTaxRate = serviceData.pricing.taxes?.serviceTax || 0;
    
    const vatAmount = (baseAmount * vatRate) / 100;
    const serviceTaxAmount = (baseAmount * serviceTaxRate) / 100;
    const totalAmount = baseAmount + vatAmount + serviceTaxAmount;

    setPricing({
      baseAmount,
      vatAmount,
      serviceTaxAmount,
      discountAmount: 0,
      totalAmount
    });
  };

  const handleInputChange = (field: string, value: any) => {
    const keys = field.split('.');
    setBookingData(prev => {
      const updated = { ...prev };
      let current: any = updated;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const addPassenger = () => {
    const newPassenger = {
      name: '',
      age: 25,
      gender: 'male' as const,
      seatNumber: ''
    };
    
    setBookingData(prev => ({
      ...prev,
      serviceDetails: {
        busDetails: {
          ...prev.serviceDetails.busDetails,
          passengers: [...prev.serviceDetails.busDetails.passengers, newPassenger],
          totalSeats: prev.serviceDetails.busDetails.passengers.length + 1
        }
      }
    }));

    if (service) {
      calculatePricing(service, bookingData.serviceDetails.busDetails.passengers.length + 1);
    }
  };

  const removePassenger = (index: number) => {
    if (bookingData.serviceDetails.busDetails.passengers.length <= 1) return;
    
    setBookingData(prev => ({
      ...prev,
      serviceDetails: {
        busDetails: {
          ...prev.serviceDetails.busDetails,
          passengers: prev.serviceDetails.busDetails.passengers.filter((_, i) => i !== index),
          totalSeats: prev.serviceDetails.busDetails.passengers.length - 1
        }
      }
    }));

    if (service) {
      calculatePricing(service, bookingData.serviceDetails.busDetails.passengers.length - 1);
    }
  };

  const handleSubmitBooking = async () => {
    try {
      setIsSubmitting(true);

      // Validate required fields
      if (!bookingData.contactInfo.name || !bookingData.contactInfo.phone || !bookingData.contactInfo.email) {
        toast({
          title: "Missing Information",
          description: "Please fill in all contact information",
          variant: "destructive"
        });
        return;
      }

      if (!bookingData.serviceDetails.busDetails.schedule.date) {
        toast({
          title: "Missing Information",
          description: "Please select a travel date",
          variant: "destructive"
        });
        return;
      }

      // Prepare booking payload
      const bookingPayload = {
        service: serviceId,
        type: serviceType,
        serviceDetails: bookingData.serviceDetails,
        contactInfo: bookingData.contactInfo,
        pricing,
        specialRequirements: bookingData.specialRequirements ? [bookingData.specialRequirements] : [],
        notes: bookingData.notes
      };

      const response = await bookingsAPI.createBooking(bookingPayload);

      if (response.success) {
        toast({
          title: "Booking Created Successfully! 🎉",
          description: `Your booking ${response.booking.bookingNumber} has been created. Proceed to payment.`,
        });

        // Move to payment step
        setStep(3);
      }
    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to create booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayment = async (method: string) => {
    try {
      setIsSubmitting(true);

      // Mock payment processing
      const paymentResponse = await fetch(`/api/payments/${method}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: pricing.totalAmount,
          bookingId: serviceId
        })
      });

      const result = await paymentResponse.json();

      if (result.success) {
        toast({
          title: "Payment Successful! 🎉",
          description: "Your booking has been confirmed. You will receive a confirmation email shortly.",
        });

        // Redirect to booking confirmation or user bookings
        setTimeout(() => {
          navigate('/bookings');
        }, 2000);
      } else {
        throw new Error(result.message || 'Payment failed');
      }
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "Payment processing failed. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading service details...</p>
        </div>
      </Layout>
    );
  }

  if (!service) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
          <p className="text-gray-600 mb-8">The requested service could not be found.</p>
          <Button onClick={() => navigate('/transportation')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-kanxa-navy">Complete Your Booking</h1>
            <p className="text-gray-600">Step {step} of 3</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {step === 1 && (
              <>
                {/* Service Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Service Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start space-x-4">
                      {service.images?.[0] && (
                        <img
                          src={service.images[0]}
                          alt={service.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{service.name}</h3>
                        <p className="text-gray-600 mb-2">{service.description}</p>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span className="text-sm">{service.rating.average} ({service.rating.count} reviews)</span>
                          </div>
                          {service.busService && (
                            <Badge variant="outline">
                              {service.busService.route.from} → {service.busService.route.to}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Travel Details */}
                {service.type === 'bus' && service.busService && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Travel Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="date">Travel Date</Label>
                          <Input
                            type="date"
                            value={bookingData.serviceDetails.busDetails.schedule.date}
                            onChange={(e) => handleInputChange('serviceDetails.busDetails.schedule.date', e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div>
                          <Label htmlFor="time">Departure Time</Label>
                          <Select
                            value={bookingData.serviceDetails.busDetails.schedule.departureTime}
                            onValueChange={(value) => handleInputChange('serviceDetails.busDetails.schedule.departureTime', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                              {service.busService.schedule.map((schedule, index) => (
                                <SelectItem key={index} value={schedule.departureTime}>
                                  {schedule.departureTime} - {schedule.arrivalTime}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="boarding">Boarding Point</Label>
                          <Input
                            placeholder="Enter boarding point"
                            value={bookingData.serviceDetails.busDetails.boardingPoint}
                            onChange={(e) => handleInputChange('serviceDetails.busDetails.boardingPoint', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="dropping">Dropping Point</Label>
                          <Input
                            placeholder="Enter dropping point"
                            value={bookingData.serviceDetails.busDetails.droppingPoint}
                            onChange={(e) => handleInputChange('serviceDetails.busDetails.droppingPoint', e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Passenger Details */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Passenger Details</CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addPassenger}
                        disabled={bookingData.serviceDetails.busDetails.passengers.length >= 6}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Add Passenger
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {bookingData.serviceDetails.busDetails.passengers.map((passenger, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">Passenger {index + 1}</h4>
                          {bookingData.serviceDetails.busDetails.passengers.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removePassenger(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label>Full Name</Label>
                            <Input
                              placeholder="Enter full name"
                              value={passenger.name}
                              onChange={(e) => {
                                const updated = [...bookingData.serviceDetails.busDetails.passengers];
                                updated[index].name = e.target.value;
                                handleInputChange('serviceDetails.busDetails.passengers', updated);
                              }}
                            />
                          </div>
                          <div>
                            <Label>Age</Label>
                            <Input
                              type="number"
                              placeholder="Age"
                              value={passenger.age}
                              onChange={(e) => {
                                const updated = [...bookingData.serviceDetails.busDetails.passengers];
                                updated[index].age = parseInt(e.target.value) || 0;
                                handleInputChange('serviceDetails.busDetails.passengers', updated);
                              }}
                            />
                          </div>
                          <div>
                            <Label>Gender</Label>
                            <Select
                              value={passenger.gender}
                              onValueChange={(value: 'male' | 'female' | 'other') => {
                                const updated = [...bookingData.serviceDetails.busDetails.passengers];
                                updated[index].gender = value;
                                handleInputChange('serviceDetails.busDetails.passengers', updated);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button
                    onClick={() => setStep(2)}
                    className="bg-kanxa-blue hover:bg-kanxa-blue/90"
                  >
                    Continue
                  </Button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          value={bookingData.contactInfo.name}
                          onChange={(e) => handleInputChange('contactInfo.name', e.target.value)}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          type="email"
                          value={bookingData.contactInfo.email}
                          onChange={(e) => handleInputChange('contactInfo.email', e.target.value)}
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          value={bookingData.contactInfo.phone}
                          onChange={(e) => handleInputChange('contactInfo.phone', e.target.value)}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="altPhone">Alternate Phone (Optional)</Label>
                        <Input
                          value={bookingData.contactInfo.alternatePhone}
                          onChange={(e) => handleInputChange('contactInfo.alternatePhone', e.target.value)}
                          placeholder="Enter alternate phone"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Special Requirements */}
                <Card>
                  <CardHeader>
                    <CardTitle>Special Requirements</CardTitle>
                    <CardDescription>Any specific needs or requests for your journey</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Enter any special requirements or notes..."
                      value={bookingData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      className="min-h-[100px]"
                    />
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Previous
                  </Button>
                  <Button
                    onClick={handleSubmitBooking}
                    disabled={isSubmitting}
                    className="bg-kanxa-green hover:bg-kanxa-green/90"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    Create Booking
                  </Button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                {/* Payment Methods */}
                <Card>
                  <CardHeader>
                    <CardTitle>Choose Payment Method</CardTitle>
                    <CardDescription>Select your preferred payment option</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        className="h-20 flex flex-col"
                        onClick={() => handlePayment('khalti')}
                        disabled={isSubmitting}
                      >
                        <CreditCard className="w-6 h-6 mb-2 text-purple-600" />
                        <span>Khalti</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-20 flex flex-col"
                        onClick={() => handlePayment('esewa')}
                        disabled={isSubmitting}
                      >
                        <CreditCard className="w-6 h-6 mb-2 text-green-600" />
                        <span>eSewa</span>
                      </Button>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        Your payment is secured with 256-bit SSL encryption
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Service</span>
                    <span className="font-medium">{service.name}</span>
                  </div>
                  {service.busService && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span>Route</span>
                        <span>{service.busService.route.from} → {service.busService.route.to}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Passengers</span>
                        <span>{bookingData.serviceDetails.busDetails.totalSeats}</span>
                      </div>
                    </>
                  )}
                  {bookingData.serviceDetails.busDetails.schedule.date && (
                    <div className="flex justify-between text-sm">
                      <span>Travel Date</span>
                      <span>{new Date(bookingData.serviceDetails.busDetails.schedule.date).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Base Amount</span>
                    <span>NPR {pricing.baseAmount.toLocaleString()}</span>
                  </div>
                  {pricing.vatAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>VAT (13%)</span>
                      <span>NPR {pricing.vatAmount.toLocaleString()}</span>
                    </div>
                  )}
                  {pricing.serviceTaxAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Service Tax</span>
                      <span>NPR {pricing.serviceTaxAmount.toLocaleString()}</span>
                    </div>
                  )}
                  {pricing.discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-NPR {pricing.discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total Amount</span>
                  <span className="text-kanxa-orange">NPR {pricing.totalAmount.toLocaleString()}</span>
                </div>

                <div className="text-xs text-gray-600 mt-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Free cancellation up to 2 hours before departure</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span>24/7 customer support: 9856056782</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
