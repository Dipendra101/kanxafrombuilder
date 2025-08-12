import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { withDB, isDBConnected } from '../config/database';

const JWT_SECRET = process.env.JWT_SECRET || 'kanxasafari_jwt_secret_key_super_secure_2024';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Authentication middleware
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;

    const user = await withDB(
      async () => {
        const foundUser = await User.findById(decoded.userId);
        return foundUser;
      },
      // Fallback: Check mock users
      (() => {
        // Mock users for demo mode
        const mockUsers = [
          {
            _id: 'mock_user_1',
            email: 'user@demo.com',
            role: 'user',
            name: 'Demo User',
            isActive: true
          },
          {
            _id: 'mock_admin_1',
            email: 'admin@demo.com',
            role: 'admin',
            name: 'Demo Admin',
            isActive: true
          }
        ];
        return mockUsers.find(u => u._id === decoded.userId) || null;
      })()
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token - user not found'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account deactivated'
      });
    }

    // Update last activity (only for real users)
    if (isDBConnected() && user.save) {
      user.lastActivity = new Date();
      await user.save();
    }

    req.user = {
      userId: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      isActive: user.isActive,
      user: user // Full user object if needed
    };

    next();
  } catch (error: any) {
    console.error('Authentication error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
        tokenExpired: true
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

// Authorization middleware - check if user has required role
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Admin only middleware
export const adminOnly = authorize('admin');

// Admin or moderator middleware
export const adminOrModerator = authorize('admin', 'moderator');

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next(); // Continue without authentication
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await User.findById(decoded.userId);

    if (user && user.isActive) {
      req.user = {
        userId: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        isActive: user.isActive,
        user: user
      };
    }

    next();
  } catch (error) {
    // Ignore token errors in optional auth
    next();
  }
};

// Rate limiting middleware for auth routes
const authAttempts = new Map();

export const rateLimitAuth = (maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip + (req.body.email || '');
    const now = Date.now();
    
    if (!authAttempts.has(key)) {
      authAttempts.set(key, { attempts: 1, resetTime: now + windowMs });
      return next();
    }
    
    const record = authAttempts.get(key);
    
    if (now > record.resetTime) {
      // Reset the record
      authAttempts.set(key, { attempts: 1, resetTime: now + windowMs });
      return next();
    }
    
    if (record.attempts >= maxAttempts) {
      return res.status(429).json({
        success: false,
        message: `Too many authentication attempts. Please try again in ${Math.ceil((record.resetTime - now) / 1000 / 60)} minutes.`
      });
    }
    
    record.attempts++;
    next();
  };
};

// Middleware to validate user ownership of resource
export const validateOwnership = (resourceUserField: string = 'user') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resourceId = req.params.id;
      const currentUserId = req.user.userId;
      
      // Admin can access any resource
      if (req.user.role === 'admin') {
        return next();
      }
      
      // For specific models, add logic to check ownership
      // This is a generic implementation
      const resource = await req.app.locals.db.collection('resources').findOne({ _id: resourceId });
      
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
      }
      
      if (resource[resourceUserField].toString() !== currentUserId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied - insufficient permissions'
        });
      }
      
      next();
    } catch (error) {
      console.error('Ownership validation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to validate resource ownership'
      });
    }
  };
};

export default {
  authenticate,
  authorize,
  adminOnly,
  adminOrModerator,
  optionalAuth,
  rateLimitAuth,
  validateOwnership
};
