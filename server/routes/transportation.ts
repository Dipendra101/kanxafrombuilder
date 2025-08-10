import { Router } from "express";
import { z } from "zod";
import { verifyToken } from "./auth";

const router = Router();

// Validation schemas
const bookingSchema = z.object({
  routeId: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  passengers: z.number().min(1).max(50),
  passengerDetails: z.array(z.object({
    name: z.string().min(2),
    age: z.number().min(1).max(120),
    phone: z.string().optional(),
  })),
  seatNumbers: z.array(z.number()).optional(),
  paymentMethod: z.enum(["khalti", "esewa", "cash"]),
});

const cargoBookingSchema = z.object({
  routeId: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  cargoType: z.string(),
  weight: z.number().min(0.1),
  dimensions: z.object({
    length: z.number().min(0.1),
    width: z.number().min(0.1),
    height: z.number().min(0.1),
  }),
  pickupAddress: z.string().min(10),
  deliveryAddress: z.string().min(10),
  contactPerson: z.string().min(2),
  contactPhone: z.string().min(10),
  paymentMethod: z.enum(["khalti", "esewa", "cash"]),
});

// Mock data (replace with database in production)
const routes = [
  {
    id: "lamjung-kathmandu",
    name: "Lamjung → Kathmandu",
    from: "Lamjung",
    to: "Kathmandu",
    distance: "180 km",
    duration: "6 hours",
    price: 800,
    type: "bus",
    schedule: [
      { time: "06:00", available: true },
      { time: "08:30", available: true },
      { time: "14:00", available: true },
      { time: "16:30", available: true },
    ],
  },
  {
    id: "lamjung-pokhara",
    name: "Lamjung → Pokhara",
    from: "Lamjung",
    to: "Pokhara",
    distance: "120 km",
    duration: "4 hours",
    price: 500,
    type: "bus",
    schedule: [
      { time: "07:00", available: true },
      { time: "09:30", available: true },
      { time: "15:00", available: true },
    ],
  },
  {
    id: "kathmandu-lamjung",
    name: "Kathmandu → Lamjung",
    from: "Kathmandu",
    to: "Lamjung",
    distance: "180 km",
    duration: "6 hours",
    price: 800,
    type: "bus",
    schedule: [
      { time: "06:30", available: true },
      { time: "09:00", available: true },
      { time: "14:30", available: true },
      { time: "17:00", available: true },
    ],
  },
];

const cargoRoutes = [
  {
    id: "cargo-lamjung-kathmandu",
    name: "Lamjung → Kathmandu (Cargo)",
    from: "Lamjung",
    to: "Kathmandu",
    distance: "180 km",
    duration: "8 hours",
    basePrice: 15000,
    pricePerKg: 50,
    type: "cargo",
    vehicleTypes: [
      { type: "Small Truck", capacity: "2 tons", price: 12000 },
      { type: "Medium Truck", capacity: "5 tons", price: 25000 },
      { type: "Large Truck", capacity: "10 tons", price: 45000 },
    ],
  },
  {
    id: "cargo-pokhara-lamjung",
    name: "Pokhara → Lamjung (Cargo)",
    from: "Pokhara",
    to: "Lamjung",
    distance: "120 km",
    duration: "5 hours",
    basePrice: 8000,
    pricePerKg: 30,
    type: "cargo",
    vehicleTypes: [
      { type: "Small Truck", capacity: "2 tons", price: 8000 },
      { type: "Medium Truck", capacity: "5 tons", price: 18000 },
      { type: "Large Truck", capacity: "10 tons", price: 35000 },
    ],
  },
];

const tours = [
  {
    id: "annapurna-circuit",
    name: "Annapurna Circuit Trek",
    duration: "14 days",
    price: 45000,
    maxGroupSize: 12,
    difficulty: "Moderate",
    description: "Experience the majestic Annapurna range with our guided trek",
    highlights: ["Thorong La Pass", "Muktinath Temple", "Manang Valley"],
    includes: ["Guide", "Accommodation", "Meals", "Permits"],
    availableDates: ["2024-03-15", "2024-04-01", "2024-04-15"],
  },
  {
    id: "pokhara-lake",
    name: "Pokhara Lake City Tour",
    duration: "3 days",
    price: 12000,
    maxGroupSize: 8,
    difficulty: "Easy",
    description: "Explore the beautiful lakes and mountains of Pokhara",
    highlights: ["Phewa Lake", "World Peace Pagoda", "Sarangkot Sunrise"],
    includes: ["Guide", "Hotel", "Transport", "Activities"],
    availableDates: ["2024-03-20", "2024-04-05", "2024-04-20"],
  },
];

const bookings: any[] = [];
const cargoBookings: any[] = [];

// Get all routes
router.get("/routes", (req, res) => {
  const { type, from, to } = req.query;
  
  let filteredRoutes = routes;
  
  if (type) {
    filteredRoutes = filteredRoutes.filter(route => route.type === type);
  }
  
  if (from) {
    filteredRoutes = filteredRoutes.filter(route => 
      route.from.toLowerCase().includes(from.toString().toLowerCase())
    );
  }
  
  if (to) {
    filteredRoutes = filteredRoutes.filter(route => 
      route.to.toLowerCase().includes(to.toString().toLowerCase())
    );
  }
  
  res.json({ routes: filteredRoutes });
});

// Get route by ID
router.get("/routes/:id", (req, res) => {
  const route = routes.find(r => r.id === req.params.id);
  if (!route) {
    return res.status(404).json({ error: "Route not found" });
  }
  res.json({ route });
});

// Get cargo routes
router.get("/cargo", (req, res) => {
  res.json({ routes: cargoRoutes });
});

