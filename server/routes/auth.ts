import { Router, Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

const router = Router();

if (!process.env.JWT_SECRET) {
  throw new Error("FATAL ERROR: JWT_SECRET is not defined in the environment variables.");
}
const JWT_SECRET = process.env.JWT_SECRET;

// --- Helper Functions & Middleware ---

const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
};

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided or token is malformed' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
};


// --- Main Authentication Routes ---

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 */
const register: RequestHandler = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields correctly.' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email or phone number' });
    }

    // Hashing is handled by the .pre('save') middleware in User.js
    await User.create({ name, email, phone, password });
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please log in.',
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Registration failed due to a server error.' });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login a user
 */
const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed due to a server error.' });
  }
};

/**
 * @route   POST /api/auth/change-password
 * @desc    Change a logged-in user's password
 */
const changePassword: RequestHandler = async (req: AuthenticatedRequest, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 6) {
        return res.status(400).json({ message: "Please provide all required password fields correctly." });
    }
    
    const user = await User.findById(req.user?.id).select('+password');
    if (!user) return res.status(404).json({ message: "User not found." });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(401).json({ message: "Incorrect current password." });

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Password updated successfully." });
};

/**
 * @route   POST /api/auth/send-verification-email
 * @desc    Send a new verification code to the user's email
 */
const sendVerificationEmail: RequestHandler = async (req: AuthenticatedRequest, res) => {
    const user = await User.findById(req.user?.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (user.isEmailVerified) return res.status(400).json({ message: "Email is already verified." });

    const verificationCode = crypto.randomInt(100000, 999999).toString();
    user.emailVerificationCode = verificationCode;
    user.emailVerificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save({ validateBeforeSave: false });

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your Kanxa Safari Email Verification Code',
            html: `<h2>Email Verification</h2><p>Your verification code is: <strong>${verificationCode}</strong></p><p>This code will expire in 10 minutes.</p>`,
        });
        res.json({ success: true, message: `Verification code sent to ${user.email}` });
    } catch (error) {
        user.emailVerificationCode = undefined;
        user.emailVerificationExpires = undefined;
        await user.save({ validateBeforeSave: false });
        console.error("Email sending error:", error);
        res.status(500).json({ message: "Failed to send verification email." });
    }
};

/**
 * @route   POST /api/auth/verify-email-code
 * @desc    Verify the code sent to the user's email
 */
const verifyEmailCode: RequestHandler = async (req: AuthenticatedRequest, res) => {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: "Please provide a verification code." });

    const user = await User.findById(req.user?.id);
    if (!user || !user.emailVerificationCode || user.emailVerificationExpires < new Date()) {
        return res.status(400).json({ message: "Invalid or expired verification code. Please request a new one." });
    }

    if (user.emailVerificationCode !== code) {
        return res.status(400).json({ message: "Incorrect verification code." });
    }

    user.isEmailVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.json({ success: true, message: "Email verified successfully!" });
};


// --- Route Definitions ---
router.post('/register', register);
router.post('/login', login);
router.post('/change-password', verifyToken, changePassword);
router.post('/send-verification-email', verifyToken, sendVerificationEmail);
router.post('/verify-email-code', verifyToken, verifyEmailCode);

export default router;