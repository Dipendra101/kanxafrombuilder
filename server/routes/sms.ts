import { Router, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import { withDB, isDBConnected } from "../config/database";
import { smsConfig, sendSMS, isValidSMSNumber } from "../config/sms";

const router = Router();
const JWT_SECRET =
  process.env.JWT_SECRET || "kanxasafari_jwt_secret_key_super_secure_2024";

// In-memory storage for SMS codes (in production, use Redis or database)
const smsCodeStore = new Map<
  string,
  { code: string; expires: number; attempts: number }
>();

// Generate a 6-digit SMS code
const generateSMSCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Utility function to validate phone number
const validatePhoneNumber = (phone: string): boolean => {
  // Remove all non-digits and check if it's a valid Nepali number
  const cleaned = phone.replace(/\D/g, "");
  return (
    cleaned.length === 13 &&
    cleaned.startsWith("977") &&
    cleaned.substring(3, 5) === "98"
  );
};

// Format phone number to international format
const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("977")) {
    return `+${cleaned}`;
  }
  if (cleaned.startsWith("98")) {
    return `+977${cleaned}`;
  }
  return `+977${cleaned}`;
};

// @route   POST /api/sms/send-code
// @desc    Send SMS verification code
// @access  Public
export const sendSMSCode: RequestHandler = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);

    if (!validatePhoneNumber(formattedPhone)) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide a valid Nepali phone number (starting with +977-98)",
      });
    }

    // Generate and store SMS code
    const code = generateSMSCode();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

    smsCodeStore.set(formattedPhone, {
      code,
      expires,
      attempts: 0,
    });

    // Send SMS using configured service
    const smsMessage = `Your Kanxa Safari verification code is: ${code}. This code will expire in 10 minutes.`;

    if (smsConfig.isConfigured) {
      const smsResult = await sendSMS(formattedPhone, smsMessage);

      if (smsResult.success) {
        console.log(
          `✅ SMS sent successfully to ${formattedPhone}. Message ID: ${smsResult.messageId}`,
        );
      } else {
        console.error(`❌ Failed to send SMS:`, smsResult.error);
        // Continue with fallback - log code for development
        console.log(`📱 Fallback - SMS Code for ${formattedPhone}: ${code}`);
      }
    } else {
      // Fallback simulation for development
      console.log(`📱 SMS Code for ${formattedPhone}: ${code}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    res.json({
      success: true,
      message: smsConfig.isConfigured
        ? "Verification code sent to your phone"
        : "Verification code sent successfully",
      // Include code in development mode for testing (only if SMS is not configured)
      ...(!smsConfig.isConfigured &&
        process.env.NODE_ENV === "development" && { code }),
    });
  } catch (error: any) {
    console.error("Send SMS code error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send verification code",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// @route   POST /api/sms/verify-code
// @desc    Verify SMS code and login/register user
// @access  Public
export const verifySMSCode: RequestHandler = async (req, res) => {
  try {
    const { phoneNumber, code } = req.body;

    if (!phoneNumber || !code) {
      return res.status(400).json({
        success: false,
        message: "Phone number and verification code are required",
      });
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);
    const storedData = smsCodeStore.get(formattedPhone);

    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: "No verification code found. Please request a new one.",
      });
    }

    // Check if code is expired
    if (Date.now() > storedData.expires) {
      smsCodeStore.delete(formattedPhone);
      return res.status(400).json({
        success: false,
        message: "Verification code has expired. Please request a new one.",
      });
    }

    // Check attempts
    if (storedData.attempts >= 3) {
      smsCodeStore.delete(formattedPhone);
      return res.status(400).json({
        success: false,
        message: "Too many failed attempts. Please request a new code.",
      });
    }

    // Verify code
    if (storedData.code !== code) {
      storedData.attempts++;
      return res.status(400).json({
        success: false,
        message: "Invalid verification code",
        attemptsRemaining: 3 - storedData.attempts,
      });
    }

    // Code is valid, remove from storage
    smsCodeStore.delete(formattedPhone);

    // Find or create user with this phone number
    const user = await withDB(
      async () => {
        let existingUser = await User.findOne({ phone: formattedPhone });

        if (!existingUser) {
          // Create new user with phone number
          existingUser = new User({
            name: "SMS User",
            email: "", // Email can be added later in profile
            phone: formattedPhone,
            role: "user",
            isPhoneVerified: true,
            verification: {
              phoneVerified: true,
              phoneVerifiedAt: new Date(),
            },
            loginHistory: [
              {
                ip: req.ip,
                userAgent: req.get("User-Agent") || "Unknown",
                timestamp: new Date(),
                method: "sms",
              },
            ],
            lastLogin: new Date(),
          });

          await existingUser.save();
        } else {
          // Update existing user login history
          existingUser.isPhoneVerified = true;
          existingUser.verification.phoneVerified = true;
          existingUser.verification.phoneVerifiedAt = new Date();
          existingUser.loginHistory = existingUser.loginHistory || [];
          existingUser.loginHistory.push({
            ip: req.ip,
            userAgent: req.get("User-Agent") || "Unknown",
            timestamp: new Date(),
            method: "sms",
          } as any);

          // Keep only last 10 login records
          if (existingUser.loginHistory.length > 10) {
            existingUser.loginHistory = existingUser.loginHistory.slice(-10);
          }

          existingUser.lastLogin = new Date();
          existingUser.lastActivity = new Date();
          await existingUser.save();
        }

        return existingUser;
      },
      // Fallback: Create mock user for demo
      (() => {
        console.log("⚠️  Database unavailable, creating mock SMS user");
        return {
          _id: `sms_${Date.now()}`,
          name: "SMS User",
          email: "",
          phone: formattedPhone,
          role: "user",
          isActive: true,
          isPhoneVerified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          toJSON: () => ({
            _id: `sms_${Date.now()}`,
            name: "SMS User",
            email: "",
            phone: formattedPhone,
            role: "user",
            isActive: true,
            isPhoneVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
        };
      })(),
    );

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        phone: user.phone,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    // Remove password from response
    const userResponse = user.toJSON ? user.toJSON() : user;

    res.json({
      success: true,
      message:
        "Phone number verified successfully" +
        (!isDBConnected() ? " (demo mode)" : ""),
      user: userResponse,
      token,
    });
  } catch (error: any) {
    console.error("Verify SMS code error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify code",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// @route   POST /api/sms/resend-code
// @desc    Resend SMS verification code
// @access  Public
export const resendSMSCode: RequestHandler = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);

    if (!validatePhoneNumber(formattedPhone)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid Nepali phone number",
      });
    }

    // Check if there's an existing code that's still valid (prevent spam)
    const existingData = smsCodeStore.get(formattedPhone);
    if (existingData && Date.now() < existingData.expires - 8 * 60 * 1000) {
      return res.status(429).json({
        success: false,
        message: "Please wait before requesting another code",
        retryAfter: Math.ceil(
          (existingData.expires - Date.now() - 8 * 60 * 1000) / 1000,
        ),
      });
    }

    // Generate and store new SMS code
    const code = generateSMSCode();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

    smsCodeStore.set(formattedPhone, {
      code,
      expires,
      attempts: 0,
    });

    // Send SMS using configured service
    const smsMessage = `Your Kanxa Safari verification code is: ${code}. This code will expire in 10 minutes.`;

    if (smsConfig.isConfigured) {
      const smsResult = await sendSMS(formattedPhone, smsMessage);

      if (smsResult.success) {
        console.log(
          `✅ SMS resent successfully to ${formattedPhone}. Message ID: ${smsResult.messageId}`,
        );
      } else {
        console.error(`❌ Failed to resend SMS:`, smsResult.error);
        // Continue with fallback - log code for development
        console.log(
          `📱 Fallback - Resent SMS Code for ${formattedPhone}: ${code}`,
        );
      }
    } else {
      // Fallback simulation for development
      console.log(`📱 Resent SMS Code for ${formattedPhone}: ${code}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    res.json({
      success: true,
      message: smsConfig.isConfigured
        ? "Verification code resent to your phone"
        : "Verification code resent successfully",
      // Include code in development mode for testing (only if SMS is not configured)
      ...(!smsConfig.isConfigured &&
        process.env.NODE_ENV === "development" && { code }),
    });
  } catch (error: any) {
    console.error("Resend SMS code error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to resend verification code",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// Set up routes
router.post("/send-code", sendSMSCode);
router.post("/verify-code", verifySMSCode);
router.post("/resend-code", resendSMSCode);

export default router;
