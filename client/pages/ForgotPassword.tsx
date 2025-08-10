import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  Shield,
  RefreshCw,
  MessageSquare,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const [activeTab, setActiveTab] = useState("email");
  const [countdown, setCountdown] = useState(0);
  
  const [formData, setFormData] = useState({
    email: "",
    phone: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string) => {
    if (!email) return "Email address is required";
    if (!/\S+@\S+\.\S+/.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePhone = (phone: string) => {
    if (!phone) return "Phone number is required";
    if (!/^[+]?[\d\s-()]+$/.test(phone)) return "Please enter a valid phone number";
    return "";
  };

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleEmailReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setErrors({ email: emailError });
      toast({
        title: "Validation Error",
        description: emailError,
        variant: "destructive",
      });
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setEmailSent(true);
      startCountdown();
      
      toast({
        title: "Reset Link Sent! 📧",
        description: `We've sent a password reset link to ${formData.email}. Please check your inbox and spam folder.`,
        action: (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-green-600 font-medium">Email Sent</span>
          </div>
        ),
      });

    } catch (error) {
      toast({
        title: "Failed to Send Email",
        description: "Unable to send reset email. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSmsReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const phoneError = validatePhone(formData.phone);
    if (phoneError) {
      setErrors({ phone: phoneError });
      toast({
        title: "Validation Error",
        description: phoneError,
        variant: "destructive",
      });
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSmsSent(true);
      startCountdown();
      
      toast({
        title: "SMS Code Sent! 📱",
        description: `We've sent a verification code to ${formData.phone}. Please check your messages.`,
        action: (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-green-600 font-medium">SMS Sent</span>
          </div>
        ),
      });

    } catch (error) {
      toast({
        title: "Failed to Send SMS",
        description: "Unable to send verification code. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    if (activeTab === "email") {
      setEmailSent(false);
      handleEmailReset(new Event('submit') as any);
    } else {
      setSmsSent(false);
      handleSmsReset(new Event('submit') as any);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-kanxa-light-blue via-white to-kanxa-light-orange flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 bg-gradient-to-br from-kanxa-blue to-kanxa-navy rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">KS</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-kanxa-navy mb-2">
            Reset Password
          </h1>
          <p className="text-gray-600">
            Don't worry! We'll help you regain access to your account
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Shield className="h-3 w-3 mr-1" />
              Secure Reset
            </Badge>
          </div>
        </div>

        <Card className="shadow-xl border-0 backdrop-blur-sm bg-white/95">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center text-kanxa-navy">
              Choose Reset Method
            </CardTitle>
            <p className="text-sm text-gray-600 text-center">
              Select how you'd like to reset your password
            </p>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="sms" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  SMS
                </TabsTrigger>
              </TabsList>

              {/* Email Reset Tab */}
              <TabsContent value="email" className="space-y-4 mt-6">
                {!emailSent ? (
                  <form onSubmit={handleEmailReset} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email address"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                          disabled={isLoading}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.email}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        We'll send a secure link to reset your password
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-kanxa-blue to-kanxa-navy"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending Email...
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Reset Link
                        </>
                      )}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email Sent Successfully!</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        We've sent a password reset link to:
                      </p>
                      <p className="font-medium text-kanxa-blue">{formData.email}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg text-left">
                      <h4 className="font-medium text-blue-900 mb-2">Next Steps:</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Check your email inbox</li>
                        <li>• Look in spam/junk folder if not found</li>
                        <li>• Click the reset link within 15 minutes</li>
                        <li>• Create a new secure password</li>
                      </ul>
                    </div>
                    {countdown > 0 ? (
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        Resend available in {countdown}s
                      </div>
                    ) : (
                      <Button
                        onClick={handleResend}
                        variant="outline"
                        className="w-full"
                        disabled={isLoading}
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Resend Email
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>

              {/* SMS Reset Tab */}
              <TabsContent value="sms" className="space-y-4 mt-6">
                {!smsSent ? (
                  <form onSubmit={handleSmsReset} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                        Phone Number
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+977-XXX-XXXXXX"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                          disabled={isLoading}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.phone}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        We'll send a verification code to your mobile number
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-kanxa-blue to-kanxa-navy"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending SMS...
                        </>
                      ) : (
                        <>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Send Verification Code
                        </>
                      )}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <MessageSquare className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">SMS Code Sent!</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        We've sent a 6-digit code to:
                      </p>
                      <p className="font-medium text-kanxa-blue">{formData.phone}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg text-left">
                      <h4 className="font-medium text-blue-900 mb-2">Next Steps:</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Check your text messages</li>
                        <li>• Enter the 6-digit verification code</li>
                        <li>• Code expires in 10 minutes</li>
                        <li>• Create a new secure password</li>
                      </ul>
                    </div>
                    {countdown > 0 ? (
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        Resend available in {countdown}s
                      </div>
                    ) : (
                      <Button
                        onClick={handleResend}
                        variant="outline"
                        className="w-full"
                        disabled={isLoading}
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Resend Code
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Alternative Options */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center space-y-3">
                <p className="text-sm text-gray-600">
                  Still having trouble?
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Phone className="mr-2 h-3 w-3" />
                    Call Support
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Mail className="mr-2 h-3 w-3" />
                    Email Help
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 space-y-4">
          <p className="text-sm text-gray-600">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-kanxa-blue hover:text-kanxa-navy font-medium transition-colors"
            >
              Sign in here
            </Link>
          </p>
          
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <Link to="/privacy" className="hover:text-gray-700 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/support" className="hover:text-gray-700 transition-colors">
              Support Center
            </Link>
          </div>

          <Button
            variant="ghost"
            asChild
            className="text-gray-600 hover:text-gray-800"
          >
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
