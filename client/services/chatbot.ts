// Kanxa Safari AI Chatbot Service
// This service integrates with Google Gemini AI to provide intelligent responses
// about Kanxa Safari services, bookings, and general assistance

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot" | "admin";
  timestamp: Date;
  type: "text" | "image" | "voice" | "video" | "file" | "system";
  metadata?: {
    imageUrl?: string;
    audioUrl?: string;
    videoUrl?: string;
    fileName?: string;
    fileSize?: number;
    duration?: number;
  };
  status?: "sending" | "sent" | "delivered" | "read";
  replyTo?: string;
}

interface KanxaSafariData {
  buses: any[];
  routes: any[];
  materials: any[];
  machinery: any[];
  services: any[];
  bookings: any[];
  orders: any[];
  prices: any[];
  schedules: any[];
}

class KanxaSafariChatbot {
  private apiKey: string;
  private baseUrl: string;
  private kanxaData: KanxaSafariData;

  constructor() {
    // In production, this should come from environment variables
    this.apiKey = "YOUR_GEMINI_API_KEY"; // Replace with actual API key
    this.baseUrl = "https://generativelanguage.googleapis.com/v1beta";
    this.kanxaData = this.initializeKanxaData();
  }

  private initializeKanxaData(): KanxaSafariData {
    // Mock data - in production, this would fetch from your backend
    return {
      buses: [
        {
          id: "BUS001",
          name: "Kathmandu Express",
          route: "Lamjung - Kathmandu",
          price: 800,
          departure: "06:00",
          arrival: "12:00",
          seats: 45,
          amenities: ["AC", "WiFi", "Entertainment", "Charging Port"],
          type: "Deluxe",
        },
        {
          id: "BUS002",
          name: "Pokhara Premium",
          route: "Lamjung - Pokhara",
          price: 600,
          departure: "08:00",
          arrival: "11:00",
          seats: 50,
          amenities: ["AC", "WiFi", "Refreshments"],
          type: "Standard",
        },
      ],
      routes: [
        {
          from: "Lamjung",
          to: "Kathmandu",
          distance: "200km",
          duration: "6 hours",
        },
        {
          from: "Lamjung",
          to: "Pokhara",
          distance: "120km",
          duration: "3 hours",
        },
        {
          from: "Lamjung",
          to: "Chitwan",
          distance: "150km",
          duration: "4 hours",
        },
      ],
      materials: [
        {
          name: "Cement",
          price: 1200,
          unit: "bag",
          category: "Building Materials",
        },
        {
          name: "Steel Rods",
          price: 85,
          unit: "kg",
          category: "Construction Steel",
        },
        {
          name: "Bricks",
          price: 25,
          unit: "piece",
          category: "Building Materials",
        },
      ],
      machinery: [
        {
          name: "Excavator",
          price: 15000,
          unit: "day",
          category: "Heavy Machinery",
        },
        {
          name: "Concrete Mixer",
          price: 2500,
          unit: "day",
          category: "Construction Equipment",
        },
        {
          name: "Bulldozer",
          price: 18000,
          unit: "day",
          category: "Heavy Machinery",
        },
      ],
      services: [
        { name: "Vehicle Maintenance", category: "Garage", startingPrice: 500 },
        { name: "Tractor Repair", category: "Garage", startingPrice: 2000 },
        { name: "Engine Overhaul", category: "Garage", startingPrice: 15000 },
      ],
      bookings: [],
      orders: [],
      prices: [],
      schedules: [],
    };
  }

