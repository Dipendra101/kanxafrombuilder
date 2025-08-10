import { Router } from "express";
import { z } from "zod";
import { verifyToken } from "./auth";

const router = Router();

// Validation schemas
const sendMessageSchema = z.object({
  content: z.string().min(1, "Message content is required").max(1000, "Message too long"),
  type: z.enum(["text", "image", "file"]).default("text"),
  attachmentUrl: z.string().optional(),
});

// Mock chat data (replace with database in production)
const conversations = [
  {
    id: "1",
    userId: "1",
    agentId: "agent-1",
    status: "active",
    subject: "Bus booking inquiry",
    createdAt: "2024-03-20T10:30:00Z",
    updatedAt: "2024-03-20T10:30:00Z",
    lastMessage: "2024-03-20T10:35:00Z",
  },
];

const messages = [
  {
    id: "1",
    conversationId: "1",
    senderId: "1",
    senderType: "user",
    content: "Hi, I need help with my bus booking",
    type: "text",
    timestamp: "2024-03-20T10:30:00Z",
    read: true,
  },
  {
    id: "2",
    conversationId: "1",
    senderId: "agent-1",
    senderType: "agent",
    content: "Hello! I'd be happy to help you with your bus booking. Can you please provide your booking reference number?",
    type: "text",
    timestamp: "2024-03-20T10:32:00Z",
    read: true,
  },
  {
    id: "3",
    conversationId: "1",
    senderId: "1",
    senderType: "user",
    content: "My booking ID is BK123456",
    type: "text",
    timestamp: "2024-03-20T10:35:00Z",
    read: false,
  },
];

// Get user conversations
router.get("/conversations", verifyToken, (req, res) => {
  const userConversations = conversations.filter(c => c.userId === req.user.userId);
  
  // Add message count and last message to each conversation
  const conversationsWithDetails = userConversations.map(conversation => {
    const conversationMessages = messages.filter(m => m.conversationId === conversation.id);
    const unreadCount = conversationMessages.filter(m => 
      m.senderType === "agent" && !m.read
    ).length;
    
    const lastMessage = conversationMessages
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    
    return {
      ...conversation,
      messageCount: conversationMessages.length,
      unreadCount,
      lastMessage: lastMessage?.content || "",
    };
  });
  
  // Sort by last message time (newest first)
  const sortedConversations = conversationsWithDetails.sort((a, b) => 
    new Date(b.lastMessage).getTime() - new Date(a.lastMessage).getTime()
  );
  
  res.json({ conversations: sortedConversations });
});

// Get conversation messages
router.get("/conversations/:id/messages", verifyToken, (req, res) => {
  const conversation = conversations.find(c => 
    c.id === req.params.id && c.userId === req.user.userId
  );
  
  if (!conversation) {
    return res.status(404).json({ error: "Conversation not found" });
  }
  
  const conversationMessages = messages
    .filter(m => m.conversationId === req.params.id)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  
  // Mark agent messages as read
  conversationMessages.forEach(message => {
    if (message.senderType === "agent" && !message.read) {
      message.read = true;
    }
  });
  
  res.json({ messages: conversationMessages });
});

// Create new conversation
router.post("/conversations", verifyToken, async (req, res) => {
  try {
    const { subject } = req.body;
    
    const newConversation = {
      id: Date.now().toString(),
      userId: req.user.userId,
      agentId: null, // Will be assigned when agent responds
      status: "pending",
      subject: subject || "General inquiry",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastMessage: new Date().toISOString(),
    };
    
    conversations.push(newConversation);
    
    res.status(201).json({
      message: "Conversation created successfully",
      conversation: newConversation,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create conversation" });
  }
});

// Send message
router.post("/conversations/:id/messages", verifyToken, async (req, res) => {
  try {
    const validatedData = sendMessageSchema.parse(req.body);
    
    const conversation = conversations.find(c => 
      c.id === req.params.id && c.userId === req.user.userId
    );
    
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    
    const newMessage = {
      id: Date.now().toString(),
      conversationId: req.params.id,
      senderId: req.user.userId,
      senderType: "user",
      ...validatedData,
      timestamp: new Date().toISOString(),
      read: false,
    };
    
    messages.push(newMessage);
    
    // Update conversation last message time
    conversation.lastMessage = newMessage.timestamp;
    conversation.updatedAt = new Date().toISOString();
    
    res.status(201).json({
      message: "Message sent successfully",
      message: newMessage,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation error", details: error.errors });
    }
    res.status(500).json({ error: "Failed to send message" });
  }
});

// Mark messages as read
router.put("/conversations/:id/read", verifyToken, async (req, res) => {
  const conversation = conversations.find(c => 
    c.id === req.params.id && c.userId === req.user.userId
  );
  
  if (!conversation) {
    return res.status(404).json({ error: "Conversation not found" });
  }
  
  // Mark all agent messages in this conversation as read
  const conversationMessages = messages.filter(m => m.conversationId === req.params.id);
  conversationMessages.forEach(message => {
    if (message.senderType === "agent" && !message.read) {
      message.read = true;
    }
  });
  
  res.json({
    message: "Messages marked as read",
  });
});

// Close conversation
router.put("/conversations/:id/close", verifyToken, async (req, res) => {
  const conversation = conversations.find(c => 
    c.id === req.params.id && c.userId === req.user.userId
  );
  
  if (!conversation) {
    return res.status(404).json({ error: "Conversation not found" });
  }
  
  conversation.status = "closed";
  conversation.updatedAt = new Date().toISOString();
  
  res.json({
    message: "Conversation closed successfully",
    conversation,
  });
});

// Get chat statistics
router.get("/stats", verifyToken, (req, res) => {
  const userConversations = conversations.filter(c => c.userId === req.user.userId);
  const userMessages = messages.filter(m => 
    userConversations.some(c => c.id === m.conversationId)
  );
  
  const stats = {
    totalConversations: userConversations.length,
    activeConversations: userConversations.filter(c => c.status === "active").length,
    pendingConversations: userConversations.filter(c => c.status === "pending").length,
    closedConversations: userConversations.filter(c => c.status === "closed").length,
    totalMessages: userMessages.length,
    unreadMessages: userMessages.filter(m => 
      m.senderType === "agent" && !m.read
    ).length,
  };
  
  res.json({ stats });
});

// Get recent conversations (for quick access)
router.get("/recent", verifyToken, (req, res) => {
  const userConversations = conversations.filter(c => c.userId === req.user.userId);
  
  // Get the 5 most recent conversations
  const recentConversations = userConversations
    .sort((a, b) => new Date(b.lastMessage).getTime() - new Date(a.lastMessage).getTime())
    .slice(0, 5);
  
  res.json({ conversations: recentConversations });
});

// Search messages
router.get("/search", verifyToken, (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    return res.status(400).json({ error: "Search query is required" });
  }
  
  const userConversations = conversations.filter(c => c.userId === req.user.userId);
  const userMessages = messages.filter(m => 
    userConversations.some(c => c.id === m.conversationId) &&
    m.content.toLowerCase().includes(query.toString().toLowerCase())
  );
  
  res.json({ messages: userMessages });
});

export { router as chatRoutes };
