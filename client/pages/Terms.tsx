import {
  FileText,
  AlertCircle,
  Shield,
  Scale,
  Users,
  Truck,
  Settings,
  MapPin,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Layout from "@/components/layout/Layout";

export default function Terms() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-kanxa-navy to-kanxa-blue text-white py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <FileText className="h-16 w-16 mx-auto mb-6 text-kanxa-orange" />
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-white/90 mb-4">
              Important terms and conditions for using Kanxa Safari services
            </p>
            <p className="text-white/80">Last updated: January 2024</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <Alert className="mb-8">
              <Scale className="h-4 w-4" />
              <AlertDescription>
                By accessing or using Kanxa Safari's services, you agree to be
                bound by these Terms of Service. Please read these terms
                carefully before using our transportation, construction, and
                machinery services.
              </AlertDescription>
            </Alert>

            <div className="space-y-8">
              {/* Acceptance of Terms */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-6 w-6 text-kanxa-blue" />
                    Acceptance of Terms
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm">
                    These Terms of Service ("Terms") constitute a legal
                    agreement between you ("Customer", "User") and Kanxa Safari
                    ("Company", "We", "Us", "Our") regarding the use of our
                    services including:
                  </p>

                  <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                    <li>Transportation services (bus, cargo, custom tours)</li>
                    <li>Construction materials supply</li>
                    <li>Machinery and equipment rental</li>
                    <li>Garage and workshop services</li>
                    <li>Online booking and payment platforms</li>
                    <li>Customer support and related services</li>
                  </ul>

                  <p className="text-gray-600 text-sm">
                    By creating an account, making a booking, or using any of
                    our services, you acknowledge that you have read,
                    understood, and agree to be bound by these Terms and our
                    Privacy Policy.
                  </p>
                </CardContent>
              </Card>

              {/* Service Descriptions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-6 w-6 text-kanxa-orange" />
                    Service Descriptions & Availability
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-kanxa-navy mb-2">
                      Transportation Services
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                      <li>
                        Regular bus services on scheduled routes with published
                        timetables
                      </li>
                      <li>
                        Cargo transportation with weight and size limitations as
                        specified
                      </li>
                      <li>
                        Custom tour packages subject to availability and weather
                        conditions
                      </li>
                      <li>
                        All transportation services subject to traffic, weather,
                        and road conditions
                      </li>
                      <li>
                        Schedule changes may occur due to circumstances beyond
                        our control
                      </li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-kanxa-navy mb-2">
                      Construction Services
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                      <li>
                        Supply of construction materials as per specifications
                        and availability
                      </li>
                      <li>
                        Machinery rental with trained operators (where
                        specified)
                      </li>
                      <li>
                        Equipment subject to maintenance schedules and safety
                        inspections
                      </li>
                      <li>
                        Delivery within specified areas subject to road
                        accessibility
                      </li>
                      <li>
                        Material quality guarantees as per industry standards
                      </li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-kanxa-navy mb-2">
                      Workshop Services
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                      <li>
                        Professional maintenance and repair services for
                        vehicles and machinery
                      </li>
                      <li>
                        Use of genuine or quality-approved replacement parts
                      </li>
                      <li>
                        Service warranties as specified for each type of work
                      </li>
                      <li>
                        Emergency breakdown services subject to technician
                        availability
                      </li>
                      <li>
                        Diagnostic services using modern equipment and certified
                        procedures
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Booking and Payment Terms */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-kanxa-green" />
                    Booking, Payment & Cancellation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-kanxa-navy mb-2">
                      Booking Policies
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                      <li>
                        All bookings require valid identification and contact
                        information
                      </li>
                      <li>
                        Confirmation is subject to availability at the time of
                        booking
                      </li>
                      <li>
                        Group bookings may require advance notice and special
                        arrangements
                      </li>
                      <li>
                        Peak season bookings subject to higher demand and
                        pricing
                      </li>
                      <li>
                        Special requests accommodated based on feasibility and
                        additional charges
                      </li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-kanxa-navy mb-2">
                      Payment Terms
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                      <li>
                        Payment required in full at time of booking for most
                        services
                      </li>
                      <li>
                        Accepted payment methods: Khalti, eSewa, bank transfer,
                        cash
                      </li>
                      <li>
                        Large orders may require deposit with balance due on
                        delivery
                      </li>
                      <li>
                        All prices subject to applicable taxes and service
                        charges
                      </li>
                      <li>
                        Foreign currency payments converted at prevailing
                        exchange rates
                      </li>
                      <li>
                        Payment receipts provided digitally and/or in print
                        format
                      </li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-kanxa-navy mb-2">
                      Cancellation & Refund Policy
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-kanxa-blue mb-2">
                          Transportation Services:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1 text-xs">
                          <li>
                            Free cancellation up to 2 hours before departure
                          </li>
                          <li>50% refund for cancellations within 2 hours</li>
                          <li>No refund for no-shows or missed departures</li>
                          <li>
                            Weather-related cancellations: full refund or
                            rescheduling
                          </li>
                        </ul>
                      </div>

                      <div>
                        <p className="font-medium text-kanxa-orange mb-2">
                          Equipment & Materials:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1 text-xs">
                          <li>24-hour notice required for cancellation</li>
                          <li>Delivered items: return in original condition</li>
                          <li>Custom orders may have restocking fees</li>
                          <li>
                            Emergency cancellations evaluated case-by-case
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* User Responsibilities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-6 w-6 text-kanxa-blue" />
                    User Responsibilities & Conduct
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-kanxa-navy mb-2">
                      General Conduct
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                      <li>
                        Provide accurate and truthful information in all
                        transactions
                      </li>
                      <li>
                        Treat staff, other customers, and property with respect
                      </li>
                      <li>
                        Follow all safety guidelines and instructions provided
                      </li>
                      <li>
                        Report any issues or concerns promptly to our staff
                      </li>
                      <li>
                        Comply with all applicable local laws and regulations
                      </li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-kanxa-navy mb-2">
                      Equipment and Property Use
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                      <li>Use rented equipment only for intended purposes</li>
                      <li>
                        Maintain equipment in good condition during rental
                        period
                      </li>
                      <li>Report damage or malfunctions immediately</li>
                      <li>Return equipment clean and in original condition</li>
                      <li>
                        Allow authorized inspections of equipment and facilities
                      </li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-kanxa-navy mb-2">
                      Prohibited Activities
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                      <li>Transportation of illegal or hazardous materials</li>
                      <li>Unauthorized use of equipment or facilities</li>
                      <li>Interference with business operations</li>
                      <li>Fraudulent bookings or payment attempts</li>
                      <li>Harassment of staff or other customers</li>
                      <li>Damage to property or equipment</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Liability and Insurance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-kanxa-green" />
                    Liability, Insurance & Risk Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-kanxa-navy mb-2">
                      Our Insurance Coverage
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                      <li>
                        Comprehensive vehicle insurance for all transportation
                        services
                      </li>
                      <li>Equipment insurance covering machinery and tools</li>
                      <li>
                        Public liability insurance for business operations
                      </li>
                      <li>Professional indemnity for technical services</li>
                      <li>
                        Cargo insurance for goods in transit (terms apply)
                      </li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-kanxa-navy mb-2">
                      Limitation of Liability
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                      <li>
                        Liability limited to the value of services purchased
                      </li>
                      <li>
                        No liability for indirect, consequential, or punitive
                        damages
                      </li>
                      <li>
                        Force majeure events (natural disasters, strikes) exempt
                        from liability
                      </li>
                      <li>
                        Customer responsible for ensuring adequate personal
                        insurance
                      </li>
                      <li>
                        Time limits apply for filing claims and complaints
                      </li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-kanxa-navy mb-2">
                      Customer Responsibilities
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                      <li>
                        Disclose any medical conditions affecting service use
                      </li>
                      <li>
                        Ensure personal insurance for high-risk activities
                      </li>
                      <li>Report incidents and accidents immediately</li>
                      <li>Cooperate with insurance investigations</li>
                      <li>
                        Maintain own insurance for valuable personal items
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Service Modifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-6 w-6 text-kanxa-orange" />
                    Service Modifications & Disruptions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-kanxa-navy mb-2">
                      Scheduled Changes
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                      <li>
                        Advance notice provided for planned service
                        modifications
                      </li>
                      <li>Alternative arrangements offered where possible</li>
                      <li>
                        Seasonal schedule adjustments with public notification
                      </li>
                      <li>
                        Route changes due to road construction or maintenance
                      </li>
                      <li>
                        Equipment upgrades may affect service availability
                      </li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-kanxa-navy mb-2">
                      Emergency Disruptions
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                      <li>Weather-related service suspensions for safety</li>
                      <li>Mechanical breakdowns handled with backup systems</li>
                      <li>
                        Strike or labor disputes may affect service delivery
                      </li>
                      <li>Government restrictions or emergency orders</li>
                      <li>Natural disasters and acts of God</li>
                    </ul>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      In case of service disruptions, customers will be notified
                      via SMS, email, or phone. Refunds or rescheduling options
                      will be provided based on the circumstances.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Dispute Resolution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-6 w-6 text-kanxa-blue" />
                    Dispute Resolution & Governing Law
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-kanxa-navy mb-2">
                      Complaint Process
                    </h4>
                    <ol className="list-decimal list-inside text-gray-600 space-y-1 text-sm">
                      <li>Contact our customer service team first</li>
                      <li>
                        Formal written complaint within 30 days of incident
                      </li>
                      <li>
                        Internal review and response within 14 business days
                      </li>
                      <li>Escalation to management if unsatisfied</li>
                      <li>External mediation if internal resolution fails</li>
                    </ol>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-kanxa-navy mb-2">
                      Legal Framework
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                      <li>Governed by the laws of Nepal</li>
                      <li>Jurisdiction: Courts of Lamjung District</li>
                      <li>Arbitration preferred for commercial disputes</li>
                      <li>Consumer protection laws apply where applicable</li>
                      <li>
                        International conventions for cross-border services
                      </li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-kanxa-navy mb-2">
                      Limitation Periods
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                      <li>Service complaints: 30 days from service date</li>
                      <li>Payment disputes: 90 days from transaction</li>
                      <li>Property damage claims: 7 days from incident</li>
                      <li>Personal injury claims: As per applicable law</li>
                      <li>Contract disputes: 1 year from breach</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Privacy and Data Protection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-kanxa-green" />
                    Privacy & Data Protection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm">
                    Your privacy and data security are governed by our
                    comprehensive Privacy Policy, which forms an integral part
                    of these Terms of Service. Key principles include:
                  </p>

                  <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                    <li>
                      Data collection limited to service provision requirements
                    </li>
                    <li>
                      Secure storage and transmission of personal information
                    </li>
                    <li>
                      No sharing with third parties without consent (except
                      legal requirements)
                    </li>
                    <li>Right to access, correct, and delete personal data</li>
                    <li>Notification of data breaches within 72 hours</li>
                    <li>Regular security audits and updates</li>
                  </ul>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      For detailed information about data handling, please
                      review our Privacy Policy. Questions about data protection
                      can be directed to privacy@kanxasafari.com
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Termination */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-6 w-6 text-kanxa-orange" />
                    Account Termination & Service Suspension
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-kanxa-navy mb-2">
                      Grounds for Termination
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                      <li>Violation of these Terms of Service</li>
                      <li>Fraudulent or illegal activities</li>
                      <li>Non-payment of outstanding amounts</li>
                      <li>Misuse of equipment or facilities</li>
                      <li>Harassment or abuse of staff or customers</li>
                      <li>Providing false information</li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-kanxa-navy mb-2">
                      Termination Process
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                      <li>Warning issued for minor violations</li>
                      <li>Immediate suspension for serious breaches</li>
                      <li>Opportunity to respond and remedy issues</li>
                      <li>Permanent termination for repeat offenses</li>
                      <li>Refund of unused services (terms apply)</li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-kanxa-navy mb-2">
                      Customer-Initiated Termination
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                      <li>Account closure available at any time</li>
                      <li>Outstanding obligations must be fulfilled</li>
                      <li>
                        Data deletion upon request (legal retention excepted)
                      </li>
                      <li>Refunds subject to cancellation policies</li>
                      <li>Re-registration permitted after account closure</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Updates and Modifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Terms Updates & Modifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">
                    We reserve the right to modify these Terms of Service at any
                    time to reflect changes in our services, legal requirements,
                    or business practices. Updates will be communicated through:
                  </p>

                  <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm mb-4">
                    <li>Email notification to registered users</li>
                    <li>Prominent notice on our website and app</li>
                    <li>SMS alerts for significant changes</li>
                    <li>Notice at service locations</li>
                  </ul>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-kanxa-navy mb-2">
                        Effective Date
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Changes become effective 30 days after notification
                        unless otherwise specified. Continued use constitutes
                        acceptance of updated terms.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-kanxa-navy mb-2">
                        Version Control
                      </h4>
                      <p className="text-gray-600 text-sm">
                        All versions are archived and available upon request.
                        The current version always supersedes previous versions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="bg-kanxa-light-blue">
                <CardHeader>
                  <CardTitle className="text-kanxa-navy">
                    Questions About These Terms?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">
                    If you have questions about these Terms of Service, please
                    contact our legal team:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-kanxa-navy">
                        Legal Department
                      </p>
                      <p>Email: legal@kanxasafari.com</p>
                      <p>Phone: +977-XXX-XXXXXX</p>
                    </div>

                    <div>
                      <p className="font-medium text-kanxa-navy">
                        Mailing Address
                      </p>
                      <p>Kanxa Safari Pvt. Ltd.</p>
                      <p>Lamjung, Nepal</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
