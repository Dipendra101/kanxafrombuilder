import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../../.env") });

// Import models
import User from "../models/User.js";
import Service from "../models/Service.js";
import Booking from "../models/Booking.js";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/kanxasafari";

// Admin user to create
const ADMIN_USER = {
  name: "System Administrator",
  email: "admin@kanxasafari.com",
  phone: "+977-9800000000",
  password: "admin@2024!",
  role: "admin",
  isActive: true,
  isEmailVerified: true,
  profilePicture: "",
  address: "Lamjung, Nepal",
  dateOfBirth: "1990-01-01",
  preferences: {
    notifications: {
      email: true,
      sms: true,
      push: true,
    },
    language: "en",
    currency: "NPR",
  },
};

// Sample services to seed
const SERVICES = [
  // Bus Services
  {
    name: "Kathmandu Express",
    description:
      "Premium bus service from Lamjung to Kathmandu with AC and entertainment",
    type: "bus",
    category: "Transportation",
    images: ["/images/bus-kathmandu.jpg"],
    pricing: {
      basePrice: 800,
      currency: "NPR",
      taxes: {
        vat: 13,
        serviceTax: 0,
      },
    },
    busService: {
      route: {
        from: "Lamjung",
        to: "Kathmandu",
        distance: 180,
        duration: "6 hours",
      },
      schedule: [
        { departureTime: "06:00", arrivalTime: "12:00" },
        { departureTime: "14:00", arrivalTime: "20:00" },
      ],
      vehicle: {
        busType: "Deluxe AC",
        totalSeats: 45,
        amenities: [
          "AC",
          "WiFi",
          "Entertainment",
          "Charging Port",
          "Reclining Seats",
        ],
      },
    },
    rating: {
      average: 4.5,
      count: 150,
    },
    isActive: true,
    isFeatured: true,
  },
  {
    name: "Pokhara Express",
    description: "Comfortable bus service from Lamjung to Pokhara",
    type: "bus",
    category: "Transportation",
    images: ["/images/bus-pokhara.jpg"],
    pricing: {
      basePrice: 500,
      currency: "NPR",
      taxes: {
        vat: 13,
        serviceTax: 0,
      },
    },
    busService: {
      route: {
        from: "Lamjung",
        to: "Pokhara",
        distance: 85,
        duration: "2.5 hours",
      },
      schedule: [
        { departureTime: "08:30", arrivalTime: "11:00" },
        { departureTime: "16:30", arrivalTime: "19:00" },
      ],
      vehicle: {
        busType: "Standard",
        totalSeats: 35,
        amenities: ["Comfortable Seats", "Music System"],
      },
    },
    rating: {
      average: 4.2,
      count: 89,
    },
    isActive: true,
    isFeatured: false,
  },
  // Cargo Services
  {
    name: "Heavy Cargo Transport",
    description: "Professional heavy cargo transportation with GPS tracking",
    type: "cargo",
    category: "Transportation",
    images: ["/images/cargo-heavy.jpg"],
    pricing: {
      basePrice: 15000,
      currency: "NPR",
      pricePerKm: 25,
    },
    cargoService: {
      capacity: "10 tons",
      vehicleType: "Heavy Truck",
      routes: ["Lamjung → Kathmandu", "Kathmandu → Lamjung"],
      features: [
        "GPS Tracking",
        "Insurance Covered",
        "24/7 Support",
        "Loading/Unloading",
      ],
    },
    rating: {
      average: 4.7,
      count: 45,
    },
    isActive: true,
    isFeatured: true,
  },
  {
    name: "Medium Cargo Service",
    description: "Reliable medium cargo transport for regular deliveries",
    type: "cargo",
    category: "Transportation",
    images: ["/images/cargo-medium.jpg"],
    pricing: {
      basePrice: 8000,
      currency: "NPR",
      pricePerKm: 18,
    },
    cargoService: {
      capacity: "5 tons",
      vehicleType: "Medium Truck",
      routes: ["Lamjung → Pokhara", "Pokhara → Lamjung"],
      features: ["GPS Tracking", "Insurance Covered", "Flexible Timing"],
    },
    rating: {
      average: 4.3,
      count: 67,
    },
    isActive: true,
    isFeatured: false,
  },
  // Construction Materials
  {
    name: "Premium Cement Supply",
    description: "High-quality OPC 53 Grade Cement for construction projects",
    type: "material",
    category: "Construction",
    images: ["/images/cement.jpg"],
    pricing: {
      basePrice: 850,
      currency: "NPR",
      unit: "50kg bag",
    },
    materialService: {
      materialType: "Cement",
      grade: "OPC 53",
      brand: "Shree Cement",
      specifications: {
        weight: "50kg",
        grade: "53",
        type: "OPC",
      },
      stockQuantity: 500,
      minimumOrder: 10,
    },
    rating: {
      average: 4.8,
      count: 234,
    },
    isActive: true,
    isFeatured: true,
  },
  {
    name: "TMT Steel Rebar",
    description: "High-strength TMT bars for reinforcement work",
    type: "material",
    category: "Construction",
    images: ["/images/steel-rebar.jpg"],
    pricing: {
      basePrice: 85,
      currency: "NPR",
      unit: "per kg",
    },
    materialService: {
      materialType: "Steel",
      grade: "Fe-500",
      brand: "Kamdhenu Steel",
      specifications: {
        diameter: "12mm",
        grade: "Fe-500",
        length: "12m",
      },
      stockQuantity: 2000,
      minimumOrder: 100,
    },
    rating: {
      average: 4.9,
      count: 156,
    },
    isActive: true,
    isFeatured: true,
  },
  // Tour Services
  {
    name: "Everest Base Camp Tour",
    description:
      "Professional guided tour to Everest Base Camp with accommodation",
    type: "tour",
    category: "Tourism",
    images: ["/images/everest-tour.jpg"],
    pricing: {
      basePrice: 125000,
      currency: "NPR",
      duration: "14 days",
    },
    tourService: {
      duration: "14 days",
      difficulty: "Moderate to Challenging",
      maxGroupSize: 12,
      includedServices: [
        "Professional Guide",
        "Accommodation",
        "Meals",
        "Permits",
        "Transportation",
        "Equipment",
      ],
      itinerary: [
        {
          day: 1,
          location: "Kathmandu",
          activities: ["Arrival", "Preparation"],
        },
        {
          day: 2,
          location: "Lukla",
          activities: ["Flight to Lukla", "Trek to Phakding"],
        },
        // Add more days as needed
      ],
    },
    rating: {
      average: 4.9,
      count: 23,
    },
    isActive: true,
    isFeatured: true,
  },
  // Garage Services
  {
    name: "Complete Vehicle Service",
    description: "Comprehensive vehicle maintenance and repair service",
    type: "garage",
    category: "Automotive",
    images: ["/images/garage-service.jpg"],
    pricing: {
      basePrice: 3500,
      currency: "NPR",
    },
    garageService: {
      serviceType: "Complete Service",
      duration: "4-6 hours",
      includedServices: [
        "Engine Oil Change",
        "Filter Replacement",
        "Brake Inspection",
        "Battery Check",
        "Tire Inspection",
        "General Diagnostics",
      ],
      warranty: "3 months or 5000 km",
    },
    rating: {
      average: 4.6,
      count: 89,
    },
    isActive: true,
    isFeatured: false,
  },
];

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

