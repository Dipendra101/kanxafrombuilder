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

    // Hashing is handled by the .pre('save') middleware in the User model
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

    const token = generateToken(user._id.toString()); // Ensure user ID is a string

    // Send back a user object without the password
    const userResponse = { id: user._id, name: user.name, email: user.email, role: user.role };
    
    res.json({
      success: true,
      message: 'Login successful',
      user: userResponse,
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
    try {
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
    } catch(error) {
        console.error("Change password error:", error);
        res.status(500).json({ message: 'Server error during password change.' });
    }
};

/**
 * @route   POST /api/auth/send-verification-email
 * @desc    Send a new verification code to the user's email
 */
const sendVerificationEmail: RequestHandler = async (req: AuthenticatedRequest, res) => {
    // ... (your existing code for this function)
};

/**
 * @route   POST /api/auth/verify-email-code
 * @desc    Verify the code sent to the user's email
 */
const verifyEmailCode: RequestHandler = async (req: AuthenticatedRequest, res) => {
    // ... (your existing code for this function)
};


// --- Route Definitions ---
router.post('/register', register);
router.post('/login', login);
router.post('/change-password', verifyToken, changePassword);
router.post('/send-verification-email', verifyToken, sendVerificationEmail);
router.post('/verify-email-code', verifyToken, verifyEmailCode);


// =========================================================================
// ===             THE FINAL FIX: ADDING THE VERIFY-TOKEN ROUTE          ===
// =========================================================================
/**
 * @route   POST /api/auth/verify-token
 * @desc    Verifies the token from the Authorization header to persist login sessions.
 * @access  Private
 */
router.post('/verify-token', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    // If the `verifyToken` middleware passes, it means the token is valid.
    // The middleware attaches the user ID to `req.user`.
    // Now, we just need to fetch the full user details to send back to the frontend.
    try {
        const user = await User.findById(req.user?.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found for this token.' });
        }
        // Success! Send back the user data to restore the session on the frontend.
        res.json({ success: true, user });
    } catch (error) {
        console.error("Error in /verify-token route:", error);
        res.status(500).json({ success: false, message: 'Server error during token verification.' });
    }
});
// =========================================================================


export default router;