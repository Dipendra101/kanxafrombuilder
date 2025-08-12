import "dotenv/config";
import express from "express";
import cors from "cors";
import crypto from "crypto";
import fetch from "node-fetch";
import { handleDemo } from "./routes/demo";
import authRoutes from "./routes/auth";

export function createServer() {
  const app = express();

  app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080'],
    credentials: true,
  }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // --- Existing API Routes ---
  app.use('/api/auth', authRoutes);
  app.get("/api/demo", handleDemo);
  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Kanxa Safari API is running' });
  });

  // --- Payment Routes (Based on MotoFix Logic) ---

  // 1. eSewa Payment Initiation
  app.post('/api/payment/esewa/initiate', (req, res) => {
    const { bookingId, amount } = req.body;
    const esewaScd = 'EPAYTEST';
    const esewaUrl = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
    
    const signatureBaseString = `total_amount=${amount},transaction_uuid=${bookingId},product_code=${esewaScd}`;
    
    const hmac = crypto.createHmac('sha256', '8gBm/:&EnhH.1/q');
    hmac.update(signatureBaseString);
    const signature = hmac.digest('base64');
    
    const formData = {
      amount: amount.toString(),
      failure_url: `${process.env.CLIENT_URL || 'http://localhost:8080'}/payment/failure`,
      product_delivery_charge: '0',
      product_service_charge: '0',
      product_code: esewaScd,
      signature: signature,
      signed_field_names: 'total_amount,transaction_uuid,product_code',
      success_url: `${process.env.CLIENT_URL || 'http://localhost:8080'}/payment/success`,
      tax_amount: '0',
      total_amount: amount.toString(),
      transaction_uuid: bookingId,
    };
    
    res.json({
      success: true,
      message: 'eSewa payment initiated.',
      formData: formData,
      esewaUrl: esewaUrl,
    });
  });

  // 2. Khalti Payment Verification
  app.post('/api/payment/khalti/verify', async (req, res) => {
    try {
      const { token, amount } = req.body;
      // Using the Khalti secret key you provided from your .env file
      const khaltiSecretKey = process.env.KHALTI_SECRET_KEY || 'test_secret_key_3f78fb6364ef4bd1b5fc670ce33a06f5';

      const response = await fetch("https://khalti.com/api/v2/payment/verify/", {
        method: "POST",
        headers: {
          'Authorization': `Key ${khaltiSecretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, amount }),
      });

      const data = await response.json();
      
      if (data.state === 'Completed') {
        // In a real app, you would now update your database record for the booking
        console.log(`Payment verified successfully via Khalti.`);
        res.json({ success: true, message: "Payment verified successfully!" });
      } else {
        console.error("Khalti verification failed:", data);
        res.status(400).json({ success: false, message: "Payment verification failed.", data });
      }
    } catch (error) {
      console.error("Error verifying Khalti payment:", error);
      res.status(500).json({ success: false, message: "Server error during payment verification." });
    }
  });


  // --- Existing Mock Services ---
  app.get('/api/services/buses', (req, res) => {
     res.json({ success: true, buses: [] });
  });
  app.get('/api/services/cargo', (req, res) => {
    res.json({ success: true, cargo: [] });
  });

  // --- Error Handling Middleware ---
  app.use((err: any, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
  });

  return app;
}