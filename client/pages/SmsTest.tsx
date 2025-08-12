import { useState } from "react";
import { 
  Phone, 
  Send, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Copy,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { smsAPI } from "@/services/api";
import Layout from "@/components/layout/Layout";

export default function SmsTest() {
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastCode, setLastCode] = useState<string | null>(null);

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const numbers = value.replace(/\D/g, "");
    
    // Format as +977-XXX-XXXXXX for Nepal
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const validatePhoneNumber = (phone: string) => {
    const numbers = phone.replace(/\D/g, "");
    return numbers.length === 10 && numbers.startsWith("98");
  };

  const handleSendTestSMS = async () => {
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    
    if (!validatePhoneNumber(phoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit Nepali phone number starting with 98",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await smsAPI.sendCode(`+977${cleanPhone}`);
      
      if (response.code) {
        setLastCode(response.code);
      }
      
      toast({
        title: "SMS Test Sent",
        description: response.message || "Test SMS has been sent successfully",
        action: (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-green-600 font-medium">Sent</span>
          </div>
        ),
      });
    } catch (error: any) {
      toast({
        title: "SMS Test Failed",
        description: error.message || "Failed to send test SMS",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Text copied successfully",
    });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-kanxa-blue to-kanxa-navy text-white py-8 sm:py-12 lg:py-16">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-4">
              SMS Configuration Test
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 px-4 sm:px-0">
              Test and configure SMS functionality for Kanxa Safari
            </p>
          </div>
        </div>
      </section>

      {/* SMS Test Content */}
      <section className="py-6 sm:py-8 lg:py-12">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Twilio Setup Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Twilio SMS Setup Instructions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Step 1: Create Twilio Account</h4>
                  <p className="text-blue-800 text-sm mb-2">
                    Sign up for a free Twilio account at{" "}
                    <a 
                      href="https://console.twilio.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="underline hover:text-blue-600 inline-flex items-center gap-1"
                    >
                      console.twilio.com
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">Step 2: Get Your Credentials</h4>
                  <div className="space-y-2 text-sm text-green-800">
                    <p>From your Twilio Console, copy these values:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li><strong>Account SID</strong> - Found on your dashboard</li>
                      <li><strong>Auth Token</strong> - Found on your dashboard</li>
                      <li><strong>Phone Number</strong> - Get a trial number or purchase one</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-900 mb-2">Step 3: Update Environment Variables</h4>
                  <p className="text-yellow-800 text-sm mb-2">
                    Update your <code className="bg-yellow-200 px-1 rounded">server/.env</code> file:
                  </p>
                  <div className="bg-gray-900 text-green-400 p-3 rounded text-xs font-mono overflow-x-auto">
                    <div>TWILIO_ACCOUNT_SID=your_account_sid_here</div>
                    <div>TWILIO_AUTH_TOKEN=your_auth_token_here</div>
                    <div>TWILIO_PHONE_NUMBER=+1234567890</div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => copyToClipboard("TWILIO_ACCOUNT_SID=your_account_sid_here\nTWILIO_AUTH_TOKEN=your_auth_token_here\nTWILIO_PHONE_NUMBER=+1234567890")}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy Template
                  </Button>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-2">Step 4: Restart Server</h4>
                  <p className="text-purple-800 text-sm">
                    After updating the environment variables, restart your development server for changes to take effect.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* SMS Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Test SMS Sending
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="testPhone" className="text-sm font-medium">
                    Test Phone Number
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                      <span className="text-sm text-gray-500">+977</span>
                      <div className="w-px h-4 bg-gray-300" />
                    </div>
                    <Input
                      id="testPhone"
                      type="tel"
                      placeholder="98X-XXX-XXXX"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                      className="pl-16"
                      maxLength={12}
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Enter a Nepali mobile number to test SMS functionality
                  </p>
                </div>

                <Button
                  onClick={handleSendTestSMS}
                  disabled={isLoading || !validatePhoneNumber(phoneNumber)}
                  className="w-full bg-gradient-to-r from-kanxa-blue to-kanxa-navy"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Test SMS...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Test SMS
                    </>
                  )}
                </Button>

                {lastCode && (
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <h4 className="font-semibold text-orange-900">Development Mode</h4>
                    </div>
                    <p className="text-orange-800 text-sm mb-2">
                      Since Twilio is not configured, here's the generated code:
                    </p>
                    <div className="bg-orange-100 p-2 rounded font-mono text-lg text-center text-orange-900">
                      {lastCode}
                    </div>
                    <p className="text-orange-700 text-xs mt-2">
                      Configure Twilio credentials to send real SMS messages.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status Information */}
            <Card>
              <CardHeader>
                <CardTitle>SMS Service Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Development Mode
                  </Badge>
                  <span className="text-sm text-gray-600">
                    Configure Twilio credentials to enable real SMS sending
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  When properly configured, SMS messages will be sent through Twilio instead of console logging.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}
