import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { authAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { 
  Shield, 
  ShieldAlert, 
  User, 
  Lock, 
  Eye, 
  EyeOff,
  Loader2,
  AlertTriangle 
} from "lucide-react";

interface AdminAccessProps {
  requiredRole?: string[];
  children: React.ReactNode;
  fallbackComponent?: React.ReactNode;
}

export function AdminAccess({ 
  requiredRole = ["admin"], 
  children, 
  fallbackComponent 
}: AdminAccessProps) {
  const { user, isAuthenticated, login } = useAuth();
  const { toast } = useToast();
  const [loginData, setLoginData] = useState({
    email: "admin@demo.com",
    password: "demo123"
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Check if user has required role
  const hasRequiredRole = user && requiredRole.includes(user.role);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    try {
      await login(loginData.email, loginData.password);
      toast({
        title: "Success",
        description: "Admin login successful",
      });
    } catch (error: any) {
      console.error("Admin login failed:", error);
      toast({
        title: "Login Failed",
        description: error.message || "Please check your credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  // If user is authenticated and has required role, show content
  if (isAuthenticated && hasRequiredRole) {
    return <>{children}</>;
  }

  // If fallback component is provided, use it
  if (fallbackComponent) {
    return <>{fallbackComponent}</>;
  }

  // Default access denied screen with login form
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-6">
        {/* Access Denied Alert */}
        <Card className="border-red-200">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
              <ShieldAlert className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl font-bold text-red-800">
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {isAuthenticated 
                  ? `${requiredRole.join(" or ").toUpperCase()} privileges required to access this dashboard.`
                  : "Admin privileges required to access this dashboard."
                }
              </AlertDescription>
            </Alert>

            {/* Current User Info */}
            {isAuthenticated && user && (
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">Logged in as:</span>
                  <span className="font-medium">{user.name} ({user.role})</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Admin Login Form */}
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl font-bold text-blue-800">
              Admin Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({
                    ...loginData,
                    email: e.target.value
                  })}
                  placeholder="Enter admin email"
                  required
                />
              </div>

              <div>
                <Label htmlFor="admin-password">Password</Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={(e) => setLoginData({
                      ...loginData,
                      password: e.target.value
                    })}
                    placeholder="Enter admin password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Login as Admin
                  </>
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Demo Admin Access</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <div>Email: <code className="bg-blue-100 px-1 rounded">admin@demo.com</code></div>
                <div>Password: <code className="bg-blue-100 px-1 rounded">demo123</code></div>
              </div>
            </div>

            {/* Go Home Button */}
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => window.location.href = '/'}
            >
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminAccess;
