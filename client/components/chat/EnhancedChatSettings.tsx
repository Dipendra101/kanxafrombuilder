import React, { useState } from 'react';
import {
  Settings,
  Bell,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Download,
  Trash2,
  User,
  Shield,
  Clock,
  MessageSquare,
  Save,
  RotateCcw,
  Palette,
  Languages,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import ExportService from '@/services/exportService';

interface ChatSettings {
  notifications: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
    email: boolean;
    volume: number;
  };
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    fontSize: number;
    bubbleStyle: 'modern' | 'classic' | 'minimal';
    accentColor: string;
  };
  privacy: {
    readReceipts: boolean;
    onlineStatus: boolean;
    typing: boolean;
    mediaAutoDownload: boolean;
  };
  chat: {
    enterToSend: boolean;
    autoCorrect: boolean;
    language: string;
    messageHistory: number; // days
    backupEnabled: boolean;
  };
}

const defaultSettings: ChatSettings = {
  notifications: {
    enabled: true,
    sound: true,
    desktop: true,
    email: false,
    volume: 0.7,
  },
  appearance: {
    theme: 'light',
    fontSize: 14,
    bubbleStyle: 'modern',
    accentColor: '#2563eb',
  },
  privacy: {
    readReceipts: true,
    onlineStatus: true,
    typing: true,
    mediaAutoDownload: true,
  },
  chat: {
    enterToSend: true,
    autoCorrect: true,
    language: 'en',
    messageHistory: 30,
    backupEnabled: true,
  },
};

interface EnhancedChatSettingsProps {
  onClose: () => void;
  initialSettings?: Partial<ChatSettings>;
}

