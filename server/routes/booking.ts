import { Router } from "express";
import { z } from "zod";
import { verifyToken } from "./auth";

const router = Router();

// Validation schemas
const createBookingSchema = z.object({
  type: z.enum(["transportation", "construction", "garage"]),
  serviceId: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  time: z.string().optional(),
  quantity: z.number().min(1).optional(),
  specialRequirements: z.string().optional(),
  contactPerson: z.string().min(2),
  contactPhone: z.string().min(10),
  deliveryAddress: z.string().min(10).optional(),
  paymentMethod: z.enum(["khalti", "esewa", "cash", "credit"]),
});

// Mock booking data (replace with database in production)
const bookings = [
  {
    id: "1",
    userId: "1",
    type: "transportation",
    serviceId: "lamjung-kathmandu",
    serviceName: "Lamjung → Kathmandu Bus",
    date: "2024-03-25",
    time: "06:00",
    quantity: 2,
    totalPrice: 1600,
    status: "confirmed",
    paymentMethod: "khalti",
    contactPerson: "Raj Kumar Sharma",
    contactPhone: "+977-9841234567",
    createdAt: "2024-03-20T10:30:00Z",
    updatedAt: "2024-03-20T10:30:00Z",
  },
  {
    id: "2",
    userId: "1",
    type: "construction",
    serviceId: "cement-order",
    serviceName: "Cement and Steel Order",
    date: "2024-03-26",
    quantity: 10,
    totalPrice: 8500,
    status: "pending",
    paymentMethod: "esewa",
    contactPerson: "Raj Kumar Sharma",
    contactPhone: "+977-9841234567",
    deliveryAddress: "Lamjung, Nepal",
    createdAt: "2024-03-19T14:20:00Z",
    updatedAt: "2024-03-19T14:20:00Z",
  },
];

// Get all bookings for a user
router.get("/", verifyToken, (req, res) => {
  const userBookings = bookings.filter(b => b.userId === req.user.userId);
  
  // Add filtering options
  const { type, status, date } = req.query;
  let filteredBookings = userBookings;
  
  if (type) {
    filteredBookings = filteredBookings.filter(b => b.type === type);
  }
  
  if (status) {
    filteredBookings = filteredBookings.filter(b => b.status === status);
  }
  
  if (date) {
    filteredBookings = filteredBookings.filter(b => b.date === date);
  }
  
  res.json({ bookings: filteredBookings });
});

// Get booking by ID
router.get("/:id", verifyToken, (req, res) => {
  const booking = bookings.find(b => b.id === req.params.id && b.userId === req.user.userId);
  
  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }
  
  res.json({ booking });
});

// Create new booking
router.post("/", verifyToken, async (req, res) => {
  try {
    const validatedData = createBookingSchema.parse(req.body);
    
    // In a real application, you would validate service availability
    // and calculate pricing based on the service
    
    const newBooking = {
      id: Date.now().toString(),
      userId: req.user.userId,
      ...validatedData,
      totalPrice: 0, // Calculate based on service
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    bookings.push(newBooking);
    
    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation error", details: error.errors });
    }
    res.status(500).json({ error: "Failed to create booking" });
  }
});

// Update booking
router.put("/:id", verifyToken, async (req, res) => {
  const booking = bookings.find(b => b.id === req.params.id && b.userId === req.user.userId);
  
  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }
  
  // Only allow updates to certain fields
  const allowedUpdates = ["specialRequirements", "contactPerson", "contactPhone", "deliveryAddress"];
  const updates = {};
  
  for (const field of allowedUpdates) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }
  
  Object.assign(booking, updates);
  booking.updatedAt = new Date().toISOString();
  
  res.json({
    message: "Booking updated successfully",
    booking,
  });
});

// Cancel booking
router.post("/:id/cancel", verifyToken, async (req, res) => {
  const booking = bookings.find(b => b.id === req.params.id && b.userId === req.user.userId);
  
  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }
  
  if (booking.status === "cancelled") {
    return res.status(400).json({ error: "Booking is already cancelled" });
  }
  
  if (booking.status === "completed") {
    return res.status(400).json({ error: "Cannot cancel completed booking" });
  }
  
  booking.status = "cancelled";
  booking.updatedAt = new Date().toISOString();
  
  res.json({
    message: "Booking cancelled successfully",
    booking,
  });
});

// Get booking statistics
router.get("/stats/overview", verifyToken, (req, res) => {
  const userBookings = bookings.filter(b => b.userId === req.user.userId);
  
  const stats = {
    total: userBookings.length,
    confirmed: userBookings.filter(b => b.status === "confirmed").length,
    pending: userBookings.filter(b => b.status === "pending").length,
    cancelled: userBookings.filter(b => b.status === "cancelled").length,
    completed: userBookings.filter(b => b.status === "completed").length,
    totalSpent: userBookings.reduce((sum, b) => sum + b.totalPrice, 0),
  };
  
  res.json({ stats });
});

// Get booking history
router.get("/history", verifyToken, (req, res) => {
  const userBookings = bookings.filter(b => b.userId === req.user.userId);
  
  // Sort by creation date (newest first)
  const sortedBookings = userBookings.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  res.json({ bookings: sortedBookings });
});

// Get upcoming bookings
router.get("/upcoming", verifyToken, (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const userBookings = bookings.filter(b => b.userId === req.user.userId);
  
  const upcomingBookings = userBookings.filter(b => 
    b.date >= today && b.status !== "cancelled"
  );
  
  // Sort by date
  const sortedBookings = upcomingBookings.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  res.json({ bookings: sortedBookings });
});

export { router as bookingRoutes };
