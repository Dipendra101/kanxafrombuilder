import express from "express";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import axios from "axios";
import { authenticate } from "../middleware/auth";

const router = express.Router();

// Environment variables for payment gateways
const KHALTI_SECRET_KEY =
  process.env.KHALTI_SECRET_KEY ||
  "test_secret_key_3f78fb6364ef4bd1b5fc670ce33a06f5";
const KHALTI_PUBLIC_KEY =
  process.env.KHALTI_PUBLIC_KEY ||
  "test_public_key_617c4c6fe77c441d88451ec1408a0c0e";

// eSewa Configuration
const ESEWA_URL = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
const ESEWA_SCD = 'EPAYTEST';
const ESEWA_SECRET = '8gBm/:&EnhH.1/q';
const BASE_URL = process.env.BASE_URL || "http://localhost:8080";

const SUCCESS_ICON_URL = 'https://cdn.vectorstock.com/i/500p/20/36/3d-green-check-icon-tick-mark-symbol-vector-56142036.jpg';

// Award loyalty points function
const awardLoyaltyPoints = async (userId: string) => {
  try {
    // In a real app, you'd update user's loyalty points in database
    const pointsToAdd = Math.floor(Math.random() * 11) + 10;
    console.log(`Awarding ${pointsToAdd} loyalty points to user ${userId}`);
    return pointsToAdd;
  } catch (error) {
    console.error('Error awarding loyalty points:', error);
    return 0;
  }
};

// eSewa Payment Initiation
router.post('/esewa/initiate', authenticate, async (req, res) => {
  try {
    const { amount, service, serviceId, bookingId } = req.body;

    if (!amount || !service) {
      return res.status(400).json({
        success: false,
        message: 'Amount and service are required'
      });
    }

    const transactionId = bookingId || `${serviceId}-${Date.now()}`;
    const amountToPay = amount.toString();

    // Create eSewa signature
    const signedFieldNames = 'total_amount,transaction_uuid,product_code';
    const signatureBaseString = `total_amount=${amountToPay},transaction_uuid=${transactionId},product_code=${ESEWA_SCD}`;

    const hmac = crypto.createHmac('sha256', ESEWA_SECRET);
    hmac.update(signatureBaseString);
    const signature = hmac.digest('base64');

    const esewaData = {
      amount: amountToPay,
      success_url: `${BASE_URL}/payment/esewa/success`,
      failure_url: `${BASE_URL}/payment/esewa/failure`,
      product_delivery_charge: '0',
      product_service_charge: '0',
      product_code: ESEWA_SCD,
      signature,
      signed_field_names: signedFieldNames,
      tax_amount: '0',
      total_amount: amountToPay,
      transaction_uuid: transactionId,
    };

    // Store payment info for verification (in real app, use database)
    console.log(`📱 eSewa payment initiated: ${transactionId} - Rs.${amountToPay}`);

    res.json({
      success: true,
      ...esewaData,
      ESEWA_URL
    });

  } catch (error: any) {
    console.error('Error in eSewa initiation:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error while initiating eSewa payment'
    });
  }
});

// eSewa Payment Verification
router.post('/esewa/verify', async (req, res) => {
  try {
    const { data } = req.query;

    if (!data) {
      return res.status(400).json({
        success: false,
        message: 'No data provided for verification'
      });
    }

    const decodedData = JSON.parse(Buffer.from(data as string, 'base64').toString('utf-8'));

    if (decodedData.status !== 'COMPLETE') {
      return res.status(400).json({
        success: false,
        message: `Payment not complete. Status: ${decodedData.status}`
      });
    }

    // Verify with eSewa server
    const verificationUrl = `https://rc-epay.esewa.com.np/api/epay/transaction/status/?product_code=${decodedData.product_code}&total_amount=${decodedData.total_amount}&transaction_uuid=${decodedData.transaction_uuid}`;

    const response = await axios.get(verificationUrl);
    const verificationResponse = response.data;

    if (verificationResponse.status === 'COMPLETE') {
      // Award loyalty points
      const points = await awardLoyaltyPoints('user_id'); // In real app, get from auth

      console.log(`✅ eSewa payment verified: ${decodedData.transaction_uuid}`);

      res.status(200).json({
        success: true,
        message: `Payment successful! You earned ${points} loyalty points.`,
        points: points
      });

    } else {
      res.status(400).json({
        success: false,
        message: 'eSewa payment verification failed'
      });
    }

  } catch (error: any) {
    console.error('Error in eSewa verification:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during eSewa verification.'
    });
  }
});

// Khalti Payment Verification
router.post('/khalti/verify', authenticate, async (req, res) => {
  try {
    const { token, amount, service, serviceId, bookingId } = req.body;

    if (!token || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification details.'
      });
    }

    // Verify payment with Khalti
    const khaltiResponse = await axios.post(
      'https://khalti.com/api/v2/payment/verify/',
      { token, amount },
      {
        headers: {
          'Authorization': `Key ${KHALTI_SECRET_KEY}`
        }
      }
    );

    if (khaltiResponse.data && khaltiResponse.data.idx) {
      // Award loyalty points
      const points = await awardLoyaltyPoints(req.user.userId);

      console.log(`✅ Khalti payment verified: ${khaltiResponse.data.idx}`);

      res.status(200).json({
        success: true,
        message: `Payment successful! You've earned ${points} loyalty points.`,
        points: points,
        transactionId: khaltiResponse.data.idx
      });

    } else {
      return res.status(400).json({
        success: false,
        message: 'Khalti payment verification failed.'
      });
    }

  } catch (error: any) {
    console.error('Khalti verification error:', error.response ? error.response.data : error.message);
    res.status(500).json({
      success: false,
      message: 'Server error during Khalti verification.'
    });
  }
});

