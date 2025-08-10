import {
  Shield,
  Eye,
  Lock,
  Users,
  Database,
  Globe,
  Mail,
  Phone,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Layout from "@/components/layout/Layout";

export default function Privacy() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-kanxa-navy to-kanxa-blue text-white py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="h-16 w-16 mx-auto mb-6 text-kanxa-orange" />
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-white/90 mb-4">
              Your privacy and data security are our top priorities
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
              <Shield className="h-4 w-4" />
              <AlertDescription>
                At Kanxa Safari, we are committed to protecting your privacy and
                ensuring the security of your personal information. This Privacy
                Policy explains how we collect, use, store, and protect your
                data when you use our services.
              </AlertDescription>
            </Alert>

            <div className="space-y-8">
              {/* Information We Collect */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-6 w-6 text-kanxa-blue" />
                    Information We Collect
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-kanxa-navy mb-2">
                      Personal Information
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                      <li>Name, email address, phone number</li>
                      <li>Physical address for delivery services</li>
                      <li>
                        Payment information (processed securely through
                        third-party providers)
                      </li>
                      <li>Government-issued ID for certain services</li>
                      <li>Emergency contact information</li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-kanxa-navy mb-2">
                      Service Information
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                      <li>Booking details and travel preferences</li>
                      <li>Vehicle and equipment rental information</li>
                      <li>Service history and usage patterns</li>
                      <li>Communication preferences</li>
                      <li>Feedback and reviews</li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-kanxa-navy mb-2">
                      Technical Information
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                      <li>IP address and device information</li>
                      <li>Browser type and version</li>
                      <li>Website usage analytics</li>
                      <li>Cookies and similar tracking technologies</li>
                      <li>Location data (when explicitly permitted)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* How We Use Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-6 w-6 text-kanxa-orange" />
                    How We Use Your Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-kanxa-navy mb-2">
                      Service Provision
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                      <li>Process bookings and reservations</li>
                      <li>Provide transportation and construction services</li>
                      <li>Manage equipment rentals and maintenance</li>
                      <li>Handle customer support requests</li>
                      <li>Process payments and issue receipts</li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-kanxa-navy mb-2">
                      Communication
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                      <li>Send booking confirmations and updates</li>
                      <li>Provide service notifications and alerts</li>
                      <li>Share promotional offers (with consent)</li>
                      <li>Respond to inquiries and feedback</li>
                      <li>Send important service announcements</li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-kanxa-navy mb-2">
                      Improvement and Analytics
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                      <li>Analyze service usage and performance</li>
                      <li>Improve website functionality and user experience</li>
                      <li>Develop new services and features</li>
                      <li>Ensure service quality and safety</li>
                      <li>Conduct market research and planning</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Data Security */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-6 w-6 text-kanxa-green" />
                    Data Security & Protection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-kanxa-navy mb-2">
                      Security Measures
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                      <li>
                        End-to-end encryption for sensitive data transmission
                      </li>
                      <li>Secure servers with regular security updates</li>
                      <li>Multi-factor authentication for admin access</li>
                      <li>Regular security audits and penetration testing</li>
                      <li>Employee training on data protection practices</li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-kanxa-navy mb-2">
                      Payment Security
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                      <li>PCI DSS compliant payment processing</li>
                      <li>
                        Integration with trusted payment gateways (Khalti,
                        eSewa)
                      </li>
                      <li>No storage of complete credit card information</li>
                      <li>Tokenized payment data handling</li>
                      <li>Fraud detection and prevention systems</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Data Sharing */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-6 w-6 text-kanxa-blue" />
                    Data Sharing & Third Parties
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-kanxa-navy mb-2">
                      When We Share Data
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                      <li>With your explicit consent</li>
                      <li>
                        To provide requested services (e.g., delivery partners)
                      </li>
                      <li>For legal compliance and safety purposes</li>
                      <li>With payment processors for transaction handling</li>
                      <li>
                        In case of business merger or acquisition (with
                        notification)
                      </li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-kanxa-navy mb-2">
                      Third-Party Partners
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                      <li>
                        Payment gateways (Khalti, eSewa) - for transaction
                        processing
                      </li>
                      <li>
                        SMS and email service providers - for communications
                      </li>
                      <li>
                        Analytics platforms - for service improvement
                        (anonymized data)
                      </li>
                      <li>
                        Cloud hosting providers - for data storage and security
                      </li>
                      <li>Government agencies - when legally required</li>
                    </ul>
                  </div>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      We never sell your personal data to third parties for
                      marketing purposes. All partner integrations are governed
                      by strict data protection agreements.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Your Rights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-6 w-6 text-kanxa-orange" />
                    Your Rights & Choices
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-kanxa-navy mb-2">
                      Data Access & Control
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                      <li>Request a copy of your personal data</li>
                      <li>Update or correct your information</li>
                      <li>Delete your account and associated data</li>
                      <li>Opt-out of marketing communications</li>
                      <li>Restrict certain data processing activities</li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-kanxa-navy mb-2">
                      Cookie Management
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                      <li>Control cookie preferences in your browser</li>
                      <li>Opt-out of non-essential tracking cookies</li>
                      <li>Manage analytics and advertising cookies</li>
                      <li>Clear stored cookies and browsing data</li>
                      <li>Receive notifications about cookie usage</li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-kanxa-navy mb-2">
                      Communication Preferences
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                      <li>Choose your preferred communication channels</li>
                      <li>Set frequency for promotional messages</li>
                      <li>Opt-out of specific types of notifications</li>
                      <li>Update contact preferences anytime</li>
                      <li>Receive only essential service communications</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Data Retention */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-6 w-6 text-kanxa-green" />
                    Data Retention & Deletion
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-gray-600 text-sm mb-4">
                      We retain your personal data only as long as necessary to
                      provide our services and comply with legal obligations.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-kanxa-navy mb-2">
                          Retention Periods
                        </h4>
                        <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                          <li>Active account data: Until account deletion</li>
                          <li>
                            Booking records: 7 years (for legal compliance)
                          </li>
                          <li>
                            Payment information: As required by financial
                            regulations
                          </li>
                          <li>Website analytics: 26 months (anonymized)</li>
                          <li>Support communications: 3 years</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-kanxa-navy mb-2">
                          Automatic Deletion
                        </h4>
                        <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                          <li>Inactive accounts after 5 years</li>
                          <li>Expired promotional data</li>
                          <li>Temporary files and cache data</li>
                          <li>Unsuccessful booking attempts</li>
                          <li>Non-essential logs and analytics</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-6 w-6 text-kanxa-blue" />
                    Contact Us About Privacy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-kanxa-navy mb-3">
                        Data Protection Officer
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-kanxa-blue" />
                          <span>privacy@kanxasafari.com</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-kanxa-orange" />
                          <span>+977-XXX-XXXXXX</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-kanxa-navy mb-3">
                        Response Time
                      </h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                        <li>Privacy inquiries: Within 72 hours</li>
                        <li>Data access requests: Within 30 days</li>
                        <li>Account deletion: Within 7 days</li>
                        <li>Data correction: Within 24 hours</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Updates */}
              <Card>
                <CardHeader>
                  <CardTitle>Policy Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">
                    We may update this Privacy Policy periodically to reflect
                    changes in our practices, technology, legal requirements, or
                    other factors. We will notify you of any material changes
                    through:
                  </p>

                  <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm mb-4">
                    <li>Email notification to your registered email address</li>
                    <li>Prominent notice on our website</li>
                    <li>In-app notifications (if applicable)</li>
                    <li>SMS alerts for significant changes</li>
                  </ul>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      Continued use of our services after policy updates
                      constitutes acceptance of the revised terms. If you
                      disagree with changes, you may close your account at any
                      time.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