async function clearExistingData() {
  try {
    await User.deleteMany({});
    await Service.deleteMany({});
    await Booking.deleteMany({});
    console.log("🗑️  Cleared existing data");
  } catch (error) {
    console.error("❌ Error clearing data:", error);
  }
}

async function seedAdmin() {
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(ADMIN_USER.password, 12);

    const admin = new User({
      ...ADMIN_USER,
      password: hashedPassword,
    });

    await admin.save();
    console.log("👑 Admin user created successfully");
    console.log(`   Email: ${ADMIN_USER.email}`);
    console.log(`   Password: ${ADMIN_USER.password}`);
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
  }
}

async function seedServices() {
  try {
    for (const serviceData of SERVICES) {
      const service = new Service(serviceData);
      await service.save();
    }
    console.log(`🛍️  Created ${SERVICES.length} services`);
  } catch (error) {
    console.error("❌ Error creating services:", error);
  }
}

async function seedDatabase() {
  console.log("🌱 Starting database seeding...");

  await connectDB();
  await clearExistingData();
  await seedAdmin();
  await seedServices();

  console.log("✅ Database seeding completed successfully!");
  console.log("\n📋 Summary:");
  console.log("   - Admin user created");
  console.log("   - All services seeded");
  console.log("\n🔐 Admin Login Credentials:");
  console.log(`   Email: ${ADMIN_USER.email}`);
  console.log(`   Password: ${ADMIN_USER.password}`);
  console.log("\n🚀 Your website is now ready for production!");

  process.exit(0);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().catch(console.error);
}

export default seedDatabase;
