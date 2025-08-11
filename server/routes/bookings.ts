import { Router, RequestHandler } from "express";
import Booking, { IBooking } from "../models/Booking";
import Service from "../models/Service";
import User from "../models/User";
import { authenticate, adminOnly, authorize } from "../middleware/auth";
import connectDB from "../config/database";

const router = Router();

// Connect to database
connectDB();

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
export const createBooking: RequestHandler = async (req, res) => {
  try {
    const userId = req.user.userId;
    const bookingData = {
      user: userId,
      ...req.body
    };

    // Validate service exists and is available
    const service = await Service.findById(bookingData.service);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    if (!service.isActive || !service.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Service is not available for booking'
      });
    }

    // Calculate pricing
    const baseAmount = service.pricing.basePrice;
    const vatAmount = (baseAmount * (service.pricing.taxes?.vat || 13)) / 100;
    const serviceTaxAmount = (baseAmount * (service.pricing.taxes?.serviceTax || 0)) / 100;
    
    const totalAmount = baseAmount + vatAmount + serviceTaxAmount;

    // Set pricing details
    bookingData.pricing = {
      baseAmount,
      taxes: {
        vat: vatAmount,
        serviceTax: serviceTaxAmount,
        others: []
      },
      discounts: bookingData.pricing?.discounts || [],
      totalAmount,
      currency: service.pricing.currency
    };

    // Set payment details
    bookingData.payment = {
      status: 'pending',
      transactions: [],
      dueAmount: totalAmount,
      paidAmount: 0,
      refundAmount: 0
    };

    // Initialize status history
    bookingData.statusHistory = [{
      status: 'pending',
      timestamp: new Date(),
      updatedBy: userId,
      notes: 'Booking created'
    }];

    const booking = new Booking(bookingData);
    await booking.save();

    // Populate related data
    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email phone')
      .populate('service', 'name type description images pricing');

    // Update service analytics
    service.analytics.bookings += 1;
    await service.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: populatedBooking
    });
  } catch (error: any) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @route   GET /api/bookings
// @desc    Get user's bookings with filters
// @access  Private
export const getUserBookings: RequestHandler = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      page = 1,
      limit = 10,
      status,
      type,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query: any = { user: userId };

    if (status) query.status = status;
    if (type) query.type = type;

    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    const bookings = await Booking.find(query)
      .populate('service', 'name type description images pricing')
      .sort(sort)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .exec();

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      bookings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Get user bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings'
    });
  }
};

// @route   GET /api/bookings/all
// @desc    Get all bookings (Admin only)
// @access  Private/Admin
export const getAllBookings: RequestHandler = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      type,
      userId,
      search,
      paymentStatus,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query: any = {};

    if (status) query.status = status;
    if (type) query.type = type;
    if (userId) query.user = userId;
    if (paymentStatus) query['payment.status'] = paymentStatus;

    // Search by booking number or contact info
    if (search) {
      query.$or = [
        { bookingNumber: { $regex: search, $options: 'i' } },
        { 'contactInfo.name': { $regex: search, $options: 'i' } },
        { 'contactInfo.phone': { $regex: search, $options: 'i' } },
        { 'contactInfo.email': { $regex: search, $options: 'i' } }
      ];
    }

    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate('service', 'name type description images pricing')
      .populate('assignedTo', 'name email')
      .sort(sort)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .exec();

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      bookings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
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

// @route   GET /api/bookings/:id
// @desc    Get specific booking details
// @access  Private
export const getBookingById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const booking = await Booking.findById(id)
      .populate('user', 'name email phone')
      .populate('service', 'name type description images pricing')
      .populate('assignedTo', 'name email')
      .populate('statusHistory.updatedBy', 'name email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user can access this booking
    if (userRole !== 'admin' && booking.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      booking
    });
  } catch (error: any) {
    console.error('Get booking by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking'
    });
  }
};

// @route   PUT /api/bookings/:id
// @desc    Update booking details
// @access  Private
export const updateBooking: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check permissions
    if (userRole !== 'admin' && booking.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Only allow updates if booking is not completed or cancelled
    if (['completed', 'cancelled', 'refunded'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update completed, cancelled, or refunded booking'
      });
    }

    const allowedUpdates = userRole === 'admin' 
      ? ['status', 'assignedTo', 'notes', 'internalNotes', 'contactInfo', 'serviceDetails']
      : ['contactInfo', 'serviceDetails', 'notes'];

    const updates: any = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate('user', 'name email phone')
      .populate('service', 'name type description images pricing')
      .populate('assignedTo', 'name email');

    res.json({
      success: true,
      message: 'Booking updated successfully',
      booking: updatedBooking
    });
  } catch (error: any) {
    console.error('Update booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking'
    });
  }
};

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status
// @access  Private/Admin
export const updateBookingStatus: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const userId = req.user.userId;

    const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Update status and add to history
    booking.status = status;
    booking.statusHistory.push({
      status,
      timestamp: new Date(),
      updatedBy: userId,
      notes: notes || `Status changed to ${status}`
    } as any);

    // Update schedule fields based on status
    switch (status) {
      case 'confirmed':
        booking.schedule.confirmedAt = new Date();
        break;
      case 'in_progress':
        booking.schedule.startDate = new Date();
        break;
      case 'completed':
        booking.schedule.completedAt = new Date();
        booking.schedule.endDate = new Date();
        break;
      case 'cancelled':
        booking.schedule.cancelledAt = new Date();
        break;
    }

    await booking.save();

    const updatedBooking = await Booking.findById(id)
      .populate('user', 'name email phone')
      .populate('service', 'name type description images pricing')
      .populate('assignedTo', 'name email');

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      booking: updatedBooking
    });
  } catch (error: any) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status'
    });
  }
};