// Legacy initiate endpoint for backward compatibility
router.post("/initiate", async (req, res) => {
  try {
    const { amount, productName, transactionId, method, customerInfo } =
      req.body;

    if (!amount || !productName || !transactionId || !method) {
      return res.status(400).json({
        success: false,
        error:
          "Missing required fields: amount, productName, transactionId, method",
      });
    }

    console.log(`Legacy initiate ${method} payment:`, {
      amount,
      productName,
      transactionId,
    });

    switch (method) {
      case "esewa": {
        const transactionUuid = transactionId;
        const esewaConfig = {
          amount: parseFloat(amount).toString(),
          tax_amount: "0",
          total_amount: parseFloat(amount).toString(),
          transaction_uuid: transactionUuid,
          product_code: ESEWA_MERCHANT_CODE,
          product_service_charge: "0",
          product_delivery_charge: "0",
          success_url: `${BASE_URL}/payment-success?method=esewa&transaction_uuid=${transactionUuid}`,
          failure_url: `${BASE_URL}/payment-failure?method=esewa`,
          signed_field_names: "total_amount,transaction_uuid,product_code",
        };

        const signatureString = `total_amount=${esewaConfig.total_amount},transaction_uuid=${esewaConfig.transaction_uuid},product_code=${esewaConfig.product_code}`;
        const signature = generateEsewaSignature(
          ESEWA_SECRET_KEY,
          signatureString,
        );

        console.log("eSewa payment config:", esewaConfig);

        return res.json({
          success: true,
          method: "esewa",
          paymentUrl: "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
          config: {
            ...esewaConfig,
            signature,
            product_service_charge: Number(esewaConfig.product_service_charge),
            product_delivery_charge: Number(
              esewaConfig.product_delivery_charge,
            ),
            tax_amount: Number(esewaConfig.tax_amount),
            total_amount: Number(esewaConfig.total_amount),
          },
        });
      }

      case "khalti": {
        const khaltiConfig = {
          return_url: `${BASE_URL}/payment-success?method=khalti`,
          website_url: BASE_URL,
          amount: Math.round(parseFloat(amount) * 100), // Khalti expects amount in paisa
          purchase_order_id: transactionId,
          purchase_order_name: productName,
          customer_info: {
            name: customerInfo?.name || "Customer Name",
            email: customerInfo?.email || "customer@example.com",
            phone: customerInfo?.phone || "9800000000",
          },
        };

        console.log("Khalti payment config:", khaltiConfig);

        const response = await fetch(
          "https://a.khalti.com/api/v2/epayment/initiate/",
          {
            method: "POST",
            headers: {
              Authorization: `Key ${KHALTI_SECRET_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(khaltiConfig),
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Khalti payment initiation failed:", errorData);
          throw new Error(
            `Khalti payment initiation failed: ${JSON.stringify(errorData)}`,
          );
        }

        const khaltiResponse = await response.json();
        console.log("Khalti response:", khaltiResponse);

        return res.json({
          success: true,
          method: "khalti",
          paymentUrl: khaltiResponse.payment_url,
          pidx: khaltiResponse.pidx,
        });
      }

      default:
        return res.status(400).json({
          success: false,
          error: "Invalid payment method. Supported methods: khalti, esewa",
        });
    }
  } catch (error: any) {
    console.error("Payment initiation error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Payment initiation failed",
    });
  }
});

// Verify Khalti payment
router.post("/verify/khalti", async (req, res) => {
  try {
    const { pidx, transaction_id, amount } = req.body;

    if (!pidx) {
      return res.status(400).json({
        success: false,
        error: "Missing pidx parameter",
      });
    }

    const response = await fetch(
      "https://a.khalti.com/api/v2/epayment/lookup/",
      {
        method: "POST",
        headers: {
          Authorization: `Key ${KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pidx }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Khalti verification failed:", errorData);
      throw new Error(
        `Khalti verification failed: ${JSON.stringify(errorData)}`,
      );
    }

    const verificationResult = await response.json();
    console.log("Khalti verification result:", verificationResult);

    if (verificationResult.status === "Completed") {
      return res.json({
        success: true,
        verified: true,
        transaction_id: verificationResult.transaction_id,
        amount: verificationResult.total_amount / 100, // Convert back to rupees
        status: verificationResult.status,
      });
    } else {
      return res.json({
        success: false,
        verified: false,
        status: verificationResult.status,
        message: "Payment not completed",
      });
    }
  } catch (error: any) {
    console.error("Khalti verification error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Payment verification failed",
    });
  }
});

// Verify eSewa payment
router.post("/verify/esewa", async (req, res) => {
  try {
    const { oid, amt, refId } = req.body;

    if (!oid || !amt || !refId) {
      return res.status(400).json({
        success: false,
        error: "Missing required parameters: oid, amt, refId",
      });
    }

    // For eSewa, we verify by calling their verification API
    const verificationUrl = `https://uat.esewa.com.np/epay/transrec`;
    const verificationData = {
      amt: amt,
      rid: refId,
      pid: oid,
      scd: ESEWA_MERCHANT_CODE,
    };

    const params = new URLSearchParams(verificationData);
    const response = await fetch(verificationUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    const responseText = await response.text();
    console.log("eSewa verification response:", responseText);

    if (responseText.includes("Success")) {
      return res.json({
        success: true,
        verified: true,
        transaction_id: oid,
        amount: parseFloat(amt),
        reference_id: refId,
      });
    } else {
      return res.json({
        success: false,
        verified: false,
        message: "Payment verification failed",
      });
    }
  } catch (error: any) {
    console.error("eSewa verification error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Payment verification failed",
    });
  }
});

export default router;
