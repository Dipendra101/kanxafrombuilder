import { Router } from "express";
import { z } from "zod";
import { verifyToken } from "./auth";

const router = Router();

// Validation schemas
const orderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    unit: z.string(),
  })),
  deliveryAddress: z.string().min(10),
  contactPerson: z.string().min(2),
  contactPhone: z.string().min(10),
  deliveryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  paymentMethod: z.enum(["khalti", "esewa", "cash", "credit"]),
  specialInstructions: z.string().optional(),
});

const machineryRentalSchema = z.object({
  machineryId: z.string(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  deliveryAddress: z.string().min(10),
  contactPerson: z.string().min(2),
  contactPhone: z.string().min(10),
  paymentMethod: z.enum(["khalti", "esewa", "cash", "credit"]),
  operatorRequired: z.boolean().optional(),
});

// Mock data (replace with database in production)
const materials = [
  {
    id: "cement-opc-53",
    name: "OPC 53 Grade Cement",
    category: "cement",
    price: 850,
    unit: "50kg bag",
    stock: 500,
    minStock: 50,
    supplier: "Himalayan Cement",
    description: "High-strength Portland cement for structural applications",
    specifications: {
      strength: "53 MPa",
      settingTime: "45 minutes",
      color: "Gray",
    },
    image: "🧱",
    rating: 4.8,
    reviews: 125,
  },
  {
    id: "rebar-12mm",
    name: "TMT Steel Rebar 12mm",
    category: "steel",
    price: 85,
    unit: "per kg",
    stock: 2000,
    minStock: 200,
    supplier: "Nepal Steel",
    description: "Thermo-mechanically treated steel bars for reinforcement",
    specifications: {
      diameter: "12mm",
      grade: "Fe 500D",
      length: "6m",
    },
    image: "🔗",
    rating: 4.9,
    reviews: 89,
  },
  {
    id: "concrete-blocks",
    name: "Concrete Hollow Blocks",
    category: "blocks",
    price: 45,
    unit: "per piece",
    stock: 1000,
    minStock: 100,
    supplier: "Lamjung Blocks",
    description: "Standard concrete blocks for wall construction",
    specifications: {
      size: "400x200x200mm",
      weight: "15kg",
      compressiveStrength: "7.5 MPa",
    },
    image: "🟤",
    rating: 4.5,
    reviews: 67,
  },
  {
    id: "pvc-pipe-4inch",
    name: "PVC Pipe 4 inch",
    category: "pipes",
    price: 450,
    unit: "per meter",
    stock: 300,
    minStock: 30,
    supplier: "Nepal Pipes",
    description: "High-quality PVC pipes for plumbing and drainage",
    specifications: {
      diameter: "4 inch",
      pressure: "PN10",
      material: "PVC-U",
    },
    image: "🚰",
    rating: 4.7,
    reviews: 43,
  },
  {
    id: "sand-fine",
    name: "Fine River Sand",
    category: "aggregates",
    price: 1200,
    unit: "per cubic meter",
    stock: 50,
    minStock: 10,
    supplier: "Local Suppliers",
    description: "Clean river sand for concrete and masonry work",
    specifications: {
      fineness: "0.075mm",
      moisture: "<3%",
      impurities: "<2%",
    },
    image: "🏖️",
    rating: 4.6,
    reviews: 34,
  },
  {
    id: "aggregate-20mm",
    name: "20mm Coarse Aggregate",
    category: "aggregates",
    price: 1800,
    unit: "per cubic meter",
    stock: 40,
    minStock: 8,
    supplier: "Local Suppliers",
    description: "Crushed stone aggregate for concrete production",
    specifications: {
      size: "20mm",
      shape: "Angular",
      strength: "High",
    },
    image: "🪨",
    rating: 4.4,
    reviews: 28,
  },
];

const machinery = [
  {
    id: "jcb-3dx",
    name: "JCB 3DX Eco Excavator",
    category: "excavator",
    dailyRate: 8000,
    weeklyRate: 45000,
    monthlyRate: 150000,
    availability: "available",
    location: "Lamjung Depot",
    operator: "included",
    description: "Versatile excavator for digging, loading, and material handling",
    specifications: {
      engine: "Diesel",
      power: "55 HP",
      bucketCapacity: "0.28 cubic meters",
      weight: "7.5 tons",
    },
    image: "🚜",
    rating: 4.8,
    reviews: 56,
    images: ["jcb-1.jpg", "jcb-2.jpg", "jcb-3.jpg"],
  },
  {
    id: "concrete-mixer-500l",
    name: "Concrete Mixer 500L",
    category: "mixer",
    dailyRate: 2500,
    weeklyRate: 14000,
    monthlyRate: 45000,
    availability: "available",
    location: "Pokhara Branch",
    operator: "not-included",
    description: "Electric concrete mixer for small to medium projects",
    specifications: {
      capacity: "500 liters",
      power: "3 HP",
      voltage: "415V",
      mixingTime: "2-3 minutes",
    },
    image: "🥽",
    rating: 4.6,
    reviews: 23,
    images: ["mixer-1.jpg", "mixer-2.jpg"],
  },
  {
    id: "tractor-mt-285",
    name: "Mahindra Tractor 285 DI",
    category: "tractor",
    dailyRate: 4500,
    weeklyRate: 25000,
    monthlyRate: 80000,
    availability: "available",
    location: "Chitwan Branch",
    operator: "included",
    description: "Powerful tractor for construction and agricultural work",
    specifications: {
      engine: "Diesel",
      power: "28 HP",
      fuelCapacity: "35 liters",
      weight: "1.8 tons",
    },
    image: "🚛",
    rating: 4.5,
    reviews: 41,
    images: ["tractor-1.jpg", "tractor-2.jpg"],
  },
  {
    id: "generator-125kva",
    name: "Diesel Generator 125 KVA",
    category: "generator",
    dailyRate: 12000,
    weeklyRate: 65000,
    monthlyRate: 200000,
    availability: "available",
    location: "Kathmandu Depot",
    operator: "included",
    description: "Heavy-duty generator for construction sites and events",
    specifications: {
      power: "125 KVA",
      fuel: "Diesel",
      fuelConsumption: "25L/hour",
      noise: "75 dB",
    },
    image: "⚡",
    rating: 4.7,
    reviews: 18,
    images: ["generator-1.jpg", "generator-2.jpg"],
  },
];

const orders: any[] = [];
const machineryRentals: any[] = [];

// Get all materials
router.get("/materials", (req, res) => {
  const { category, search, minPrice, maxPrice } = req.query;
  
  let filteredMaterials = materials;
  
  if (category) {
    filteredMaterials = filteredMaterials.filter(material => material.category === category);
  }
  
  if (search) {
    filteredMaterials = filteredMaterials.filter(material =>
      material.name.toLowerCase().includes(search.toString().toLowerCase()) ||
      material.description.toLowerCase().includes(search.toString().toLowerCase())
    );
  }
  
  if (minPrice) {
    filteredMaterials = filteredMaterials.filter(material => material.price >= Number(minPrice));
  }
  
  if (maxPrice) {
    filteredMaterials = filteredMaterials.filter(material => material.price <= Number(maxPrice));
  }
  
  res.json({ materials: filteredMaterials });
});

// Get material by ID
router.get("/materials/:id", (req, res) => {
  const material = materials.find(m => m.id === req.params.id);
  if (!material) {
    return res.status(404).json({ error: "Material not found" });
  }
  res.json({ material });
});

// Get all machinery
router.get("/machinery", (req, res) => {
  const { category, availability, location } = req.query;
  
  let filteredMachinery = machinery;
  
  if (category) {
    filteredMachinery = filteredMachinery.filter(machine => machine.category === category);
  }
  
  if (availability) {
    filteredMachinery = filteredMachinery.filter(machine => machine.availability === availability);
  }
  
  if (location) {
    filteredMachinery = filteredMachinery.filter(machine => 
      machine.location.toLowerCase().includes(location.toString().toLowerCase())
    );
  }
  
  res.json({ machinery: filteredMachinery });
});

// Get machinery by ID
router.get("/machinery/:id", (req, res) => {
  const machine = machinery.find(m => m.id === req.params.id);
  if (!machine) {
    return res.status(404).json({ error: "Machinery not found" });
  }
  res.json({ machinery: machine });
});

// Place material order
router.post("/order", verifyToken, async (req, res) => {
  try {
    const validatedData = orderSchema.parse(req.body);
    
    // Validate stock availability
    for (const item of validatedData.items) {
      const material = materials.find(m => m.id === item.productId);
      if (!material) {
        return res.status(404).json({ error: `Material ${item.productId} not found` });
      }
      if (material.stock < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for ${material.name}. Available: ${material.stock} ${material.unit}` 
        });
      }
    }
    
    // Calculate total price
    let totalPrice = 0;
    const orderItems = [];
    
    for (const item of validatedData.items) {
      const material = materials.find(m => m.id === item.productId);
      const itemTotal = material!.price * item.quantity;
      totalPrice += itemTotal;
      
      orderItems.push({
        ...item,
        material: material,
        unitPrice: material!.price,
        total: itemTotal,
      });
    }
    
    // Create order
    const order = {
      id: Date.now().toString(),
      userId: req.user.userId,
      items: orderItems,
      totalPrice,
      deliveryAddress: validatedData.deliveryAddress,
      contactPerson: validatedData.contactPerson,
      contactPhone: validatedData.contactPhone,
      deliveryDate: validatedData.deliveryDate,
      paymentMethod: validatedData.paymentMethod,
      specialInstructions: validatedData.specialInstructions,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    orders.push(order);
    
    // Update stock levels
    for (const item of validatedData.items) {
      const material = materials.find(m => m.id === item.productId);
      if (material) {
        material.stock -= item.quantity;
      }
    }
    
    res.status(201).json({
      message: "Order placed successfully",
      order,
      paymentUrl: `/api/payment/initiate?orderId=${order.id}`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation error", details: error.errors });
    }
    res.status(500).json({ error: "Order placement failed" });
  }
});

// Rent machinery
router.post("/machinery/rent", verifyToken, async (req, res) => {
  try {
    const validatedData = machineryRentalSchema.parse(req.body);
    
    const machine = machinery.find(m => m.id === validatedData.machineryId);
    if (!machine) {
      return res.status(404).json({ error: "Machinery not found" });
    }
    
    if (machine.availability !== "available") {
      return res.status(400).json({ error: "Machinery is not available for rent" });
    }
    
    // Calculate rental period and price
    const startDate = new Date(validatedData.startDate);
    const endDate = new Date(validatedData.endDate);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (days <= 0) {
      return res.status(400).json({ error: "End date must be after start date" });
    }
    
    let totalPrice = 0;
    if (days <= 7) {
      totalPrice = machine.dailyRate * days;
    } else if (days <= 30) {
      totalPrice = machine.weeklyRate * Math.ceil(days / 7);
    } else {
      totalPrice = machine.monthlyRate * Math.ceil(days / 30);
    }
    
    // Add operator cost if required
    if (validatedData.operatorRequired && machine.operator === "not-included") {
      totalPrice += 2000 * days; // 2000 NPR per day for operator
    }
    
    // Create rental
    const rental = {
      id: Date.now().toString(),
      userId: req.user.userId,
      machineryId: validatedData.machineryId,
      machinery: machine,
      startDate: validatedData.startDate,
      endDate: validatedData.endDate,
      days,
      deliveryAddress: validatedData.deliveryAddress,
      contactPerson: validatedData.contactPerson,
      contactPhone: validatedData.contactPhone,
      operatorRequired: validatedData.operatorRequired || false,
      totalPrice,
      paymentMethod: validatedData.paymentMethod,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    machineryRentals.push(rental);
    
    // Update availability
    machine.availability = "rented";
    
    res.status(201).json({
      message: "Machinery rental created successfully",
      rental,
      paymentUrl: `/api/payment/initiate?rentalId=${rental.id}`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation error", details: error.errors });
    }
    res.status(500).json({ error: "Rental creation failed" });
  }
});

// Get user orders
router.get("/orders", verifyToken, (req, res) => {
  const userOrders = orders.filter(o => o.userId === req.user.userId);
  const userRentals = machineryRentals.filter(r => r.userId === req.user.userId);
  
  res.json({
    orders: userOrders,
    rentals: userRentals,
  });
});

// Get order by ID
router.get("/orders/:id", verifyToken, (req, res) => {
  const order = orders.find(o => o.id === req.params.id && o.userId === req.user.userId);
  const rental = machineryRentals.find(r => r.id === req.params.id && r.userId === req.user.userId);
  
  if (!order && !rental) {
    return res.status(404).json({ error: "Order not found" });
  }
  
  res.json({
    order: order || rental,
    type: order ? "material" : "rental",
  });
});

// Cancel order
router.post("/orders/:id/cancel", verifyToken, async (req, res) => {
  const order = orders.find(o => o.id === req.params.id && o.userId === req.user.userId);
  const rental = machineryRentals.find(r => r.id === req.params.id && r.userId === req.user.userId);
  
  if (!order && !rental) {
    return res.status(404).json({ error: "Order not found" });
  }
  
  const targetOrder = order || rental;
  
  if (targetOrder.status === "cancelled") {
    return res.status(400).json({ error: "Order is already cancelled" });
  }
  
  if (targetOrder.status === "completed" || targetOrder.status === "delivered") {
    return res.status(400).json({ error: "Cannot cancel completed order" });
  }
  
  // Update order status
  targetOrder.status = "cancelled";
  targetOrder.updatedAt = new Date();
  
  // Restore stock if it's a material order
  if (order) {
    for (const item of order.items) {
      const material = materials.find(m => m.id === item.productId);
      if (material) {
        material.stock += item.quantity;
      }
    }
  }
  
  // Restore machinery availability if it's a rental
  if (rental) {
    const machine = machinery.find(m => m.id === rental.machineryId);
    if (machine) {
      machine.availability = "available";
    }
  }
  
  res.json({
    message: "Order cancelled successfully",
    order: targetOrder,
  });
});

// Get categories
router.get("/categories", (req, res) => {
  const materialCategories = [...new Set(materials.map(m => m.category))];
  const machineryCategories = [...new Set(machinery.map(m => m.category))];
  
  res.json({
    materials: materialCategories,
    machinery: machineryCategories,
  });
});

// Get inventory status
router.get("/inventory", (req, res) => {
  const lowStockMaterials = materials.filter(m => m.stock <= m.minStock);
  const availableMachinery = machinery.filter(m => m.availability === "available");
  
  res.json({
    lowStockMaterials,
    availableMachinery,
    totalMaterials: materials.length,
    totalMachinery: machinery.length,
  });
});

export { router as constructionRoutes };
