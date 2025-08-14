import "./global.css";

// Suppress Recharts defaultProps warnings
const originalError = console.error;
console.error = (...args) => {
  if (
    args[0]?.includes?.("Support for defaultProps will be removed") &&
    (args[0]?.includes?.("XAxis") || args[0]?.includes?.("YAxis"))
  ) {
    return; // Suppress Recharts warnings
  }
  originalError.apply(console, args);
};

import { Toaster } from "react-hot-toast"; // 1. IMPORT react-hot-toast
import { createRoot, Root } from "react-dom/client"; // 2. Import the 'Root' type
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
import ResetPassword from "./pages/ResetPassword";
import Chat from "./pages/Chat";
import TokenExpiryHandler from "./components/auth/TokenExpiryHandler";
import AdminDashboard from "./pages/AdminDashboard";
import AdminDashboardSimple from "./pages/AdminDashboardSimple";
import AdminTest from "./pages/AdminTest";
import SmsTest from "./pages/SmsTest";
import EnhancedBooking from "./pages/EnhancedBooking";
import TestFormSubmission from "./pages/TestFormSubmission";
import SecurityAudit from "./pages/SecurityAudit";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";
import PaymentEsewaSuccess from "./pages/PaymentEsewaSuccess";
import PaymentEsewaFailure from "./pages/PaymentEsewaFailure";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div>
        {" "}
        {/* Wrapper div for react-hot-toast */}
        <Toaster // react-hot-toast Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            // Define default options
            duration: 5000,
            style: {
              background: "#1f2937",
              color: "#fff",
              borderRadius: "8px",
              fontSize: "14px",
            },
            // Default options for specific types
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#22c55e",
                secondary: "#fff",
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
        <BrowserRouter>
          <AuthProvider>
            <TokenExpiryHandler />
            <Routes>
              <Route path="/" element={<Index />} />

              {/* Authentication Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

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
              <Route path="/payment" element={<Payment />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-failure" element={<PaymentFailure />} />
              <Route
                path="/payment/esewa/success"
                element={<PaymentEsewaSuccess />}
              />
              <Route
                path="/payment/esewa/failure"
                element={<PaymentEsewaFailure />}
              />
              <Route path="/orders" element={<Orders />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/chat" element={<Chat />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/AdminDashboard" element={<AdminDashboard />} />
              <Route path="/admin-simple" element={<AdminDashboardSimple />} />
              <Route
                path="/AdminDashboardSimple"
                element={<AdminDashboardSimple />}
              />
              <Route path="/admin-test" element={<AdminTest />} />
              <Route path="/AdminTest" element={<AdminTest />} />
              <Route path="/sms-test" element={<SmsTest />} />
              <Route path="/SmsTest" element={<SmsTest />} />

              {/* Information & Support Routes */}
              <Route path="/routes" element={<RoutesPage />} />
              <Route path="/support" element={<Support />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />

              {/* Test Routes */}
            <Route path="/test-forms" element={<TestFormSubmission />} />
            <Route path="/qa-test" element={<TestFormSubmission />} />
            <Route path="/security-audit" element={<SecurityAudit />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </div>
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