  private createSystemPrompt(): string {
    return `You are Kanxa Safari AI Assistant, a helpful chatbot for Kanxa Safari company in Nepal. 

COMPANY OVERVIEW:
Kanxa Safari is a premium transportation, construction, and garage service provider based in Lamjung, Nepal. We have been serving customers for over 15 years with excellence and innovation.

OUR SERVICES:
1. TRANSPORTATION:
   - Premium bus services with modern fleet
   - Cargo transportation across Nepal
   - Custom tour packages
   - Online booking system

2. CONSTRUCTION:
   - Building materials supply (cement, steel, bricks, etc.)
   - Heavy machinery rental (excavators, bulldozers, etc.)
   - Construction equipment
   - Project consultation

3. GARAGE & WORKSHOP:
   - Vehicle maintenance and repair
   - Tractor and heavy equipment servicing
   - Spare parts supply
   - Expert technician services

CONTACT INFORMATION:
- Phone: 9856056782, 9856045678
- Email: kanxasafari1@gmail.com
- Location: Lamjung, Nepal
- Operating Hours: Transportation 24/7, Construction 6 AM - 8 PM, Garage 7 AM - 7 PM

PERSONALITY & TONE:
- Be friendly, helpful, and professional
- Use appropriate Nepali greetings when suitable (Namaste, Dhanyabad)
- Show enthusiasm about our services
- Be knowledgeable about transportation in Nepal
- Provide specific, actionable information
- Always try to help users find solutions

AVAILABLE DATA:
${JSON.stringify(this.kanxaData, null, 2)}

CAPABILITIES:
- Answer questions about our services, prices, and schedules
- Help with booking inquiries
- Provide route information
- Assist with construction material needs
- Give information about machinery rental
- Help troubleshoot basic vehicle issues
- Direct users to appropriate services
- Handle complaints and feedback professionally

Always prioritize user satisfaction and try to convert inquiries into actual bookings or orders when appropriate. If you don't have specific information, acknowledge it and offer to connect them with our team.

Respond in a conversational, helpful manner. Keep responses concise but informative.`;
  }

  async generateResponse(
    userMessage: string,
    conversationHistory: ChatMessage[] = [],
  ): Promise<string> {
    try {
      // Prepare the conversation context
      const context = conversationHistory
        .slice(-10) // Last 10 messages for context
        .map((msg) => `${msg.sender}: ${msg.text}`)
        .join("\n");

      const prompt = `${this.createSystemPrompt()}

CONVERSATION CONTEXT:
${context}

USER: ${userMessage}

ASSISTANT:`;

      // Simulate Gemini API call (replace with actual implementation)
      const response = await this.callGeminiAPI(prompt);
      return response;
    } catch (error) {
      console.error("Chatbot error:", error);
      return "I apologize, but I'm having trouble processing your request right now. Please try again or contact our support team at 9856056782 for immediate assistance.";
    }
  }

  private async callGeminiAPI(prompt: string): Promise<string> {
    // Mock implementation - replace with actual Gemini API call
    // In production, you would make an HTTP request to Gemini API

    // For now, return intelligent responses based on keywords
    return this.generateMockResponse(prompt);
  }

