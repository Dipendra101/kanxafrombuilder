import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import NetworkStatus from "@/components/ui/network-status";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <div className="container mx-auto px-4 py-2">
          <NetworkStatus />
        </div>
        <main>{children}</main>
      </div>
      <Footer />
    </div>
  );
}
