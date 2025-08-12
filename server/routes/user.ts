import { Router, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import User from "../models/User.js";

const router = Router();

// Define a custom request type to include the user ID
interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

// Middleware to verify token
const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ message: 'Token is required' });
  
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// GET /api/users/profile - Get current user's profile
router.get('/profile', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/users/profile - Update user's profile
router.put('/profile', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, phone, company, address, bio } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user?.id,
      { name, phone, company, address, bio },
      { new: true, runValidators: true }
    ).select('-password');
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error on update' });
  }
});

// POST /api/users/profile/picture - Upload profile picture
const upload = multer({ dest: 'uploads/' }); // Configure multer
router.post('/profile/picture', verifyToken, upload.single('profilePicture'), async (req: AuthenticatedRequest, res: Response) => {
    // In a real app, you would upload req.file.path to a cloud service (like Cloudinary, S3)
    // and save the URL to the user model.
    // For this example, we'll just simulate it.
    const mockImageUrl = `/uploads/${req.file?.filename}`; // This path is for local dev only
    await User.findByIdAndUpdate(req.user?.id, { profilePicture: mockImageUrl });
    res.json({ success: true, message: "Profile picture updated", imageUrl: mockImageUrl });
});


export default router;