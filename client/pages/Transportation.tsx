import { Bus } from "lucide-react";
import PlaceholderPage from "./PlaceholderPage";

export default function Transportation() {
  return (
    <PlaceholderPage
      title="Transportation Services"
      description="Book buses, cargo trucks, and custom tours with real-time availability and secure payments."
      icon={<Bus className="h-12 w-12 text-kanxa-blue" />}
    />
  );
}