// @route   PUT /api/bookings/:id/payment
// @desc    Update payment status
// @access  Private
export const updatePaymentStatus: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, paymentMethod, transactionId, amount, gatewayResponse } = req.body;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Add transaction record
    const transaction = {
      id: transactionId || `txn_${Date.now()}`,
      amount: amount || booking.pricing.totalAmount,
      status: paymentStatus === 'completed' ? 'completed' : 'pending',
      method: paymentMethod,
      gatewayResponse,
      timestamp: new Date()
    };

    booking.payment.transactions.push(transaction as any);
    booking.payment.status = paymentStatus;
    booking.payment.method = paymentMethod;

    if (paymentStatus === 'completed') {
      booking.payment.paidAmount += transaction.amount;
      booking.payment.dueAmount = Math.max(0, booking.pricing.totalAmount - booking.payment.paidAmount);
      
      // Auto-confirm booking if fully paid
      if (booking.payment.dueAmount === 0 && booking.status === 'pending') {
        booking.status = 'confirmed';
        booking.statusHistory.push({
          status: 'confirmed',
          timestamp: new Date(),
          updatedBy: booking.user,
          notes: 'Auto-confirmed after payment'
        } as any);
        booking.schedule.confirmedAt = new Date();
      }
    }

    await booking.save();

    const updatedBooking = await Booking.findById(id)
      .populate('user', 'name email phone')
      .populate('service', 'name type description images pricing');

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      booking: updatedBooking
    });
  } catch (error: any) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment status'
    });
  }
};

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel booking
// @access  Private
export const cancelBooking: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check permissions
    if (userRole !== 'admin' && booking.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (['completed', 'cancelled', 'refunded'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be cancelled'
      });
    }

    // Calculate refund amount based on cancellation policy
    let refundAmount = 0;
    if (booking.payment.paidAmount > 0) {
      // Simple refund logic - can be enhanced based on business rules
      const hoursBeforeService = booking.schedule.startDate 
        ? (booking.schedule.startDate.getTime() - Date.now()) / (1000 * 60 * 60)
        : 24; // Default to 24 hours if no start date
      
      if (hoursBeforeService >= 24) {
        refundAmount = booking.payment.paidAmount; // Full refund
      } else if (hoursBeforeService >= 2) {
        refundAmount = booking.payment.paidAmount * 0.5; // 50% refund
      }
      // No refund if less than 2 hours
    }

    booking.status = 'cancelled';
    booking.schedule.cancelledAt = new Date();
    booking.cancellation = {
      reason: reason || 'Cancelled by user',
      requestedBy: userId,
      requestedAt: new Date(),
      approvedBy: userRole === 'admin' ? userId : undefined,
      approvedAt: userRole === 'admin' ? new Date() : undefined,
      refundAmount,
      refundStatus: 'pending'
    };

    booking.statusHistory.push({
      status: 'cancelled',
      timestamp: new Date(),
      updatedBy: userId,
      notes: reason || 'Booking cancelled'
    } as any);

    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      refundAmount
    });
  } catch (error: any) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking'
    });
  }
};

// @route   GET /api/bookings/stats
// @desc    Get booking statistics (Admin only)
// @access  Private/Admin
export const getBookingStats: RequestHandler = async (req, res) => {
  try {
    const stats = await Booking.aggregate([
      {
        $facet: {
          totalBookings: [{ $count: "count" }],
          bookingsByStatus: [
            { $group: { _id: "$status", count: { $sum: 1 } } }
          ],
          bookingsByType: [
            { $group: { _id: "$type", count: { $sum: 1 } } }
          ],
          revenue: [
            { $group: { _id: null, totalRevenue: { $sum: "$payment.paidAmount" } } }
          ],
          pendingRevenue: [
            { $group: { _id: null, pendingRevenue: { $sum: "$payment.dueAmount" } } }
          ],
          recentBookings: [
            { $match: { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
            { $count: "count" }
          ]
        }
      }
    ]);

    const result = {
      totalBookings: stats[0].totalBookings[0]?.count || 0,
      totalRevenue: stats[0].revenue[0]?.totalRevenue || 0,
      pendingRevenue: stats[0].pendingRevenue[0]?.pendingRevenue || 0,
      recentBookings: stats[0].recentBookings[0]?.count || 0,
      bookingsByStatus: stats[0].bookingsByStatus.reduce((acc: any, item: any) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      bookingsByType: stats[0].bookingsByType.reduce((acc: any, item: any) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    };

    res.json({
      success: true,
      stats: result
    });
  } catch (error: any) {
    console.error('Get booking stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking statistics'
    });
  }
};

// Set up routes
router.post('/', authenticate, createBooking);
router.get('/', authenticate, getUserBookings);
router.get('/all', authenticate, adminOnly, getAllBookings);
router.get('/stats', authenticate, adminOnly, getBookingStats);
router.get('/:id', authenticate, getBookingById);
router.put('/:id', authenticate, updateBooking);
router.put('/:id/status', authenticate, adminOnly, updateBookingStatus);
router.put('/:id/payment', authenticate, updatePaymentStatus);
router.put('/:id/cancel', authenticate, cancelBooking);

export default router;
