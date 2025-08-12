import { useState } from "react";
import {
  Phone,
  ArrowLeft,
  Send,
  Shield,
  Check,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { smsAPI } from "@/services/api";

interface SmsLoginProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function SmsLogin({ onBack, onSuccess }: SmsLoginProps) {
  const { toast } = useToast();
  const { smsLogin } = useAuth();
  
  const [step, setStep] = useState<"phone" | "verify">("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [countdown, setCountdown] = useState(0);

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

  const handleSendCode = async () => {
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
      const cleanPhone = phoneNumber.replace(/\D/g, "");
      await smsAPI.sendCode(`+977${cleanPhone}`);
      
      setStep("verify");
      setCountdown(60);
      
      // Start countdown timer
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      toast({
        title: "Verification Code Sent",
        description: `A 6-digit code has been sent to +977-${cleanPhone}`,
        action: (
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-600" />
            <span className="text-green-600 font-medium">Sent</span>
          </div>
        ),
      });
    } catch (error) {
      toast({
        title: "Failed to Send Code",
        description: "Please try again or contact support",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter the complete 6-digit verification code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const cleanPhone = phoneNumber.replace(/\D/g, "");
      const response = await smsAPI.verifyCode(`+977${cleanPhone}`, verificationCode);

      // Use the response to login (this will be handled by AuthContext)
      await smsLogin(`+977${cleanPhone}`, verificationCode);
      
      toast({
        title: "Login Successful! 🎉",
        description: "Welcome to Kanxa Safari",
        action: (
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-600" />
            <span className="text-green-600 font-medium">Success</span>
          </div>
        ),
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCountdown(60);
      
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      toast({
        title: "Code Resent",
        description: "A new verification code has been sent",
      });
    } catch (error) {
      toast({
        title: "Failed to Resend",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="shadow-xl border-0 backdrop-blur-sm bg-white/95">
        <CardHeader className="space-y-1 pb-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle className="text-xl text-kanxa-navy">
                SMS Login
              </CardTitle>
              <p className="text-sm text-gray-600">
                {step === "phone" 
                  ? "Enter your phone number" 
                  : "Enter verification code"
                }
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mt-3">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Phone className="h-3 w-3 mr-1" />
              Quick & Secure
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {step === "phone" ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone Number
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    <span className="text-sm text-gray-500">+977</span>
                    <div className="w-px h-4 bg-gray-300" />
                  </div>
                  <Input
                    id="phone"
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
                  Enter your Nepali mobile number (starting with 98)
                </p>
              </div>

              <Button
                onClick={handleSendCode}
                className="w-full bg-gradient-to-r from-kanxa-blue to-kanxa-navy"
                disabled={isLoading || !validatePhoneNumber(phoneNumber)}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Verification Code
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Phone className="h-8 w-8 mx-auto mb-2 text-kanxa-blue" />
                <p className="text-sm text-gray-700">
                  Code sent to <strong>+977-{phoneNumber}</strong>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code" className="text-sm font-medium text-gray-700">
                  Verification Code
                </Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="text-center text-lg tracking-widest"
                  maxLength={6}
                  disabled={isLoading}
                />
              </div>

              <Button
                onClick={handleVerifyCode}
                className="w-full bg-gradient-to-r from-kanxa-blue to-kanxa-navy"
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Verify & Login
                  </>
                )}
              </Button>

              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-sm text-gray-500">
                    Resend code in {countdown}s
                  </p>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResendCode}
                    disabled={isLoading}
                    className="text-kanxa-blue hover:text-kanxa-navy"
                  >
                    Resend Code
                  </Button>
                )}
              </div>

              <Button
                variant="outline"
                onClick={() => setStep("phone")}
                className="w-full"
                disabled={isLoading}
              >
                Change Phone Number
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
