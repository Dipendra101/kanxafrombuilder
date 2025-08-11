import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import connectDB from "./config/database";
import { handleDemo } from "./routes/demo";
import { authRoutes } from "./routes/auth";
import { transportationRoutes } from "./routes/transportation";
import { constructionRoutes } from "./routes/construction";
import { userRoutes } from "./routes/user";
import { bookingRoutes } from "./routes/booking";
import { paymentRoutes } from "./routes/payment";
import { chatRoutes } from "./routes/chat";

// Import models for initialization
import User from "./models/User";
import BusService from "./models/BusService";
import CargoService from "./models/CargoService";
import TourPackage from "./models/TourPackage";

export async function createServer() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Initialize default data
    await initializeDefaultData();

    const app = express();

  // Security middleware
  app.use(helmet());
  app.use(morgan('combined'));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
  });
  app.use('/api/', limiter);

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Health check endpoint
  app.get("/api/ping", (_req, res) => {
    res.json({ 
      message: "Kanxa Safari API is running!", 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
    });
  });

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/transportation", transportationRoutes);
  app.use("/api/construction", constructionRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/booking", bookingRoutes);
  app.use("/api/payment", paymentRoutes);
  app.use("/api/chat", chatRoutes);
  app.get("/api/demo", (req, res) => {
    res.json({ message: "Hello from Express server" });
  });

  // Root endpoint
  app.get("/api", (_req, res) => {
    res.json({ 
      message: "Welcome to Kanxa Safari API", 
      version: "1.0.0",
      database: "MongoDB",
      endpoints: {
        health: "/api/ping",
        auth: "/api/auth",
        transportation: "/api/transportation",
        construction: "/api/construction",
        user: "/api/user",
        booking: "/api/booking",
        payment: "/api/payment",
        chat: "/api/chat",
        demo: "/api/demo"
      }
    });
  });

  // Error handling middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Server error:", err.stack);
    res.status(500).json({ 
      error: "Internal server error", 
      message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
  });

  // 404 handler for API routes
  app.use("/api/*", (req, res) => {
    res.status(404).json({ 
      error: "API endpoint not found",
      path: req.path,
      method: req.method
    });
  });

    return app;
  } catch (error) {
    console.error('Failed to create server:', error);
    throw error;
  }
}

// Initialize default data
async function initializeDefaultData() {
  try {
    console.log('🔄 Initializing default data...');
    
    // Create admin user
    await User.createAdminIfNotExists();
    
    // Create default bus services
    await BusService.createDefaultServices();
    
    // Create default cargo services
    await CargoService.createDefaultServices();
    
    // Create default tour packages
    await TourPackage.createDefaultPackages();
    
    console.log('✅ Default data initialization completed');
  } catch (error) {
    console.error('❌ Error initializing default data:', error);
  }
}
