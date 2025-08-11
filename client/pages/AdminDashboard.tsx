import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalServices: 0,
    totalBookings: 0,
    totalRevenue: 0,
    recentUsers: 0,
    activeServices: 0,
    pendingBookings: 0,
    monthlyRevenue: 0
  });

  const [recentBookings, setRecentBookings] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockStats = {
      totalUsers: 1247,
      totalServices: 56,
      totalBookings: 2843,
      totalRevenue: 1250000,
      recentUsers: 23,
      activeServices: 48,
      pendingBookings: 15,
      monthlyRevenue: 186000
    };

    const mockRecentBookings = [
      {
        id: "KS24081000001",
        user: "Ram Kumar Sharma",
        service: "Lamjung → Kathmandu Bus",
        amount: 800,
        status: "confirmed",
        date: "2024-08-11"
      },
      {
        id: "KS24081000002",
        user: "Sita Devi Thapa",
        service: "Construction Materials",
        amount: 15000,
        status: "pending",
        date: "2024-08-11"
      },
      {
        id: "KS24081000003",
        user: "Bikram Ale",
        service: "Tractor Maintenance",
        amount: 5000,
        status: "in_progress",
        date: "2024-08-10"
      }
    ];

    const mockRecentUsers = [
      {
        id: "1",
        name: "Dipendra Ghimire",
        email: "dipendra@example.com",
        role: "user",
        joinDate: "2024-08-11",
        status: "active"
      },
      {
        id: "2",
        name: "Krishna Bahadur",
        email: "krishna@example.com",
        role: "user",
        joinDate: "2024-08-10",
        status: "active"
      }
    ];

    setTimeout(() => {
      setStats(mockStats);
      setRecentBookings(mockRecentBookings as any);
      setRecentUsers(mockRecentUsers as any);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Redirect if not admin
  if (user?.role !== 'admin') {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">You don't have permission to access the admin dashboard.</p>
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      change: "+12%",
      changeType: "positive" as const,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Active Services",
      value: stats.activeServices.toString(),
      change: "+3%",
      changeType: "positive" as const,
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings.toLocaleString(),
      change: "+8%",
      changeType: "positive" as const,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Total Revenue",
      value: `NPR ${(stats.totalRevenue / 1000).toFixed(0)}K`,
      change: "+15%",
      changeType: "positive" as const,
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
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
            <h1 className="text-3xl font-bold text-kanxa-navy mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name}! Here's your business overview.</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button size="sm" className="bg-kanxa-blue hover:bg-kanxa-blue/90">
              <Plus className="w-4 h-4 mr-2" />
              Add New
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                    <p className="text-2xl font-bold text-kanxa-navy">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      {stat.changeType === "positive" ? (
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs last month</span>
                    </div>
                  </div>
                  <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Bookings */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Bookings</CardTitle>
                    <Link to="/admin/bookings">
                      <Button variant="ghost" size="sm">View All</Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentBookings.map((booking: any) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{booking.user}</p>
                          <p className="text-xs text-gray-600">{booking.service}</p>
                          <p className="text-xs text-gray-500">#{booking.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">NPR {booking.amount.toLocaleString()}</p>
                          <Badge 
                            variant={
                              booking.status === 'confirmed' ? 'default' :
                              booking.status === 'pending' ? 'secondary' : 'outline'
                            }
                            className="text-xs"
                          >
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Users */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Users</CardTitle>
                    <Link to="/admin/users">
                      <Button variant="ghost" size="sm">View All</Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentUsers.map((user: any) => (
                      <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-kanxa-blue rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-gray-600">{user.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="text-xs">
                            {user.role}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">{user.joinDate}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used admin actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link to="/admin/services/new">
                    <Button variant="outline" className="w-full h-20 flex flex-col">
                      <Plus className="w-6 h-6 mb-2" />
                      Add New Service
                    </Button>
                  </Link>
                  <Link to="/admin/users">
                    <Button variant="outline" className="w-full h-20 flex flex-col">
                      <Users className="w-6 h-6 mb-2" />
                      Manage Users
                    </Button>
                  </Link>
                  <Link to="/admin/bookings">
                    <Button variant="outline" className="w-full h-20 flex flex-col">
                      <Calendar className="w-6 h-6 mb-2" />
                      View Bookings
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Bookings Management</h2>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input placeholder="Search bookings..." className="pl-10 w-64" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
            
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentBookings.map((booking: any) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">#{booking.id}</TableCell>
                      <TableCell>{booking.user}</TableCell>
                      <TableCell>{booking.service}</TableCell>
                      <TableCell>NPR {booking.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={
                          booking.status === 'confirmed' ? 'default' :
                          booking.status === 'pending' ? 'secondary' : 'outline'
                        }>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{booking.date}</TableCell>
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
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Cancel</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Users Management</h2>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input placeholder="Search users..." className="pl-10 w-64" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button size="sm" className="bg-kanxa-blue hover:bg-kanxa-blue/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>
            
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((user: any) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-kanxa-blue rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {user.name.charAt(0)}
                          </div>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.joinDate}</TableCell>
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
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit User</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Services Management</h2>
              <Button size="sm" className="bg-kanxa-blue hover:bg-kanxa-blue/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {['Bus Services', 'Cargo Services', 'Construction Materials', 'Garage Services', 'Tour Packages'].map((service, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{service}</CardTitle>
                    <CardDescription>Manage {service.toLowerCase()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold">{Math.floor(Math.random() * 20) + 5}</span>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Manage {service}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Analytics & Reports</h2>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Revenue Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                    <p className="text-gray-500">Revenue Chart Placeholder</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="w-5 h-5 mr-2" />
                    Service Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                    <p className="text-gray-500">Service Chart Placeholder</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    User Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                    <p className="text-gray-500">Activity Chart Placeholder</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Conversion Rate</span>
                      <span className="font-semibold">12.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Avg. Booking Value</span>
                      <span className="font-semibold">NPR 4,200</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Customer Retention</span>
                      <span className="font-semibold">68%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Monthly Growth</span>
                      <span className="font-semibold text-green-600">+15.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
