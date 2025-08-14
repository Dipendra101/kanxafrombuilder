import { Router, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User, { IUser } from "../models/User";
import { withDB, isDBConnected } from "../config/database";
import { authenticate } from "../middleware/auth";
import emailService from "../services/emailService";

const router = Router();
const JWT_SECRET =
  process.env.JWT_SECRET || "kanxasafari_jwt_secret_key_super_secure_2024";

// User Registration
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Database connection check
    if (!isDBConnected()) {
      return res.status(503).json({
        success: false,
        message: "Database service unavailable. Please try again later.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { phone }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email or phone already exists",
      });
    }

    // Create new user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      phone,
      password,
      role: "user",
      isActive: true,
      isEmailVerified: false,
    });

    await user.save();

    // Generate token
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" },
    );

    const refreshToken = jwt.sign(
      { userId: user._id, type: "refresh" },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    // User response without password
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: userResponse,
      token: accessToken,
      refreshToken,
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
});

// User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Database connection check
    if (!isDBConnected()) {
      return res.status(503).json({
        success: false,
        message: "Database service unavailable. Please try again later.",
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase(),
      isActive: true,
    }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" },
    );

    const refreshToken = jwt.sign(
      { userId: user._id, type: "refresh" },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // User response without password
    const userResponse = user.toJSON();
    delete userResponse.password;

    console.log(`✅ Login successful for ${email}:`, {
      userId: user._id,
      role: user.role,
      tokenGenerated: !!accessToken,
    });

    res.json({
      success: true,
      message: "Login successful",
      user: userResponse,
      token: accessToken,
      refreshToken,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
});

// Token Verification
router.post("/verify-token", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Database connection check
    if (!isDBConnected()) {
      return res.status(503).json({
        success: false,
        message: "Database service unavailable",
      });
    }

    // Find user
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User not found or inactive",
      });
    }

    // User response without password
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.json({
      success: true,
      user: userResponse,
      token,
    });
  } catch (error: any) {
    console.error("Token verification error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
});

// Extend Token (for remember me functionality)
router.post("/extend-token", authenticate, async (req, res) => {
  try {
    if (!isDBConnected()) {
      return res.status(503).json({
        success: false,
        message: "Database service unavailable",
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate new extended token (30 days for remember me)
    const extendedToken = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "30d" },
    );

    res.json({
      success: true,
      token: extendedToken,
      message: "Token extended successfully",
    });
  } catch (error: any) {
    console.error("Extend token error:", error);
    res.status(500).json({
      success: false,
      message: "Server error extending token",
    });
  }
});

// Forgot Password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!isDBConnected()) {
      return res.status(503).json({
        success: false,
        message: "Database service unavailable. Please try again later.",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
      isActive: true,
    });

    if (!user) {
      // Don't reveal if user exists for security
      return res.json({
        success: true,
        message:
          "If an account with this email exists, a reset link has been sent.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = resetTokenExpiry;
    await user.save();

    // Send email
    try {
      await emailService.sendPasswordResetEmail(
        user.email,
        user.name,
        resetToken,
      );
      console.log(`📧 Password reset email sent to ${user.email}`);
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError);
      return res.status(500).json({
        success: false,
        message: "Failed to send reset email. Please try again later.",
      });
    }

    res.json({
      success: true,
      message: "Password reset link has been sent to your email.",
    });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error processing request",
    });
  }
});

// Verify Reset Token
router.post("/verify-reset-token", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Reset token is required",
      });
    }

    if (!isDBConnected()) {
      return res.status(503).json({
        success: false,
        message: "Database service unavailable",
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: new Date() },
      isActive: true,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    res.json({
      success: true,
      message: "Reset token is valid",
    });
  } catch (error: any) {
    console.error("Verify reset token error:", error);
    res.status(500).json({
      success: false,
      message: "Server error verifying token",
    });
  }
});

// Reset Password
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    if (!isDBConnected()) {
      return res.status(503).json({
        success: false,
        message: "Database service unavailable",
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: new Date() },
      isActive: true,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error: any) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error resetting password",
    });
  }
});

// Logout (client-side token removal)
router.post("/logout", (req, res) => {
  res.json({
    success: true,
    message: "Logout successful",
  });
});

export default router;
