import { Link } from "react-router-dom";
import { 
  ShieldAlert, 
  UserPlus, 
  Smartphone,
  Lock,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GuestRestrictionProps {
  action: string;
  description?: string;
}

export default function GuestRestriction({ 
  action, 
  description 
}: GuestRestrictionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-kanxa-light-blue via-white to-kanxa-light-orange flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 backdrop-blur-sm bg-white/95">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="h-8 w-8 text-orange-600" />
            </div>
            <CardTitle className="text-xl text-kanxa-navy mb-2">
              Login Required
            </CardTitle>
            <p className="text-gray-600 text-sm">
              You need to login to {action}
            </p>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 mt-2">
              <Lock className="h-3 w-3 mr-1" />
              Guest Mode Active
            </Badge>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-800">
                {description || `To ${action}, you need to create an account or login. Guest mode allows browsing but restricts booking and purchasing.`}
              </p>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full bg-gradient-to-r from-kanxa-blue to-kanxa-navy">
                <Link to="/signup">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Account
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full">
                <Link to="/login">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Login with Email
                </Link>
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button asChild variant="outline" size="sm" className="text-xs">
                  <Link to="/login">
                    <Smartphone className="mr-1 h-3 w-3" />
                    SMS Login
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="text-xs">
                  <Link to="/">
                    Continue Browsing
                  </Link>
                </Button>
              </div>
            </div>

            <div className="text-center pt-4 border-t">
              <p className="text-xs text-gray-500">
                Don't worry, your browsing session will be saved
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
