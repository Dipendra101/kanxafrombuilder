import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  VisuallyHidden,
} from "@/components/ui/dialog";

interface AccessibleDialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogContent> {
  title: string;
  description?: string;
  hideTitle?: boolean;
  children: React.ReactNode;
}

/**
 * AccessibleDialogContent ensures that every dialog has a proper title for screen readers.
 * If hideTitle is true, the title will be visually hidden but still accessible to screen readers.
 */
export const AccessibleDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogContent>,
  AccessibleDialogContentProps
>(({ title, description, hideTitle = false, children, ...props }, ref) => (
  <DialogContent ref={ref} {...props}>
    <DialogHeader>
      {hideTitle ? (
        <VisuallyHidden>
          <DialogTitle>{title}</DialogTitle>
        </VisuallyHidden>
      ) : (
        <DialogTitle>{title}</DialogTitle>
      )}
      {description && <DialogDescription>{description}</DialogDescription>}
    </DialogHeader>
    {children}
  </DialogContent>
));

AccessibleDialogContent.displayName = "AccessibleDialogContent";

export {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  VisuallyHidden,
  AccessibleDialogContent,
};
