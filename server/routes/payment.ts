import { Router } from "express";
import { z } from "zod";
import { verifyToken } from "./auth";

const router = Router();

// Validation schemas
const initiatePaymentSchema = z.object({
  amount: z.number().min(1, "Amount must be at least 1"),
  currency: z.enum(["NPR"]).default("NPR"),
  paymentMethod: z.enum(["khalti", "esewa", "cash", "credit"]),
  bookingId: z.string().optional(),
  orderId: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  customerInfo: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(10),
  }),
});

const verifyPaymentSchema = z.object({
  paymentId: z.string(),
  transactionId: z.string(),
  signature: z.string().optional(),
});

// Mock payment data (replace with database in production)
const payments = [
  {
    id: "1",
    userId: "1",
    bookingId: "1",
    amount: 1600,
    currency: "NPR",
    paymentMethod: "khalti",
    status: "completed",
    transactionId: "khalti_txn_123456",
    description: "Bus ticket booking - Lamjung to Kathmandu",
    customerInfo: {
      name: "Raj Kumar Sharma",
      email: "raj.sharma@email.com",
      phone: "+977-9841234567",
    },
    createdAt: "2024-03-20T10:30:00Z",
    completedAt: "2024-03-20T10:32:00Z",
  },
  {
    id: "2",
    userId: "1",
    orderId: "2",
    amount: 8500,
    currency: "NPR",
    paymentMethod: "esewa",
    status: "pending",
    transactionId: null,
    description: "Construction materials order",
    customerInfo: {
      name: "Raj Kumar Sharma",
      email: "raj.sharma@email.com",
      phone: "+977-9841234567",
    },
    createdAt: "2024-03-19T14:20:00Z",
    completedAt: null,
  },
];

