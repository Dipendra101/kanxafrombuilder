import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Bell,
  Download,
  CreditCard,
  User,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Clock,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'booking' | 'payment' | 'system';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface NotificationData {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  timestamp: Date;
  category?: string;
  metadata?: {
    amount?: number;
    bookingId?: string;
    userId?: string;
    actionUrl?: string;
    imageUrl?: string;
    duration?: number;
    progress?: number;
  };
  actions?: Array<{
    label: string;
    action: () => void;
    variant?: 'default' | 'destructive' | 'outline';
  }>;
  persistent?: boolean;
  autoHide?: boolean;
  hideAfter?: number; // milliseconds
  read?: boolean;
}

interface NotificationContextType {
  notifications: NotificationData[];
  addNotification: (notification: Omit<NotificationData, 'id' | 'timestamp'>) => string;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  getUnreadCount: () => number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const addNotification = (notification: Omit<NotificationData, 'id' | 'timestamp'>): string => {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: NotificationData = {
      ...notification,
      id,
      timestamp: new Date(),
      read: false,
      autoHide: notification.autoHide ?? true,
      hideAfter: notification.hideAfter ?? (notification.priority === 'urgent' ? 8000 : 5000),
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Auto-hide notification if not persistent
    if (newNotification.autoHide && !newNotification.persistent) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.hideAfter);
    }