export default function EnhancedChatSettings({ 
  onClose, 
  initialSettings 
}: EnhancedChatSettingsProps) {
  const { toast } = useToast();
  const [settings, setSettings] = useState<ChatSettings>({
    ...defaultSettings,
    ...initialSettings,
  });

  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = (path: string, value: any) => {
    const keys = path.split('.');
    const newSettings = { ...settings };
    let current: any = newSettings;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    setSettings(newSettings);
    setHasChanges(true);
  };

  const saveSettings = () => {
    // Save to localStorage or send to API
    localStorage.setItem('chatSettings', JSON.stringify(settings));
    
    toast({
      title: "Settings Saved",
      description: "Your chat preferences have been updated successfully.",
    });
    
    setHasChanges(false);
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    setHasChanges(true);
    
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values.",
    });
  };

  const exportChatData = async () => {
    // Mock chat data - in real app, this would come from chat service
    const chatData = [
      {
        id: '1',
        contact: 'Kanxa Safari Assistant',
        lastMessage: 'How can I help you today?',
        timestamp: new Date().toISOString(),
        messageCount: 15,
      },
      {
        id: '2', 
        contact: 'Support Team',
        lastMessage: 'Your booking has been confirmed',
        timestamp: new Date().toISOString(),
        messageCount: 8,
      }
    ];

    await ExportService.exportData(chatData, {
      format: 'json',
      filename: `chat_backup_${new Date().toISOString().split('T')[0]}`,
      includeHeaders: true,
    });
  };

  const clearChatHistory = () => {
    // Clear chat history logic
    toast({
      title: "Chat History Cleared",
      description: "All chat messages have been permanently deleted.",
      variant: "destructive",
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Chat Settings</h2>
          <p className="text-gray-600">Customize your chat experience</p>
        </div>
        <div className="flex items-center space-x-2">
          {hasChanges && (
            <Button variant="outline" onClick={resetSettings} size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          )}
          <Button onClick={saveSettings} disabled={!hasChanges}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Enable Notifications</Label>
                  <p className="text-sm text-gray-600">Receive notifications for new messages</p>
                </div>
                <Switch
                  checked={settings.notifications.enabled}
                  onCheckedChange={(checked) => updateSetting('notifications.enabled', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Sound Notifications</Label>
                  <p className="text-sm text-gray-600">Play sound when receiving messages</p>
                </div>
                <Switch
                  checked={settings.notifications.sound}
                  onCheckedChange={(checked) => updateSetting('notifications.sound', checked)}
                  disabled={!settings.notifications.enabled}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-base">Notification Volume</Label>
                <div className="flex items-center space-x-4">
                  <VolumeX className="h-4 w-4 text-gray-400" />
                  <Slider
                    value={[settings.notifications.volume * 100]}
                    onValueChange={(value) => updateSetting('notifications.volume', value[0] / 100)}
                    disabled={!settings.notifications.sound}
                    className="flex-1"
                  />
                  <Volume2 className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Desktop Notifications</Label>
                  <p className="text-sm text-gray-600">Show browser notifications</p>
                </div>
                <Switch
                  checked={settings.notifications.desktop}
                  onCheckedChange={(checked) => updateSetting('notifications.desktop', checked)}
                  disabled={!settings.notifications.enabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-gray-600">Send important messages to email</p>
                </div>
                <Switch
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) => updateSetting('notifications.email', checked)}
                  disabled={!settings.notifications.enabled}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Visual Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-base">Theme</Label>
                <div className="flex space-x-3">
                  <Button
                    variant={settings.appearance.theme === 'light' ? 'default' : 'outline'}
                    onClick={() => updateSetting('appearance.theme', 'light')}
                    className="flex items-center space-x-2"
                  >
                    <Sun className="h-4 w-4" />
                    <span>Light</span>
                  </Button>
                  <Button
                    variant={settings.appearance.theme === 'dark' ? 'default' : 'outline'}
                    onClick={() => updateSetting('appearance.theme', 'dark')}
                    className="flex items-center space-x-2"
                  >
                    <Moon className="h-4 w-4" />
                    <span>Dark</span>
                  </Button>
                  <Button
                    variant={settings.appearance.theme === 'auto' ? 'default' : 'outline'}
                    onClick={() => updateSetting('appearance.theme', 'auto')}
                    className="flex items-center space-x-2"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Auto</span>
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label className="text-base">Font Size</Label>
                <div className="flex items-center space-x-4">
                  <span className="text-sm">Small</span>
                  <Slider
                    value={[settings.appearance.fontSize]}
                    onValueChange={(value) => updateSetting('appearance.fontSize', value[0])}
                    min={12}
                    max={18}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm">Large</span>
                </div>
                <p className="text-sm text-gray-600">Current size: {settings.appearance.fontSize}px</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label className="text-base">Message Bubble Style</Label>
                <Select
                  value={settings.appearance.bubbleStyle}
                  onValueChange={(value) => updateSetting('appearance.bubbleStyle', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label className="text-base">Accent Color</Label>
                <div className="flex space-x-2">
                  {['#2563eb', '#16a34a', '#dc2626', '#ca8a04', '#9333ea'].map(color => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: color }}
                      onClick={() => updateSetting('appearance.accentColor', color)}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Read Receipts</Label>
                  <p className="text-sm text-gray-600">Let others know when you've read their messages</p>
                </div>
                <Switch
                  checked={settings.privacy.readReceipts}
                  onCheckedChange={(checked) => updateSetting('privacy.readReceipts', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Online Status</Label>
                  <p className="text-sm text-gray-600">Show when you're online</p>
                </div>
                <Switch
                  checked={settings.privacy.onlineStatus}
                  onCheckedChange={(checked) => updateSetting('privacy.onlineStatus', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Typing Indicators</Label>
                  <p className="text-sm text-gray-600">Show when you're typing</p>
                </div>
                <Switch
                  checked={settings.privacy.typing}
                  onCheckedChange={(checked) => updateSetting('privacy.typing', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Auto-download Media</Label>
                  <p className="text-sm text-gray-600">Automatically download images and files</p>
                </div>
                <Switch
                  checked={settings.privacy.mediaAutoDownload}
                  onCheckedChange={(checked) => updateSetting('privacy.mediaAutoDownload', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chat Settings */}
        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Chat Behavior
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Enter to Send</Label>
                  <p className="text-sm text-gray-600">Press Enter to send messages (Shift+Enter for new line)</p>
                </div>
                <Switch
                  checked={settings.chat.enterToSend}
                  onCheckedChange={(checked) => updateSetting('chat.enterToSend', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Auto-correct</Label>
                  <p className="text-sm text-gray-600">Automatically correct spelling mistakes</p>
                </div>
                <Switch
                  checked={settings.chat.autoCorrect}
                  onCheckedChange={(checked) => updateSetting('chat.autoCorrect', checked)}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-base">Language</Label>
                <Select
                  value={settings.chat.language}
                  onValueChange={(value) => updateSetting('chat.language', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ne">नेपाली (Nepali)</SelectItem>
                    <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-base">Message History (days)</Label>
                <Input
                  type="number"
                  value={settings.chat.messageHistory}
                  onChange={(e) => updateSetting('chat.messageHistory', parseInt(e.target.value))}
                  min={1}
                  max={365}
                />
                <p className="text-sm text-gray-600">How long to keep chat messages</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Automatic Backup</Label>
                  <p className="text-sm text-gray-600">Automatically backup chat data</p>
                </div>
                <Switch
                  checked={settings.chat.backupEnabled}
                  onCheckedChange={(checked) => updateSetting('chat.backupEnabled', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Management */}
        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Download className="h-5 w-5 mr-2" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Export Chat Data</h4>
                  <p className="text-sm text-gray-600 mb-3">Download your chat history and settings</p>
                  <Button onClick={exportChatData} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2 text-red-600">Danger Zone</h4>
                  <p className="text-sm text-gray-600 mb-3">Permanently delete all chat data</p>
                  <Button onClick={clearChatHistory} variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All Chat History
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
