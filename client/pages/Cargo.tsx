import { Truck } from "lucide-react";
import PlaceholderPage from "./PlaceholderPage";

export default function Cargo() {
  return (
    <PlaceholderPage
      title="Cargo Truck Services"
      description="Freight and logistics services with heavy-duty trucks for all your cargo transportation needs."
      icon={<Truck className="h-12 w-12 text-kanxa-blue" />}
    />
  );
}
