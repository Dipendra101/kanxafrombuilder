import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SmsLogin from "@/components/auth/SmsLogin";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  LogIn,
  User,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  Smartphone,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { authAPI } from "@/services/api";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, guestLogin } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginMode, setLoginMode] = useState<"email" | "sms">("email");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("kanxa_remembered_email");
    const rememberFlag = localStorage.getItem("kanxa_remember");

    if (rememberedEmail && rememberFlag === "true") {
      setFormData(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  // Function to extend token expiry for remember me
  const extendTokenExpiry = async (token: string) => {
    try {
      const response = await fetch("/api/auth/extend-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ rememberMe: true }),
      });

      if (response.ok) {
        const result = await response.json();
        return result.token;
      }
    } catch (error) {
      console.error("Failed to extend token expiry:", error);
    }
    return null;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

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
      // Use real backend authentication
      const loginResponse = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

      // Update auth context
      await login(formData.email, formData.password);

      // Show success notification
      toast({
        title: "Welcome back! 🎉",
        description:
          "You have successfully logged into your Kanxa Safari account.",
        action: (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-green-600 font-medium">Success</span>
          </div>
        ),
      });

      // Store remember me preference and email
      if (rememberMe) {
        localStorage.setItem("kanxa_remember", "true");
        localStorage.setItem("kanxa_remembered_email", formData.email);
        // Set longer token expiry for remember me (30 days instead of 7)
        const extendedToken = await extendTokenExpiry(loginResponse.token);
        if (extendedToken) {
          localStorage.setItem("authToken", extendedToken);
        }
      } else {
        // Clear remember me data if unchecked
        localStorage.removeItem("kanxa_remember");
        localStorage.removeItem("kanxa_remembered_email");
      }

      // Redirect based on user role from login response
      if (loginResponse.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description:
          error.message ||
          "Invalid email or password. Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast({
      title: "Google Login",
      description: "Google authentication will be available soon!",
      action: (
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <span className="text-blue-600 font-medium">Coming Soon</span>
        </div>
      ),
    });
  };

  const handleSmsLogin = () => {
    setLoginMode("sms");
  };

  const handleGuestLogin = () => {
    guestLogin();
    toast({
      title: "Guest Mode Activated",
      description: "You can browse the website but cannot make bookings",
      action: (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-orange-600" />
          <span className="text-orange-600 font-medium">Guest</span>
        </div>
      ),
    });
    navigate("/");
  };

  const handleSmsSuccess = () => {
    // Check user role from context after SMS login
    if (user?.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  const handleBackToEmail = () => {
    setLoginMode("email");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (loginMode === "sms") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-kanxa-light-blue via-white to-kanxa-light-orange flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <SmsLogin onBack={handleBackToEmail} onSuccess={handleSmsSuccess} />
      </div>
    );
  }

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
            Welcome Back!
          </h1>
          <p className="text-gray-600">
            Sign in to access your Kanxa Safari account
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Shield className="h-3 w-3 mr-1" />
              Secure Login
            </Badge>
          </div>
        </div>

        <Card className="shadow-xl border-0 backdrop-blur-sm bg-white/95">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center text-kanxa-navy">
              Sign In
            </CardTitle>
            <p className="text-sm text-gray-600 text-center">
              Enter your credentials to continue
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`pl-10 ${errors.email ? "border-red-500 focus:border-red-500" : ""}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className={`pl-10 pr-10 ${errors.password ? "border-red-500 focus:border-red-500" : ""}`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked as boolean)
                    }
                    disabled={isLoading}
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    Remember me
                  </Label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-kanxa-blue hover:text-kanxa-navy transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-kanxa-blue to-kanxa-navy hover:from-kanxa-navy hover:to-kanxa-blue transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <Separator className="my-6" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white px-2 text-sm text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login */}
            <Button
              variant="outline"
              onClick={handleGoogleLogin}
              className="w-full border-gray-300 hover:bg-gray-50"
              disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            {/* Alternative Auth Options */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="text-sm"
                onClick={handleSmsLogin}
                disabled={isLoading}
              >
                <Smartphone className="mr-2 h-3 w-3" />
                SMS Login
              </Button>
              <Button
                variant="outline"
                className="text-sm"
                onClick={handleGuestLogin}
                disabled={isLoading}
              >
                <User className="mr-2 h-3 w-3" />
                Guest Mode
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 space-y-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-kanxa-blue hover:text-kanxa-navy font-medium transition-colors"
            >
              Create one now
            </Link>
          </p>

          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <Link
              to="/privacy"
              className="hover:text-gray-700 transition-colors"
            >
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-gray-700 transition-colors">
              Terms of Service
            </Link>
            <span>•</span>
            <Link
              to="/support"
              className="hover:text-gray-700 transition-colors"
            >
              Support
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
