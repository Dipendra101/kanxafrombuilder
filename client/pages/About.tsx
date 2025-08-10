import { Info } from "lucide-react";
import PlaceholderPage from "./PlaceholderPage";

export default function About() {
  return (
    <PlaceholderPage
      title="About Kanxa Safari"
      description="Learn more about our company, mission, and commitment to providing premium transportation and construction services."
      icon={<Info className="h-12 w-12 text-kanxa-blue" />}
    />
  );
}
