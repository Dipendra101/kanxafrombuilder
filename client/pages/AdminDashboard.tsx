import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  FileText,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  MoreVertical,
  Plus,
  Search,
  Filter,
  Download,
  Bell,
  Settings,
  BarChart3,
  PieChart,
  Activity,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { adminAPI, servicesAPI, bookingsAPI, userAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast-simple";
import ExportService from "@/services/exportService";
import PremiumAnalytics from "@/components/analytics/PremiumAnalytics";

interface DashboardStats {
  totalUsers: number;
  totalServices: number;
  totalBookings: number;
  totalRevenue: number;
  recentUsers: number;
  activeServices: number;
  pendingBookings: number;
  monthlyRevenue: number;
}

interface RecentBooking {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  service: {
    _id: string;
    name: string;
    type: string;
  };
  totalAmount: number;
  status: string;
  createdAt: string;
  bookingDate: string;
}

interface RecentUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

interface Service {
  _id: string;
  name: string;
  description: string;
  type: string;
  category: string;
  pricing: {
    basePrice: number;
    currency: string;
  };
  isActive: boolean;
  isFeatured: boolean;
  rating: {
    average: number;
    count: number;
  };
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalServices: 0,
    totalBookings: 0,
    totalRevenue: 0,
    recentUsers: 0,
    activeServices: 0,
    pendingBookings: 0,
    monthlyRevenue: 0,
  });

  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [allUsers, setAllUsers] = useState<RecentUser[]>([]);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [allBookings, setAllBookings] = useState<RecentBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check admin access - allow demo mode for UI preview
  const isDemoMode = !isAuthenticated || !user;
  const isAdmin = user?.role === "admin";
  const [activeTab, setActiveTab] = useState("overview");

  // Modal states
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<RecentUser | null>(null);

  // Form states
  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    type: "bus",
    category: "",
    basePrice: "",
    isActive: true,
    isFeatured: false,
  });

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "user",
    isActive: true,
  });

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);

        // In demo mode, skip API calls and use mock data
        if (isDemoMode) {
          console.log("Loading dashboard in demo mode");

          // Use demo data directly without API calls
          setStats({
            totalUsers: 125,
            totalServices: 25,
            totalBookings: 340,
            totalRevenue: 125000,
            recentUsers: 8,
            activeServices: 22,
            pendingBookings: 12,
            monthlyRevenue: 25000,
          });

          // Set demo users
          const demoUsers = [
            {
              _id: "demo1",
              name: "John Doe",
              email: "john@example.com",
              phone: "+977-980-123456",
              role: "user",
              isActive: true,
              createdAt: new Date().toISOString(),
            },
            {
              _id: "demo2",
              name: "Jane Smith",
              email: "jane@example.com",
              phone: "+977-981-234567",
              role: "user",
              isActive: true,
              createdAt: new Date().toISOString(),
            },
          ];
          setAllUsers(demoUsers);
          setRecentUsers(demoUsers);

          // Set demo services
          const demoServices = [
            {
              _id: "service1",
              name: "Bus Transportation",
              type: "transportation",
              category: "bus",
              isActive: true,
              isFeatured: true,
              pricing: { basePrice: 500, currency: "₨" },
              rating: { average: 4.8, count: 156 },
            },
            {
              _id: "service2",
              name: "Cargo Service",
              type: "transportation",
              category: "cargo",
              isActive: true,
              isFeatured: false,
              pricing: { basePrice: 1000, currency: "₨" },
              rating: { average: 4.5, count: 89 },
            },
          ];
          setAllServices(demoServices);

          // Set demo bookings
          const demoBookings = [
            {
              _id: "booking1",
              user: demoUsers[0],
              service: demoServices[0],
              totalAmount: 1500,
              status: "confirmed",
              createdAt: new Date().toISOString(),
              bookingDate: new Date().toISOString(),
            },
          ];
          setRecentBookings(demoBookings);
          setAllBookings(demoBookings);

          setIsLoading(false);
          return;
        }

        // For authenticated admin users, try API calls with better error handling
        console.log("Loading dashboard with API calls");
        const [
          dashboardResponse,
          usersResponse,
          servicesResponse,
          bookingsResponse,
        ] = await Promise.allSettled([
          adminAPI.getDashboard().catch(err => {
            console.warn("Dashboard API failed:", err.message);
            return { data: null };
          }),
          userAPI.getAllUsers().catch(err => {
            console.warn("Users API failed:", err.message);
            return { users: [] };
          }),
          servicesAPI.getAllServices({ limit: 100 }).catch(err => {
            console.warn("Services API failed:", err.message);
            return { services: [] };
          }),
          bookingsAPI.getAllBookings({ limit: 100 }).catch(err => {
            console.warn("Bookings API failed:", err.message);
            return { bookings: [] };
          }),
        ]);

        // Handle dashboard stats
        if (dashboardResponse.status === "fulfilled") {
          setStats(dashboardResponse.value.data);
        } else {
          // Fallback stats if API fails
          setStats({
            totalUsers: 125,
            totalServices: 25,
            totalBookings: 340,
            totalRevenue: 125000,
            recentUsers: 8,
            activeServices: 22,
            pendingBookings: 12,
            monthlyRevenue: 25000,
          });
        }

        // Handle users data
        if (usersResponse.status === "fulfilled") {
          const users = usersResponse.value.users || [];
          setAllUsers(users);
          setRecentUsers(users.slice(0, 5));
        } else {
          // Fallback users
          const mockUsers = [
            {
              _id: "1",
              name: "Ram Kumar Sharma",
              email: "ram@example.com",
              phone: "9841234567",
              role: "user",
              isActive: true,
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
            },
            {
              _id: "2",
              name: "Sita Devi Thapa",
              email: "sita@example.com",
              phone: "9841234568",
              role: "user",
              isActive: true,
              createdAt: new Date().toISOString(),
            },
          ];
          setAllUsers(mockUsers);
          setRecentUsers(mockUsers);
        }

        // Handle services data
        if (servicesResponse.status === "fulfilled") {
          const services = servicesResponse.value.services || [];
          setAllServices(services);
        } else {
          // Fallback services
          const mockServices = [
            {
              _id: "1",
              name: "Kathmandu to Pokhara Bus",
              description: "Comfortable AC bus service",
              type: "bus",
              category: "Transportation",
              pricing: { basePrice: 800, currency: "₨" },
              isActive: true,
              isFeatured: true,
              rating: { average: 4.5, count: 120 },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ];
          setAllServices(mockServices);
        }

        // Handle bookings data
        if (bookingsResponse.status === "fulfilled") {
          const bookings = bookingsResponse.value.bookings || [];
          setAllBookings(bookings);
          setRecentBookings(bookings.slice(0, 5));
        } else {
          // Fallback bookings
          const mockBookings = [
            {
              _id: "1",
              user: { _id: "1", name: "Ram Kumar", email: "ram@example.com" },
              service: { _id: "1", name: "Kathmandu Bus", type: "bus" },
              totalAmount: 800,
              status: "confirmed",
              createdAt: new Date().toISOString(),
              bookingDate: new Date().toISOString(),
            },
          ];
          setAllBookings(mockBookings);
          setRecentBookings(mockBookings);
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);

        // Only show error toast for authenticated users, not in demo mode
        if (!isDemoMode) {
          toast({
            title: "Error",
            description: "Failed to load dashboard data. Using demo data.",
            variant: "destructive",
          });
        }

        // Fallback to demo data
        setStats({
          totalUsers: 125,
          totalServices: 25,
          totalBookings: 340,
          totalRevenue: 125000,
          recentUsers: 8,
          activeServices: 22,
          pendingBookings: 12,
          monthlyRevenue: 25000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [toast, isDemoMode]);

  useEffect(() => {
    // Only redirect if user is authenticated but not admin (allow demo mode)
    if (!isLoading && isAuthenticated && user && user.role !== "admin") {
      toast({
        title: "Access Denied",
        description: "Admin privileges required to access this page.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [user, isAuthenticated, isLoading, navigate, toast]);

  // Service management functions
  const handleServiceSubmit = async () => {
    try {
      const serviceData = {
        ...serviceForm,
        pricing: {
          basePrice: parseFloat(serviceForm.basePrice),
          currency: "₨",
        },
      };

      if (editingService) {
        await servicesAPI.updateService(editingService._id, serviceData);
        toast({
          title: "Success",
          description: "Service updated successfully.",
        });
      } else {
        await servicesAPI.createService(serviceData);
        toast({
          title: "Success",
          description: "Service created successfully.",
        });
      }

      // Reload services
      const response = await servicesAPI.getAllServices({ limit: 100 });
      setAllServices(response.services || []);

      // Reset form
      setServiceForm({
        name: "",
        description: "",
        type: "bus",
        category: "",
        basePrice: "",
        isActive: true,
        isFeatured: false,
      });
      setEditingService(null);
      setIsServiceDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save service.",
        variant: "destructive",
      });
    }
  };

  const handleServiceEdit = (service: Service) => {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      description: service.description,
      type: service.type,
      category: service.category,
      basePrice: (service.pricing?.basePrice || 0).toString(),
      isActive: service.isActive,
      isFeatured: service.isFeatured,
    });
    setIsServiceDialogOpen(true);
  };

  const handleServiceDelete = async (serviceId: string) => {
    try {
      await servicesAPI.deleteService(serviceId);
      setAllServices((prev) => prev.filter((s) => s._id !== serviceId));
      toast({
        title: "Success",
        description: "Service deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete service.",
        variant: "destructive",
      });
    }
  };

  // User management functions
  const handleUserSubmit = async () => {
    try {
      if (editingUser) {
        await userAPI.updateUser(editingUser._id, userForm);
        toast({
          title: "Success",
          description: "User updated successfully.",
        });
      } else {
        await userAPI.createUser(userForm);
        toast({
          title: "Success",
          description: "User created successfully.",
        });
      }

      // Reload users
      const response = await userAPI.getAllUsers();
      const users = response.users || [];
      setAllUsers(users);
      setRecentUsers(users.slice(0, 5));

      // Reset form
      setUserForm({
        name: "",
        email: "",
        phone: "",
        role: "user",
        isActive: true,
      });
      setEditingUser(null);
      setIsUserDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save user.",
        variant: "destructive",
      });
    }
  };

  const handleUserEdit = (user: RecentUser) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
    });
    setIsUserDialogOpen(true);
  };

  const handleUserDelete = async (userId: string) => {
    try {
      await userAPI.deleteUser(userId);
      setAllUsers((prev) => prev.filter((u) => u._id !== userId));
      setRecentUsers((prev) => prev.filter((u) => u._id !== userId));
      toast({
        title: "Success",
        description: "User deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      cancelled: { color: "bg-red-100 text-red-800", icon: XCircle },
      in_progress: { color: "bg-blue-100 text-blue-800", icon: Activity },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {status.replace("_", " ")}
      </Badge>
    );
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      change: "+12%",
      changeType: "positive" as const,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Services",
      value: stats.activeServices.toString(),
      change: "+3%",
      changeType: "positive" as const,
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings.toLocaleString(),
      change: "+8%",
      changeType: "positive" as const,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Revenue",
      value: `₨ ${stats.totalRevenue.toLocaleString()}`,
      change: "+15%",
      changeType: "positive" as const,
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  if (!isAuthenticated || (user && user.role !== "admin")) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600 mb-8">
              Admin privileges required to access this dashboard.
            </p>
            <div className="space-y-4">
              <Link to="/login">
                <Button className="w-full">Login as Admin</Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="w-full">
                  Go Home
                </Button>
              </Link>
            </div>
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">
                Demo Admin Access
              </h3>
              <p className="text-sm text-blue-600">
                Email: admin@demo.com
                <br />
                Password: demo123
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Demo Mode Banner */}
        {isDemoMode && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">i</span>
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-blue-800">
                  Demo Mode - Admin Dashboard Preview
                </h3>
                <p className="text-blue-600 mt-1">
                  You're viewing the admin dashboard in demo mode. Login with
                  admin@demo.com / demo123 for full functionality.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome{user?.name ? `, ${user.name}` : " to the admin panel"}!
              Here's what's happening with Kanxa Safari.
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => ExportService.exportUsers(allUsers)}
                  disabled={isLoading}
                >
                  Export Users ({allUsers.length})
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => ExportService.exportServices(allServices)}
                  disabled={isLoading}
                >
                  Export Services ({allServices.length})
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => ExportService.exportBookings(allBookings)}
                  disabled={isLoading}
                >
                  Export Bookings ({allBookings.length})
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => ExportService.exportFinancialReport({
                    totalRevenue: stats.totalRevenue,
                    monthlyRevenue: stats.monthlyRevenue,
                    bookings: allBookings
                  })}
                  disabled={isLoading}
                >
                  Financial Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
            <Button size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mb-1">
                        {stat.value}
                      </p>
                      <div className="flex items-center">
                        {stat.changeType === "positive" ? (
                          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                        )}
                        <span
                          className={`text-sm font-medium ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"}`}
                        >
                          {stat.change}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">
                          from last month
                        </span>
                      </div>
                    </div>
                    <div className={`${stat.bgColor} p-3 rounded-full`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="premium">Premium</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Bookings */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Bookings</CardTitle>
                    <CardDescription>Latest customer bookings</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="#" onClick={() => setActiveTab("bookings")}>
                      View All
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <div
                        key={booking._id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            {booking.user?.name || 'User not available'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {booking.service?.name || 'Service not available'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-sm font-medium">
                            ₨ {(booking.totalAmount || 0).toLocaleString()}
                          </p>
                          {getStatusBadge(booking.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Users */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>New Users</CardTitle>
                    <CardDescription>Recently registered users</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="#" onClick={() => setActiveTab("users")}>
                      View All
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentUsers.map((user) => (
                      <div
                        key={user._id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-sm text-gray-600">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={user.isActive ? "default" : "secondary"}
                          >
                            {user.role}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Manage system users and their permissions
                  </CardDescription>
                </div>
                <Button onClick={() => setIsUserDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search users..." className="pl-10" />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allUsers.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-600">
                              {user.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{user.phone}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.role === "admin" ? "default" : "secondary"
                            }
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={user.isActive ? "default" : "secondary"}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => handleUserEdit(user)}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleUserDelete(user._id)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Service Management</CardTitle>
                  <CardDescription>
                    Manage available services and their details
                  </CardDescription>
                </div>
                <Button onClick={() => setIsServiceDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search services..." className="pl-10" />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allServices.map((service) => (
                      <TableRow key={service._id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{service.name}</p>
                            <p className="text-sm text-gray-600 max-w-xs truncate">
                              {service.description}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{service.type}</Badge>
                        </TableCell>
                        <TableCell>{service.category}</TableCell>
                        <TableCell>
                          ₨ {(service.pricing?.basePrice || 0).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <span className="text-sm font-medium">
                              {service.rating?.average?.toFixed(1) || 'N/A'}
                            </span>
                            <span className="text-sm text-gray-500">
                              ({service.rating?.count || 0})
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col space-y-1">
                            <Badge
                              variant={
                                service.isActive ? "default" : "secondary"
                              }
                            >
                              {service.isActive ? "Active" : "Inactive"}
                            </Badge>
                            {service.isFeatured && (
                              <Badge variant="outline" className="text-xs">
                                Featured
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => handleServiceEdit(service)}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  const serviceData = [{
                                    id: service._id,
                                    name: service.name,
                                    type: service.type,
                                    price: service.pricing?.basePrice || 0,
                                    status: service.isActive ? 'Active' : 'Inactive'
                                  }];
                                  ExportService.exportData(serviceData, {
                                    format: 'csv',
                                    filename: `service_${service.name.replace(/\s+/g, '_').toLowerCase()}`
                                  });
                                }}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Export Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleServiceDelete(service._id)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Management</CardTitle>
                <CardDescription>
                  Monitor and manage customer bookings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search bookings..." className="pl-10" />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allBookings.map((booking) => (
                      <TableRow key={booking._id}>
                        <TableCell className="font-mono text-sm">
                          {booking._id.slice(-8).toUpperCase()}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{booking.user?.name || 'User not available'}</p>
                            <p className="text-sm text-gray-600">
                              {booking.user?.email || 'Email not available'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {booking.service?.name || 'Service not available'}
                            </p>
                            <Badge variant="outline" className="mt-1">
                              {booking.service?.type || 'N/A'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          ₨ {(booking.totalAmount || 0).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {new Date(booking.bookingDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => ExportService.exportInvoice(booking)}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download Invoice
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Update Status
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Revenue Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                      <div>
                        <p className="text-sm text-blue-600">This Month</p>
                        <p className="text-2xl font-bold text-blue-800">
                          ₨ {stats.monthlyRevenue.toLocaleString()}
                        </p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Transportation</span>
                        <span>60%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: "60%" }}
                        ></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Construction</span>
                        <span>25%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: "25%" }}
                        ></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Tours</span>
                        <span>15%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: "15%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="w-5 h-5 mr-2" />
                    Service Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.activeServices}
                      </p>
                      <p className="text-sm text-gray-600">Active Services</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Bus Services</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-12 h-2 bg-gray-200 rounded-full">
                            <div className="w-10 h-2 bg-blue-600 rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium">12</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Tours</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-12 h-2 bg-gray-200 rounded-full">
                            <div className="w-8 h-2 bg-green-600 rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium">8</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Construction</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-12 h-2 bg-gray-200 rounded-full">
                            <div className="w-6 h-2 bg-purple-600 rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium">5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Premium Analytics Tab */}
          <TabsContent value="premium" className="space-y-6">
            <PremiumAnalytics />
          </TabsContent>
        </Tabs>

        {/* Service Dialog */}
        <Dialog
          open={isServiceDialogOpen}
          onOpenChange={setIsServiceDialogOpen}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingService ? "Edit Service" : "Add New Service"}
              </DialogTitle>
              <DialogDescription>
                {editingService
                  ? "Update service details"
                  : "Create a new service for customers to book"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Service Name</Label>
                <Input
                  id="name"
                  value={serviceForm.name}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, name: e.target.value })
                  }
                  placeholder="Enter service name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={serviceForm.description}
                  onChange={(e) =>
                    setServiceForm({
                      ...serviceForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter service description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={serviceForm.type}
                    onValueChange={(value) =>
                      setServiceForm({ ...serviceForm, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bus">Bus</SelectItem>
                      <SelectItem value="tour">Tour</SelectItem>
                      <SelectItem value="cargo">Cargo</SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                      <SelectItem value="garage">Garage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={serviceForm.category}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
                        category: e.target.value,
                      })
                    }
                    placeholder="Category"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="basePrice">Base Price (₨)</Label>
                <Input
                  id="basePrice"
                  type="number"
                  value={serviceForm.basePrice}
                  onChange={(e) =>
                    setServiceForm({
                      ...serviceForm,
                      basePrice: e.target.value,
                    })
                  }
                  placeholder="Enter base price"
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={serviceForm.isActive}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
                        isActive: e.target.checked,
                      })
                    }
                  />
                  <span className="text-sm">Active</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={serviceForm.isFeatured}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
                        isFeatured: e.target.checked,
                      })
                    }
                  />
                  <span className="text-sm">Featured</span>
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsServiceDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleServiceSubmit}>
                {editingService ? "Update" : "Create"} Service
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* User Dialog */}
        <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? "Edit User" : "Add New User"}
              </DialogTitle>
              <DialogDescription>
                {editingUser
                  ? "Update user details and permissions"
                  : "Create a new user account"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="userName">Full Name</Label>
                <Input
                  id="userName"
                  value={userForm.name}
                  onChange={(e) =>
                    setUserForm({ ...userForm, name: e.target.value })
                  }
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="userEmail">Email</Label>
                <Input
                  id="userEmail"
                  type="email"
                  value={userForm.email}
                  onChange={(e) =>
                    setUserForm({ ...userForm, email: e.target.value })
                  }
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="userPhone">Phone</Label>
                <Input
                  id="userPhone"
                  value={userForm.phone}
                  onChange={(e) =>
                    setUserForm({ ...userForm, phone: e.target.value })
                  }
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="userRole">Role</Label>
                <Select
                  value={userForm.role}
                  onValueChange={(value) =>
                    setUserForm({ ...userForm, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="userActive"
                  checked={userForm.isActive}
                  onChange={(e) =>
                    setUserForm({ ...userForm, isActive: e.target.checked })
                  }
                />
                <Label htmlFor="userActive">Active Account</Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsUserDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUserSubmit}>
                {editingUser ? "Update" : "Create"} User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
