import { useState } from "react";
import { MessageCircle, Bot, Users, Phone, Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import ChatList from "@/components/chat/ChatList";
import ChatInterface from "@/components/chat/ChatInterface";

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
  type: 'bot' | 'admin' | 'user';
}

export default function Chat() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);

  // Auto-select Kanxa Safari AI Assistant on load
  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsMobileView(true); // Show chat interface on mobile
  };

  const handleCloseChat = () => {
    setSelectedContact(null);
    setIsMobileView(false);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-kanxa-blue to-kanxa-navy text-white py-12">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              Chat & Support Center
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Get instant help from our AI assistant or connect with our support team for personalized assistance.
            </p>
          </div>
        </div>
      </section>

      {/* Chat Features Banner */}
      <section className="py-8 bg-gray-50">
        <div className="container px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="text-center">
              <CardContent className="p-6">
                <Bot className="h-8 w-8 text-kanxa-blue mx-auto mb-3" />
                <h3 className="font-semibold mb-2">AI Assistant</h3>
                <p className="text-sm text-gray-600">
                  Get instant answers about our services, pricing, and bookings
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <Users className="h-8 w-8 text-kanxa-orange mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Live Support</h3>
                <p className="text-sm text-gray-600">
                  Chat with our expert team for personalized assistance
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <Phone className="h-8 w-8 text-kanxa-green mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Voice & Video</h3>
                <p className="text-sm text-gray-600">
                  Make voice or video calls for complex issues
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Chat Interface */}
      <section className="flex-1 bg-white">
        <div className="container px-0 h-screen max-h-[calc(100vh-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
            {/* Chat List - Hidden on mobile when chat is open */}
            <div className={`lg:col-span-4 xl:col-span-3 border-r bg-white ${
              isMobileView ? 'hidden lg:block' : 'block'
            }`}>
              <ChatList 
                onSelectContact={handleSelectContact}
                selectedContactId={selectedContact?.id}
              />
            </div>

            {/* Chat Interface */}
            <div className={`lg:col-span-8 xl:col-span-9 ${
              !selectedContact ? 'hidden lg:flex' : 'flex'
            } flex-col`}>
              {selectedContact ? (
                <ChatInterface 
                  onClose={handleCloseChat}
                  initialContact={selectedContact}
                />
              ) : (
                /* Empty State */
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center max-w-md mx-auto p-8">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <MessageCircle className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Welcome to Kanxa Safari Chat
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Select a conversation from the sidebar to start chatting, or begin a new conversation with our AI assistant.
                    </p>
                    
                    <div className="space-y-3">
                      <Button 
                        onClick={() => handleSelectContact({
                          id: 'kanxa-bot',
                          name: 'Kanxa Safari Assistant',
                          type: 'bot',
                          isOnline: true
                        })}
                        className="w-full bg-kanxa-blue hover:bg-kanxa-navy"
                      >
                        <Bot className="mr-2 h-4 w-4" />
                        Start Chat with AI Assistant
                      </Button>
                      
                      <Button 
                        variant="outline"
                        onClick={() => handleSelectContact({
                          id: 'admin-support',
                          name: 'Customer Support',
                          type: 'admin',
                          isOnline: true
                        })}
                        className="w-full"
                      >
                        <Users className="mr-2 h-4 w-4" />
                        Connect with Support Team
                      </Button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <p className="text-sm text-gray-500 mb-3">Need immediate help?</p>
                      <div className="flex space-x-3 justify-center">
                        <Button variant="outline" size="sm">
                          <Phone className="mr-2 h-4 w-4" />
                          Call: 9856056782
                        </Button>
                        <Button variant="outline" size="sm">
                          <Video className="mr-2 h-4 w-4" />
                          Video Call
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access FAQs */}
      <section className="py-12 bg-gray-50">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Quick Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "How to book a bus ticket?",
                "What's the price of cement?",
                "When is my next booking?",
                "How to track my order?",
                "What services do you offer?",
                "How to cancel a booking?"
              ].map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="text-left justify-start p-4 h-auto"
                  onClick={() => {
                    const botContact = {
                      id: 'kanxa-bot',
                      name: 'Kanxa Safari Assistant',
                      type: 'bot' as const,
                      isOnline: true
                    };
                    setSelectedContact(botContact);
                    setIsMobileView(true);
                  }}
                >
                  <MessageCircle className="mr-3 h-4 w-4 text-kanxa-blue" />
                  {question}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
