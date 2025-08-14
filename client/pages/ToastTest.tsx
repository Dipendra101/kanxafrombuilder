import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast, toast } from "@/hooks/use-toast-simple";
import Layout from "@/components/layout/Layout";

export default function ToastTest() {
  const { toast: useToastHook } = useToast();

  const handleTestToasts = () => {
    // Test success toast
    useToastHook({
      title: "Success!",
      description: "This is a success message",
      variant: "success",
    });

    // Test error toast after delay
    setTimeout(() => {
      useToastHook({
        title: "Error!",
        description: "This is an error message",
        variant: "destructive",
      });
    }, 1000);

    // Test default toast after delay
    setTimeout(() => {
      useToastHook({
        title: "Info",
        description: "This is an info message",
        variant: "default",
      });
    }, 2000);
  };

  const handleDirectToasts = () => {
    toast.success("Direct success toast!");
    setTimeout(() => toast.error("Direct error toast!"), 1000);
    setTimeout(() => toast("Direct default toast!"), 2000);
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>React Hot Toast Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleTestToasts} className="w-full">
              Test useToast Hook
            </Button>
            <Button onClick={handleDirectToasts} variant="outline" className="w-full">
              Test Direct Toast Methods
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
