import { Router, RequestHandler } from "express";
import User, { IUser } from "../models/User";
import { authenticate, adminOnly, authorize } from "../middleware/auth";
import { withDB, isDBConnected } from "../config/database";

const router = Router();

// Mock user data for when database is unavailable
const getMockUser = (userId: string) => ({
  _id: userId,
  name: "Demo User",
  email: "demo@example.com",
  phone: "+977-980-123456",
  role: "user",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  toJSON: function () {
    return {
      _id: this._id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      role: this.role,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  },
});

// @route   GET /api/users/profile
// @desc    Get current user's profile
// @access  Private
export const getProfile: RequestHandler = async (req, res) => {
  try {
    const user = await withDB(
      async () => {
        const foundUser = await User.findById(req.user.userId).populate({
          path: "loginHistory",
          options: { sort: { timestamp: -1 }, limit: 5 },
        });
        return foundUser;
      },
      // Fallback: Return mock user
      (() => {
        console.log("⚠️  Database unavailable, returning mock user profile");
        return getMockUser(req.user.userId);
      })(),
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: user.toJSON ? user.toJSON() : user,
      demo: !isDBConnected(),
    });
  } catch (error: any) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// @route   PUT /api/users/profile
// @desc    Update current user's profile
// @access  Private
export const updateProfile: RequestHandler = async (req, res) => {
  try {
    const userId = req.user.userId;
    const allowedUpdates = [
      "name",
      "phone",
      "address",
      "dateOfBirth",
      "gender",
      "preferences",
      "profile",
      "profilePicture",
    ];

    const updates: any = {};
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Validate phone if being updated
    if (
      updates.phone &&
      !/^\+977[0-9]{10}$/.test(updates.phone) &&
      !/^[0-9]{10}$/.test(updates.phone)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid phone number",
      });
    }

    // Format phone number if needed
    if (updates.phone && !updates.phone.startsWith("+977")) {
      updates.phone = `+977${updates.phone.replace(/^0+/, "")}`;
    }

    const user = await withDB(
      async () => {
        // Check if phone is already taken by another user
        if (updates.phone) {
          const existingUser = await User.findOne({
            phone: updates.phone,
            _id: { $ne: userId },
          });

          if (existingUser) {
            throw new Error("Phone number already exists");
          }
        }

        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { $set: updates },
          { new: true, runValidators: true },
        );

        if (!updatedUser) {
          throw new Error("User not found or update failed");
        }

        console.log(`✅ Profile updated successfully for user ${userId}`);
        return updatedUser;
      },
      // Fallback: Return updated mock user with proper structure
      (() => {
        console.log(
          "⚠️  Database unavailable, simulating profile update in demo mode",
        );
        const mockUser = {
          ...getMockUser(userId),
          ...updates,
          updatedAt: new Date(),
        };

        // Simulate successful update for demo
        console.log(
          `🔄 Demo mode: Profile update simulated for ${mockUser.name}`,
        );
        return mockUser;
      })(),
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Ensure user object exists
    if (!user) {
      return res.status(500).json({
        success: false,
        message: "Failed to update profile - user object is null",
      });
    }

    const responseUser = user.toJSON ? user.toJSON() : user;
    const isDemoMode = !isDBConnected();

    console.log(`📤 Sending profile update response:`, {
      success: true,
      demo: isDemoMode,
      userId: responseUser._id,
      updatedFields: Object.keys(updates),
    });

    res.json({
      success: true,
      message:
        "Profile updated successfully" + (isDemoMode ? " (demo mode)" : ""),
      user: responseUser,
      demo: isDemoMode,
      updatedFields: Object.keys(updates),
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Update profile error:", error);

    if (error.message === "Phone number already exists") {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        success: false,
        message: `${field} already exists`,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// @route   DELETE /api/users/profile
// @desc    Deactivate current user's account
// @access  Private
export const deactivateAccount: RequestHandler = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await withDB(
      async () => {
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          {
            isActive: false,
            lastActivity: new Date(),
          },
          { new: true },
        );

        if (!updatedUser) {
          throw new Error("User not found");
        }

        return updatedUser;
      },
      // Fallback for demo mode
      {
        _id: userId,
        isActive: false,
        lastActivity: new Date(),
      },
    );

    res.json({
      success: true,
      message:
        "Account deactivated successfully" +
        (!isDBConnected() ? " (demo mode)" : ""),
      demo: !isDBConnected(),
    });
  } catch (error: any) {
    console.error("Deactivate account error:", error);

    if (error.message === "User not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to deactivate account",
    });
  }
};

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
export const getAllUsers: RequestHandler = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      role = "",
      isActive = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const result = await withDB(
      async () => {
        const query: any = {};

        // Search by name or email
        if (search) {
          query.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ];
        }

        // Filter by role
        if (role) {
          query.role = role;
        }

        // Filter by active status
        if (isActive !== "") {
          query.isActive = isActive === "true";
        }

        const sort: any = {};
        sort[sortBy as string] = sortOrder === "asc" ? 1 : -1;

        const users = await User.find(query)
          .sort(sort)
          .limit(Number(limit))
          .skip((Number(page) - 1) * Number(limit))
          .select("-password -verification")
          .exec();

        const total = await User.countDocuments(query);

        return { users, total };
      },
      // Fallback mock data
      {
        users: [
          {
            _id: "mock_user_1",
            name: "Ram Kumar Sharma",
            email: "ram@example.com",
            phone: "+977-9841234567",
            role: "user",
            isActive: true,
            createdAt: new Date(),
            lastLogin: new Date(),
          },
          {
            _id: "mock_user_2",
            name: "Sita Devi Thapa",
            email: "sita@example.com",
            phone: "+977-9841234568",
            role: "user",
            isActive: true,
            createdAt: new Date(),
          },
          {
            _id: "mock_user_3",
            name: "Hari Bahadur Gurung",
            email: "hari@example.com",
            phone: "+977-9841234569",
            role: "admin",
            isActive: true,
            createdAt: new Date(),
          },
        ],
        total: 3,
      },
    );

    res.json({
      success: true,
      users: result.users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: result.total,
        pages: Math.ceil(result.total / Number(limit)),
      },
      demo: !isDBConnected(),
    });
  } catch (error: any) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// @route   GET /api/users/:id
