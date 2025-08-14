// Compatibility wrapper that redirects to the new react-hot-toast implementation
// This prevents breaking changes for any components still using the old import

export { useToast, toast } from './use-toast-simple';

// Re-export types for compatibility if needed
export type { ToastActionElement, ToastProps } from '@/components/ui/toast';
