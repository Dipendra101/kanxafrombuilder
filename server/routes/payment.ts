import { Router } from "express";
import { verifyToken } from "./auth";

const router = Router();

// Khalti Payment Configuration
const KHALTI_MERCHANT_ID = process.env.KHALTI_MERCHANT_ID || 'KP001';
const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY || 'test_secret_key';
const KHALTI_BASE_URL = process.env.KHALTI_BASE_URL || 'https://a.khalti.com/api/v2';

// Esewa Payment Configuration
const ESEWA_MERCHANT_ID = process.env.ESEWA_MERCHANT_ID || 'EPAYTEST';
const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY || 'test_secret_key';
const ESEWA_BASE_URL = process.env.ESEWA_BASE_URL || 'https://esewa.com.np/epay/main';

// Get payment methods (public endpoint)
router.get("/methods", (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 'khalti',
        name: 'Khalti',
        description: 'Pay with Khalti',
        icon: '💳',
        enabled: true
      },
      {
        id: 'esewa',
        name: 'eSewa',
        description: 'Pay with eSewa',
        icon: '📱',
        enabled: true
      },
      {
        id: 'cod',
        name: 'Cash on Delivery',
        description: 'Pay when you receive',
        icon: '💰',
        enabled: true
      }
    ]
  });
});

// Initialize Khalti Payment
router.post("/khalti/init", verifyToken, async (req, res) => {
  try {
    const { amount, orderId, customerName, customerEmail, customerPhone } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({
        success: false,
        error: "Amount and order ID are required"
      });
    }

    const khaltiPayload = {
      merchant_id: KHALTI_MERCHANT_ID,
      merchant_order_id: orderId,
      amount: amount,
      currency: 'NPR',
      customer_name: customerName || 'Customer',
      customer_email: customerEmail || 'customer@example.com',
      customer_phone: customerPhone || '9800000000',
      return_url: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/payment/success`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/payment/cancel`,
      notify_url: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/payment/khalti/verify`,
      signature: generateKhaltiSignature(orderId, amount)
    };

    res.json({
      success: true,
      data: {
        payment_url: `${KHALTI_BASE_URL}/payment/initiate`,
        payload: khaltiPayload
      }
    });
  } catch (error) {
    console.error('Khalti payment init error:', error);
    res.status(500).json({
      success: false,
      error: "Failed to initialize payment"
    });
  }
});

// Verify Khalti Payment
router.post("/khalti/verify", async (req, res) => {
  try {
    const { merchant_order_id, transaction_id, status, signature } = req.body;

    // Verify signature
    const expectedSignature = generateKhaltiSignature(merchant_order_id, req.body.amount);
    
    if (signature !== expectedSignature) {
      return res.status(400).json({
        success: false,
        error: "Invalid signature"
      });
    }

    // Update payment status in database
    // This would typically update your booking/payment record
    
    res.json({
      success: true,
      data: {
        order_id: merchant_order_id,
        transaction_id: transaction_id,
        status: status,
        payment_method: 'khalti'
      }
    });
  } catch (error) {
    console.error('Khalti payment verify error:', error);
    res.status(500).json({
      success: false,
      error: "Failed to verify payment"
    });
  }
});

// Initialize Esewa Payment
router.post("/esewa/init", verifyToken, async (req, res) => {
  try {
    const { amount, orderId, customerName, customerEmail, customerPhone } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({
        success: false,
        error: "Amount and order ID are required"
      });
    }

    const esewaPayload = {
      amt: amount,
      pdc: 0,
      psc: 0,
      txAmt: 0,
      tAmt: amount,
      pid: orderId,
      scd: ESEWA_MERCHANT_ID,
      su: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/payment/success`,
      fu: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/payment/cancel`
    };

    res.json({
      success: true,
      data: {
        payment_url: ESEWA_BASE_URL,
        payload: esewaPayload
      }
    });
  } catch (error) {
    console.error('Esewa payment init error:', error);
    res.status(500).json({
      success: false,
      error: "Failed to initialize payment"
    });
  }
});

// Verify Esewa Payment
router.post("/esewa/verify", async (req, res) => {
  try {
    const { oid, amt, refId } = req.body;

    // Verify with Esewa
    const verificationUrl = 'https://esewa.com.np/epay/transrec';
    const verificationData = {
      amt: amt,
      rid: refId,
      pid: oid,
      scd: ESEWA_MERCHANT_ID
    };

    // In production, you would make an HTTP request to verify
    // For demo purposes, we'll assume success
    const isSuccess = refId && amt;

    if (isSuccess) {
      res.json({
        success: true,
        data: {
          order_id: oid,
          transaction_id: refId,
          amount: amt,
          status: 'success',
          payment_method: 'esewa'
        }
      });
    } else {
      res.json({
        success: false,
        error: "Payment verification failed"
      });
    }
  } catch (error) {
    console.error('Esewa payment verify error:', error);
    res.status(500).json({
      success: false,
      error: "Failed to verify payment"
    });
  }
});

// Process Cash on Delivery
router.post("/cod/process", verifyToken, async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json({
        success: false,
        error: "Order ID and amount are required"
      });
    }

    // Update order status to COD
    // This would typically update your booking record

    res.json({
      success: true,
      data: {
        order_id: orderId,
        amount: amount,
        status: 'pending',
        payment_method: 'cod',
        message: 'Order placed successfully. Pay on delivery.'
      }
    });
  } catch (error) {
    console.error('COD payment error:', error);
    res.status(500).json({
      success: false,
      error: "Failed to process COD payment"
    });
  }
});

// Get payment history
router.get("/history", verifyToken, async (req, res) => {
  try {
    // This would typically fetch from your database
    const payments = [
      {
        id: '1',
        orderId: 'ORD001',
        amount: 1500,
        method: 'khalti',
        status: 'completed',
        date: new Date().toISOString()
      }
    ];

    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      error: "Failed to get payment history"
    });
  }
});

// Helper function to generate Khalti signature
function generateKhaltiSignature(orderId: string, amount: number): string {
  const data = `${KHALTI_MERCHANT_ID}${orderId}${amount}`;
  // In production, you would use crypto to generate proper signature
  return Buffer.from(data + KHALTI_SECRET_KEY).toString('base64');
}

export { router as paymentRoutes };
