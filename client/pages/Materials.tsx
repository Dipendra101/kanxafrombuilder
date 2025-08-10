import { Building } from "lucide-react";
import PlaceholderPage from "./PlaceholderPage";

export default function Materials() {
  return (
    <PlaceholderPage
      title="Building Materials"
      description="Essential construction materials including cement, blocks, bricks, water pipes, tanks, rebars, gravel, and sand at competitive prices."
      icon={<Building className="h-12 w-12 text-kanxa-orange" />}
    />
  );
}
