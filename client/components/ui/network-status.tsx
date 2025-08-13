import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const NetworkStatus: React.FC = () => {
  const { networkError, retryConnection } = useAuth();

  if (!networkError) return null;

  return (
    <Alert className="mb-4 border-orange-200 bg-orange-50">
      <WifiOff className="h-4 w-4 text-orange-600" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-orange-800">
          Connection lost. Some features may be limited.
        </span>
        <Button 
          variant="outline" 
          size="sm"
          onClick={retryConnection}
          className="ml-4 border-orange-300 text-orange-700 hover:bg-orange-100"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default NetworkStatus;
