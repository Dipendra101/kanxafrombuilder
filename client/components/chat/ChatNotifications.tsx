import { useState } from "react";
import {
  Bell,
  BellOff,
  MessageCircle,
  Phone,
  Video,
  FileText,
  Settings,
  Check,
  CheckCheck,
  X,
  Volume2,
  VolumeX,
  Moon,
  Clock,
  Calendar,
  CreditCard,
  Package,
  Wrench,
  Truck,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useChatNotifications,
  ChatNotification,
} from "@/services/chatNotifications";
import { useEffect } from "react";

export default function ChatNotifications() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markChatAsRead,
    clearAll,
    settings,
    updateSettings,
    toggleDoNotDisturb,
    testNotification,
  } = useChatNotifications();

  const [isOpen, setIsOpen] = useState(false);

  // Initialize with some sample notifications on component mount
  useEffect(() => {
    // Add some sample notifications to demonstrate the unified system
    const sampleNotifications = [
      {
        id: "booking-confirmed",
        chatId: "booking-system",
        senderName: "Booking System",
        message: "Your bus seat has been reserved for Lamjung → Kathmandu",
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        type: "message" as const,
        isRead: false,
        priority: "medium" as const,
      },
    ];

    // This would normally come from your notification service
  }, []);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "now";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const getNotificationIcon = (type: ChatNotification["type"]) => {
    switch (type) {
      case "call":
        return <Phone className="w-4 h-4 text-green-600" />;
      case "video":
        return <Video className="w-4 h-4 text-blue-600" />;
      case "file":
        return <FileText className="w-4 h-4 text-purple-600" />;
      case "booking":
        return <Calendar className="w-4 h-4 text-kanxa-blue" />;
      case "payment":
        return <CreditCard className="w-4 h-4 text-green-600" />;
      case "service":
        return <Wrench className="w-4 h-4 text-kanxa-green" />;
      case "delivery":
        return <Truck className="w-4 h-4 text-kanxa-orange" />;
      case "system":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <MessageCircle className="w-4 h-4 text-kanxa-blue" />;
    }
  };

  const NotificationItem = ({
    notification,
  }: {
    notification: ChatNotification;
  }) => (
    <div
      className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
        notification.isRead
          ? "hover:bg-gray-50"
          : "bg-blue-50 hover:bg-blue-100"
      }`}
      onClick={() => {
        markAsRead(notification.id);
        // Navigate to chat
        window.location.href = `/chat#${notification.chatId}`;
        setIsOpen(false);
      }}
    >
      <div className="flex-shrink-0">
        <Avatar className="w-8 h-8">
          <AvatarImage src={notification.senderAvatar} />
          <AvatarFallback className="text-xs">
            {notification.senderName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="absolute -mt-1 -ml-1">
          {getNotificationIcon(notification.type)}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p
            className={`text-sm font-medium truncate ${
              notification.isRead ? "text-gray-700" : "text-gray-900"
            }`}
          >
            {notification.senderName}
          </p>
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-500">
              {formatTime(notification.timestamp)}
            </span>
            {!notification.isRead && (
              <div className="w-2 h-2 bg-kanxa-blue rounded-full" />
            )}
          </div>
        </div>

        <p
          className={`text-sm mt-1 truncate ${
            notification.isRead ? "text-gray-500" : "text-gray-700"
          }`}
        >
          {notification.message}
        </p>
      </div>
    </div>
  );

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {settings.doNotDisturb ? (
            <BellOff className="h-4 w-4 text-gray-500" />
          ) : (
            <Bell className="h-4 w-4" />
          )}
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-kanxa-orange hover:bg-kanxa-orange">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 max-h-96 overflow-hidden p-0 z-50"
        sideOffset={8}
      >
        <Tabs defaultValue="notifications" className="w-full">
          <div className="px-4 py-3 border-b">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Notifications</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleDoNotDisturb();
                  }}
                  className="p-1 hover:bg-gray-100"
                >
                  {settings.doNotDisturb ? (
                    <Moon className="w-4 h-4 text-purple-600" />
                  ) : (
                    <Bell className="w-4 h-4" />
                  )}
                </Button>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      clearAll();
                    }}
                    className="text-xs hover:bg-gray-100"
                  >
                    Clear all
                  </Button>
                )}
              </div>
            </div>

            <div className="text-xs text-gray-500 mb-2">
              All your notifications from bookings, orders, chat messages, and
              system updates
            </div>

            {/* Tabs for different notification types */}
            <TabsList className="grid w-full grid-cols-3 mt-2">
              <TabsTrigger value="notifications" className="text-xs">
                All
                {unreadCount > 0 && (
                  <Badge className="ml-1 h-4 w-4 p-0 text-xs bg-kanxa-blue">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="system" className="text-xs">
                System
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs">
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="notifications"
            className="max-h-80 overflow-y-auto p-0"
          >
            {/* Add some sample system notifications */}
            {notifications.length === 0 && (
              <div className="space-y-1 p-2">
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-kanxa-light-blue cursor-pointer transition-colors hover:bg-blue-100">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-kanxa-blue rounded-full flex items-center justify-center">
                      <CheckCheck className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        Booking Confirmed
                      </p>
                      <span className="text-xs text-gray-500">5m</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">
                      Your bus seat has been reserved for Lamjung → Kathmandu
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-kanxa-orange rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-700">
                        Payment Received
                      </p>
                      <span className="text-xs text-gray-500">1h</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Tour request payment processed successfully
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic notifications */}
            {notifications.length > 0 ? (
              <div className="space-y-1 p-2">
                {notifications.slice(0, 10).map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                  />
                ))}

                {notifications.length > 10 && (
                  <div className="text-center p-2">
                    <Button variant="ghost" size="sm" className="text-xs">
                      View all notifications
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No new notifications</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={testNotification}
                  className="mt-2 text-xs"
                >
                  Test notification
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="system" className="max-h-80 overflow-y-auto p-0">
            <div className="space-y-1 p-2">
              {/* Sample system notifications */}
              <div
                className="flex items-start space-x-3 p-3 rounded-lg bg-kanxa-light-blue hover:bg-blue-100 cursor-pointer transition-colors"
                onClick={() => {
                  window.location.href = '/bookings';
                  setIsOpen(false);
                }}
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-kanxa-blue rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      Booking Confirmed
                    </p>
                    <span className="text-xs text-gray-500">2h</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">
                    Your bus seat to Kathmandu has been reserved
                  </p>
                </div>
              </div>

              <div
                className="flex items-start space-x-3 p-3 rounded-lg bg-kanxa-light-green hover:bg-green-100 cursor-pointer transition-colors"
                onClick={() => {
                  window.location.href = '/profile';
                  setIsOpen(false);
                }}
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-kanxa-green rounded-full flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      Payment Received
                    </p>
                    <span className="text-xs text-gray-500">1d</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">
                    Tour request payment processed successfully
                  </p>
                </div>
              </div>

              <div
                className="flex items-start space-x-3 p-3 rounded-lg bg-kanxa-light-orange hover:bg-orange-100 cursor-pointer transition-colors"
                onClick={() => {
                  window.location.href = '/garage';
                  setIsOpen(false);
                }}
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-kanxa-orange rounded-full flex items-center justify-center">
                    <Wrench className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      Service Complete
                    </p>
                    <span className="text-xs text-gray-500">2d</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">
                    Your tractor maintenance has been completed
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="p-4 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4" />
                  <span className="text-sm">Notifications</span>
                </div>
                <Switch
                  checked={settings.enabled}
                  onCheckedChange={(checked) =>
                    updateSettings({ enabled: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {settings.sound ? (
                    <Volume2 className="w-4 h-4" />
                  ) : (
                    <VolumeX className="w-4 h-4" />
                  )}
                  <span className="text-sm">Sound</span>
                </div>
                <Switch
                  checked={settings.sound}
                  onCheckedChange={(checked) =>
                    updateSettings({ sound: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">Preview</span>
                </div>
                <Switch
                  checked={settings.messagePreview}
                  onCheckedChange={(checked) =>
                    updateSettings({ messagePreview: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">Calls</span>
                </div>
                <Switch
                  checked={settings.callNotifications}
                  onCheckedChange={(checked) =>
                    updateSettings({ callNotifications: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Moon className="w-4 h-4" />
                  <span className="text-sm">Do Not Disturb</span>
                </div>
                <Switch
                  checked={settings.doNotDisturb}
                  onCheckedChange={toggleDoNotDisturb}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Quiet Hours</span>
                </div>
                <Switch
                  checked={settings.quietHours.enabled}
                  onCheckedChange={(checked) =>
                    updateSettings({
                      quietHours: { ...settings.quietHours, enabled: checked },
                    })
                  }
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={testNotification}
                className="w-full text-xs"
              >
                Test Notification
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                onClick={() => {
                  window.location.href = "/chat";
                  setIsOpen(false);
                }}
              >
                Open Chat Center
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
