import { Router, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User, { IUser } from "../models/User";
import { withDB, isDBConnected } from "../config/database";

const router = Router();
const JWT_SECRET =
  process.env.JWT_SECRET || "kanxasafari_jwt_secret_key_super_secure_2024";

// Mock users for when database is unavailable
const mockUsers = [
  {
    _id: "mock_user_1",
    name: "Demo User",
    email: "user@demo.com",
    phone: "1234567890",
    password: "$2b$12$DEMO_HASH_PASSWORD",
    role: "user",
    isActive: true,
    toJSON: () => ({
      _id: "mock_user_1",
      name: "Demo User",
      email: "user@demo.com",
      phone: "1234567890",
      role: "user",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  },
  {
    _id: "mock_admin_1",
    name: "Demo Admin",
    email: "admin@demo.com",
    phone: "0987654321",
    password: "$2b$12$DEMO_HASH_PASSWORD",
    role: "admin",
    isActive: true,
    toJSON: () => ({
      _id: "mock_admin_1",
      name: "Demo Admin",
      email: "admin@demo.com",
      phone: "0987654321",
      role: "admin",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  },
];

// Utility functions
const generateToken = (user: IUser) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  );
};

const generateRefreshToken = (user: IUser) => {
  return jwt.sign({ userId: user._id, type: "refresh" }, JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
export const register: RequestHandler = async (req, res) => {
  try {
    const { name, email, phone, password, role = "user" } = req.body;

    // Comprehensive validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required fields: name, email, phone, password",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid 10-digit phone number",
      });
    }

    // Use safe database operation
    const result = await withDB(
      async () => {
        // Check if user already exists
        const existingUser = await User.findOne({
          $or: [{ email }, { phone }],
        });

        if (existingUser) {
          const field = existingUser.email === email ? "email" : "phone";
          throw new Error(`User already exists with this ${field}`);
        }

        // Create new user
        const user = new User({
          name: name.trim(),
          email: email.toLowerCase().trim(),
          phone: phone.trim(),
          password,
          role: role === "admin" ? "admin" : "user",
          verification: {
            emailToken: crypto.randomBytes(32).toString("hex"),
            phoneToken: Math.floor(100000 + Math.random() * 900000).toString(),
          },
          loginHistory: [
            {
              ip: req.ip,
              userAgent: req.get("User-Agent") || "Unknown",
              timestamp: new Date(),
            },
          ],
          lastLogin: new Date(),
        });

        await user.save();
        return user;
      },
      // Fallback: Create mock user for demo
      (() => {
        console.log("⚠️  Database unavailable, creating mock user response");
        const mockUser = {
          _id: `mock_${Date.now()}`,
          name: name.trim(),
          email: email.toLowerCase().trim(),
          phone: phone.trim(),
          role: role === "admin" ? "admin" : "user",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          toJSON: () => ({
            _id: `mock_${Date.now()}`,
            name: name.trim(),
            email: email.toLowerCase().trim(),
            phone: phone.trim(),
            role: role === "admin" ? "admin" : "user",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
        };
        return mockUser;
      })(),
    );

    // Generate tokens
    const accessToken = generateToken(result as any);
    const refreshToken = generateRefreshToken(result as any);

    // Remove sensitive information
    const userResponse = result.toJSON ? result.toJSON() : result;

    res.status(201).json({
      success: true,
      message:
        "User registered successfully" +
        (!isDBConnected() ? " (demo mode)" : ""),
      user: userResponse,
      token: accessToken, // Frontend expects 'token', not 'tokens'
      refreshToken,
    });
  } catch (error: any) {
    console.error("Registration error:", error);

    if (error.message.includes("User already exists")) {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Registration failed",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password, rememberMe = false } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Use safe database operation
    const user = await withDB(
      async () => {
        // Find user and include password for comparison
        const foundUser = await User.findOne({ email: email.toLowerCase() })
          .select("+password")
          .exec();
        return foundUser;
      },
      // Fallback: Check mock users
      (() => {
        console.log("⚠️  Database unavailable, checking mock users");
        const mockUser = mockUsers.find((u) => u.email === email.toLowerCase());

        // Simple demo authentication - accept any password for demo users
        if (mockUser && (password === "demo123" || email.includes("demo"))) {
          return mockUser;
        }
        return null;
      })(),
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Please contact support.",
      });
    }

    // Check password (skip for mock users)
    if (isDBConnected() && user.comparePassword) {
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }
    }

    // Update login history (only for real users)
    if (isDBConnected() && user.save) {
      user.loginHistory = user.loginHistory || [];
      user.loginHistory.push({
        ip: req.ip,
        userAgent: req.get("User-Agent") || "Unknown",
        timestamp: new Date(),
      } as any);

      // Keep only last 10 login records
      if (user.loginHistory.length > 10) {
        user.loginHistory = user.loginHistory.slice(-10);
      }

      user.lastLogin = new Date();
      user.lastActivity = new Date();
      await user.save();
    }

    // Generate tokens
    const accessTokenExpiry = rememberMe ? "30d" : "7d";
    const accessToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: accessTokenExpiry },
    );
    const refreshToken = generateRefreshToken(user as any);

    // Remove password from response
    const userResponse = user.toJSON ? user.toJSON() : user;

    console.log(`✅ Login successful for ${user.email}:`, {
      userId: user._id,
      role: user.role,
      demo: !isDBConnected(),
      tokenGenerated: !!accessToken
    });

    res.json({
      success: true,
      message: "Login successful" + (!isDBConnected() ? " (demo mode)" : ""),
      user: userResponse,
      token: accessToken, // Frontend expects 'token', not 'tokens'
      refreshToken,
      demo: !isDBConnected(),
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// @route   POST /api/auth/verify-token
// @desc    Verify JWT token
// @access  Public
export const verifyToken: RequestHandler = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Use safe database operation with fallback
    const user = await withDB(
      async () => {
        const foundUser = await User.findById(decoded.userId);
        return foundUser;
      },
      // Fallback: Check mock users
      (() => {
        console.log(
          "⚠️  Database unavailable, checking mock users for token verification",
        );
        const mockUser = mockUsers.find((u) => u._id === decoded.userId);
        return mockUser || null;
      })(),
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token - user not found",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account deactivated",
      });
    }

    // Update last activity (only for real users)
    if (isDBConnected() && user.save) {
      user.lastActivity = new Date();
      await user.save();
    }

    res.json({
      success: true,
      user: user.toJSON ? user.toJSON() : user,
      tokenValid: true,
    });
  } catch (error: any) {
    console.error("Token verification error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
        tokenExpired: true,
      });
    }

    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

