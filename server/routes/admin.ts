import { Router, RequestHandler } from "express";
import { withDB, isDBConnected } from "../config/database";
import { authenticate, adminOnly } from "../middleware/auth";
import User from "../models/User";
import Service from "../models/Service";
import Booking from "../models/Booking";

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(adminOnly);

// @route   GET /api/admin/dashboard
// @desc    Get dashboard overview data
// @access  Private/Admin
export const getDashboard: RequestHandler = async (req, res) => {
  try {
    const dashboardData = await withDB(
      async () => {
        // Get real stats from database
        const [userCount, serviceCount, bookingCount] = await Promise.all([
          User.countDocuments({ isActive: true }),
          Service.countDocuments({ isActive: true }),
          Booking.countDocuments({}),
        ]);

        // Calculate revenue (sum of all confirmed bookings)
        const revenueResult = await Booking.aggregate([
          { $match: { paymentStatus: "completed" } },
          { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
        ]);
        const totalRevenue = revenueResult[0]?.totalRevenue || 0;

        // Monthly stats
        const monthStart = new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);

        const [monthlyUsers, monthlyBookings] = await Promise.all([
          User.countDocuments({
            createdAt: { $gte: monthStart },
            isActive: true,
          }),
          Booking.countDocuments({
            createdAt: { $gte: monthStart },
          }),
        ]);

        const monthlyRevenueResult = await Booking.aggregate([
          {
            $match: {
              paymentStatus: "completed",
              createdAt: { $gte: monthStart },
            },
          },
          { $group: { _id: null, monthlyRevenue: { $sum: "$totalAmount" } } },
        ]);
        const monthlyRevenue = monthlyRevenueResult[0]?.monthlyRevenue || 0;

        // Get service type breakdown
        const servicesByType = await Service.aggregate([
          { $match: { isActive: true } },
          { $group: { _id: "$type", count: { $sum: 1 } } },
        ]);

        const serviceTypeCounts = {
          bus: 0,
          cargo: 0,
          construction: 0,
          tour: 0,
          garage: 0,
        };

        servicesByType.forEach((item) => {
          if (serviceTypeCounts.hasOwnProperty(item._id)) {
            serviceTypeCounts[item._id as keyof typeof serviceTypeCounts] =
              item.count;
          }
        });

        return {
          totalUsers: userCount,
          totalServices: serviceCount,
          totalBookings: bookingCount,
          totalRevenue,
          recentUsers: monthlyUsers,
          activeServices: serviceCount,
          pendingBookings: await Booking.countDocuments({ status: "pending" }),
          monthlyRevenue,
          servicesByType: serviceTypeCounts,
        };
      },
      // Fallback mock data
      {
        totalUsers: 1247,
        totalServices: 56,
        totalBookings: 2843,
        totalRevenue: 1250000,
        recentUsers: 23,
        activeServices: 48,
        pendingBookings: 15,
        monthlyRevenue: 186000,
        servicesByType: {
          bus: 15,
          cargo: 12,
          construction: 8,
          tour: 6,
          garage: 7,
        },
      },
    );

    res.json({
      success: true,
      data: dashboardData,
    });
  } catch (error: any) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
    });
  }
};

