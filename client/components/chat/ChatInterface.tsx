import { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  MoreVertical,
  ArrowLeft,
  Camera,
  Mic,
  MicOff,
  Image as ImageIcon,
  FileText,
  MapPin,
  Heart,
  Trash2,
  Copy,
  Reply,
  Info,
  CheckCheck,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { kanxaChatbot, ChatMessage } from "@/services/chatbot";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import EnhancedChatSettings from "./EnhancedChatSettings";
import ExportService from "@/services/exportService";

interface ChatInterfaceProps {
  onClose: () => void;
  initialContact?: {
    id: string;
    name: string;
    avatar?: string;
    isOnline: boolean;
    lastSeen?: Date;
    type: "bot" | "admin" | "user";
  };
}

export default function ChatInterface({
  onClose,
  initialContact,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Mock contact data
  const contact = initialContact || {
    id: "kanxa-bot",
    name: "Kanxa Safari Assistant",
    avatar: "",
    isOnline: true,
    type: "bot" as const,
  };

  useEffect(() => {
    // Initialize with welcome message from bot
    if (contact.type === "bot") {
      const welcomeMessage: ChatMessage = {
        id: "welcome",
        text: "🙏 Namaste! Welcome to Kanxa Safari! I'm your AI assistant. How can I help you today?",
        sender: "bot",
        timestamp: new Date(),
        type: "text",
        status: "read",
      };
      setMessages([welcomeMessage]);
    }
  }, [contact.type]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
      type: "text",
      status: "sending",
      replyTo: replyingTo?.id,
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setReplyingTo(null);

    // Update message status to sent
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id ? { ...msg, status: "sent" } : msg,
        ),
      );
    }, 500);

    // Generate bot response if chatting with bot
    if (contact.type === "bot") {
      setIsLoading(true);
      try {
        const response = await kanxaChatbot.generateResponse(
          newMessage,
          messages,
        );

        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: response,
          sender: "bot",
          timestamp: new Date(),
          type: "text",
          status: "read",
        };

        setMessages((prev) => [...prev, botMessage]);

        // Mark user message as read
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === userMessage.id ? { ...msg, status: "read" } : msg,
          ),
        );
      } catch (error) {
        console.error("Bot response error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileMessage: ChatMessage = {
      id: Date.now().toString(),
      text: `Shared ${file.type.startsWith("image/") ? "photo" : "file"}: ${file.name}`,
      sender: "user",
      timestamp: new Date(),
      type: file.type.startsWith("image/") ? "image" : "file",
      metadata: {
        fileName: file.name,
        fileSize: file.size,
        imageUrl: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined,
      },
      status: "sent",
    };

    setMessages((prev) => [...prev, fileMessage]);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, you would start/stop voice recording here
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getStatusIcon = (status: ChatMessage["status"]) => {
    switch (status) {
      case "sending":
        return (
          <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse" />
        );
      case "sent":
        return <Check className="w-3 h-3 text-gray-400" />;
      case "delivered":
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case "read":
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const MessageBubble = ({ message }: { message: ChatMessage }) => {
    const isUser = message.sender === "user";
    const isBot = message.sender === "bot";

    return (
      <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
        <div className={`max-w-[80%] ${isUser ? "order-2" : "order-1"}`}>
          {/* Reply indicator */}
          {message.replyTo && (
            <div className="text-xs text-gray-500 mb-1 px-3">
              Replying to previous message
            </div>
          )}

          <div
            className={`px-4 py-2 rounded-2xl ${
              isUser
                ? "bg-kanxa-blue text-white ml-auto"
                : isBot
                  ? "bg-gray-100 text-gray-900"
                  : "bg-blue-500 text-white"
            }`}
          >
            {/* Image message */}
            {message.type === "image" && message.metadata?.imageUrl && (
              <div className="mb-2">
                <img
                  src={message.metadata.imageUrl}
                  alt="Shared image"
                  className="max-w-full rounded-lg"
                  style={{ maxHeight: "300px", objectFit: "cover" }}
                />
              </div>
            )}

            {/* File message */}
            {message.type === "file" && (
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="w-5 h-5" />
                <div>
                  <p className="font-medium">{message.metadata?.fileName}</p>
                  <p className="text-xs opacity-75">
                    {((message.metadata?.fileSize || 0) / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
            )}

            {/* Text content */}
            <p className="whitespace-pre-wrap break-words">{message.text}</p>

            {/* Message footer */}
            <div
              className={`flex items-center justify-between mt-1 text-xs ${
                isUser ? "text-white/70" : "text-gray-500"
              }`}
            >
              <span>{formatTime(message.timestamp)}</span>
              {isUser && (
                <div className="ml-2">{getStatusIcon(message.status)}</div>
              )}
            </div>
          </div>
        </div>

        {/* Avatar for non-user messages */}
        {!isUser && (
          <Avatar
            className={`w-8 h-8 ${isUser ? "order-1 mr-2" : "order-2 ml-2"}`}
          >
            <AvatarImage src={contact.avatar} />
            <AvatarFallback
              className={
                isBot ? "bg-kanxa-blue text-white" : "bg-blue-500 text-white"
              }
            >
              {isBot ? "KS" : contact.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <Avatar className="w-10 h-10">
            <AvatarImage src={contact.avatar} />
            <AvatarFallback
              className={
                contact.type === "bot"
                  ? "bg-kanxa-blue text-white"
                  : "bg-blue-500 text-white"
              }
            >
              {contact.type === "bot" ? "KS" : contact.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{contact.name}</h3>
            <div className="flex items-center space-x-1">
              {contact.isOnline ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-xs text-green-600">Online</span>
                </>
              ) : (
                <span className="text-xs text-gray-500">
                  Last seen {contact.lastSeen?.toLocaleTimeString()}
                </span>
              )}
              {contact.type === "bot" && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  AI Assistant
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {contact.type !== "bot" && (
            <>
              <Button variant="ghost" size="icon">
                <Phone className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="w-5 h-5" />
              </Button>
            </>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowInfo(!showInfo)}>
                <Info className="w-4 h-4 mr-2" />
                Contact Info
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowSettings(true)}>
                <Settings className="w-4 h-4 mr-2" />
                Chat Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={async () => {
                const chatData = messages.map(msg => ({
                  id: msg.id,
                  text: msg.text,
                  sender: msg.sender,
                  timestamp: msg.timestamp.toISOString(),
                  type: msg.type
                }));
                await ExportService.exportData(chatData, {
                  format: 'json',
                  filename: `chat_${contact.name.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}`
                });
              }}>
                <Download className="w-4 h-4 mr-2" />
                Export Chat
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Heart className="w-4 h-4 mr-2" />
                Add to Favorites
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={() => {
                setMessages([]);
                if (contact.type === 'bot') {
                  const welcomeMessage: ChatMessage = {
                    id: 'welcome',
                    text: '🙏 Namaste! Welcome to Kanxa Safari! I\'m your AI assistant. How can I help you today?',
                    sender: 'bot',
                    timestamp: new Date(),
                    type: 'text',
                    status: 'read',
                  };
                  setMessages([welcomeMessage]);
                }
              }}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isLoading && (
          <div className="flex justify-start mb-2">
            <div className="bg-gray-100 rounded-2xl px-4 py-2">
              <LoadingSpinner size="sm" text="Typing..." />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Reply indicator */}
      {replyingTo && (
        <div className="px-4 py-2 bg-gray-50 border-l-4 border-kanxa-blue">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Replying to:</p>
              <p className="text-sm text-gray-700 truncate">
                {replyingTo.text}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setReplyingTo(null)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="p-4 border-t bg-white">
        <div className="flex items-end space-x-2">
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Camera className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="min-h-[40px] max-h-32 resize-none border-gray-300 rounded-2xl pr-12"
              rows={1}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 bottom-1"
            >
              <Smile className="w-5 h-5" />
            </Button>
          </div>

          {newMessage.trim() ? (
            <Button
              onClick={handleSendMessage}
              className="bg-kanxa-blue hover:bg-kanxa-navy rounded-full p-2"
              disabled={isLoading}
            >
              <Send className="w-5 h-5" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleRecording}
              className={isRecording ? "text-red-500" : ""}
            >
              {isRecording ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        hidden
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
        onChange={handleFileUpload}
      />

      {/* Enhanced Chat Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-h-[90vh] overflow-y-auto w-full max-w-4xl">
            <div className="p-6">
              <EnhancedChatSettings
                onClose={() => setShowSettings(false)}
                initialSettings={{
                  // Load saved settings or defaults
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
