import { cn } from "@/lib/utils";
import { Loader2, RefreshCw, Truck, Building2, Wrench } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "pulse" | "bounce" | "kanxa" | "themed";
  theme?: "transportation" | "construction" | "garage";
  text?: string;
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  variant = "default",
  theme,
  text,
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  };

  const getIcon = () => {
    if (theme === "transportation") return Truck;
    if (theme === "construction") return Building2;
    if (theme === "garage") return Wrench;
    return Loader2;
  };

  const Icon = getIcon();

  const getSpinnerComponent = () => {
    switch (variant) {
      case "pulse":
        return (
          <div className={cn("relative", sizeClasses[size])}>
            <div className="absolute inset-0 bg-kanxa-blue rounded-full animate-ping opacity-75" />
            <div className="relative bg-kanxa-blue rounded-full w-full h-full" />
          </div>
        );

      case "bounce":
        return (
          <div className="flex space-x-1">
            <div
              className={cn(
                "bg-kanxa-blue rounded-full animate-bounce",
                size === "sm"
                  ? "w-2 h-2"
                  : size === "md"
                    ? "w-3 h-3"
                    : size === "lg"
                      ? "w-4 h-4"
                      : "w-6 h-6",
              )}
              style={{ animationDelay: "0ms" }}
            />
            <div
              className={cn(
                "bg-kanxa-orange rounded-full animate-bounce",
                size === "sm"
                  ? "w-2 h-2"
                  : size === "md"
                    ? "w-3 h-3"
                    : size === "lg"
                      ? "w-4 h-4"
                      : "w-6 h-6",
              )}
              style={{ animationDelay: "150ms" }}
            />
            <div
              className={cn(
                "bg-kanxa-green rounded-full animate-bounce",
                size === "sm"
                  ? "w-2 h-2"
                  : size === "md"
                    ? "w-3 h-3"
                    : size === "lg"
                      ? "w-4 h-4"
                      : "w-6 h-6",
              )}
              style={{ animationDelay: "300ms" }}
            />
          </div>
        );

      case "kanxa":
        return (
          <div className={cn("relative", sizeClasses[size])}>
            <div className="absolute inset-0 border-4 border-kanxa-light-blue rounded-full" />
            <div className="absolute inset-0 border-4 border-transparent border-t-kanxa-blue rounded-full animate-spin" />
            <div
              className="absolute inset-2 border-2 border-transparent border-t-kanxa-orange rounded-full animate-spin"
              style={{ animationDirection: "reverse" }}
            />
          </div>
        );

      case "themed":
        return (
          <div className="flex items-center space-x-2">
            <Icon
              className={cn(
                "animate-spin",
                sizeClasses[size],
                theme === "transportation"
                  ? "text-kanxa-blue"
                  : theme === "construction"
                    ? "text-kanxa-orange"
                    : theme === "garage"
                      ? "text-kanxa-green"
                      : "text-kanxa-blue",
              )}
            />
            {theme && (
              <div
                className={cn(
                  "flex space-x-1",
                  size === "sm" ? "gap-0.5" : "gap-1",
                )}
              >
                <div
                  className={cn(
                    "rounded-full animate-pulse bg-current opacity-60",
                    size === "sm"
                      ? "w-1 h-1"
                      : size === "md"
                        ? "w-1.5 h-1.5"
                        : size === "lg"
                          ? "w-2 h-2"
                          : "w-3 h-3",
                  )}
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className={cn(
                    "rounded-full animate-pulse bg-current opacity-60",
                    size === "sm"
                      ? "w-1 h-1"
                      : size === "md"
                        ? "w-1.5 h-1.5"
                        : size === "lg"
                          ? "w-2 h-2"
                          : "w-3 h-3",
                  )}
                  style={{ animationDelay: "200ms" }}
                />
                <div
                  className={cn(
                    "rounded-full animate-pulse bg-current opacity-60",
                    size === "sm"
                      ? "w-1 h-1"
                      : size === "md"
                        ? "w-1.5 h-1.5"
                        : size === "lg"
                          ? "w-2 h-2"
                          : "w-3 h-3",
                  )}
                  style={{ animationDelay: "400ms" }}
                />
              </div>
            )}
          </div>
        );

      default:
        return (
          <Loader2
            className={cn("animate-spin text-kanxa-blue", sizeClasses[size])}
          />
        );
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center space-y-2",
        className,
      )}
    >
      {getSpinnerComponent()}
      {text && (
        <p className={cn("text-gray-600 font-medium", textSizeClasses[size])}>
          {text}
        </p>
      )}
    </div>
  );
}

// Full page loading overlay
export function LoadingOverlay({
  text = "Loading...",
  variant = "kanxa",
  size = "lg",
}: {
  text?: string;
  variant?: LoadingSpinnerProps["variant"];
  size?: LoadingSpinnerProps["size"];
}) {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl border">
        <LoadingSpinner
          variant={variant}
          size={size}
          text={text}
          className="mb-2"
        />
      </div>
    </div>
  );
}

// Inline loading states
export function InlineLoader({
  text,
  size = "sm",
  className,
}: {
  text?: string;
  size?: LoadingSpinnerProps["size"];
  className?: string;
}) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <LoadingSpinner size={size} />
      {text && <span className="text-gray-600 text-sm">{text}</span>}
    </div>
  );
}
