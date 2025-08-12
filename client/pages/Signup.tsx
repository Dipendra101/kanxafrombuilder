import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye, EyeOff, Mail, Lock, User, Phone, MapPin, Building2, UserPlus, ArrowLeft, CheckCircle, AlertCircle, Loader2, Shield, Check, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    company: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return "Enter password";
    if (passwordStrength <= 25) return "Weak";
    if (passwordStrength <= 50) return "Fair";
    if (passwordStrength <= 75) return "Good";
    return "Strong";
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email address is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email address";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!acceptTerms) newErrors.terms = "You must accept the terms and conditions";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors below and try again.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      // **FIX**: Capture the return value in a 'response' variable
      const response = await register({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      toast({
        title: "Account Created Successfully! 🎉",
        // **FIX**: Use the correct message and redirect prompt
        description:"Please log in to continue.",
        action: (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-green-600 font-medium">Success</span>
          </div>
        ),
      });

      // **FIX**: Redirect to the login page
      navigate("/login");

    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Unable to create your account. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const passwordRequirements = [
    { text: "At least 8 characters", met: formData.password.length >= 8 },
    { text: "Uppercase letter", met: /[A-Z]/.test(formData.password) },
    { text: "Lowercase letter", met: /[a-z]/.test(formData.password) },
    { text: "Number", met: /[0-9]/.test(formData.password) },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-kanxa-light-blue via-white to-kanxa-light-orange flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 bg-gradient-to-br from-kanxa-blue to-kanxa-navy rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">KS</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-kanxa-navy mb-2">Join Kanxa Safari</h1>
          <p className="text-gray-600">Create your account and start your journey with us</p>
        </div>
        <Card className="shadow-xl border-0 backdrop-blur-sm bg-white/95">
          <CardHeader>
            <CardTitle className="text-xl text-center text-kanxa-navy">Create Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input id="firstName" placeholder="Your first name" value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} className={`pl-10 ${errors.firstName ? "border-red-500" : ""}`} disabled={isLoading} />
                  </div>
                  {errors.firstName && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input id="lastName" placeholder="Your last name" value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} className={`pl-10 ${errors.lastName ? "border-red-500" : ""}`} disabled={isLoading} />
                  </div>
                  {errors.lastName && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.lastName}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input id="email" type="email" placeholder="your.email@example.com" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} className={`pl-10 ${errors.email ? "border-red-500" : ""}`} disabled={isLoading} />
                </div>
                {errors.email && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.email}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input id="phone" type="tel" placeholder="+977-XXX-XXXXXX" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} className={`pl-10 ${errors.phone ? "border-red-500" : ""}`} disabled={isLoading} />
                  </div>
                  {errors.phone && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.phone}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input id="address" placeholder="Your address" value={formData.address} onChange={(e) => handleInputChange("address", e.target.value)} className={`pl-10 ${errors.address ? "border-red-500" : ""}`} disabled={isLoading} />
                  </div>
                  {errors.address && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.address}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="Create a strong password" value={formData.password} onChange={(e) => handleInputChange("password", e.target.value)} className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`} disabled={isLoading} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" disabled={isLoading}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                </div>
                {formData.password && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between"><span className="text-xs text-gray-600">Password strength:</span><span className={`text-xs font-medium ${passwordStrength <= 25 ? "text-red-600" : passwordStrength <= 50 ? "text-yellow-600" : passwordStrength <= 75 ? "text-blue-600" : "text-green-600"}`}>{getPasswordStrengthText()}</span></div>
                    <Progress value={passwordStrength} className="h-2" />
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      {passwordRequirements.map((req, index) => (<div key={index} className={`flex items-center gap-1 ${req.met ? "text-green-600" : "text-gray-400"}`}>{req.met ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />} {req.text}</div>))}
                    </div>
                  </div>
                )}
                {errors.password && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.password}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm your password" value={formData.confirmPassword} onChange={(e) => handleInputChange("confirmPassword", e.target.value)} className={`pl-10 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`} disabled={isLoading} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" disabled={isLoading}>{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.confirmPassword}</p>}
              </div>
              <div className="space-y-3 pt-2">
                <div className="flex items-start space-x-2">
                  <Checkbox id="terms" checked={acceptTerms} onCheckedChange={(checked) => { setAcceptTerms(checked as boolean); if (errors.terms && checked) { setErrors((prev) => ({ ...prev, terms: "" })); } }} disabled={isLoading} className="mt-1" />
                  <Label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">I agree to the{" "}<Link to="/terms" className="text-kanxa-blue hover:text-kanxa-navy">Terms of Service</Link>{" "}and{" "}<Link to="/privacy" className="text-kanxa-blue hover:text-kanxa-navy">Privacy Policy</Link></Label>
                </div>
                {errors.terms && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.terms}</p>}
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-kanxa-blue to-kanxa-navy" disabled={isLoading}>{isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...</>) : (<><UserPlus className="mr-2 h-4 w-4" /> Create Account</>)}</Button>
            </form>
            <div className="mt-6 text-center text-sm">
              <p>Already have an account?{" "}<Link to="/login" className="text-kanxa-blue hover:text-kanxa-navy font-medium">Sign in here</Link></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}