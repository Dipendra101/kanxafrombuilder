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
  RefreshCw,
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
  });

  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [allUsers, setAllUsers] = useState<RecentUser[]>([]);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [allBookings, setAllBookings] = useState<RecentBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Production-ready admin access check
  const isAdmin = isAuthenticated && !isGuest && user?.role === "admin";
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

  // Search and filter states
  const [userSearch, setUserSearch] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");
  const [bookingSearch, setBookingSearch] = useState("");

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

        console.log("Loading admin dashboard data...");

        const [
          dashboardResponse,
          usersResponse,
          servicesResponse,
          bookingsResponse,
        ] = await Promise.all([
          adminAPI.getDashboard(),
          userAPI.getAllUsers(),
          servicesAPI.getAllServices({ limit: 100 }),
          bookingsAPI.getAllBookings({ limit: 100 }),
        ]);

        // Set stats
        setStats(dashboardResponse.data);

        // Set users
        const users = usersResponse.users || [];
        setAllUsers(users);
        setRecentUsers(users.slice(0, 5));

        // Set services
        const services = servicesResponse.services || [];
        setAllServices(services);

        // Set bookings
        const bookings = bookingsResponse.bookings || [];
        setAllBookings(bookings);
        setRecentBookings(bookings.slice(0, 5));

        console.log("Dashboard data loaded successfully");
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
  }, [isAdmin, toast]);

  // Redirect non-admin users
  useEffect(() => {
    if (
      !isLoading &&
      (!isAuthenticated || isGuest || !user || user.role !== "admin")
    ) {
      navigate("/");
    }
  }, [user, isAuthenticated, isGuest, isLoading, navigate]);

  // Service management functions
  const handleServiceSubmit = async () => {
    if (!isAdmin) return;

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
    if (!isAdmin) return;

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
    if (!isAdmin) return;

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
    if (!isAdmin) return;

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

  // Filter functions
  const filteredUsers = allUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase()),
  );

  const filteredServices = allServices.filter(
    (service) =>
      service.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      service.type.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      service.category.toLowerCase().includes(serviceSearch.toLowerCase()),
  );

  const filteredBookings = allBookings.filter(
    (booking) =>
      booking.user?.name.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      booking.service?.name
        .toLowerCase()
        .includes(bookingSearch.toLowerCase()) ||
      booking._id.toLowerCase().includes(bookingSearch.toLowerCase()),
  );

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
              <p className="text-gray-600">Loading dashboard...</p>
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome, {user.name}! Here's what's happening with Kanxa Safari.
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
                    {recentBookings.length > 0 ? (
                      recentBookings.map((booking) => (
                        <div
                          key={booking._id}
                          className="flex items-center justify-between p-4 border rounded-lg"
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
                    <Input
                      placeholder="Search users..."
                      className="pl-10"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                    />
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
                    {filteredUsers.map((user) => (
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
                    Manage all services - buses, cargo, tours, materials, and
                    more
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
                    <Input
                      placeholder="Search services..."
                      className="pl-10"
                      value={serviceSearch}
                      onChange={(e) => setServiceSearch(e.target.value)}
                    />
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
                    {filteredServices.map((service) => (
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
                              {service.rating?.average?.toFixed(1) || "N/A"}
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
                                  const serviceData = [
                                    {
                                      id: service._id,
                                      name: service.name,
                                      type: service.type,
                                      price: service.pricing?.basePrice || 0,
                                      status: service.isActive
                                        ? "Active"
                                        : "Inactive",
                                    },
                                  ];
                                  ExportService.exportData(serviceData, {
                                    format: "csv",
                                    filename: `service_${service.name.replace(/\s+/g, "_").toLowerCase()}`,
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
                    <Input
                      placeholder="Search bookings..."
                      className="pl-10"
                      value={bookingSearch}
                      onChange={(e) => setBookingSearch(e.target.value)}
                    />
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
                    {filteredBookings.map((booking) => (
                      <TableRow key={booking._id}>
                        <TableCell className="font-mono text-sm">
                          {booking._id.slice(-8).toUpperCase()}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {booking.user?.name || "User not available"}
                            </p>
                            <p className="text-sm text-gray-600">
                              {booking.user?.email || "Email not available"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {booking.service?.name || "Service not available"}
                            </p>
                            <Badge variant="outline" className="mt-1">
                              {booking.service?.type || "N/A"}
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
                                onClick={() =>
                                  ExportService.exportInvoice(booking)
                                }
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
                        <span>Materials</span>
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
                        <span className="text-sm">Materials</span>
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
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingService ? "Edit Service" : "Add New Service"}
              </DialogTitle>
              <DialogDescription>
                {editingService
                  ? "Update the service details below."
                  : "Create a new service for your platform."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={serviceForm.name}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, name: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={serviceForm.description}
                  onChange={(e) =>
                    setServiceForm({
                      ...serviceForm,
                      description: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select
                  value={serviceForm.type}
                  onValueChange={(value) =>
                    setServiceForm({ ...serviceForm, type: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bus">Bus Transportation</SelectItem>
                    <SelectItem value="cargo">Cargo Services</SelectItem>
                    <SelectItem value="tour">Tour Packages</SelectItem>
                    <SelectItem value="material">
                      Construction Materials
                    </SelectItem>
                    <SelectItem value="garage">Garage Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Input
                  id="category"
                  value={serviceForm.category}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, category: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="basePrice" className="text-right">
                  Base Price (₨)
                </Label>
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
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsServiceDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleServiceSubmit}>
                {editingService ? "Update" : "Create"} Service
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* User Dialog */}
        <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? "Edit User" : "Add New User"}
              </DialogTitle>
              <DialogDescription>
                {editingUser
                  ? "Update the user details below."
                  : "Create a new user account."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="userName" className="text-right">
                  Name
                </Label>
                <Input
                  id="userName"
                  value={userForm.name}
                  onChange={(e) =>
                    setUserForm({ ...userForm, name: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="userEmail" className="text-right">
                  Email
                </Label>
                <Input
                  id="userEmail"
                  type="email"
                  value={userForm.email}
                  onChange={(e) =>
                    setUserForm({ ...userForm, email: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="userPhone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="userPhone"
                  value={userForm.phone}
                  onChange={(e) =>
                    setUserForm({ ...userForm, phone: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="userRole" className="text-right">
                  Role
                </Label>
                <Select
                  value={userForm.role}
                  onValueChange={(value) =>
                    setUserForm({ ...userForm, role: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select user role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsUserDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleUserSubmit}>
                {editingUser ? "Update" : "Create"} User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