// @desc    Get specific user by ID (Admin only)
// @access  Private/Admin
export const getUserById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await withDB(
      async () => {
        const foundUser = await User.findById(id)
          .populate({
            path: "loginHistory",
            options: { sort: { timestamp: -1 }, limit: 10 },
          })
          .select("-password");
        return foundUser;
      },
      // Fallback mock user
      {
        _id: id,
        name: "Mock User",
        email: "mock@example.com",
        phone: "+977-9841234567",
        role: "user",
        isActive: true,
        createdAt: new Date(),
        loginHistory: [],
      },
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: user.toJSON ? user.toJSON() : user,
      demo: !isDBConnected(),
    });
  } catch (error: any) {
    console.error("Get user by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};

// @route   PUT /api/users/:id
// @desc    Update user by ID (Admin only)
// @access  Private/Admin
export const updateUserById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const allowedUpdates = [
      "name",
      "email",
      "phone",
      "role",
      "isActive",
      "isEmailVerified",
      "isPhoneVerified",
      "address",
      "dateOfBirth",
      "gender",
      "preferences",
      "profile",
    ];

    const updates: any = {};
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Validate email and phone if being updated
    if (
      updates.email &&
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(updates.email)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    if (updates.phone && !/^[0-9]{10}$/.test(updates.phone)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid 10-digit phone number",
      });
    }

    const user = await withDB(
      async () => {
        // Check for duplicate email/phone
        if (updates.email || updates.phone) {
          const existingUser = await User.findOne({
            $or: [
              updates.email ? { email: updates.email, _id: { $ne: id } } : {},
              updates.phone ? { phone: updates.phone, _id: { $ne: id } } : {},
            ].filter((obj) => Object.keys(obj).length > 0),
          });

          if (existingUser) {
            const field =
              existingUser.email === updates.email ? "email" : "phone";
            throw new Error(`User already exists with this ${field}`);
          }
        }

        const updatedUser = await User.findByIdAndUpdate(
          id,
          { $set: updates },
          { new: true, runValidators: true },
        ).select("-password");

        if (!updatedUser) {
          throw new Error("User not found");
        }

        return updatedUser;
      },
      // Fallback mock user
      {
        _id: id,
        ...updates,
        updatedAt: new Date(),
      },
    );

    res.json({
      success: true,
      message:
        "User updated successfully" + (!isDBConnected() ? " (demo mode)" : ""),
      user: user.toJSON ? user.toJSON() : user,
      demo: !isDBConnected(),
    });
  } catch (error: any) {
    console.error("Update user by ID error:", error);

    if (error.message.includes("already exists")) {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        success: false,
        message: `${field} already exists`,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update user",
    });
  }
};

