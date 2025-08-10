import { Bus } from "lucide-react";
import PlaceholderPage from "./PlaceholderPage";

export default function Buses() {
  return (
    <PlaceholderPage
      title="Bus Services"
      description="Daily and nightly bus routes from Lamjung to Kathmandu, Pokhara, and other destinations with online seat booking."
      icon={<Bus className="h-12 w-12 text-kanxa-blue" />}
    />
  );
}
