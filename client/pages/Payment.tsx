import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Truck, Bus, Route, Package, MapPin, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Layout from "@/components/layout/Layout";
import { PaymentOptions } from "@/components/ui/payment-options";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface ServiceDetails {
  id: string;
  type: string;
  name: string;
  amount: number;
  description: string;
  icon: JSX.Element;
  seatNumbers?: string[];
  vehiclePlate?: string;
  route?: string;
}

// Generate Nepalese vehicle plate number
const generateVehiclePlate = (serviceType: string, serviceId: string) => {
  const provinces = [
    "BAGMATI",
    "KOSHI",
    "GANDAKI",
    "LUMBINI",
    "KARNALI",
    "SUDURPASHCHIM",
    "MADHESH",
  ];
  const letters = ["GA", "KA", "BA", "JA", "NA", "PA", "RA", "LA", "SA", "HA"];

  const province = provinces[Math.floor(Math.random() * provinces.length)];
  const letterCode = letters[Math.floor(Math.random() * letters.length)];
  const numbers = String(parseInt(serviceId) * 123 + 1000).slice(-4); // Generate consistent number based on service ID

  return `${province} ${letterCode} ${numbers}`;
};

export default function Payment() {
  const { isAuthenticated, isGuest } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [serviceDetails, setServiceDetails] = useState<ServiceDetails | null>(
    null,
  );

  // Redirect guests to login page with return URL
  useEffect(() => {
    if (!isAuthenticated || isGuest) {
      const currentUrl = window.location.pathname + window.location.search;
      navigate(`/login?returnUrl=${encodeURIComponent(currentUrl)}`);
      return;
    }
  }, [isAuthenticated, isGuest, navigate]);

  useEffect(() => {
    const serviceId = searchParams.get("service");
    const serviceType = searchParams.get("type");
    const amount = parseFloat(searchParams.get("amount") || "0");
    const customServiceName = searchParams.get("serviceName");
    const seatNumbers = searchParams.get("seats")?.split(",") || [];

    if (!serviceId || !serviceType || !amount) {
      toast({
        title: "Invalid Payment Request",
        description: "Missing payment information. Redirecting...",
        variant: "destructive",
      });
      navigate("/transportation");
      return;
    }

    // Mock service details based on type and ID
    let details: ServiceDetails;

    switch (serviceType) {
      case "cargo":
        details = {
          id: serviceId,
          type: "Cargo Service",
          name: getCargoServiceName(serviceId),
          amount,
          description: "Professional cargo transportation service",
          icon: <Truck className="w-6 h-6 text-kanxa-orange" />,
          vehiclePlate: generateVehiclePlate("cargo", serviceId),
        };
        break;
      case "bus":
        details = {
          id: serviceId,
          type: "Bus Ticket",
          name: customServiceName || getBusServiceName(serviceId),
          amount,
          description: "Comfortable bus transportation",
          icon: <Bus className="w-6 h-6 text-kanxa-blue" />,
          seatNumbers: seatNumbers.length > 0 ? seatNumbers : undefined,
          vehiclePlate: generateVehiclePlate("bus", serviceId),
          route: getRouteFromServiceName(
            customServiceName || getBusServiceName(serviceId),
          ),
        };
        break;
      case "tour":
        details = {
          id: serviceId,
          type: "Tour Package",
          name: getTourServiceName(serviceId),
          amount,
          description: "Custom tour transportation",
          icon: <Route className="w-6 h-6 text-kanxa-green" />,
        };
        break;
      default:
        details = {
          id: serviceId,
          type: "Service",
          name: "Transportation Service",
          amount,
          description: "General transportation service",
          icon: <Package className="w-6 h-6 text-kanxa-navy" />,
        };
    }

    setServiceDetails(details);
  }, [searchParams, navigate, toast]);

  const getCargoServiceName = (id: string) => {
    const cargoNames: { [key: string]: string } = {
      "1": "Heavy Truck - 10 tons",
      "2": "Medium Truck - 5 tons",
      "3": "Light Truck - 2 tons",
    };
    return cargoNames[id] || "Cargo Service";
  };

  const getBusServiceName = (id: string) => {
    const busNames: { [key: string]: string } = {
      "1": "Kathmandu Express - Deluxe AC",
      "2": "Pokhara Express - Standard",
    };
    return busNames[id] || "Bus Service";
  };

  const getTourServiceName = (id: string) => {
    return `Custom Tour Package #${id}`;
  };

  const getRouteFromServiceName = (serviceName: string) => {
    // Extract route information from service name or use defaults
    if (serviceName.includes("Kathmandu")) {
      return "Lamjung → Kathmandu";
    } else if (serviceName.includes("Pokhara")) {
      return "Lamjung → Pokhara";
    }
    return "Lamjung → Kathmandu"; // default route
  };

  const handlePaymentComplete = (method: string) => {
    // Generate unique transaction ID
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    toast({
      title: "Initiating Payment...",
      description: `Connecting to ${method} payment gateway...`,
    });

    // Store payment details for after redirect
    localStorage.setItem(
      "paymentDetails",
      JSON.stringify({
        serviceId: serviceDetails?.id,
        serviceName: serviceDetails?.name,
        amount: serviceDetails?.amount,
        method: method,
        transactionId: transactionId,
        timestamp: Date.now(),
      }),
    );
  };

  if (!serviceDetails) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kanxa-blue"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-to-br from-kanxa-navy to-kanxa-blue text-white py-12">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20 mb-4"
              onClick={() => {
                const serviceType = searchParams.get("type");
                if (serviceType === "bus") {
                  navigate("/transportation");
                } else if (serviceType === "cargo") {
                  navigate("/transportation");
                } else if (serviceType === "tour") {
                  navigate("/transportation");
                } else {
                  navigate("/transportation");
                }
              }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Services
            </Button>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              Complete Your Payment
            </h1>
            <p className="text-xl text-white/90">
              Secure payment processing for your transportation service
            </p>
          </div>
        </div>
      </section>

      {/* Payment Section */}
      <section className="py-12 bg-gray-50">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Service Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {serviceDetails.icon}
                      Order Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{serviceDetails.type}</Badge>
                      </div>
                      <h3 className="font-semibold text-lg text-kanxa-navy">
                        {serviceDetails.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {serviceDetails.description}
                      </p>

                      {/* Transportation service details */}
                      {(serviceDetails.type === "Bus Ticket" ||
                        serviceDetails.type === "Cargo Service") && (
                        <div className="mt-3 space-y-2">
                          {serviceDetails.route && (
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-gray-600" />
                              <span className="text-gray-600">Route:</span>
                              <span className="font-medium text-kanxa-blue">
                                {serviceDetails.route}
                              </span>
                            </div>
                          )}

                          {serviceDetails.type === "Bus Ticket" &&
                            serviceDetails.seatNumbers &&
                            serviceDetails.seatNumbers.length > 0 && (
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-gray-600">
                                  Seat Numbers:
                                </span>
                                <div className="flex gap-1">
                                  {serviceDetails.seatNumbers.map(
                                    (seat, index) => (
                                      <Badge
                                        key={index}
                                        variant="outline"
                                        className="text-xs bg-kanxa-light-blue text-kanxa-navy"
                                      >
                                        {seat}
                                      </Badge>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}

                          {serviceDetails.type === "Cargo Service" && (
                            <div className="flex items-center gap-2 text-sm">
                              <Truck className="w-4 h-4 text-gray-600" />
                              <span className="text-gray-600">Capacity:</span>
                              <span className="font-medium text-kanxa-orange">
                                {serviceDetails.name.includes("Heavy")
                                  ? "10 tons"
                                  : serviceDetails.name.includes("Medium")
                                    ? "5 tons"
                                    : "2 tons"}
                              </span>
                            </div>
                          )}

                          {serviceDetails.vehiclePlate && (
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-gray-600">
                                Vehicle Plate:
                              </span>
                              <div className="bg-white border-2 border-gray-800 px-3 py-2 rounded-md shadow-sm">
                                <div className="text-center">
                                  <div className="text-[8px] font-bold text-gray-700 leading-none mb-1">
                                    {serviceDetails.vehiclePlate.split(" ")[0]}
                                  </div>
                                  <div className="text-sm font-bold text-gray-900 tracking-widest font-mono">
                                    {serviceDetails.vehiclePlate
                                      .split(" ")
                                      .slice(1)
                                      .join(" ")}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Service Fee:</span>
                        <span>Rs {serviceDetails.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Processing Fee:</span>
                        <span>Rs 0</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total Amount:</span>
                        <span className="text-kanxa-navy">
                          Rs {serviceDetails.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-green-800 font-medium">
                        ✓ No hidden charges
                      </p>
                      <p className="text-sm text-green-700">
                        ✓ Instant booking confirmation
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Payment Options */}
              <div className="lg:col-span-2">
                <PaymentOptions
                  amount={serviceDetails.amount}
                  service={serviceDetails.name}
                  serviceId={serviceDetails.id}
                  onPaymentSelect={handlePaymentComplete}
                  className="h-fit"
                />

                {/* Additional Information */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium text-kanxa-navy mb-2">
                          Khalti Payment
                        </h4>
                        <ul className="text-gray-600 space-y-1">
                          <li>• Digital wallet payment</li>
                          <li>• Instant transaction</li>
                          <li>• Mobile banking support</li>
                          <li>• QR code payment</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-kanxa-navy mb-2">
                          eSewa Payment
                        </h4>
                        <ul className="text-gray-600 space-y-1">
                          <li>• Secure digital payment</li>
                          <li>• Bank account linking</li>
                          <li>• Real-time confirmation</li>
                          <li>• 24/7 availability</li>
                        </ul>
                      </div>
                    </div>

                    <Separator />

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">
                        Test Environment Notice
                      </h4>
                      <ul className="text-blue-800 text-sm space-y-1">
                        <li>• Currently using test payment gateways</li>
                        <li>
                          • Use Khalti test phone: 9800000000, OTP: 123456
                        </li>
                        <li>• eSewa test: any amount works in test mode</li>
                        <li>• No real money will be charged</li>
                        <li>
                          • Customer support available 24/7 for payment issues
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
