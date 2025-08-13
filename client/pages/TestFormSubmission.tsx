import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { authAPI, userAPI, bookingsAPI, servicesAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Bug,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  Save,
  TestTube,
  Database,
  RefreshCw,
  Settings,
} from "lucide-react";
import Layout from "@/components/layout/Layout";

interface TestResult {
  name: string;
  status: "pass" | "fail" | "warning" | "pending";
  message: string;
  data?: any;
  error?: string;
}

export default function TestFormSubmission() {
  const { user, isAuthenticated, login, updateUser } = useAuth();
  const { toast } = useToast();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        bio: "",
      });
    }
  }, [user]);

  const addTestResult = (result: TestResult) => {
    setTestResults((prev) => [...prev, result]);
  };

  const clearTestResults = () => {
    setTestResults([]);
  };

  // Test 1: Authentication API
  const testAuthentication = async () => {
    try {
      addTestResult({
        name: "Authentication API Test",
        status: "pending",
        message: "Testing demo login...",
      });

      const response = await authAPI.login({
        email: "admin@demo.com",
        password: "demo123",
      });

      if (response.success && response.user && response.token) {
        addTestResult({
          name: "Authentication API Test",
          status: "pass",
          message: "Login successful",
          data: {
            userId: response.user._id,
            email: response.user.email,
            role: response.user.role,
            tokenLength: response.token?.length,
          },
        });
      } else {
        addTestResult({
          name: "Authentication API Test",
          status: "fail",
          message: "Login failed - invalid response structure",
          data: response,
        });
      }
    } catch (error: any) {
      addTestResult({
        name: "Authentication API Test",
        status: "fail",
        message: `Login failed: ${error.message}`,
        error: error.toString(),
      });
    }
  };

  // Test 2: Profile Update API
  const testProfileUpdate = async () => {
    if (!user) {
      addTestResult({
        name: "Profile Update Test",
        status: "fail",
        message: "User not authenticated",
      });
      return;
    }

    try {
      addTestResult({
        name: "Profile Update Test",
        status: "pending",
        message: "Testing profile update...",
      });

      const testData = {
        name: `Test User ${Date.now()}`,
        phone: "9876543210",
        address: "Test Address Updated",
      };

      const response = await userAPI.updateProfile(testData);

      if (response.success) {
        addTestResult({
          name: "Profile Update Test",
          status: "pass",
          message: "Profile update successful",
          data: {
            updatedFields: Object.keys(testData),
            response: response,
          },
        });
      } else {
        addTestResult({
          name: "Profile Update Test",
          status: "fail",
          message: `Profile update failed: ${response.message}`,
          data: response,
        });
      }
    } catch (error: any) {
      addTestResult({
        name: "Profile Update Test",
        status: "fail",
        message: `Profile update error: ${error.message}`,
        error: error.toString(),
      });
    }
  };

  // Test 3: Services API
  const testServicesAPI = async () => {
    try {
      addTestResult({
        name: "Services API Test",
        status: "pending",
        message: "Testing services API...",
      });

      const response = await servicesAPI.getAllServices({ limit: 5 });

      if (response.success || response.services) {
        addTestResult({
          name: "Services API Test",
          status: "pass",
          message: `Services API working - ${response.services?.length || 0} services found`,
          data: {
            servicesCount: response.services?.length || 0,
            mode: response.mode || "unknown",
            services: response.services?.slice(0, 2),
          },
        });
      } else {
        addTestResult({
          name: "Services API Test",
          status: "warning",
          message: "Services API returned unexpected structure",
          data: response,
        });
      }
    } catch (error: any) {
      addTestResult({
        name: "Services API Test",
        status: "fail",
        message: `Services API error: ${error.message}`,
        error: error.toString(),
      });
    }
  };

  // Test 4: Bookings API
  const testBookingsAPI = async () => {
    if (!user) {
      addTestResult({
        name: "Bookings API Test",
        status: "fail",
        message: "User not authenticated",
      });
      return;
    }

    try {
      addTestResult({
        name: "Bookings API Test",
        status: "pending",
        message: "Testing bookings API...",
      });

      const response = await bookingsAPI.getBookings({ limit: 5 });

      if (response.success || response.bookings) {
        addTestResult({
          name: "Bookings API Test",
          status: "pass",
          message: `Bookings API working - ${response.bookings?.length || 0} bookings found`,
          data: {
            bookingsCount: response.bookings?.length || 0,
            demo: response.demo,
            bookings: response.bookings?.slice(0, 2),
          },
        });
      } else {
        addTestResult({
          name: "Bookings API Test",
          status: "warning",
          message: "Bookings API returned unexpected structure",
          data: response,
        });
      }
    } catch (error: any) {
      addTestResult({
        name: "Bookings API Test",
        status: "fail",
        message: `Bookings API error: ${error.message}`,
        error: error.toString(),
      });
    }
  };

  // Test 5: Database Connection
  const testDatabaseConnection = async () => {
    try {
      addTestResult({
        name: "Database Connection Test",
        status: "pending",
        message: "Testing database connection...",
      });

      const response = await fetch("/api/health");
      const healthData = await response.json();

      addTestResult({
        name: "Database Connection Test",
        status: response.ok ? "pass" : "warning",
        message: response.ok
          ? "Health endpoint accessible"
          : "Health endpoint failed",
        data: healthData,
      });
    } catch (error: any) {
      addTestResult({
        name: "Database Connection Test",
        status: "fail",
        message: `Database connection test failed: ${error.message}`,
        error: error.toString(),
      });
    }
  };

  // Test 6: Form Submission with actual data
  const testFormSubmission = async () => {
    if (!profileData.name.trim()) {
      toast({
        title: "Error",
        description: "Please fill in the name field",
        variant: "destructive",
      });
      return;
    }

    try {
      addTestResult({
        name: "Form Submission Test",
        status: "pending",
        message: "Testing form submission with UI data...",
      });

      const response = await updateUser(profileData);

      addTestResult({
        name: "Form Submission Test",
        status: "pass",
        message: "Form submission successful",
        data: {
          submittedData: profileData,
          response: response,
        },
      });

      toast({
        title: "Success",
        description: "Form submitted successfully!",
      });
    } catch (error: any) {
      addTestResult({
        name: "Form Submission Test",
        status: "fail",
        message: `Form submission failed: ${error.message}`,
        error: error.toString(),
      });

      toast({
        title: "Error",
        description: `Form submission failed: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  // Run all tests
  const runAllTests = async () => {
    setIsRunningTests(true);
    clearTestResults();

    const tests = [
      testDatabaseConnection,
      testAuthentication,
      testProfileUpdate,
      testServicesAPI,
      testBookingsAPI,
    ];

    for (const test of tests) {
      await test();
      // Small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setIsRunningTests(false);
  };

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "fail":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "pending":
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      default:
        return <TestTube className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: TestResult["status"]) => {
    const variants: Record<TestResult["status"], string> = {
      pass: "bg-green-100 text-green-800",
      fail: "bg-red-100 text-red-800",
      warning: "bg-yellow-100 text-yellow-800",
      pending: "bg-blue-100 text-blue-800",
    };

    return <Badge className={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Bug className="h-8 w-8" />
              <h1 className="text-4xl lg:text-5xl font-bold">
                QA Testing Suite
              </h1>
            </div>
            <p className="text-xl text-white/90 mb-8">
              Comprehensive quality assurance testing for form submissions and
              backend integration
            </p>
          </div>
        </div>
      </section>

      {/* Test Results */}
      <section className="py-12">
        <div className="container px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Test Controls */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TestTube className="h-5 w-5" />
                      Test Controls
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      onClick={runAllTests}
                      disabled={isRunningTests}
                      className="w-full"
                    >
                      {isRunningTests ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Running Tests...
                        </>
                      ) : (
                        <>
                          <TestTube className="mr-2 h-4 w-4" />
                          Run All Tests
                        </>
                      )}
                    </Button>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={testAuthentication}
                        disabled={isRunningTests}
                        size="sm"
                      >
                        Test Auth
                      </Button>
                      <Button
                        variant="outline"
                        onClick={testProfileUpdate}
                        disabled={isRunningTests}
                        size="sm"
                      >
                        Test Profile
                      </Button>
                      <Button
                        variant="outline"
                        onClick={testServicesAPI}
                        disabled={isRunningTests}
                        size="sm"
                      >
                        Test Services
                      </Button>
                      <Button
                        variant="outline"
                        onClick={testBookingsAPI}
                        disabled={isRunningTests}
                        size="sm"
                      >
                        Test Bookings
                      </Button>
                    </div>

                    <Button
                      variant="secondary"
                      onClick={clearTestResults}
                      className="w-full"
                    >
                      Clear Results
                    </Button>
                  </CardContent>
                </Card>

                {/* Profile Form Test */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Profile Form Test
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            name: e.target.value,
                          })
                        }
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            phone: e.target.value,
                          })
                        }
                        placeholder="Enter your phone"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={profileData.address}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            address: e.target.value,
                          })
                        }
                        placeholder="Enter your address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            bio: e.target.value,
                          })
                        }
                        placeholder="Enter your bio"
                        rows={3}
                      />
                    </div>

                    <Button onClick={testFormSubmission} className="w-full">
                      <Save className="mr-2 h-4 w-4" />
                      Test Form Submission
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Test Results */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Test Results ({testResults.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {testResults.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No test results yet. Run some tests to see results here.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {testResults.map((result, index) => (
                          <div
                            key={index}
                            className="border rounded-lg p-4 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(result.status)}
                                <span className="font-medium">
                                  {result.name}
                                </span>
                              </div>
                              {getStatusBadge(result.status)}
                            </div>
                            <p className="text-sm text-gray-600">
                              {result.message}
                            </p>
                            {result.data && (
                              <details className="text-xs">
                                <summary className="cursor-pointer text-blue-600">
                                  View Data
                                </summary>
                                <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
                                  {JSON.stringify(result.data, null, 2)}
                                </pre>
                              </details>
                            )}
                            {result.error && (
                              <details className="text-xs">
                                <summary className="cursor-pointer text-red-600">
                                  View Error
                                </summary>
                                <pre className="mt-2 p-2 bg-red-50 rounded overflow-auto text-red-700">
                                  {result.error}
                                </pre>
                              </details>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* User Info */}
                {user && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Current User
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Name:</span>
                          <span className="font-medium">{user.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Email:</span>
                          <span className="font-medium">{user.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Role:</span>
                          <Badge variant="outline">{user.role}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Authenticated:</span>
                          <Badge className="bg-green-100 text-green-800">
                            {isAuthenticated ? "Yes" : "No"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
