import "dotenv/config";
import express from "express";
import cors from "cors";
import crypto from "crypto";
import { handleDemo } from "./routes/demo";
import authRoutes from "./routes/auth";

export function createServer() {
  const app = express();

  app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Existing API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });
  app.get("/api/demo", handleDemo);
  app.use('/api/auth', authRoutes);
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'OK', 
      message: 'Kanxa Safari API is running',
      timestamp: new Date().toISOString() 
    });
  });

  // --- NEW PAYMENT ROUTES ---
  
  app.post('/api/payment/esewa/initiate', (req, res) => {
    const { bookingId, amount } = req.body;
    const esewaScd = 'EPAYTEST';
    const esewaUrl = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
    const esewaSecret = '8gBm/:&EnhH.1/q';

    const signatureBaseString = `total_amount=${amount},transaction_uuid=${bookingId},product_code=${esewaScd}`;
    
    const hmac = crypto.createHmac('sha256', esewaSecret);
    hmac.update(signatureBaseString);
    const signature = hmac.digest('base64');
    
    const formData = {
      amount: amount.toString(),
      failure_url: `${process.env.CLIENT_URL || 'http://localhost:8080'}/payment-failure`,
      product_delivery_charge: '0',
      product_service_charge: '0',
      product_code: esewaScd,
      signature: signature,
      signed_field_names: 'total_amount,transaction_uuid,product_code',
      success_url: `${process.env.CLIENT_URL || 'http://localhost:8080'}/payment-success`,
      tax_amount: '0',
      total_amount: amount.toString(),
      transaction_uuid: bookingId,
    };
    
    res.json({
      success: true,
      message: 'eSewa payment initiated.',
      formData,
      esewaUrl,
    });
  });

  app.post('/api/payment/khalti/initiate', (req, res) => {
    res.json({
      success: true,
      message: 'Khalti payment ready.',
    });
  });

  // Existing Mock services endpoints
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

  return app;
}