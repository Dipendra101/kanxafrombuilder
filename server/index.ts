import "dotenv/config";
import express from "express";
import cors from "cors";
import crypto from "crypto";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

// Import your database connection and routes
import connectDB from "./config/database.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";

// This is the new, exportable function that your build process needs.
export function createServer() {
  const app = express();

  // Immediately connect to the database when the server is created.
  connectDB();

  // --- Middleware Setup ---
  app.use(cors({
    // It's good practice to include the default Vite dev port (5173) as well.
    origin: ['http://localhost:8080', 'http://localhost:5173'],
    credentials: true,
  }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Helper to get the correct directory path in ES Modules
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Statically serve the 'uploads' folder for profile pictures
  // Using path.resolve is more robust than path.join here.
  app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

  // --- API Routes ---
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);

  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Kanxa Safari API is running' });
  });

  // --- Payment Routes (Kept from your original file) ---
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
        failure_url: `http://localhost:8080/payment/failure`,
        product_delivery_charge: '0',
        product_service_charge: '0',
        product_code: esewaScd,
        signature: signature,
        signed_field_names: 'total_amount,transaction_uuid,product_code',
        success_url: `http://localhost:8080/payment/success`,
        tax_amount: '0',
        total_amount: amount.toString(),
        transaction_uuid: bookingId,
      };
      res.json({ success: true, formData, esewaUrl });
  });

  app.post('/api/payment/khalti/verify', async (req, res) => {
    try {
      const { token, amount } = req.body;
      const khaltiSecretKey = process.env.KHALTI_SECRET_KEY as string;
      const response = await fetch("https://khalti.com/api/v2/payment/verify/", {
        method: "POST",
        headers: { 'Authorization': `Key ${khaltiSecretKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, amount }),
      });
      const data = await response.json() as any;
      if (data.state === 'Completed') {
        res.json({ success: true, message: "Payment verified successfully!" });
      } else {
        res.status(400).json({ success: false, message: "Payment verification failed." });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error during payment verification." });
    }
  });

  // This function does NOT start the server. It only creates and returns the app object.
  return { app };
}


// --- Development-only server start ---
// This block checks if we are NOT in a production environment.
// It allows your `npm run dev` (using `tsx watch`) to work as it did before.
if (process.env.NODE_ENV !== 'production') {
  const { app } = createServer();
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`🚀 Development server is running on http://localhost:${PORT}`);
  });
}