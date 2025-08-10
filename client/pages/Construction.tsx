import { Building } from "lucide-react";
import PlaceholderPage from "./PlaceholderPage";

export default function Construction() {
  return (
    <PlaceholderPage
      title="Construction Materials & Machinery"
      description="Premium building materials, construction machinery, and tractor services at competitive prices."
      icon={<Building className="h-12 w-12 text-kanxa-orange" />}
    />
  );
}