  private generateMockResponse(prompt: string): string {
    const userMessage = prompt
      .split("USER: ")[1]
      ?.split("ASSISTANT:")[0]
      ?.trim()
      .toLowerCase();

    if (!userMessage) return "How can I help you today?";

    // Bus/Transportation queries
    if (
      userMessage.includes("bus") ||
      userMessage.includes("ticket") ||
      userMessage.includes("booking")
    ) {
      return `🚌 I'd be happy to help you with bus bookings! 

We have premium bus services from Lamjung to:
• Kathmandu - NPR 800 (6 hours) - Departures: 6:00 AM, 2:00 PM
• Pokhara - NPR 600 (3 hours) - Departures: 8:00 AM, 4:00 PM  
• Chitwan - NPR 700 (4 hours) - Departures: 7:00 AM, 3:00 PM

All our buses feature AC, WiFi, and entertainment systems. Would you like me to help you book a specific route?`;
    }

    // Construction materials
    if (
      userMessage.includes("cement") ||
      userMessage.includes("construction") ||
      userMessage.includes("materials")
    ) {
      return `🏗️ We supply high-quality construction materials:

Popular items:
• Cement - NPR 1,200 per bag
• Steel Rods - NPR 85 per kg  
• Bricks - NPR 25 per piece
• Sand & Gravel - Available in bulk

We offer:
✅ Quality guarantee
✅ Timely delivery
✅ Competitive pricing
✅ Technical consultation

What materials do you need for your project? I can provide detailed quotes and delivery schedules.`;
    }

    // Machinery rental
    if (
      userMessage.includes("excavator") ||
      userMessage.includes("machinery") ||
      userMessage.includes("equipment")
    ) {
      return `🚜 Our heavy machinery rental services:

Available equipment:
• Excavator - NPR 15,000/day
• Bulldozer - NPR 18,000/day  
• Concrete Mixer - NPR 2,500/day
• Road Roller - NPR 12,000/day

Includes:
✅ Certified operators
✅ Fuel and maintenance
✅ Insurance coverage
✅ 24/7 support

Which machinery do you need and for how many days? I can check availability and provide a detailed quote.`;
    }

    // Garage services
    if (
      userMessage.includes("repair") ||
      userMessage.includes("garage") ||
      userMessage.includes("maintenance")
    ) {
      return `🔧 Our expert garage services:

We repair and maintain:
• All vehicle types (cars, trucks, buses)
• Tractors and farm equipment
�� Heavy machinery
• Engine overhauls

Services include:
✅ Diagnostic testing
✅ Preventive maintenance  
✅ Genuine spare parts
✅ Experienced technicians

Operating hours: 7 AM - 7 PM daily. What type of vehicle needs service? I can schedule an appointment for you.`;
    }

    // Price inquiries
    if (
      userMessage.includes("price") ||
      userMessage.includes("cost") ||
      userMessage.includes("rate")
    ) {
      return `💰 I can help you with pricing information!

Quick price guide:
🚌 Bus tickets: NPR 600-800 depending on destination
🏗️ Construction materials: Starting from NPR 25 (bricks)
🚜 Machinery rental: NPR 2,500-18,000 per day
🔧 Garage services: Starting from NPR 500

For detailed quotes specific to your needs, please let me know:
- What service you're interested in
- Quantity/duration needed
- Any special requirements

I'll provide you with exact pricing and availability!`;
    }

    // Contact/location queries
    if (
      userMessage.includes("contact") ||
      userMessage.includes("phone") ||
      userMessage.includes("address")
    ) {
      return `📞 Here's how to reach Kanxa Safari:

Phone Numbers:
• 9856056782
• 9856045678

Email: kanxasafari1@gmail.com
Location: Lamjung, Nepal

Operating Hours:
• Transportation: 24/7
• Construction: 6 AM - 8 PM  
• Garage: 7 AM - 7 PM

You can also book online through our website or continue chatting with me for immediate assistance!`;
    }

    // Greetings
    if (
      userMessage.includes("hello") ||
      userMessage.includes("hi") ||
      userMessage.includes("namaste")
    ) {
      return `🙏 Namaste! Welcome to Kanxa Safari! 

I'm your AI assistant, here to help you with:
🚌 Bus bookings and transportation
🏗️ Construction materials and machinery
🔧 Vehicle repair and maintenance

How can I assist you today? Feel free to ask about our services, prices, schedules, or anything else!`;
    }

    // Default response
    return `Thank you for your message! I'm here to help you with Kanxa Safari services.

I can assist with:
🚌 Transportation (buses, cargo, tours)
🏗️ Construction (materials, machinery rental)  
🔧 Garage services (repairs, maintenance)

Could you please tell me more about what you're looking for? For example:
- "I need a bus ticket to Kathmandu"
- "What's the price of cement?"
- "I need an excavator for 3 days"
- "My tractor needs repair"

I'm here to help! 😊`;
  }

  // Helper methods for specific queries
  searchBuses(route: string, date?: string) {
    return this.kanxaData.buses.filter((bus) =>
      bus.route.toLowerCase().includes(route.toLowerCase()),
    );
  }

  getMaterialPrice(materialName: string) {
    return this.kanxaData.materials.find((material) =>
      material.name.toLowerCase().includes(materialName.toLowerCase()),
    );
  }

  getMachineryInfo(machineName: string) {
    return this.kanxaData.machinery.find((machine) =>
      machine.name.toLowerCase().includes(machineName.toLowerCase()),
    );
  }

  getServiceInfo(serviceName: string) {
    return this.kanxaData.services.find((service) =>
      service.name.toLowerCase().includes(serviceName.toLowerCase()),
    );
  }
}

export const kanxaChatbot = new KanxaSafariChatbot();
export type { ChatMessage, KanxaSafariData };