// @route   GET /api/admin/users
// @desc    Get all users with filters and pagination
// @access  Private/Admin
export const getAllUsers: RequestHandler = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, isActive, search } = req.query;

    const users = await withDB(
      async () => {
        const query: any = {};

        if (role) query.role = role;
        if (isActive !== undefined) query.isActive = isActive === "true";
        if (search) {
          query.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ];
        }

        const users = await User.find(query)
          .sort({ createdAt: -1 })
          .limit(Number(limit))
          .skip((Number(page) - 1) * Number(limit))
          .select("-password")
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
            phone: "9841234567",
            role: "user",
            isActive: true,
            createdAt: new Date(),
            lastLogin: new Date(),
          },
          {
            _id: "mock_user_2",
            name: "Sita Devi Thapa",
            email: "sita@example.com",
            phone: "9841234568",
            role: "user",
            isActive: true,
            createdAt: new Date(),
          },
        ],
        total: 2,
      },
    );

    res.json({
      success: true,
      users: users.users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: users.total,
        pages: Math.ceil(users.total / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

// @route   POST /api/admin/users
// @desc    Create new user
// @access  Private/Admin
export const createUser: RequestHandler = async (req, res) => {
  try {
    const { name, email, phone, role = "user", isActive = true } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and phone are required",
      });
    }

    const user = await withDB(
      async () => {
        // Check if user already exists
        const existingUser = await User.findOne({
          $or: [{ email }, { phone }],
        });

        if (existingUser) {
          throw new Error("User already exists with this email or phone");
        }

        // Create new user with default password
        const newUser = new User({
          name,
          email,
          phone,
          password: "temppassword123", // User should change this
          role,
          isActive,
          isEmailVerified: true, // Admin created users are pre-verified
        });

        await newUser.save();
        return newUser.toJSON();
      },
      // Fallback for demo mode
      {
        _id: `mock_${Date.now()}`,
        name,
        email,
        phone,
        role,
        isActive,
        createdAt: new Date(),
      },
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error: any) {
    console.error("Create user error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create user",
    });
  }
};

// @route   PUT /api/admin/users/:id
// @desc    Update user
// @access  Private/Admin
export const updateUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const user = await withDB(
      async () => {
        const user = await User.findByIdAndUpdate(id, updateData, {
          new: true,
          runValidators: true,
        }).select("-password");

        if (!user) {
          throw new Error("User not found");
        }

        return user.toJSON();
      },
      // Fallback for demo mode
      {
        _id: id,
        ...updateData,
        updatedAt: new Date(),
      },
    );

    res.json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (error: any) {
    console.error("Update user error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update user",
    });
  }
};

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private/Admin
export const deleteUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    await withDB(
      async () => {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
          throw new Error("User not found");
        }
        return user;
      },
      // Fallback for demo mode
      { deleted: true },
    );

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete user",
    });
  }
};

