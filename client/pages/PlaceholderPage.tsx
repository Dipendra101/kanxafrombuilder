import { Link } from "react-router-dom";
import { ArrowLeft, Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function PlaceholderPage({ 
  title, 
  description, 
  icon = <Construction className="h-12 w-12 text-kanxa-orange" />
}: PlaceholderPageProps) {
  return (
    <Layout>
      <div className="container py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            {icon}
          </div>
          <h1 className="text-3xl font-bold text-kanxa-navy mb-4">{title}</h1>
          <p className="text-lg text-kanxa-gray mb-8">{description}</p>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This page is under development. Continue prompting to build out the specific features you need.
            </p>
            <Button asChild>
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