// @route   POST /api/auth/refresh-token
// @desc    Refresh access token
// @access  Public
export const refreshToken: RequestHandler = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token required",
      });
    }

    const decoded = jwt.verify(refreshToken, JWT_SECRET) as any;

    if (decoded.type !== "refresh") {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // Generate new access token
    const newAccessToken = generateToken(user);

    res.json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error: any) {
    console.error("Refresh token error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
};

// @route   POST /api/auth/logout
// @desc    Logout user (invalidate tokens)
// @access  Private
export const logout: RequestHandler = async (req, res) => {
  try {
    // In a production app, you'd maintain a blacklist of invalidated tokens
    // For now, we'll just return success
    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error: any) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

// @route   POST /api/auth/forgot-password
// @desc    Request password reset
// @access  Public
export const forgotPassword: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't reveal if email exists for security
      return res.json({
        success: true,
        message:
          "If an account with that email exists, password reset instructions have been sent",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.verification.resetPasswordToken = resetToken;
    user.verification.resetPasswordExpires = new Date(
      Date.now() + 15 * 60 * 1000,
    ); // 15 minutes

    await user.save();

    // In a real app, send email here
    console.log(`Password reset token for ${email}: ${resetToken}`);

    res.json({
      success: true,
      message: "Password reset instructions sent to your email",
      // Include token in response for testing (remove in production)
      ...(process.env.NODE_ENV === "development" && { resetToken }),
    });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process password reset request",
    });
  }
};

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
export const resetPassword: RequestHandler = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const user = await User.findOne({
      "verification.resetPasswordToken": token,
      "verification.resetPasswordExpires": { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Update password
    user.password = newPassword;
    user.verification.resetPasswordToken = undefined;
    user.verification.resetPasswordExpires = undefined;

    await user.save();

    res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error: any) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reset password",
    });
  }
};

// @route   POST /api/auth/change-password
// @desc    Change password for authenticated user
// @access  Private
export const changePassword: RequestHandler = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = (req as any).user.userId;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);

    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error: any) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
  }
};

// Set up routes
router.post("/register", register);
router.post("/login", login);
router.post("/verify-token", verifyToken);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", changePassword);

export default router;
