import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import authRoutes from "./routes/auth";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.use('/api/auth', authRoutes);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'OK', 
      message: 'Kanxa Safari API is running',
      timestamp: new Date().toISOString() 
    });
  });

  // Mock services endpoints for now
  app.get('/api/services/buses', (req, res) => {
    res.json({
      success: true,
      buses: [
        {
          id: 1,
          from: "Lamjung",
          to: "Kathmandu",
          schedule: [{
            departureTime: "06:00 AM",
            arrivalTime: "12:00 PM",
            duration: "6h 0m",
          }],
          busDetails: {
            busType: "Deluxe AC",
            totalSeats: 45,
            amenities: ["AC", "WiFi", "Charging Port"],
            operator: "Kanxa Express"
          },
          pricing: {
            basePrice: 800
          },
          rating: {
            average: 4.8
          }
        }
      ]
    });
  });

  app.get('/api/services/cargo', (req, res) => {
    res.json({
      success: true,
      cargo: []
    });
  });

  // Error handling middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Something went wrong!',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  });

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({ 
      success: false, 
      message: 'Route not found' 
    });
  });

  return app;
}
