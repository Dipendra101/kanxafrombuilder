import { useState } from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Bus,
  Building,
  Wrench,
  Package,
  CreditCard,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  MapPin,
  Truck,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

// Admin Sub-pages
import AdminDashboard from "./admin/Dashboard";
import AdminUsers from "./admin/Users";
import AdminTransportation from "./admin/Transportation";
import AdminConstruction from "./admin/Construction";
import AdminGarage from "./admin/Garage";
import AdminOrders from "./admin/Orders";
import AdminPayments from "./admin/Payments";
import AdminAnalytics from "./admin/Analytics";
import AdminSettings from "./admin/Settings";

export default function Admin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the admin panel.",
    });
    navigate("/admin/login");
  };

  const navigation = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: "/admin",
    },
    {
      id: "users",
      name: "Users",
      icon: <Users className="h-5 w-5" />,
      path: "/admin/users",
    },
    {
      id: "transportation",
      name: "Transportation",
      icon: <Bus className="h-5 w-5" />,
      path: "/admin/transportation",
    },
    {
      id: "construction",
      name: "Construction",
      icon: <Building className="h-5 w-5" />,
      path: "/admin/construction",
    },
    {
      id: "garage",
      name: "Garage",
      icon: <Wrench className="h-5 w-5" />,
      path: "/admin/garage",
    },
    {
      id: "orders",
      name: "Orders",
      icon: <Package className="h-5 w-5" />,
      path: "/admin/orders",
    },
    {
      id: "payments",
      name: "Payments",
      icon: <CreditCard className="h-5 w-5" />,
      path: "/admin/payments",
    },
    {
      id: "analytics",
      name: "Analytics",
      icon: <BarChart3 className="h-5 w-5" />,
      path: "/admin/analytics",
    },
    {
      id: "settings",
      name: "Settings",
      icon: <Settings className="h-5 w-5" />,
      path: "/admin/settings",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-br from-kanxa-blue to-kanxa-orange rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">KS</span>
              </div>
              <span className="text-xl font-bold text-kanxa-navy">
                Admin Panel
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? "bg-kanxa-blue text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                {navigation.find(nav => nav.id === activeTab)?.name || "Dashboard"}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-kanxa-blue rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">A</span>
                </div>
                <span className="text-sm font-medium text-gray-700">Admin</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-6">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/transportation" element={<AdminTransportation />} />
            <Route path="/construction" element={<AdminConstruction />} />
            <Route path="/garage" element={<AdminGarage />} />
            <Route path="/orders" element={<AdminOrders />} />
            <Route path="/payments" element={<AdminPayments />} />
            <Route path="/analytics" element={<AdminAnalytics />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
