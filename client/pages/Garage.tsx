import { Wrench } from "lucide-react";
import PlaceholderPage from "./PlaceholderPage";

export default function Garage() {
  return (
    <PlaceholderPage
      title="Garage & Workshop Services"
      description="Professional maintenance and repair services for tractors and heavy machinery with genuine parts."
      icon={<Wrench className="h-12 w-12 text-kanxa-green" />}
    />
  );
}
