import { Router, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import User from "../models/User.js";

const router = Router();

// --- TYPE DEFINITION ---
// Define a custom request type to include the user object from the token
interface AuthenticatedRequest extends Request {
  user?: { id: string };
}


// --- MIDDLEWARE ---
// Middleware to verify JWT token and attach user to the request
const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication Error: Token is required' });
  }
  
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    req.user = { id: decoded.id }; // Attach user ID to the request object
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Authentication Error: Invalid token' });
  }
};


// --- MULTER CONFIGURATION ---
// Configure Multer storage to keep original file extensions
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // The directory where files will be stored
  },
  filename: function (req, file, cb) {
    // Create a unique filename to prevent overwrites: fieldname-timestamp-random.extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


// =================================================================
// --- ROUTES ---
// =================================================================


// --- GET /api/users/profile ---
// Get current user's profile information
router.get('/profile', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  console.log("--- [GET /profile] Route hit ---");
  try {
    const user = await User.findById(req.user?.id).select('-password');
    if (!user) {
      console.log("--- [GET /profile] User not found for ID:", req.user?.id);
      return res.status(404).json({ message: 'User not found' });
    }
    console.log("--- [GET /profile] Successfully retrieved user profile ---");
    res.json({ success: true, user });
  } catch (error) {
    console.error("--- [GET /profile] CATCH BLOCK ERROR:", error);
    res.status(500).json({ message: 'Server error' });
  }
});


// --- PUT /api/users/profile ---
// Update user's text-based profile information
router.put('/profile', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  console.log("--- [PUT /profile] Route hit ---");
  try {
    const { name, phone, company, address, bio } = req.body;
    console.log("--- [PUT /profile] Updating with data:", req.body);
    const updatedUser = await User.findByIdAndUpdate(
      req.user?.id,
      { name, phone, company, address, bio },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      console.log("--- [PUT /profile] User not found for ID:", req.user?.id);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log("--- [PUT /profile] Profile updated successfully ---");
    res.json({ success: true, message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error("--- [PUT /profile] CATCH BLOCK ERROR:", error);
    res.status(500).json({ message: 'Server error on update' });
  }
});


// --- POST /api/users/profile/picture ---
// Upload a new profile picture
router.post('/profile/picture', verifyToken, upload.single('profilePicture'), async (req: AuthenticatedRequest, res: Response) => {
    
    // Log 1: Check if the route is being hit at all
    console.log("\n--- [POST /profile/picture] Entering Profile Picture Upload Route ---\n");

    try {
      // Log 2: Check if the user object from the token is present
      console.log("[LOG 2] User object from token:", req.user);

      // Log 3: Check if the file object from Multer is present
      console.log("[LOG 3] File object from Multer:", req.file);

      // --- VALIDATION ---
      if (!req.file) {
        console.error("[ERROR] Validation failed: No file was uploaded. Multer did not process a file.");
        return res.status(400).json({ success: false, message: "No file uploaded." });
      }

      const userId = req.user?.id;
      if (!userId) {
        console.error("[ERROR] Validation failed: User ID is missing from the verified token.");
        return res.status(400).json({ success: false, message: "User ID not found in token." });
      }
      // --- END VALIDATION ---

      const profilePicturePath = `/uploads/${req.file.filename}`;
      console.log("[LOG 4] Path to be saved to DB:", profilePicturePath);
      console.log("[LOG 5] Attempting to update user with ID:", userId);
      
      // --- DATABASE OPERATION ---
      // This is the most likely point of failure if the file saves but DB doesn't update.
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePicture: profilePicturePath },
        { new: true } // IMPORTANT: Returns the updated document, not the old one
      ).select('-password');
      // --- END DATABASE OPERATION ---

      // Log 6: See what the database returned after the update attempt
      console.log("[LOG 6] Result from findByIdAndUpdate:", updatedUser);

      if (!updatedUser) {
        // This means the ID was valid, but no user with that ID was found in the collection.
        console.error("[ERROR] Database update failed: User was not found for the given ID:", userId);
        return res.status(404).json({ message: 'User not found during update.' });
      }

      console.log("\n--- [POST /profile/picture] Update Successful! Sending response. ---\n");
      res.json({ 
        success: true, 
        message: "Profile picture updated successfully", 
        user: updatedUser 
      });

    } catch (error) {
      // Log 7: See if the whole thing crashed unexpectedly
      console.error("\n--- [POST /profile/picture] CATCH BLOCK ERROR ---");
      console.error(error);
      console.error("--- END CATCH BLOCK ---\n");
      res.status(500).json({ success: false, message: "A server error occurred during file upload." });
    }
});


export default router;