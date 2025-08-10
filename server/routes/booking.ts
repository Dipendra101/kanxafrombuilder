import { Router } from "express";
import { z } from "zod";
import { verifyToken } from "./auth";
import Booking from "../models/Booking";
import BusService from "../models/BusService";
import CargoService from "../models/CargoService";
import TourPackage from "../models/TourPackage";

const router = Router();

// Validation schemas
const createBookingSchema = z.object({
  serviceType: z.enum(['bus', 'cargo', 'tour']),
  serviceId: z.string(),
  travelDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  passengers: z.number().min(1, "At least 1 passenger required"),
  paymentMethod: z.enum(['khalti', 'esewa', 'cash', 'bank_transfer']),
  contactInfo: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().min(10, "Phone must be at least 10 digits"),
    email: z.string().email("Invalid email"),
    address: z.string().optional(),
  }),
  specialRequests: z.string().optional(),
});

// Create a new booking
router.post("/", verifyToken, async (req, res) => {
  try {
    const validatedData = createBookingSchema.parse(req.body);
    
    // Check if service exists and is active
    let service;
    let totalAmount = 0;
    
    switch (validatedData.serviceType) {
      case 'bus':
        service = await BusService.findById(validatedData.serviceId);
        if (!service || !service.isActive) {
          return res.status(404).json({
            success: false,
            error: "Bus service not found or inactive"
          });
        }
        if (service.availableSeats < validatedData.passengers) {
          return res.status(400).json({
            success: false,
            error: "Not enough seats available"
          });
        }
        totalAmount = service.price * validatedData.passengers;
        break;
        
      case 'cargo':
        service = await CargoService.findById(validatedData.serviceId);
        if (!service || !service.isActive) {
          return res.status(404).json({
            success: false,
            error: "Cargo service not found or inactive"
          });
        }
        totalAmount = service.price;
        break;
        
      case 'tour':
        service = await TourPackage.findById(validatedData.serviceId);
        if (!service || !service.isActive) {
          return res.status(404).json({
            success: false,
            error: "Tour package not found or inactive"
          });
        }
        totalAmount = service.price * validatedData.passengers;
        break;
        
      default:
        return res.status(400).json({
          success: false,
          error: "Invalid service type"
        });
    }
    
    // Create booking
    const booking = await Booking.create({
      userId: req.user.userId,
      serviceType: validatedData.serviceType,
      serviceId: validatedData.serviceId,
      travelDate: new Date(validatedData.travelDate),
      passengers: validatedData.passengers,
      totalAmount,
      paymentMethod: validatedData.paymentMethod,
      contactInfo: validatedData.contactInfo,
      specialRequests: validatedData.specialRequests,
    });
    
    // Update available seats for bus service
    if (validatedData.serviceType === 'bus' && service) {
      service.availableSeats -= validatedData.passengers;
      await service.save();
    }
    
    // Populate service details
    await booking.populate('serviceId');
    
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Validation error",
        details: error.errors
      });
    }
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      error: "Failed to create booking"
    });
  }
});

// Get user's bookings
router.get("/my-bookings", verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.userId })
      .populate('serviceId')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: bookings,
      count: bookings.length
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch bookings"
    });
  }
});

// Get booking by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('serviceId')
      .populate('userId', '-password');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found"
      });
    }
    
    // Check if user owns this booking or is admin
    if (booking.userId.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: "Access denied"
      });
    }
    
    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch booking"
    });
  }
});

// Cancel booking
router.post("/:id/cancel", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found"
      });
    }
    
    // Check if user owns this booking or is admin
    if (booking.userId.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: "Access denied"
      });
    }
    
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        error: "Booking is already cancelled"
      });
    }
    
    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        error: "Cannot cancel completed booking"
      });
    }
    
    // Update booking status
    booking.status = 'cancelled';
    await booking.save();
    
    // Restore available seats for bus service
    if (booking.serviceType === 'bus') {
      const busService = await BusService.findById(booking.serviceId);
      if (busService) {
        busService.availableSeats += booking.passengers;
        await busService.save();
      }
    }
    
    res.json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      error: "Failed to cancel booking"
    });
  }
});

// Get all bookings (admin only)
router.get("/", verifyToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: "Access denied. Admin only."
      });
    }
    
    const { status, serviceType, page = 1, limit = 10 } = req.query;
    
    let filter: any = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (serviceType) {
      filter.serviceType = serviceType;
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const bookings = await Booking.find(filter)
      .populate('serviceId')
      .populate('userId', '-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Booking.countDocuments(filter);
    
    res.json({
      success: true,
      data: bookings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch bookings"
    });
  }
});

// Update booking status (admin only)
router.put("/:id/status", verifyToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: "Access denied. Admin only."
      });
    }
    
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status"
      });
    }
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found"
      });
    }
    
    booking.status = status;
    await booking.save();
    
    res.json({
      success: true,
      message: "Booking status updated successfully",
      data: booking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      error: "Failed to update booking status"
    });
  }
});

export { router as bookingRoutes };
