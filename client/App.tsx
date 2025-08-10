import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/transportation" element={<Transportation />} />
          <Route path="/construction" element={<Construction />} />
          <Route path="/garage" element={<Garage />} />
          <Route path="/about" element={<About />} />
          <Route path="/buses" element={<Buses />} />
          <Route path="/cargo" element={<Cargo />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/machinery" element={<Machinery />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