    return id;
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getUnreadCount = () => {
    return notifications.filter(notif => !notif.read).length;
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
        getUnreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

// Enhanced notification component
export function EnhancedNotification({ 
  notification, 
  onClose, 
  onRead 
}: { 
  notification: NotificationData; 
  onClose: () => void;
  onRead: () => void;
}) {
  const [progress, setProgress] = useState(100);

  // Progress bar for auto-hide notifications
  useEffect(() => {
    if (notification.autoHide && !notification.persistent && notification.hideAfter) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (notification.hideAfter! / 100));
          return Math.max(0, newProgress);
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [notification]);

  useEffect(() => {
    if (!notification.read) {
      // Mark as read after being visible for 2 seconds
      const timer = setTimeout(() => {
        onRead();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [notification.read, onRead]);

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'booking':
        return <Calendar className="h-5 w-5 text-purple-500" />;
      case 'payment':
        return <CreditCard className="h-5 w-5 text-green-500" />;
      case 'system':
        return <Bell className="h-5 w-5 text-gray-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getPriorityColor = () => {
    switch (notification.priority) {
      case 'urgent':
        return 'border-l-red-500 bg-red-50';
      case 'high':
        return 'border-l-orange-500 bg-orange-50';
      case 'medium':
        return 'border-l-blue-500 bg-blue-50';
      case 'low':
        return 'border-l-gray-500 bg-gray-50';
      default:
        return 'border-l-gray-500 bg-white';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const formatMetadata = () => {
    const { metadata } = notification;
    if (!metadata) return null;

    const items = [];
    if (metadata.amount) items.push(`Amount: ₨ ${metadata.amount.toLocaleString()}`);
    if (metadata.bookingId) items.push(`Booking: ${metadata.bookingId.slice(-8).toUpperCase()}`);
    if (metadata.progress !== undefined) items.push(`Progress: ${metadata.progress}%`);

    return items.length > 0 ? items.join(' • ') : null;
  };

  return (
    <Card className={cn(
      'mb-3 border-l-4 shadow-md transition-all duration-300 hover:shadow-lg',
      getPriorityColor(),
      !notification.read && 'ring-2 ring-blue-200'
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-semibold text-gray-900 truncate">
                  {notification.title}
                </h4>
                <div className="flex items-center space-x-2">
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                  <Badge
                    variant={notification.priority === 'urgent' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {notification.priority}
                  </Badge>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">
                {notification.message}
              </p>

              {/* Metadata */}
              {formatMetadata() && (
                <p className="text-xs text-gray-500 mb-2">
                  {formatMetadata()}
                </p>
              )}

              {/* Image if available */}
              {notification.metadata?.imageUrl && (
                <img
                  src={notification.metadata.imageUrl}
                  alt="Notification"
                  className="w-16 h-16 object-cover rounded-md mb-2"
                />
              )}

              {/* Actions */}
              {notification.actions && notification.actions.length > 0 && (
                <div className="flex space-x-2 mt-3">
                  {notification.actions.map((action, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant={action.variant || 'outline'}
                      onClick={action.action}
                      className="text-xs"
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}

              {/* Timestamp and category */}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{formatTime(notification.timestamp)}</span>
                  {notification.category && (
                    <>
                      <span>•</span>
                      <span className="capitalize">{notification.category}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress bar for auto-hide */}
        {notification.autoHide && !notification.persistent && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div
                className="bg-blue-600 h-1 rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Notification Center Component
export function NotificationCenter() {
  const { notifications, removeNotification, markAsRead, markAllAsRead, clearAll, getUnreadCount } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {getUnreadCount() > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs"
          >
            {getUnreadCount()}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-96 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Notifications</h3>
              <div className="flex space-x-2">
                {getUnreadCount() > 0 && (
                  <Button size="sm" variant="outline" onClick={markAllAsRead}>
                    Mark All Read
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={clearAll}>
                  Clear All
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map(notification => (
                <EnhancedNotification
                  key={notification.id}
                  notification={notification}
                  onClose={() => removeNotification(notification.id)}
                  onRead={() => markAsRead(notification.id)}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Floating notification container for toast-like notifications
export function FloatingNotifications() {
  const { notifications, removeNotification, markAsRead } = useNotifications();
  
  // Show only recent, non-persistent notifications
  const floatingNotifications = notifications.filter(
    notif => !notif.persistent && Date.now() - notif.timestamp.getTime() < 10000
  ).slice(0, 3); // Limit to 3 floating notifications

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {floatingNotifications.map(notification => (
        <div
          key={notification.id}
          className="transform transition-all duration-300 ease-in-out"
        >
          <EnhancedNotification
            notification={notification}
            onClose={() => removeNotification(notification.id)}
            onRead={() => markAsRead(notification.id)}
          />
        </div>
      ))}
    </div>
  );
}

// Pre-configured notification functions
export const NotificationTemplates = {
  showSuccess: (title: string, message: string, options?: Partial<NotificationData>) => {
    const { addNotification } = useNotifications();
    return addNotification({
      type: 'success',
      priority: 'medium',
      title,
      message,
      ...options,
    });
  },

  showError: (title: string, message: string, options?: Partial<NotificationData>) => {
    const { addNotification } = useNotifications();
    return addNotification({
      type: 'error',
      priority: 'high',
      title,
      message,
      persistent: true,
      autoHide: false,
      ...options,
    });
  },

  showBookingConfirmation: (bookingId: string, amount: number) => {
    const { addNotification } = useNotifications();
    return addNotification({
      type: 'booking',
      priority: 'high',
      title: 'Booking Confirmed! 🎉',
      message: 'Your booking has been successfully confirmed.',
      category: 'booking',
      metadata: { bookingId, amount },
      actions: [
        {
          label: 'View Booking',
          action: () => window.location.href = `/bookings/${bookingId}`,
        },
        {
          label: 'Download Invoice',
          action: () => {/* Export invoice logic */},
          variant: 'outline',
        },
      ],
    });
  },

  showPaymentSuccess: (amount: number, method: string) => {
    const { addNotification } = useNotifications();
    return addNotification({
      type: 'payment',
      priority: 'high',
      title: 'Payment Successful! 💳',
      message: `Payment via ${method} completed successfully.`,
      category: 'payment',
      metadata: { amount },
    });
  },

  showSystemUpdate: (message: string) => {
    const { addNotification } = useNotifications();
    return addNotification({
      type: 'system',
      priority: 'low',
      title: 'System Update',
      message,
      category: 'system',
      autoHide: false,
      persistent: true,
    });
  },
};

export default NotificationCenter;
