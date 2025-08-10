// Chat Notifications Service
// Handles real-time chat notifications, sound alerts, and browser notifications

import { useState, useEffect } from "react";

interface ChatNotification {
  id: string;
  chatId: string;
  senderName: string;
  senderAvatar?: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'call' | 'video' | 'file';
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  desktop: boolean;
  messagePreview: boolean;
  callNotifications: boolean;
  doNotDisturb: boolean;
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string;   // HH:MM format
  };
}

class ChatNotificationService {
  private notifications: ChatNotification[] = [];
  private settings: NotificationSettings = {
    enabled: true,
    sound: true,
    desktop: true,
    messagePreview: true,
    callNotifications: true,
    doNotDisturb: false,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  };
  private audio: HTMLAudioElement | null = null;
  private listeners: ((notifications: ChatNotification[]) => void)[] = [];

  constructor() {
    this.initializeAudio();
    this.requestNotificationPermission();
    this.loadSettings();
  }

  private initializeAudio() {
    // Create audio elements for different notification sounds
    this.audio = new Audio();
    // In production, you'd have actual audio files
    // this.audio.src = '/sounds/message-notification.mp3';
  }

  private async requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }

  private loadSettings() {
    const saved = localStorage.getItem('chat-notification-settings');
    if (saved) {
      this.settings = { ...this.settings, ...JSON.parse(saved) };
    }
  }

  private saveSettings() {
    localStorage.setItem('chat-notification-settings', JSON.stringify(this.settings));
  }

  private isQuietTime(): boolean {
    if (!this.settings.quietHours.enabled) return false;

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const { start, end } = this.settings.quietHours;
    
    // Handle overnight quiet hours (e.g., 22:00 to 08:00)
    if (start > end) {
      return currentTime >= start || currentTime <= end;
    }
    
    return currentTime >= start && currentTime <= end;
  }

  private playNotificationSound() {
    if (!this.settings.sound || this.isQuietTime() || this.settings.doNotDisturb) {
      return;
    }

    // Play different sounds for different notification types
    try {
      // For now, use a simple beep
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.warn('Could not play notification sound:', error);
    }
  }

  private showDesktopNotification(notification: ChatNotification) {
    if (!this.settings.desktop || 
        !this.settings.enabled || 
        this.isQuietTime() || 
        this.settings.doNotDisturb ||
        Notification.permission !== 'granted') {
      return;
    }

    const title = `New message from ${notification.senderName}`;
    const body = this.settings.messagePreview 
      ? notification.message 
      : 'You have a new message';

    const desktopNotification = new Notification(title, {
      body,
      icon: notification.senderAvatar || '/favicon.ico',
      badge: '/favicon.ico',
      tag: notification.chatId, // Replace previous notifications from same chat
      requireInteraction: notification.priority === 'high',
      silent: !this.settings.sound
    });

    // Auto-close after 5 seconds unless high priority
    if (notification.priority !== 'high') {
      setTimeout(() => {
        desktopNotification.close();
      }, 5000);
    }

    // Handle click to focus chat
    desktopNotification.onclick = () => {
      window.focus();
      // Navigate to chat - you'd implement this based on your routing
      window.location.hash = `#/chat/${notification.chatId}`;
      desktopNotification.close();
    };
  }

  addNotification(notification: ChatNotification) {
    // Don't add duplicate notifications
    const exists = this.notifications.find(n => 
      n.chatId === notification.chatId && 
      n.timestamp.getTime() === notification.timestamp.getTime()
    );
    
    if (exists) return;

    this.notifications.unshift(notification);
    
    // Keep only last 50 notifications
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }

    // Trigger notifications if enabled
    if (this.settings.enabled && !this.settings.doNotDisturb) {
      this.playNotificationSound();
      this.showDesktopNotification(notification);
    }

    // Notify listeners
    this.notifyListeners();
  }

  markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
      this.notifyListeners();
    }
  }

  markChatAsRead(chatId: string) {
    this.notifications
      .filter(n => n.chatId === chatId)
      .forEach(n => n.isRead = true);
    this.notifyListeners();
  }

  clearAll() {
    this.notifications = [];
    this.notifyListeners();
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  getUnreadForChat(chatId: string): number {
    return this.notifications.filter(n => n.chatId === chatId && !n.isRead).length;
  }

  getNotifications(): ChatNotification[] {
    return [...this.notifications];
  }

  getRecentNotifications(limit: number = 10): ChatNotification[] {
    return this.notifications.slice(0, limit);
  }

  // Settings management
  updateSettings(newSettings: Partial<NotificationSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
  }

  getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  toggleDoNotDisturb() {
    this.settings.doNotDisturb = !this.settings.doNotDisturb;
    this.saveSettings();
    this.notifyListeners();
  }

  // Event listeners
  subscribe(callback: (notifications: ChatNotification[]) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.notifications);
      } catch (error) {
        console.error('Error in notification listener:', error);
      }
    });
  }

  // Mock incoming notifications for demo
  simulateIncomingMessage(chatId: string, senderName: string, message: string, type: ChatNotification['type'] = 'message') {
    const notification: ChatNotification = {
      id: Math.random().toString(36).substr(2, 9),
      chatId,
      senderName,
      message,
      timestamp: new Date(),
      type,
      isRead: false,
      priority: type === 'call' || type === 'video' ? 'high' : 'medium'
    };

    this.addNotification(notification);
  }

  // Test notifications
  testNotification() {
    this.simulateIncomingMessage(
      'test-chat',
      'Test User',
      'This is a test notification to check if everything is working correctly!'
    );
  }
}

// Singleton instance
export const chatNotificationService = new ChatNotificationService();

// React hook for using notifications
export function useChatNotifications() {
  const [notifications, setNotifications] = useState<ChatNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const updateNotifications = (newNotifications: ChatNotification[]) => {
      setNotifications(newNotifications);
      setUnreadCount(chatNotificationService.getUnreadCount());
    };

    updateNotifications(chatNotificationService.getNotifications());
    
    const unsubscribe = chatNotificationService.subscribe(updateNotifications);
    return unsubscribe;
  }, []);

  return {
    notifications,
    unreadCount,
    markAsRead: (id: string) => chatNotificationService.markAsRead(id),
    markChatAsRead: (chatId: string) => chatNotificationService.markChatAsRead(chatId),
    clearAll: () => chatNotificationService.clearAll(),
    settings: chatNotificationService.getSettings(),
    updateSettings: (settings: Partial<NotificationSettings>) => 
      chatNotificationService.updateSettings(settings),
    toggleDoNotDisturb: () => chatNotificationService.toggleDoNotDisturb(),
    testNotification: () => chatNotificationService.testNotification()
  };
}

export type { ChatNotification, NotificationSettings };
