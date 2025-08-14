import toast from "react-hot-toast";

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  action?: any; // For compatibility, but not used in react-hot-toast
}

export function useToast() {
  const showToast = ({
    title,
    description,
    variant = "default",
  }: ToastOptions) => {
    const message = title
      ? `${title}${description ? `: ${description}` : ""}`
      : description || "";

    switch (variant) {
      case "destructive":
        return toast.error(message, {
          duration: 5000,
          style: {
            background: "#ef4444",
            color: "#fff",
          },
        });
      case "success":
        return toast.success(message, {
          duration: 3000,
          style: {
            background: "#22c55e",
            color: "#fff",
          },
        });
      default:
        return toast(message, {
          duration: 4000,
          style: {
            background: "#1f2937",
            color: "#fff",
          },
        });
    }
  };

  return {
    toast: showToast,
  };
}

// Export direct toast methods for convenience
export { toast };
