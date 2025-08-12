import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot, Root } from "react-dom/client"; // 1. Import the 'Root' type
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Transportation from "./pages/Transportation";
import Construction from "./pages/Construction";
import Garage from "./pages/Garage";
import About from "./pages/About";
import Buses from "./pages/Buses";
import Cargo from "./pages/Cargo";
import Tours from "./pages/Tours";
import Materials from "./pages/Materials";
import Machinery from "./pages/Machinery";
import Booking from "./pages/Booking";
import RoutesPage from "./pages/Routes";
import Support from "./pages/Support";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Chat from "./pages/Chat";
import AdminDashboard from "./pages/AdminDashboard";
import AdminDashboardSimple from "./pages/AdminDashboardSimple";
import AdminTest from "./pages/AdminTest";
import SmsTest from "./pages/SmsTest";
import EnhancedBooking from "./pages/EnhancedBooking";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />

            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Main Service Routes */}
            <Route path="/transportation" element={<Transportation />} />
            <Route path="/construction" element={<Construction />} />
            <Route path="/garage" element={<Garage />} />
            <Route path="/about" element={<About />} />

            {/* Transportation Sub-routes */}
            <Route path="/buses" element={<Buses />} />
            <Route path="/cargo" element={<Cargo />} />
            <Route path="/tours" element={<Tours />} />

            {/* Construction Sub-routes */}
            <Route path="/materials" element={<Materials />} />
            <Route path="/machinery" element={<Machinery />} />

            {/* User Account Routes */}
            <Route path="/booking" element={<Booking />} />
            <Route path="/bookings" element={<Booking />} />
            <Route path="/book" element={<EnhancedBooking />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/chat" element={<Chat />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin-simple" element={<AdminDashboardSimple />} />
            <Route path="/AdminDashboardSimple" element={<AdminDashboardSimple />} />
            <Route path="/admin-test" element={<AdminTest />} />
            <Route path="/AdminTest" element={<AdminTest />} />
            <Route path="/sms-test" element={<SmsTest />} />
            <Route path="/SmsTest" element={<SmsTest />} />

            {/* Information & Support Routes */}
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/support" element={<Support />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// 2. Define a custom interface for our root container
interface RootContainer extends HTMLElement {
  _reactRootContainer?: Root;
}

const container = document.getElementById("root")! as RootContainer; // 3. Cast the container to our new type

// This block will now work without TypeScript errors
if (!container._reactRootContainer) {
  const root = createRoot(container);
  container._reactRootContainer = root;
  root.render(<App />);
} else {
  container._reactRootContainer.render(<App />);
}