// Get tours
router.get("/tours", (req, res) => {
  res.json({ tours });
});

// Get tour by ID
router.get("/tours/:id", (req, res) => {
  const tour = tours.find(t => t.id === req.params.id);
  if (!tour) {
    return res.status(404).json({ error: "Tour not found" });
  }
  res.json({ tour });
});

// Book transportation
router.post("/book", verifyToken, async (req, res) => {
  try {
    const validatedData = bookingSchema.parse(req.body);
    
    const route = routes.find(r => r.id === validatedData.routeId);
    if (!route) {
      return res.status(404).json({ error: "Route not found" });
    }
    
    // Check availability
    const schedule = route.schedule.find(s => s.available);
    if (!schedule) {
      return res.status(400).json({ error: "No available seats for this route" });
    }
    
    // Calculate total price
    const totalPrice = route.price * validatedData.passengers;
    
    // Create booking
    const booking = {
      id: Date.now().toString(),
      userId: req.user.userId,
      routeId: validatedData.routeId,
      route: route,
      date: validatedData.date,
      time: schedule.time,
      passengers: validatedData.passengers,
      passengerDetails: validatedData.passengerDetails,
      seatNumbers: validatedData.seatNumbers || [],
      totalPrice,
      paymentMethod: validatedData.paymentMethod,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    bookings.push(booking);
    
    // Update availability
    schedule.available = false;
    
    res.status(201).json({
      message: "Booking created successfully",
      booking,
      paymentUrl: `/api/payment/initiate?bookingId=${booking.id}`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation error", details: error.errors });
    }
    res.status(500).json({ error: "Booking failed" });
  }
});

// Book cargo
router.post("/cargo/book", verifyToken, async (req, res) => {
  try {
    const validatedData = cargoBookingSchema.parse(req.body);
    
    const route = cargoRoutes.find(r => r.id === validatedData.routeId);
    if (!route) {
      return res.status(404).json({ error: "Cargo route not found" });
    }
    
    // Calculate total price
    const totalPrice = route.basePrice + (route.pricePerKg * validatedData.weight);
    
    // Create cargo booking
    const cargoBooking = {
      id: Date.now().toString(),
      userId: req.user.userId,
      routeId: validatedData.routeId,
      route: route,
      date: validatedData.date,
      cargoType: validatedData.cargoType,
      weight: validatedData.weight,
      dimensions: validatedData.dimensions,
      pickupAddress: validatedData.pickupAddress,
      deliveryAddress: validatedData.deliveryAddress,
      contactPerson: validatedData.contactPerson,
      contactPhone: validatedData.contactPhone,
      totalPrice,
      paymentMethod: validatedData.paymentMethod,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    cargoBookings.push(cargoBooking);
    
    res.status(201).json({
      message: "Cargo booking created successfully",
      booking: cargoBooking,
      paymentUrl: `/api/payment/initiate?bookingId=${cargoBooking.id}&type=cargo`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation error", details: error.errors });
    }
    res.status(500).json({ error: "Cargo booking failed" });
  }
});

// Get user bookings
router.get("/bookings", verifyToken, (req, res) => {
  const userBookings = bookings.filter(b => b.userId === req.user.userId);
  const userCargoBookings = cargoBookings.filter(b => b.userId === req.user.userId);
  
  res.json({
    bookings: userBookings,
    cargoBookings: userCargoBookings,
  });
});

// Get booking by ID
router.get("/bookings/:id", verifyToken, (req, res) => {
  const booking = bookings.find(b => b.id === req.params.id && b.userId === req.user.userId);
  const cargoBooking = cargoBookings.find(b => b.id === req.params.id && b.userId === req.user.userId);
  
  if (!booking && !cargoBooking) {
    return res.status(404).json({ error: "Booking not found" });
  }
  
  res.json({
    booking: booking || cargoBooking,
    type: booking ? "passenger" : "cargo",
  });
});

// Cancel booking
router.post("/bookings/:id/cancel", verifyToken, async (req, res) => {
  const booking = bookings.find(b => b.id === req.params.id && b.userId === req.user.userId);
  const cargoBooking = cargoBookings.find(b => b.id === req.params.id && b.userId === req.user.userId);
  
  if (!booking && !cargoBooking) {
    return res.status(404).json({ error: "Booking not found" });
  }
  
  const targetBooking = booking || cargoBooking;
  
  if (targetBooking.status === "cancelled") {
    return res.status(400).json({ error: "Booking is already cancelled" });
  }
  
  if (targetBooking.status === "completed") {
    return res.status(400).json({ error: "Cannot cancel completed booking" });
  }
  
  // Update booking status
  targetBooking.status = "cancelled";
  targetBooking.updatedAt = new Date();
  
  // If it's a passenger booking, make the seat available again
  if (booking) {
    const route = routes.find(r => r.id === booking.routeId);
    if (route) {
      const schedule = route.schedule.find(s => s.time === booking.time);
      if (schedule) {
        schedule.available = true;
      }
    }
  }
  
  res.json({
    message: "Booking cancelled successfully",
    booking: targetBooking,
  });
});

// Get live transportation board
router.get("/live-board", (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const dayAfter = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  const liveBoard = {
    today: routes.map(route => ({
      ...route,
      availableSeats: route.schedule.filter(s => s.available).length * 40, // Assuming 40 seats per bus
    })),
    tomorrow: routes.map(route => ({
      ...route,
      availableSeats: route.schedule.filter(s => s.available).length * 40,
    })),
    dayAfter: routes.map(route => ({
      ...route,
      availableSeats: route.schedule.filter(s => s.available).length * 40,
    })),
  };
  
  res.json(liveBoard);
});

export { router as transportationRoutes };