// @route   GET /api/admin/bookings
// @desc    Get all bookings with filters
// @access  Private/Admin
export const getAllBookings: RequestHandler = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, userId, serviceId } = req.query;

    const bookings = await withDB(
      async () => {
        const query: any = {};

        if (status) query.status = status;
        if (userId) query.userId = userId;
        if (serviceId) query.serviceId = serviceId;

        const bookings = await Booking.find(query)
          .populate("userId", "name email")
          .populate("serviceId", "name type")
          .sort({ createdAt: -1 })
          .limit(Number(limit))
          .skip((Number(page) - 1) * Number(limit))
          .exec();

        const total = await Booking.countDocuments(query);

        return { bookings, total };
      },
      // Fallback mock data
      {
        bookings: [
          {
            _id: "mock_booking_1",
            user: { _id: "user1", name: "Ram Kumar", email: "ram@example.com" },
            service: { _id: "service1", name: "Kathmandu Bus", type: "bus" },
            totalAmount: 800,
            status: "confirmed",
            createdAt: new Date(),
            bookingDate: new Date(),
          },
        ],
        total: 1,
      },
    );

    res.json({
      success: true,
      bookings: bookings.bookings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: bookings.total,
        pages: Math.ceil(bookings.total / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error("Get all bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

// @route   GET /api/admin/analytics
// @desc    Get analytics data
// @access  Private/Admin
export const getAnalytics: RequestHandler = async (req, res) => {
  try {
    const { period = "30d" } = req.query;

    const analytics = await withDB(
      async () => {
        // Calculate date range based on period
        const now = new Date();
        let startDate = new Date();
        let previousStartDate = new Date();

        switch (period) {
          case "7d":
            startDate.setDate(now.getDate() - 7);
            previousStartDate.setDate(now.getDate() - 14);
            break;
          case "30d":
            startDate.setDate(now.getDate() - 30);
            previousStartDate.setDate(now.getDate() - 60);
            break;
          case "90d":
            startDate.setDate(now.getDate() - 90);
            previousStartDate.setDate(now.getDate() - 180);
            break;
          case "1y":
            startDate.setFullYear(now.getFullYear() - 1);
            previousStartDate.setFullYear(now.getFullYear() - 2);
            break;
          default:
            startDate.setDate(now.getDate() - 30);
            previousStartDate.setDate(now.getDate() - 60);
        }

        // Current period stats
        const [
          totalRevenue,
          previousRevenue,
          totalBookings,
          previousBookings,
          completedBookings,
          pendingBookings,
          cancelledBookings,
          totalUsers,
          activeUsers,
          newUsers,
        ] = await Promise.all([
          // Total revenue current period
          Booking.aggregate([
            {
              $match: {
                paymentStatus: "completed",
                createdAt: { $gte: startDate },
              },
            },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
          ]).then((result) => result[0]?.total || 0),

          // Previous period revenue for growth calculation
          Booking.aggregate([
            {
              $match: {
                paymentStatus: "completed",
                createdAt: { $gte: previousStartDate, $lt: startDate },
              },
            },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
          ]).then((result) => result[0]?.total || 0),

          // Total bookings current period
          Booking.countDocuments({ createdAt: { $gte: startDate } }),

          // Previous period bookings
          Booking.countDocuments({
            createdAt: { $gte: previousStartDate, $lt: startDate },
          }),

          // Booking status counts
          Booking.countDocuments({
            status: "confirmed",
            createdAt: { $gte: startDate },
          }),
          Booking.countDocuments({
            status: "pending",
            createdAt: { $gte: startDate },
          }),
          Booking.countDocuments({
            status: "cancelled",
            createdAt: { $gte: startDate },
          }),

          // User stats
          User.countDocuments({ createdAt: { $gte: startDate } }),
          User.countDocuments({
            isActive: true,
            lastActivity: { $gte: startDate },
          }),
          User.countDocuments({ createdAt: { $gte: startDate } }),
        ]);

        // Monthly revenue trend
        const monthlyRevenue = await Booking.aggregate([
          {
            $match: {
              paymentStatus: "completed",
              createdAt: { $gte: startDate },
            },
          },
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
              },
              revenue: { $sum: "$totalAmount" },
              bookings: { $sum: 1 },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        // Popular services
        const popularServices = await Booking.aggregate([
          { $match: { createdAt: { $gte: startDate } } },
          {
            $lookup: {
              from: "services",
              localField: "serviceId",
              foreignField: "_id",
              as: "service",
            },
          },
          { $unwind: "$service" },
          {
            $group: {
              _id: "$service.name",
              bookings: { $sum: 1 },
              revenue: {
                $sum: {
                  $cond: [
                    { $eq: ["$paymentStatus", "completed"] },
                    "$totalAmount",
                    0,
                  ],
                },
              },
            },
          },
          { $sort: { bookings: -1 } },
          { $limit: 5 },
        ]);

        // Geographic distribution (assuming address field exists)
        const geographic = await Booking.aggregate([
          { $match: { createdAt: { $gte: startDate } } },
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "user",
            },
          },
          { $unwind: "$user" },
          {
            $group: {
              _id: { $ifNull: ["$user.address.city", "Unknown"] },
              bookings: { $sum: 1 },
              revenue: {
                $sum: {
                  $cond: [
                    { $eq: ["$paymentStatus", "completed"] },
                    "$totalAmount",
                    0,
                  ],
                },
              },
            },
          },
          { $sort: { bookings: -1 } },
          { $limit: 6 },
        ]);

        // Time series data for charts (last 8 periods)
        const timeSeriesData = await Booking.aggregate([
          { $match: { createdAt: { $gte: startDate } } },
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                day: { $dayOfMonth: "$createdAt" },
              },
              revenue: {
                $sum: {
                  $cond: [
                    { $eq: ["$paymentStatus", "completed"] },
                    "$totalAmount",
                    0,
                  ],
                },
              },
              bookings: { $sum: 1 },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
          { $limit: 30 },
        ]);

        // Calculate growth percentages
        const revenueGrowth =
          previousRevenue > 0
            ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
            : 0;
        const bookingGrowth =
          previousBookings > 0
            ? ((totalBookings - previousBookings) / previousBookings) * 100
            : 0;
        const conversionRate =
          totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0;

        // Format data to match PremiumAnalytics interface
        return {
          revenue: {
            total: totalRevenue,
            monthly: monthlyRevenue.reduce(
              (sum, month) => sum + month.revenue,
              0,
            ),
            growth: Math.round(revenueGrowth * 10) / 10,
            trend: revenueGrowth >= 0 ? "up" : "down",
          },
          bookings: {
            total: totalBookings,
            completed: completedBookings,
            pending: pendingBookings,
            cancelled: cancelledBookings,
            conversionRate: Math.round(conversionRate * 10) / 10,
          },
          users: {
            total: totalUsers,
            active: activeUsers,
            new: newUsers,
            retention: 78.9, // This would need more complex calculation
          },
          services: {
            total: await Service.countDocuments({ isActive: true }),
            popular: popularServices.map((service) => ({
              name: service._id,
              bookings: service.bookings,
              revenue: service.revenue,
            })),
            performance: popularServices.map((service) => ({
              name: service._id,
              rating: 4.5, // This would come from reviews/ratings
              bookings: service.bookings,
            })),
          },
          geographic: geographic.map((location) => ({
            location: location._id,
            bookings: location.bookings,
            revenue: location.revenue,
          })),
          timeSeriesData: timeSeriesData.map((item) => ({
            date: `${item._id.year}-${String(item._id.month).padStart(2, "0")}`,
            revenue: item.revenue,
            bookings: item.bookings,
            users: Math.floor(item.bookings * 0.8), // Approximate users from bookings
          })),
        };
      },
      // Enhanced fallback mock analytics
      {
        revenue: {
          total: 2500000,
          monthly: 450000,
          growth: 15.3,
          trend: "up",
        },
        bookings: {
          total: 3450,
          completed: 2890,
          pending: 420,
          cancelled: 140,
          conversionRate: 83.8,
        },
        users: {
          total: 1847,
          active: 1456,
          new: 234,
          retention: 78.9,
        },
        services: {
          total: 48,
          popular: [
            { name: "Bus Transportation", bookings: 1250, revenue: 875000 },
            { name: "Cargo Services", bookings: 820, revenue: 640000 },
            { name: "Construction Materials", bookings: 650, revenue: 520000 },
            { name: "Tours & Packages", bookings: 480, revenue: 360000 },
            { name: "Machinery Rental", bookings: 250, revenue: 180000 },
          ],
          performance: [
            { name: "Bus Services", rating: 4.8, bookings: 1250 },
            { name: "Tour Packages", rating: 4.7, bookings: 480 },
            { name: "Cargo", rating: 4.6, bookings: 820 },
            { name: "Construction", rating: 4.5, bookings: 650 },
            { name: "Machinery", rating: 4.4, bookings: 250 },
          ],
        },
        geographic: [
          { location: "Kathmandu", bookings: 1200, revenue: 850000 },
          { location: "Pokhara", bookings: 680, revenue: 420000 },
          { location: "Lamjung", bookings: 520, revenue: 320000 },
          { location: "Chitwan", bookings: 380, revenue: 280000 },
          { location: "Bhaktapur", bookings: 320, revenue: 240000 },
          { location: "Others", bookings: 350, revenue: 180000 },
        ],
        timeSeriesData: [
          { date: "2024-01", revenue: 180000, bookings: 240, users: 45 },
          { date: "2024-02", revenue: 220000, bookings: 290, users: 52 },
          { date: "2024-03", revenue: 280000, bookings: 350, users: 68 },
          { date: "2024-04", revenue: 320000, bookings: 420, users: 78 },
          { date: "2024-05", revenue: 380000, bookings: 480, users: 89 },
          { date: "2024-06", revenue: 450000, bookings: 560, users: 112 },
          { date: "2024-07", revenue: 520000, bookings: 640, users: 134 },
          { date: "2024-08", revenue: 480000, bookings: 580, users: 125 },
        ],
      },
    );

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error: any) {
    console.error("Get analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
};

// Set up routes
router.get("/dashboard", getDashboard);
router.get("/users", getAllUsers);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.get("/bookings", getAllBookings);
router.get("/analytics", getAnalytics);

export default router;
