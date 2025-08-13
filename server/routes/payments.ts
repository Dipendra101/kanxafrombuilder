import express from "express";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

const router = express.Router();

// Environment variables for payment gateways
const KHALTI_SECRET_KEY =
  process.env.KHALTI_SECRET_KEY ||
  "test_secret_key_3f78fb6364ef4bd1b5fc670ce33a06f5";
const KHALTI_PUBLIC_KEY =
  process.env.KHALTI_PUBLIC_KEY ||
  "test_public_key_617c4c6fe77c441d88451ec1408a0c0e";
const ESEWA_MERCHANT_CODE = process.env.ESEWA_MERCHANT_CODE || "EPAYTEST";
const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q";
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

// Helper function to generate eSewa signature
function generateEsewaSignature(secretKey: string, message: string): string {
  const hash = crypto
    .createHmac("sha256", secretKey)
    .update(message)
    .digest("base64");
  return hash;
}

// Initiate payment endpoint
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

    console.log(`Initiating ${method} payment:`, {
      amount,
      productName,
      transactionId,
    });

    switch (method) {
      case "esewa": {
        const transactionUuid = `${Date.now()}-${uuidv4()}`;
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
