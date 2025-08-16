import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  FileText,
  Calendar,
  DollarSign,
  TrendingUp,
  Settings,
  RefreshCw,
  BarChart3,
  Bus,
  Truck,
  Hammer,
  MapPin,
  Wrench,
  Package,
  AlertTriangle,
  Plus,
  Download,
  Bell,
  Activity
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { adminAPI, servicesAPI, bookingsAPI, userAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast-simple";
import ExportService from "@/services/exportService";
import PremiumAnalytics from "@/components/analytics/PremiumAnalytics";

// Import specialized service managers
import BusServiceManager from "@/components/admin/services/BusServiceManager";
import CargoServiceManager from "@/components/admin/services/CargoServiceManager";
import MaterialsServiceManager from "@/components/admin/services/MaterialsServiceManager";

interface DashboardStats {
  totalUsers: number;
  totalServices: number;
  totalBookings: number;
  totalRevenue: number;
  recentUsers: number;
  activeServices: number;
  pendingBookings: number;
  monthlyRevenue: number;
  servicesByType: {
    bus: number;
    cargo: number;
    construction: number;
    tour: number;
    garage: number;
  };
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

export default function EnhancedAdminDashboard() {
  const { user, isAuthenticated, isGuest } = useAuth();
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
    servicesByType: {
      bus: 0,
      cargo: 0,
      construction: 0,
      tour: 0,
      garage: 0,
    },
  });

  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [allUsers, setAllUsers] = useState<RecentUser[]>([]);
  const [allBookings, setAllBookings] = useState<RecentBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Production-ready admin access check
  const isAdmin = isAuthenticated && !isGuest && user?.role === "admin";
  const [activeTab, setActiveTab] = useState("overview");

  // Load dashboard data with production-ready error handling
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!isAdmin) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        console.log("Loading enhanced admin dashboard data...");

        const [
          dashboardResponse,
          usersResponse,
          bookingsResponse,
        ] = await Promise.all([
          adminAPI.getDashboard(),
          userAPI.getAllUsers(),
          bookingsAPI.getAllBookings({ limit: 100 }),
        ]);

        // Set stats
        setStats(dashboardResponse.data);

        // Set users
        const users = usersResponse.users || [];
        setAllUsers(users);
        setRecentUsers(users.slice(0, 5));

        // Set bookings
        const bookings = bookingsResponse.bookings || [];
        setAllBookings(bookings);
        setRecentBookings(bookings.slice(0, 5));

        console.log("Enhanced dashboard data loaded successfully");
      } catch (error: any) {
        console.error("Failed to load dashboard data:", error);
        setError(error.message || "Failed to load dashboard data");

        toast({
          title: "Error",
          description:
            "Failed to load dashboard data. Please try refreshing the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [isAdmin]);

  // Redirect non-admin users
  useEffect(() => {
    if (
      !isLoading &&
      (!isAuthenticated || isGuest || !user || user.role !== "admin")
    ) {
      navigate("/");
    }
  }, [user, isAuthenticated, isGuest, isLoading, navigate]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { color: "bg-green-100 text-green-800", label: "Confirmed" },
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      cancelled: { color: "bg-red-100 text-red-800", label: "Cancelled" },
      in_progress: { color: "bg-blue-100 text-blue-800", label: "In Progress" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <Badge className={`${config.color}`}>
        {config.label}
      </Badge>
    );
  };

  const serviceTypeStats = [
    {
      title: "Bus Services",
      value: stats.servicesByType?.bus || 0,
      icon: Bus,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Transportation routes"
    },
    {
      title: "Cargo Services", 
      value: stats.servicesByType?.cargo || 0,
      icon: Truck,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Logistics & delivery"
    },
    {
      title: "Construction Materials",
      value: stats.servicesByType?.construction || 0,
      icon: Hammer,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Building supplies"
    },
    {
      title: "Tour Packages",
      value: stats.servicesByType?.tour || 0,
      icon: MapPin,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Adventure tours"
    },
    {
      title: "Garage Services",
      value: stats.servicesByType?.garage || 0,
      icon: Wrench,
      color: "text-red-600",
      bgColor: "bg-red-50",
      description: "Vehicle maintenance"
    },
  ];

  const quickActions = [
    {
      title: "Add Bus Service",
      description: "Create new bus route",
      icon: Bus,
      action: () => setActiveTab("bus-services"),
      color: "bg-blue-500"
    },
    {
      title: "Add Cargo Service",
      description: "Setup cargo transport",
      icon: Truck,
      action: () => setActiveTab("cargo-services"),
      color: "bg-green-500"
    },
    {
      title: "Add Materials",
      description: "List construction items",
      icon: Hammer,
      action: () => setActiveTab("materials-services"),
      color: "bg-orange-500"
    },
    {
      title: "View Analytics",
      description: "Detailed insights",
      icon: BarChart3,
      action: () => setActiveTab("premium"),
      color: "bg-purple-500"
    }
  ];

  // Access denied for non-admin users
  if (!isAuthenticated || isGuest || !user || user.role !== "admin") {
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
              <p className="text-gray-600">Loading enhanced dashboard...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Error Loading Dashboard
            </h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Enhanced Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back, {user.name}! Manage your transportation and logistics platform.
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
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
                  onClick={() => ExportService.exportBookings(allBookings)}
                  disabled={isLoading}
                >
                  Export Bookings ({allBookings.length})
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    ExportService.exportFinancialReport({
                      totalRevenue: stats.totalRevenue,
                      monthlyRevenue: stats.monthlyRevenue,
                      bookings: allBookings,
                    })
                  }
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

        {/* Service Type Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {serviceTypeStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mb-1">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500">
                        {stat.description}
                      </p>
                    </div>
                    <div className={`${stat.bgColor} p-3 rounded-lg`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
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
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bus-services">Bus Services</TabsTrigger>
            <TabsTrigger value="cargo-services">Cargo</TabsTrigger>
            <TabsTrigger value="materials-services">Materials</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="premium">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Frequently used admin functions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-20 flex-col space-y-2 hover:shadow-md"
                        onClick={action.action}
                      >
                        <div className={`${action.color} p-2 rounded-lg`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-sm">{action.title}</p>
                          <p className="text-xs text-gray-600">{action.description}</p>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Total Users
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mb-1">
                        {stats.totalUsers.toLocaleString()}
                      </p>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm font-medium text-green-600">
                          +12%
                        </span>
                        <span className="text-sm text-gray-500 ml-1">
                          from last month
                        </span>
                      </div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-full">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Active Services
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mb-1">
                        {stats.activeServices.toString()}
                      </p>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm font-medium text-green-600">
                          +5%
                        </span>
                        <span className="text-sm text-gray-500 ml-1">
                          this week
                        </span>
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-full">
                      <FileText className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Total Bookings
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mb-1">
                        {stats.totalBookings.toLocaleString()}
                      </p>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm font-medium text-green-600">
                          +8%
                        </span>
                        <span className="text-sm text-gray-500 ml-1">
                          from last month
                        </span>
                      </div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-full">
                      <Calendar className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Total Revenue
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mb-1">
                        ₨ {stats.totalRevenue.toLocaleString()}
                      </p>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm font-medium text-green-600">
                          +15%
                        </span>
                        <span className="text-sm text-gray-500 ml-1">
                          from last month
                        </span>
                      </div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-full">
                      <DollarSign className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
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
                    {recentBookings.length > 0 ? (
                      recentBookings.map((booking) => (
                        <div
                          key={booking._id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="space-y-1">
                            <p className="text-sm font-medium">
                              {booking.user?.name || "User not available"}
                            </p>
                            <p className="text-sm text-gray-600">
                              {booking.service?.name || "Service not available"}
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
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No recent bookings</p>
                      </div>
                    )}
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
                    {recentUsers.length > 0 ? (
                      recentUsers.map((user) => (
                        <div
                          key={user._id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
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
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No recent users</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Specialized Service Management Tabs */}
          <TabsContent value="bus-services" className="space-y-6">
            <BusServiceManager />
          </TabsContent>

          <TabsContent value="cargo-services" className="space-y-6">
            <CargoServiceManager />
          </TabsContent>

          <TabsContent value="materials-services" className="space-y-6">
            <MaterialsServiceManager />
          </TabsContent>

          {/* Legacy tabs for compatibility */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage system users and their permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  User management functionality - coming soon in next update
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Management</CardTitle>
                <CardDescription>
                  Monitor and manage customer bookings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Booking management functionality - coming soon in next update
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Premium Analytics Tab */}
          <TabsContent value="premium" className="space-y-6">
            <PremiumAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
