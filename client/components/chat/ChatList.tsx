import { useState, useEffect } from "react";
import {
  Search,
  MessageCircle,
  Phone,
  Video,
  MoreVertical,
  Bot,
  Shield,
  Users,
  Settings,
  Archive,
  Star,
  Filter,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
  type: 'bot' | 'admin' | 'user';
  lastMessage?: {
    text: string;
    timestamp: Date;
    sender: string;
    unread: boolean;
  };
  unreadCount: number;
  isPinned: boolean;
  isArchived: boolean;
}

interface ChatListProps {
  onSelectContact: (contact: Contact) => void;
  selectedContactId?: string;
}

export default function ChatList({ onSelectContact, selectedContactId }: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    // Initialize with mock contacts
    setContacts([
      {
        id: 'kanxa-bot',
        name: 'Kanxa Safari Assistant',
        type: 'bot',
        isOnline: true,
        lastMessage: {
          text: '🙏 Namaste! Welcome to Kanxa Safari! How can I help you today?',
          timestamp: new Date(),
          sender: 'bot',
          unread: false
        },
        unreadCount: 0,
        isPinned: true,
        isArchived: false
      },
      {
        id: 'admin-support',
        name: 'Customer Support',
        type: 'admin',
        isOnline: true,
        lastMessage: {
          text: 'Thank you for contacting Kanxa Safari. How can we assist you?',
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          sender: 'admin',
          unread: true
        },
        unreadCount: 2,
        isPinned: false,
        isArchived: false
      },
      {
        id: 'booking-dept',
        name: 'Booking Department',
        type: 'admin',
        isOnline: false,
        lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        lastMessage: {
          text: 'Your booking confirmation is ready. Would you like to proceed?',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
          sender: 'admin',
          unread: false
        },
        unreadCount: 0,
        isPinned: false,
        isArchived: false
      },
      {
        id: 'construction-team',
        name: 'Construction Team',
        type: 'admin',
        isOnline: true,
        lastMessage: {
          text: 'Your materials are ready for delivery tomorrow at 10 AM.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
          sender: 'admin',
          unread: true
        },
        unreadCount: 1,
        isPinned: false,
        isArchived: false
      },
      {
        id: 'garage-service',
        name: 'Garage Service',
        type: 'admin',
        isOnline: false,
        lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
        lastMessage: {
          text: 'Your vehicle service is completed. You can pick it up anytime.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
          sender: 'admin',
          unread: false
        },
        unreadCount: 0,
        isPinned: false,
        isArchived: false
      }
    ]);
  }, []);

  const formatLastMessageTime = (timestamp: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return diffInMinutes < 1 ? 'now' : `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return diffInDays === 1 ? 'yesterday' : `${diffInDays}d`;
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    switch (activeTab) {
      case 'bots':
        return matchesSearch && contact.type === 'bot';
      case 'admins':
        return matchesSearch && contact.type === 'admin';
      case 'unread':
        return matchesSearch && contact.unreadCount > 0;
      case 'pinned':
        return matchesSearch && contact.isPinned;
      case 'archived':
        return matchesSearch && contact.isArchived;
      default:
        return matchesSearch && !contact.isArchived;
    }
  });

  const totalUnread = contacts.reduce((sum, contact) => sum + contact.unreadCount, 0);

  const ContactItem = ({ contact }: { contact: Contact }) => {
    const isSelected = contact.id === selectedContactId;

    return (
      <div
        className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
          isSelected 
            ? 'bg-kanxa-light-blue border border-kanxa-blue' 
            : 'hover:bg-gray-50'
        }`}
        onClick={() => onSelectContact(contact)}
      >
        <div className="relative">
          <Avatar className="w-12 h-12">
            <AvatarImage src={contact.avatar} />
            <AvatarFallback className={
              contact.type === 'bot' 
                ? 'bg-kanxa-blue text-white' 
                : contact.type === 'admin'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-500 text-white'
            }>
              {contact.type === 'bot' ? 'KS' : contact.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          {/* Online indicator */}
          {contact.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
          )}
          
          {/* Bot indicator */}
          {contact.type === 'bot' && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-kanxa-orange rounded-full flex items-center justify-center">
              <Bot className="w-3 h-3 text-white" />
            </div>
          )}
          
          {/* Admin indicator */}
          {contact.type === 'admin' && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
              <Shield className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        <div className="flex-1 ml-3 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className={`font-semibold truncate ${
                contact.lastMessage?.unread ? 'text-gray-900' : 'text-gray-700'
              }`}>
                {contact.name}
              </h3>
              {contact.isPinned && (
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
              )}
              {contact.type === 'bot' && (
                <Badge variant="secondary" className="text-xs">AI</Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-1">
              {contact.lastMessage && (
                <span className="text-xs text-gray-500">
                  {formatLastMessageTime(contact.lastMessage.timestamp)}
                </span>
              )}
              {contact.unreadCount > 0 && (
                <Badge className="bg-kanxa-blue text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center">
                  {contact.unreadCount > 99 ? '99+' : contact.unreadCount}
                </Badge>
              )}
            </div>
          </div>
          
          {contact.lastMessage && (
            <p className={`text-sm truncate mt-1 ${
              contact.lastMessage.unread 
                ? 'text-gray-900 font-medium' 
                : 'text-gray-500'
            }`}>
              {contact.lastMessage.sender === 'user' ? 'You: ' : ''}
              {contact.lastMessage.text}
            </p>
          )}
          
          {!contact.isOnline && contact.lastSeen && (
            <p className="text-xs text-gray-400 mt-1">
              Last seen {formatLastMessageTime(contact.lastSeen)}
            </p>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8 opacity-0 group-hover:opacity-100">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Star className="w-4 h-4 mr-2" />
              {contact.isPinned ? 'Unpin' : 'Pin'} Chat
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Archive className="w-4 h-4 mr-2" />
              Archive Chat
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              Delete Chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
          <div className="flex items-center space-x-2">
            {totalUnread > 0 && (
              <Badge className="bg-kanxa-blue text-white">
                {totalUnread} new
              </Badge>
            )}
            <Button variant="ghost" size="icon">
              <Filter className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Plus className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-6 mx-4 mt-2">
          <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
          <TabsTrigger value="bots" className="text-xs">AI</TabsTrigger>
          <TabsTrigger value="admins" className="text-xs">Staff</TabsTrigger>
          <TabsTrigger value="unread" className="text-xs">Unread</TabsTrigger>
          <TabsTrigger value="pinned" className="text-xs">Pinned</TabsTrigger>
          <TabsTrigger value="archived" className="text-xs">Archive</TabsTrigger>
        </TabsList>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto">
          <TabsContent value={activeTab} className="mt-0 p-4 space-y-2">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <ContactItem key={contact.id} contact={contact} />
              ))
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No conversations found</p>
                {searchQuery && (
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear search
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t bg-gray-50">
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              <Bot className="w-4 h-4 mr-1" />
              AI Help
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <Phone className="w-4 h-4 mr-1" />
              Call
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <Video className="w-4 h-4 mr-1" />
              Video
            </Button>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
