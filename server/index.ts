import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import serviceRoutes from "./routes/services";
import bookingRoutes from "./routes/bookings";
import adminRoutes from "./routes/admin";
import connectDB from "./config/database";

export function createServer() {
  const app = express();

  // Connect to MongoDB with graceful fallback
  connectDB().then((db) => {
    if (db) {
      console.log('✅ Database connected successfully');
    } else {
      console.log('ℹ️  Running in mock mode without database');
    }
  }).catch((error) => {
    console.error('❌ Database connection failed:', error);
    console.log('ℹ️  Running in mock mode without database');
  });

  // Middleware
  app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080'],
    credentials: true,
  }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Request logging middleware
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'OK', 
      message: 'Kanxa Safari API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Main application routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/services', serviceRoutes);
  app.use('/api/bookings', bookingRoutes);

  // Admin routes
  app.get('/api/admin/dashboard', async (req, res) => {
    try {
      // Simple dashboard data - can be expanded
      const dashboardData = {
        totalUsers: 0,
        totalServices: 0,
        totalBookings: 0,
        totalRevenue: 0,
        recentActivity: []
      };

      res.json({
        success: true,
        data: dashboardData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard data'
      });
    }
  });

  // Mock payment endpoints for testing
  app.post('/api/payments/khalti', async (req, res) => {
    try {
      const { amount, bookingId } = req.body;
      
      // Mock Khalti payment processing
      const mockResponse = {
        success: true,
        transactionId: `khalti_${Date.now()}`,
        amount,
        status: 'completed',
        gateway: 'khalti'
      };

      res.json(mockResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Payment processing failed'
      });
    }
  });

  app.post('/api/payments/esewa', async (req, res) => {
    try {
      const { amount, bookingId } = req.body;
      
      // Mock eSewa payment processing
      const mockResponse = {
        success: true,
        transactionId: `esewa_${Date.now()}`,
        amount,
        status: 'completed',
        gateway: 'esewa'
      };

      res.json(mockResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Payment processing failed'
      });
    }
  });

  // File upload endpoint (mock)
  app.post('/api/upload', async (req, res) => {
    try {
      // Mock file upload - in production, use actual file storage
      const mockFileUrl = `https://example.com/uploads/file_${Date.now()}.jpg`;
      
      res.json({
        success: true,
        url: mockFileUrl,
        filename: `file_${Date.now()}.jpg`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'File upload failed'
      });
    }
  });

  // Search endpoint
  app.get('/api/search', async (req, res) => {
    try {
      const { q, type } = req.query;
      
      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      // Mock search results - in production, implement proper search
      const mockResults = {
        services: [],
        users: [],
        bookings: []
      };

      res.json({
        success: true,
        query: q,
        results: mockResults
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Search failed'
      });
    }
  });

  // Notifications endpoint
  app.get('/api/notifications', async (req, res) => {
    try {
      // Mock notifications
      const notifications = [
        {
          id: 1,
          title: 'Booking Confirmed',
          message: 'Your bus booking has been confirmed',
          type: 'booking',
          isRead: false,
          createdAt: new Date()
        },
        {
          id: 2,
          title: 'Payment Received',
          message: 'Payment for your tour package has been received',
          type: 'payment',
          isRead: false,
          createdAt: new Date()
        }
      ];

      res.json({
        success: true,
        notifications
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch notifications'
      });
    }
  });

  // Error handling middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(err.errors).map((e: any) => e.message)
      });
    }
    
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Something went wrong!',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  });

  return app;
}