// @route   DELETE /api/users/:id
// @desc    Delete user by ID (Admin only)
// @access  Private/Admin
export const deleteUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (id === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete your own account",
      });
    }

    const user = await withDB(
      async () => {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
          throw new Error("User not found");
        }
        return deletedUser;
      },
      // Fallback for demo mode
      { deleted: true },
    );

    res.json({
      success: true,
      message:
        "User deleted successfully" + (!isDBConnected() ? " (demo mode)" : ""),
      demo: !isDBConnected(),
    });
  } catch (error: any) {
    console.error("Delete user error:", error);

    if (error.message === "User not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

// @route   GET /api/users/stats
// @desc    Get user statistics (Admin only)
// @access  Private/Admin
export const getUserStats: RequestHandler = async (req, res) => {
  try {
    const stats = await withDB(
      async () => {
        const result = await User.aggregate([
          {
            $facet: {
              totalUsers: [{ $count: "count" }],
              activeUsers: [
                { $match: { isActive: true } },
                { $count: "count" },
              ],
              usersByRole: [{ $group: { _id: "$role", count: { $sum: 1 } } }],
              recentUsers: [
                {
                  $match: {
                    createdAt: {
                      $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                    },
                  },
                },
                { $count: "count" },
              ],
              verifiedUsers: [
                { $match: { isEmailVerified: true } },
                { $count: "count" },
              ],
            },
          },
        ]);

        return {
          totalUsers: result[0].totalUsers[0]?.count || 0,
          activeUsers: result[0].activeUsers[0]?.count || 0,
          inactiveUsers:
            (result[0].totalUsers[0]?.count || 0) -
            (result[0].activeUsers[0]?.count || 0),
          recentUsers: result[0].recentUsers[0]?.count || 0,
          verifiedUsers: result[0].verifiedUsers[0]?.count || 0,
          usersByRole: result[0].usersByRole.reduce((acc: any, item: any) => {
            acc[item._id] = item.count;
            return acc;
          }, {}),
        };
      },
      // Fallback mock stats
      {
        totalUsers: 1247,
        activeUsers: 1156,
        inactiveUsers: 91,
        recentUsers: 45,
        verifiedUsers: 892,
        usersByRole: {
          user: 1200,
          admin: 47,
        },
      },
    );

    res.json({
      success: true,
      stats,
      demo: !isDBConnected(),
    });
  } catch (error: any) {
    console.error("Get user stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user statistics",
    });
  }
};

// Set up routes
router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);
router.delete("/profile", authenticate, deactivateAccount);

// Admin routes
router.get("/", authenticate, adminOnly, getAllUsers);
router.get("/stats", authenticate, adminOnly, getUserStats);
router.get("/:id", authenticate, adminOnly, getUserById);
router.put("/:id", authenticate, adminOnly, updateUserById);
router.delete("/:id", authenticate, adminOnly, deleteUser);

export default router;