// Initiate payment
router.post("/initiate", verifyToken, async (req, res) => {
  try {
    const validatedData = initiatePaymentSchema.parse(req.body);
    
    const payment = {
      id: Date.now().toString(),
      userId: req.user.userId,
      ...validatedData,
      status: "pending",
      transactionId: null,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };
    
    payments.push(payment);
    
    // Generate payment URL based on payment method
    let paymentUrl = "";
    let paymentData = {};
    
    switch (validatedData.paymentMethod) {
      case "khalti":
        paymentUrl = "https://khalti.com/pay";
        paymentData = {
          public_key: process.env.KHALTI_PUBLIC_KEY || "test_public_key",
          amount: validatedData.amount * 100, // Khalti expects amount in paisa
          product_identity: payment.id,
          product_name: validatedData.description,
          customer_info: validatedData.customerInfo,
        };
        break;
        
      case "esewa":
        paymentUrl = "https://esewa.com.np/epay/main";
        paymentData = {
          amt: validatedData.amount,
          pdc: 0,
          psc: 0,
          txAmt: 0,
          tAmt: validatedData.amount,
          pid: payment.id,
          scd: process.env.ESEWA_MERCHANT_CODE || "test_merchant",
          su: `${process.env.BASE_URL}/payment/success`,
          fu: `${process.env.BASE_URL}/payment/failure`,
        };
        break;
        
      case "cash":
        paymentUrl = `${process.env.BASE_URL}/payment/cash/${payment.id}`;
        break;
        
      case "credit":
        paymentUrl = `${process.env.BASE_URL}/payment/credit/${payment.id}`;
        break;
    }
    
    res.json({
      message: "Payment initiated successfully",
      payment,
      paymentUrl,
      paymentData,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation error", details: error.errors });
    }
    res.status(500).json({ error: "Failed to initiate payment" });
  }
});

// Verify payment (webhook/callback)
router.post("/verify", async (req, res) => {
  try {
    const validatedData = verifyPaymentSchema.parse(req.body);
    
    const payment = payments.find(p => p.id === validatedData.paymentId);
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }
    
    // In a real application, you would verify the payment with the payment gateway
    // For demo purposes, we'll just mark it as completed
    
    payment.status = "completed";
    payment.transactionId = validatedData.transactionId;
    payment.completedAt = new Date().toISOString();
    
    // Update related booking/order status
    if (payment.bookingId) {
      // Update booking status
      console.log(`Updating booking ${payment.bookingId} to confirmed`);
    }
    
    if (payment.orderId) {
      // Update order status
      console.log(`Updating order ${payment.orderId} to confirmed`);
    }
    
    res.json({
      message: "Payment verified successfully",
      payment,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation error", details: error.errors });
    }
    res.status(500).json({ error: "Failed to verify payment" });
  }
});

// Get payment by ID
router.get("/:id", verifyToken, (req, res) => {
  const payment = payments.find(p => p.id === req.params.id && p.userId === req.user.userId);
  
  if (!payment) {
    return res.status(404).json({ error: "Payment not found" });
  }
  
  res.json({ payment });
});

// Get user payment history
router.get("/history", verifyToken, (req, res) => {
  const userPayments = payments.filter(p => p.userId === req.user.userId);
  
  // Add filtering options
  const { status, paymentMethod, startDate, endDate } = req.query;
  let filteredPayments = userPayments;
  
  if (status) {
    filteredPayments = filteredPayments.filter(p => p.status === status);
  }
  
  if (paymentMethod) {
    filteredPayments = filteredPayments.filter(p => p.paymentMethod === paymentMethod);
  }
  
  if (startDate) {
    filteredPayments = filteredPayments.filter(p => p.createdAt >= startDate);
  }
  
  if (endDate) {
    filteredPayments = filteredPayments.filter(p => p.createdAt <= endDate);
  }
  
  // Sort by creation date (newest first)
  const sortedPayments = filteredPayments.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  res.json({ payments: sortedPayments });
});

// Get payment statistics
router.get("/stats/overview", verifyToken, (req, res) => {
  const userPayments = payments.filter(p => p.userId === req.user.userId);
  
  const stats = {
    total: userPayments.length,
    completed: userPayments.filter(p => p.status === "completed").length,
    pending: userPayments.filter(p => p.status === "pending").length,
    failed: userPayments.filter(p => p.status === "failed").length,
    totalAmount: userPayments.reduce((sum, p) => sum + p.amount, 0),
    completedAmount: userPayments
      .filter(p => p.status === "completed")
      .reduce((sum, p) => sum + p.amount, 0),
  };
  
  res.json({ stats });
});

// Refund payment
router.post("/:id/refund", verifyToken, async (req, res) => {
  const payment = payments.find(p => p.id === req.params.id && p.userId === req.user.userId);
  
  if (!payment) {
    return res.status(404).json({ error: "Payment not found" });
  }
  
  if (payment.status !== "completed") {
    return res.status(400).json({ error: "Only completed payments can be refunded" });
  }
  
  // In a real application, you would process the refund with the payment gateway
  payment.status = "refunded";
  payment.updatedAt = new Date().toISOString();
  
  res.json({
    message: "Refund processed successfully",
    payment,
  });
});

// Khalti webhook
router.post("/webhook/khalti", async (req, res) => {
  try {
    // Verify Khalti webhook signature
    // In a real application, you would verify the signature
    
    const { token, amount, product_identity } = req.body;
    
    const payment = payments.find(p => p.id === product_identity);
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }
    
    // Verify amount
    if (amount !== payment.amount * 100) {
      return res.status(400).json({ error: "Amount mismatch" });
    }
    
    payment.status = "completed";
    payment.transactionId = token;
    payment.completedAt = new Date().toISOString();
    
    res.json({ message: "Webhook processed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to process webhook" });
  }
});

// eSewa webhook
router.post("/webhook/esewa", async (req, res) => {
  try {
    // Verify eSewa webhook
    // In a real application, you would verify the webhook
    
    const { pid, amt, refId } = req.body;
    
    const payment = payments.find(p => p.id === pid);
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }
    
    // Verify amount
    if (parseFloat(amt) !== payment.amount) {
      return res.status(400).json({ error: "Amount mismatch" });
    }
    
    payment.status = "completed";
    payment.transactionId = refId;
    payment.completedAt = new Date().toISOString();
    
    res.json({ message: "Webhook processed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to process webhook" });
  }
});

export { router as paymentRoutes };
