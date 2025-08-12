import "dotenv/config";
import express from "express";
import cors from "cors";
import crypto from "crypto";
import fetch from "node-fetch";
import authRoutes from "./routes/auth.js";
import connectDB from "./config/database.js";
import userRoutes from "./routes/user.js";


// Immediately connect to the database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:8080'], // Only allow requests from the Vite frontend
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Kanxa Safari API is running' });
});

// Payment Routes
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
    const data = await response.json();
    if ((data as any).state === 'Completed') {
      res.json({ success: true, message: "Payment verified successfully!" });
    } else {
      res.status(400).json({ success: false, message: "Payment verification failed." });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error during payment verification." });
  }
});

// Start listening for requests
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});