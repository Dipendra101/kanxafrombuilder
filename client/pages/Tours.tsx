import { MapPin } from "lucide-react";
import PlaceholderPage from "./PlaceholderPage";

export default function Tours() {
  return (
    <PlaceholderPage
      title="Custom Tour Services"
      description="Reserved tour services where you can submit custom requests for vehicles and seating arrangements."
      icon={<MapPin className="h-12 w-12 text-kanxa-blue" />}
    />
  );
}
