import { useState, useEffect } from "react";
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  Info,
  X,
  Truck,
  Building2,
  Wrench,
  Clock,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export interface NotificationProps {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  link?: {
    label: string;
    href: string;
    external?: boolean;
  };
  autoClose?: boolean;
  duration?: number;
  showProgress?: boolean;
  category?: "transportation" | "construction" | "garage" | "account" | "system";
  metadata?: {
    orderId?: string;
    bookingId?: string;
    amount?: number;
    timestamp?: Date;
  };
  onClose?: () => void;
}

export function EnhancedToast({
  id,
  type,
  title,
  description,
  action,
  link,
  autoClose = true,
  duration = 5000,
  showProgress = true,
  category,
  metadata,
  onClose
}: NotificationProps) {
  const [progress, setProgress] = useState(100);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!autoClose) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - (100 / (duration / 100));
        if (newProgress <= 0) {
          handleClose();
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [autoClose, duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const getIcon = () => {
    if (category) {
      switch (category) {
        case "transportation":
          return <Truck className="h-5 w-5" />;
        case "construction":
          return <Building2 className="h-5 w-5" />;
        case "garage":
          return <Wrench className="h-5 w-5" />;
        default:
          break;
      }
    }

    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5" />;
      case "error":
        return <XCircle className="h-5 w-5" />;
      case "warning":
        return <AlertCircle className="h-5 w-5" />;
      case "info":
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-50 border-green-200",
          icon: "text-green-600",
          title: "text-green-900",
          description: "text-green-700",
          progress: "bg-green-500"
        };
      case "error":
        return {
          bg: "bg-red-50 border-red-200",
          icon: "text-red-600",
          title: "text-red-900",
          description: "text-red-700",
          progress: "bg-red-500"
        };
      case "warning":
        return {
          bg: "bg-yellow-50 border-yellow-200",
          icon: "text-yellow-600",
          title: "text-yellow-900",
          description: "text-yellow-700",
          progress: "bg-yellow-500"
        };
      case "info":
      default:
        return {
          bg: "bg-blue-50 border-blue-200",
          icon: "text-blue-600",
          title: "text-blue-900",
          description: "text-blue-700",
          progress: "bg-blue-500"
        };
    }
  };

  const colors = getColors();

  const formatMetadata = () => {
    if (!metadata) return null;

    const items = [];
    if (metadata.orderId) items.push(`Order: ${metadata.orderId}`);
    if (metadata.bookingId) items.push(`Booking: ${metadata.bookingId}`);
    if (metadata.amount) items.push(`Amount: NPR ${metadata.amount.toLocaleString()}`);
    if (metadata.timestamp) {
      items.push(`Time: ${metadata.timestamp.toLocaleTimeString()}`);
    }

    return items.length > 0 ? items.join(" • ") : null;
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border shadow-lg transition-all duration-300 transform",
        colors.bg,
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
      style={{ maxWidth: "420px", minWidth: "320px" }}
    >
      {/* Progress Bar */}
      {showProgress && autoClose && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
          <div
            className={cn("h-full transition-all duration-100 ease-linear", colors.progress)}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start space-x-3">
          {/* Icon */}
          <div className={cn("flex-shrink-0 mt-0.5", colors.icon)}>
            {getIcon()}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className={cn("text-sm font-semibold", colors.title)}>
                  {title}
                </h4>
                {description && (
                  <p className={cn("mt-1 text-sm", colors.description)}>
                    {description}
                  </p>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className={cn(
                  "flex-shrink-0 ml-2 p-1 rounded-md hover:bg-gray-200 transition-colors",
                  colors.icon
                )}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Metadata */}
            {metadata && (
              <div className="mt-2 text-xs text-gray-500 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {formatMetadata()}
              </div>
            )}

            {/* Actions */}
            {(action || link) && (
              <div className="mt-3 flex items-center space-x-2">
                {action && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={action.onClick}
                    className="text-xs h-7"
                  >
                    {action.label}
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                )}
                {link && (
                  <Button
                    size="sm"
                    variant="ghost"
                    asChild
                    className="text-xs h-7"
                  >
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                    >
                      {link.label}
                      {link.external && <ExternalLink className="ml-1 h-3 w-3" />}
                    </a>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Notification Manager Hook
export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  const addNotification = (notification: Omit<NotificationProps, "id" | "onClose">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: NotificationProps = {
      ...notification,
      id,
      onClose: () => removeNotification(id)
    };

    setNotifications(prev => [...prev, newNotification]);
    return id;
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Pre-configured notification types
  const showSuccess = (title: string, options?: Partial<NotificationProps>) => {
    return addNotification({
      type: "success",
      title,
      ...options
    });
  };

  const showError = (title: string, options?: Partial<NotificationProps>) => {
    return addNotification({
      type: "error",
      title,
      autoClose: false, // Errors should not auto-close
      ...options
    });
  };

  const showWarning = (title: string, options?: Partial<NotificationProps>) => {
    return addNotification({
      type: "warning",
      title,
      duration: 7000, // Longer duration for warnings
      ...options
    });
  };

  const showInfo = (title: string, options?: Partial<NotificationProps>) => {
    return addNotification({
      type: "info",
      title,
      ...options
    });
  };

  // Category-specific notifications
  const showBookingSuccess = (bookingId: string, details?: string) => {
    return showSuccess("Booking Confirmed! 🎉", {
      description: details || "Your booking has been successfully confirmed.",
      category: "transportation",
      metadata: {
        bookingId,
        timestamp: new Date()
      },
      action: {
        label: "View Booking",
        onClick: () => window.location.href = `/booking?id=${bookingId}`
      }
    });
  };

  const showOrderSuccess = (orderId: string, amount: number) => {
    return showSuccess("Order Placed Successfully! 🛒", {
      description: "Your order has been received and is being processed.",
      category: "construction",
      metadata: {
        orderId,
        amount,
        timestamp: new Date()
      },
      action: {
        label: "Track Order",
        onClick: () => window.location.href = `/orders?id=${orderId}`
      }
    });
  };

  const showPaymentSuccess = (amount: number, method: string) => {
    return showSuccess("Payment Successful! 💳", {
      description: `Payment of NPR ${amount.toLocaleString()} via ${method} completed.`,
      category: "account",
      metadata: {
        amount,
        timestamp: new Date()
      }
    });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showBookingSuccess,
    showOrderSuccess,
    showPaymentSuccess
  };
}

// Notification Container Component
export function NotificationContainer() {
  const { notifications } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {notifications.map((notification) => (
        <EnhancedToast key={notification.id} {...notification} />
      ))}
    </div>
  );
}
