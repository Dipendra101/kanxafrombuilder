import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import User from "../models/User";

const router = Router();

// Validation schemas
const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  address: z.string().optional(),
  company: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Register new user
router.post("/register", async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        error: "User with this email already exists" 
      });
    }

    // Create user
    const newUser = await User.create({
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      phone: validatedData.phone,
      password: validatedData.password,
      address: validatedData.address,
      company: validatedData.company,
      role: validatedData.email === 'admin@gmail.com' ? 'admin' : 'customer',
      isVerified: validatedData.email === 'admin@gmail.com' ? true : false,
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: newUser._id, 
        email: newUser.email,
        role: newUser.role 
      },
      process.env.JWT_SECRET || "kanxa-safari-secret",
      { expiresIn: "7d" }
    );

    // Remove password from response
    const userResponse = {
      id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      phone: newUser.phone,
      address: newUser.address,
      company: newUser.company,
      role: newUser.role,
      isVerified: newUser.isVerified,
      createdAt: newUser.createdAt,
    };

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: userResponse,
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false,
        error: "Validation error", 
        details: error.errors 
      });
    }
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      error: "Registration failed" 
    });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    
    // Find user by email
    const user = await User.findOne({ email: validatedData.email });
    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: "Invalid email or password" 
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(validatedData.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        error: "Invalid email or password" 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET || "kanxa-safari-secret",
      { expiresIn: "7d" }
    );

    // Remove password from response
    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      company: user.company,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    };

    res.json({
      success: true,
      message: "Login successful",
      data: userResponse,
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false,
        error: "Validation error", 
        details: error.errors 
      });
    }
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      error: "Login failed" 
    });
  }
});

// Forgot password
router.post("/forgot-password", async (req, res) => {
  try {
    const validatedData = forgotPasswordSchema.parse(req.body);
    
    const user = await User.findOne({ email: validatedData.email });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: "User not found" 
      });
    }

    // Generate reset token (in production, send email)
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "kanxa-safari-secret",
      { expiresIn: "1h" }
    );

    // Update user with reset token
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    res.json({
      success: true,
      message: "Password reset instructions sent to your email",
      resetToken, // In production, don't send this in response
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false,
        error: "Validation error", 
        details: error.errors 
      });
    }
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      success: false,
      error: "Failed to process request" 
    });
  }
});

// Reset password
router.post("/reset-password", async (req, res) => {
  try {
    const validatedData = resetPasswordSchema.parse(req.body);
    
    // Verify token
    const decoded = jwt.verify(
      validatedData.token,
      process.env.JWT_SECRET || "kanxa-safari-secret"
    ) as { userId: string };

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: "User not found" 
      });
    }

    if (user.resetPasswordToken !== validatedData.token) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid reset token" 
      });
    }

    if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
      return res.status(400).json({ 
        success: false,
        error: "Reset token has expired" 
      });
    }

    // Update password
    user.password = validatedData.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false,
        error: "Validation error", 
        details: error.errors 
      });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid reset token" 
      });
    }
    console.error('Reset password error:', error);
    res.status(500).json({ 
      success: false,
      error: "Failed to reset password" 
    });
  }
});

// Get current user
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: "User not found" 
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false,
      error: "Failed to get user data" 
    });
  }
});

// Update user profile
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { firstName, lastName, phone, address, company } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: "User not found" 
      });
    }

    // Update fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (company !== undefined) user.company = company;

    await user.save();

    // Remove password from response
    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      company: user.company,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: userResponse,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false,
      error: "Failed to update profile" 
    });
  }
});

// Change password
router.put("/change-password", verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ 
        success: false,
        error: "New passwords don't match" 
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: "User not found" 
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ 
        success: false,
        error: "Current password is incorrect" 
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      success: false,
      error: "Failed to change password" 
    });
  }
});

// Verify token middleware
export const verifyToken = (req: any, res: any, next: any) => {
  const token = req.header('Authorization')?.replace('Bearer ', '') || 
                req.cookies?.token || 
                req.query?.token;

  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: "Access denied. No token provided." 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "kanxa-safari-secret") as any;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false,
      error: "Invalid token." 
    });
  }
};

export { router as authRoutes };
