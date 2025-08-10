import { Settings } from "lucide-react";
import PlaceholderPage from "./PlaceholderPage";

export default function Machinery() {
  return (
    <PlaceholderPage
      title="Construction Machinery"
      description="JCBs, small mixers, and tractors for construction and material transportation services."
      icon={<Settings className="h-12 w-12 text-kanxa-orange" />}
    />
  );
}
