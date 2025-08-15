import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
  Shield,
  ArrowLeft,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast-simple";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check token validity on component mount
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      return;
    }

    const checkToken = async () => {
      try {
        const response = await fetch(
          `/api/auth/verify-reset-token?token=${token}`,
        );
        const result = await response.json();
        setTokenValid(result.success);

        if (!result.success) {
          toast({
            title: "Invalid Reset Link",
            description:
              result.message || "This reset link is invalid or has expired.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Token verification error:", error);
        setTokenValid(false);
        toast({
          title: "Error",
          description: "Unable to verify reset link. Please try again.",
          variant: "destructive",
        });
      }
    };

    checkToken();
  }, [token]); // Remove toast dependency to prevent infinite loop

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and number";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors below",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          newPassword: formData.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to reset password");
      }

      setResetSuccess(true);

      toast({
        title: "Password Reset Successful! 🎉",
        description:
          "Your password has been updated. You can now log in with your new password.",
        action: (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-green-600 font-medium">Success</span>
          </div>
        ),
      });

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast({
        title: "Reset Failed",
        description:
          error.message || "Unable to reset password. Please try again.",
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

  const getPasswordStrength = (password: string) => {
    if (password.length < 6) return { strength: "weak", color: "text-red-500" };
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password))
      return { strength: "medium", color: "text-yellow-500" };
    return { strength: "strong", color: "text-green-500" };
  };

  // Show loading while checking token
  if (tokenValid === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-kanxa-light-blue via-white to-kanxa-light-orange flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kanxa-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  // Show error if token is invalid
  if (tokenValid === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-kanxa-light-blue via-white to-kanxa-light-orange flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0 backdrop-blur-sm bg-white/95">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-xl text-red-700">
                Invalid Reset Link
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-gray-600">
                This password reset link is invalid or has expired.
              </p>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Reset links expire after 15 minutes for security reasons.
                </AlertDescription>
              </Alert>
              <div className="flex gap-3">
                <Button variant="outline" asChild className="flex-1">
                  <Link to="/forgot-password">Request New Link</Link>
                </Button>
                <Button asChild className="flex-1">
                  <Link to="/login">Back to Login</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
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
            Create New Password
          </h1>
          <p className="text-gray-600">
            Enter a strong new password for your account
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <KeyRound className="h-3 w-3 mr-1" />
              Secure Reset
            </Badge>
          </div>
        </div>

        <Card className="shadow-xl border-0 backdrop-blur-sm bg-white/95">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center text-kanxa-navy">
              Reset Your Password
            </CardTitle>
            <p className="text-sm text-gray-600 text-center">
              Choose a strong password you haven't used before
            </p>
          </CardHeader>

          <CardContent>
            {!resetSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-600">Strength:</span>
                      <span
                        className={`font-medium ${getPasswordStrength(formData.password).color}`}
                      >
                        {getPasswordStrength(
                          formData.password,
                        ).strength.toUpperCase()}
                      </span>
                    </div>
                  )}
                  {errors.password && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-gray-700"
                  >
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      className={`pl-10 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Password Requirements */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Password Requirements:
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li
                      className={`flex items-center gap-2 ${formData.password.length >= 6 ? "text-green-700" : ""}`}
                    >
                      {formData.password.length >= 6 ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <div className="h-3 w-3 border border-gray-400 rounded-full" />
                      )}
                      At least 6 characters
                    </li>
                    <li
                      className={`flex items-center gap-2 ${/(?=.*[a-z])/.test(formData.password) ? "text-green-700" : ""}`}
                    >
                      {/(?=.*[a-z])/.test(formData.password) ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <div className="h-3 w-3 border border-gray-400 rounded-full" />
                      )}
                      One lowercase letter
                    </li>
                    <li
                      className={`flex items-center gap-2 ${/(?=.*[A-Z])/.test(formData.password) ? "text-green-700" : ""}`}
                    >
                      {/(?=.*[A-Z])/.test(formData.password) ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <div className="h-3 w-3 border border-gray-400 rounded-full" />
                      )}
                      One uppercase letter
                    </li>
                    <li
                      className={`flex items-center gap-2 ${/(?=.*\d)/.test(formData.password) ? "text-green-700" : ""}`}
                    >
                      {/(?=.*\d)/.test(formData.password) ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <div className="h-3 w-3 border border-gray-400 rounded-full" />
                      )}
                      One number
                    </li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-kanxa-blue to-kanxa-navy"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Update Password
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
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Password Updated Successfully!
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Your password has been changed. You can now log in with your
                    new password.
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-left">
                  <h4 className="font-medium text-green-900 mb-2">
                    What's Next:
                  </h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• You'll be redirected to login automatically</li>
                    <li>• Use your email and new password to sign in</li>
                    <li>• Keep your password secure and private</li>
                    <li>• Consider using a password manager</li>
                  </ul>
                </div>
                <Button asChild className="w-full">
                  <Link to="/login">Go to Login Now</Link>
                </Button>
              </div>
            )}
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
