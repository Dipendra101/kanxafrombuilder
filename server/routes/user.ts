import { Router } from "express";
import { z } from "zod";
import { verifyToken } from "./auth";

const router = Router();

// Validation schemas
const updateProfileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").optional(),
  lastName: z.string().min(2, "Last name must be at least 2 characters").optional(),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional(),
  address: z.string().min(10, "Address must be at least 10 characters").optional(),
  preferences: z.object({
    notifications: z.boolean().optional(),
    emailUpdates: z.boolean().optional(),
    smsUpdates: z.boolean().optional(),
  }).optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Mock user data (replace with database in production)
const users = [
  {
    id: "1",
    firstName: "Raj",
    lastName: "Kumar Sharma",
    email: "raj.sharma@email.com",
    phone: "+977-9841234567",
    address: "Lamjung, Nepal",
    role: "customer",
    status: "active",
    isVerified: true,
    preferences: {
      notifications: true,
      emailUpdates: true,
      smsUpdates: false,
    },
    createdAt: "2024-01-15",
    updatedAt: "2024-03-20",
  },
];

// Get user profile
router.get("/profile", verifyToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({ user });
});

// Update user profile
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const validatedData = updateProfileSchema.parse(req.body);
    
    const user = users.find(u => u.id === req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user data
    Object.assign(user, validatedData);
    user.updatedAt = new Date().toISOString();

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation error", details: error.errors });
    }
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// Change password
router.post("/change-password", verifyToken, async (req, res) => {
  try {
    const validatedData = changePasswordSchema.parse(req.body);
    
    const user = users.find(u => u.id === req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // In a real application, you would verify the current password
    // For demo purposes, we'll just accept any current password
    if (validatedData.currentPassword !== "current-password") {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // In a real application, you would hash the new password
    // For demo purposes, we'll just update it directly
    user.password = validatedData.newPassword;
    user.updatedAt = new Date().toISOString();

    res.json({
      message: "Password changed successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation error", details: error.errors });
    }
    res.status(500).json({ error: "Failed to change password" });
  }
});

// Get user preferences
router.get("/preferences", verifyToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({ preferences: user.preferences });
});

// Update user preferences
router.put("/preferences", verifyToken, async (req, res) => {
  try {
    const { preferences } = req.body;
    
    const user = users.find(u => u.id === req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.preferences = { ...user.preferences, ...preferences };
    user.updatedAt = new Date().toISOString();

    res.json({
      message: "Preferences updated successfully",
      preferences: user.preferences,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update preferences" });
  }
});

// Get user activity
router.get("/activity", verifyToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Mock activity data
  const activity = [
    {
      id: "1",
      type: "booking",
      description: "Booked bus ticket for Lamjung → Kathmandu",
      timestamp: "2024-03-20T10:30:00Z",
      status: "completed",
    },
    {
      id: "2",
      type: "order",
      description: "Placed construction order for cement and steel",
      timestamp: "2024-03-19T14:20:00Z",
      status: "pending",
    },
    {
      id: "3",
      type: "payment",
      description: "Payment of NPR 25,000 completed via Khalti",
      timestamp: "2024-03-18T09:15:00Z",
      status: "completed",
    },
  ];

  res.json({ activity });
});

// Delete user account
router.delete("/account", verifyToken, async (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // In a real application, you would mark the user as deleted
  // For demo purposes, we'll just remove them from the array
  const userIndex = users.findIndex(u => u.id === req.user.userId);
  if (userIndex > -1) {
    users.splice(userIndex, 1);
  }

  res.json({
    message: "Account deleted successfully",
  });
});

export { router as userRoutes };
