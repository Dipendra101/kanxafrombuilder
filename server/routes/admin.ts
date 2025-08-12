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
          Booking.countDocuments({})
        ]);

        // Calculate revenue (sum of all confirmed bookings)
        const revenueResult = await Booking.aggregate([
          { $match: { paymentStatus: 'completed' } },
          { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueResult[0]?.totalRevenue || 0;

        // Monthly stats
        const monthStart = new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);

        const [monthlyUsers, monthlyBookings] = await Promise.all([
          User.countDocuments({ 
            createdAt: { $gte: monthStart },
            isActive: true 
          }),
          Booking.countDocuments({ 
            createdAt: { $gte: monthStart } 
          })
        ]);

        const monthlyRevenueResult = await Booking.aggregate([
          { 
            $match: { 
              paymentStatus: 'completed',
              createdAt: { $gte: monthStart }
            } 
          },
          { $group: { _id: null, monthlyRevenue: { $sum: '$totalAmount' } } }
        ]);
        const monthlyRevenue = monthlyRevenueResult[0]?.monthlyRevenue || 0;

        return {
          totalUsers: userCount,
          totalServices: serviceCount,
          totalBookings: bookingCount,
          totalRevenue,
          recentUsers: monthlyUsers,
          activeServices: serviceCount,
          pendingBookings: await Booking.countDocuments({ status: 'pending' }),
          monthlyRevenue
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
        monthlyRevenue: 186000
      }
    );

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error: any) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data'
    });
  }
};

// @route   GET /api/admin/users
// @desc    Get all users with filters and pagination
// @access  Private/Admin
export const getAllUsers: RequestHandler = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      role,
      isActive,
      search
    } = req.query;

    const users = await withDB(
      async () => {
        const query: any = {};
        
        if (role) query.role = role;
        if (isActive !== undefined) query.isActive = isActive === 'true';
        if (search) {
          query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ];
        }

        const users = await User.find(query)
          .sort({ createdAt: -1 })
          .limit(Number(limit))
          .skip((Number(page) - 1) * Number(limit))
          .select('-password')
          .exec();

        const total = await User.countDocuments(query);

        return { users, total };
      },
      // Fallback mock data
      {
        users: [
          {
            _id: 'mock_user_1',
            name: 'Ram Kumar Sharma',
            email: 'ram@example.com',
            phone: '9841234567',
            role: 'user',
            isActive: true,
            createdAt: new Date(),
            lastLogin: new Date()
          },
          {
            _id: 'mock_user_2',
            name: 'Sita Devi Thapa',
            email: 'sita@example.com',
            phone: '9841234568',
            role: 'user',
            isActive: true,
            createdAt: new Date()
          }
        ],
        total: 2
      }
    );

    res.json({
      success: true,
      users: users.users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: users.total,
        pages: Math.ceil(users.total / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

// @route   POST /api/admin/users
// @desc    Create new user
// @access  Private/Admin
export const createUser: RequestHandler = async (req, res) => {
  try {
    const { name, email, phone, role = 'user', isActive = true } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and phone are required'
      });
    }

    const user = await withDB(
      async () => {
        // Check if user already exists
        const existingUser = await User.findOne({
          $or: [{ email }, { phone }]
        });

        if (existingUser) {
          throw new Error('User already exists with this email or phone');
        }

        // Create new user with default password
        const newUser = new User({
          name,
          email,
          phone,
          password: 'temppassword123', // User should change this
          role,
          isActive,
          isEmailVerified: true // Admin created users are pre-verified
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
        createdAt: new Date()
      }
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user
    });
  } catch (error: any) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create user'
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
        const user = await User.findByIdAndUpdate(
          id,
          updateData,
          { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
          throw new Error('User not found');
        }

        return user.toJSON();
      },
      // Fallback for demo mode
      {
        _id: id,
        ...updateData,
        updatedAt: new Date()
      }
    );

    res.json({
      success: true,
      message: 'User updated successfully',
      user
    });
  } catch (error: any) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update user'
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
          throw new Error('User not found');
        }
        return user;
      },
      // Fallback for demo mode
      { deleted: true }
    );

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete user'
    });
  }
};

// @route   GET /api/admin/bookings
// @desc    Get all bookings with filters
// @access  Private/Admin
export const getAllBookings: RequestHandler = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      userId,
      serviceId
    } = req.query;

    const bookings = await withDB(
      async () => {
        const query: any = {};
        
        if (status) query.status = status;
        if (userId) query.userId = userId;
        if (serviceId) query.serviceId = serviceId;

        const bookings = await Booking.find(query)
          .populate('userId', 'name email')
          .populate('serviceId', 'name type')
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
            _id: 'mock_booking_1',
            user: { _id: 'user1', name: 'Ram Kumar', email: 'ram@example.com' },
            service: { _id: 'service1', name: 'Kathmandu Bus', type: 'bus' },
            totalAmount: 800,
            status: 'confirmed',
            createdAt: new Date(),
            bookingDate: new Date()
          }
        ],
        total: 1
      }
    );

    res.json({
      success: true,
      bookings: bookings.bookings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: bookings.total,
        pages: Math.ceil(bookings.total / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Get all bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings'
    });
  }
};

// @route   GET /api/admin/analytics
// @desc    Get analytics data
// @access  Private/Admin
export const getAnalytics: RequestHandler = async (req, res) => {
  try {
    const { period = '30d' } = req.query;

    const analytics = await withDB(
      async () => {
        // Calculate date range based on period
        const now = new Date();
        let startDate = new Date();
        
        switch (period) {
          case '7d':
            startDate.setDate(now.getDate() - 7);
            break;
          case '30d':
            startDate.setDate(now.getDate() - 30);
            break;
          case '90d':
            startDate.setDate(now.getDate() - 90);
            break;
          default:
            startDate.setDate(now.getDate() - 30);
        }

        // Revenue by service type
        const revenueByType = await Booking.aggregate([
          {
            $match: {
              paymentStatus: 'completed',
              createdAt: { $gte: startDate }
            }
          },
          {
            $lookup: {
              from: 'services',
              localField: 'serviceId',
              foreignField: '_id',
              as: 'service'
            }
          },
          {
            $unwind: '$service'
          },
          {
            $group: {
              _id: '$service.type',
              revenue: { $sum: '$totalAmount' },
              count: { $sum: 1 }
            }
          }
        ]);

        // User growth
        const userGrowth = await User.aggregate([
          {
            $match: {
              createdAt: { $gte: startDate }
            }
          },
          {
            $group: {
              _id: {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' },
                day: { $dayOfMonth: '$createdAt' }
              },
              count: { $sum: 1 }
            }
          },
          {
            $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
          }
        ]);

        return {
          revenueByType,
          userGrowth,
          period
        };
      },
      // Fallback mock analytics
      {
        revenueByType: [
          { _id: 'bus', revenue: 75000, count: 150 },
          { _id: 'tour', revenue: 45000, count: 30 },
          { _id: 'construction', revenue: 30000, count: 20 }
        ],
        userGrowth: [
          { _id: { year: 2024, month: 8, day: 10 }, count: 5 },
          { _id: { year: 2024, month: 8, day: 11 }, count: 8 },
          { _id: { year: 2024, month: 8, day: 12 }, count: 3 }
        ],
        period
      }
    );

    res.json({
      success: true,
      data: analytics
    });
  } catch (error: any) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics'
    });
  }
};

// Set up routes
router.get('/dashboard', getDashboard);
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/bookings', getAllBookings);
router.get('/analytics', getAnalytics);

export default router;
