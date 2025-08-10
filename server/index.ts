import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { authRoutes } from "./routes/auth";
import { transportationRoutes } from "./routes/transportation";
import { constructionRoutes } from "./routes/construction";
import { userRoutes } from "./routes/user";
import { bookingRoutes } from "./routes/booking";
import { paymentRoutes } from "./routes/payment";
import { chatRoutes } from "./routes/chat";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping, status: "healthy", timestamp: new Date().toISOString() });
  });

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/transportation", transportationRoutes);
  app.use("/api/construction", constructionRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/booking", bookingRoutes);
  app.use("/api/payment", paymentRoutes);
  app.use("/api/chat", chatRoutes);
  app.get("/api/demo", handleDemo);

  // Error handling middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ 
      error: "Something went wrong!", 
      message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' 
    });
  });

  // 404 handler
  app.use("*", (req, res) => {
    res.status(404).json({ error: "API endpoint not found" });
  });

  return app;
}
