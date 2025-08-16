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

// Realistic Nepalese data
const nepaleseNames = [
  "Rajesh Sharma", "Sunita Thapa", "Krishna Bahadur Rai", "Maya Devi Gurung",
  "Deepak Shrestha", "Kamala Magar", "Nirmal Paudel", "Sita Tamang",
  "Ramesh Adhikari", "Bindu Karki", "Suresh Pun", "Radha Limbu",
  "Prakash Chhetri", "Gita Khadka", "Dinesh Ghimire", "Laxmi Neupane",
  "Bikash Koirala", "Saraswoti Pokhrel", "Mahesh Regmi", "Devi Shrestha"
];

const nepaleseCities = [
  "Kathmandu", "Pokhara", "Lalitpur", "Biratnagar", "Birgunj", "Dharan",
  "Bharatpur", "Janakpur", "Hetauda", "Butwal", "Dhangadhi", "Mahendranagar",
  "Baglung", "Gorkha", "Lamjung", "Chitwan", "Nawalpur", "Dang", "Kailali"
];

const nepalRoutes = [
  { from: "Kathmandu", to: "Pokhara", distance: 200, duration: "6 hours" },
  { from: "Kathmandu", to: "Chitwan", distance: 146, duration: "4.5 hours" },
  { from: "Kathmandu", to: "Dharan", distance: 347, duration: "10 hours" },
  { from: "Kathmandu", to: "Birgunj", distance: 135, duration: "4 hours" },
  { from: "Pokhara", to: "Chitwan", distance: 150, duration: "4 hours" },
  { from: "Pokhara", to: "Butwal", distance: 120, duration: "3.5 hours" },
  { from: "Lamjung", to: "Kathmandu", distance: 180, duration: "5.5 hours" },
  { from: "Lamjung", to: "Pokhara", distance: 80, duration: "2.5 hours" },
  { from: "Chitwan", to: "Butwal", distance: 85, duration: "2.5 hours" },
  { from: "Biratnagar", to: "Dharan", distance: 50, duration: "1.5 hours" }
];

const constructionMaterials = [
  {
    name: "OPC 53 Grade Cement",
    brand: "Shree Cement",
    specifications: { grade: "53", type: "OPC", weight: "50kg" },
    price: 850,
    unit: "bag"
  },
  {
    name: "TMT Steel Bars Fe-500",
    brand: "Kamdhenu Steel", 
    specifications: { grade: "Fe-500", diameter: "12mm", length: "12m" },
    price: 85,
    unit: "kg"
  },
  {
    name: "Red Clay Bricks",
    brand: "Local Manufacturer",
    specifications: { size: "230x110x70mm", grade: "First Class" },
    price: 18,
    unit: "piece"
  },
  {
    name: "River Sand",
    brand: "Local Supplier",
    specifications: { type: "Fine Sand", grade: "Construction Grade" },
    price: 1200,
    unit: "cubic meter"
  },
  {
    name: "20mm Aggregate",
    brand: "Local Quarry",
    specifications: { size: "20mm", type: "Crushed Stone" },
    price: 1800,
    unit: "cubic meter"
  },
  {
    name: "Galvanized Iron Sheets",
    brand: "Tata Steel",
    specifications: { thickness: "0.5mm", coating: "Galvanized" },
    price: 950,
    unit: "sheet"
  }
];

const tourPackages = [
  {
    name: "Everest Base Camp Trek",
    duration: "14 days",
    difficulty: "challenging",
    destinations: ["Lukla", "Namche Bazaar", "Tengboche", "Dingboche", "EBC"],
    groupSize: { min: 2, max: 12 },
    price: 125000
  },
  {
    name: "Annapurna Circuit Trek", 
    duration: "16 days",
    difficulty: "moderate",
    destinations: ["Besisahar", "Manang", "Thorong La", "Muktinath", "Pokhara"],
    groupSize: { min: 2, max: 15 },
    price: 95000
  },
  {
    name: "Chitwan Safari Tour",
    duration: "3 days",
    difficulty: "easy",
    destinations: ["Chitwan National Park", "Sauraha", "Elephant Breeding Center"],
    groupSize: { min: 2, max: 20 },
    price: 15000
  },
  {
    name: "Langtang Valley Trek",
    duration: "10 days", 
    difficulty: "moderate",
    destinations: ["Syabrubesi", "Langtang Village", "Kyanjin Gompa"],
    groupSize: { min: 2, max: 12 },
    price: 75000
  }
];

const garageServices = [
  {
    name: "Complete Vehicle Service",
    serviceTypes: ["Engine Service", "Oil Change", "Filter Replacement", "Brake Check"],
    duration: "4-6 hours",
    price: 3500
  },
  {
    name: "Brake System Repair", 
    serviceTypes: ["Brake Pad Replacement", "Brake Fluid Change", "Brake Disc Service"],
    duration: "2-3 hours",
    price: 2500
  },
  {
    name: "Engine Diagnostics",
    serviceTypes: ["Computer Diagnostics", "Engine Tuning", "Performance Check"],
    duration: "1-2 hours", 
    price: 1500
  },
  {
    name: "Tire Services",
    serviceTypes: ["Tire Replacement", "Wheel Alignment", "Tire Balancing"],
    duration: "1-2 hours",
    price: 1200
  }
];

// Generate realistic admin user
const ADMIN_USER = {
  name: "Rajesh Kumar Shrestha",
  email: "admin@kanxasafari.com",
  phone: "+977-9851234567",
  password: "KanxaAdmin@2024!",
  role: "admin",
  isActive: true,
  isEmailVerified: true,
  profilePicture: "",
  address: {
    street: "New Baneshwor",
    city: "Kathmandu", 
    state: "Bagmati Province",
    country: "Nepal",
    zipCode: "44600"
  },
  dateOfBirth: "1985-05-15",
  preferences: {
    notifications: {
      email: true,
      sms: true,
      push: true,
    },
    language: "en",
    currency: "NPR",
  },
  bio: "Experienced transportation and logistics administrator with 10+ years in the industry.",
  company: "Kanxa Safari Pvt. Ltd."
};

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

async function seedUsers() {
  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash(ADMIN_USER.password, 12);
    const admin = new User({
      ...ADMIN_USER,
      password: hashedPassword,
    });
    await admin.save();
    console.log("👑 Admin user created successfully");

    // Create regular users
    const users = [];
    for (let i = 0; i < 50; i++) {
      const name = nepaleseNames[Math.floor(Math.random() * nepaleseNames.length)];
      const city = nepaleseCities[Math.floor(Math.random() * nepaleseCities.length)];
      const email = name.toLowerCase().replace(/\s+/g, '.') + Math.floor(Math.random() * 1000) + "@gmail.com";
      const phone = "+977-98" + Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
      
      const user = new User({
        name,
        email,
        phone,
        password: await bcrypt.hash("user123", 12),
        role: "user",
        isActive: true,
        isEmailVerified: Math.random() > 0.2,
        address: {
          city,
          state: getStateFromCity(city),
          country: "Nepal"
        },
        dateOfBirth: new Date(1980 + Math.floor(Math.random() * 30), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        preferences: {
          notifications: {
            email: Math.random() > 0.3,
            sms: Math.random() > 0.4,
            push: Math.random() > 0.5,
          },
          language: Math.random() > 0.8 ? "ne" : "en",
          currency: "NPR",
        },
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000))
      });
      users.push(user);
    }

    await User.insertMany(users);
    console.log(`👥 Created ${users.length} regular users`);
    return admin;
  } catch (error) {
    console.error("❌ Error creating users:", error);
  }
}

async function seedBusServices(adminId) {
  const busServices = [];
  
  for (const route of nepalRoutes) {
    // Create 2-3 different bus services per route
    const servicesPerRoute = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < servicesPerRoute; i++) {
      const busTypes = ["AC Deluxe", "Non-AC", "Tourist Bus", "VIP"];
      const operators = ["Nepal Yatayat", "Greenline Tours", "Buddha Air Bus", "Shree Airlines Bus", "Local Transport"];
      
      const busType = busTypes[Math.floor(Math.random() * busTypes.length)];
      const operator = operators[Math.floor(Math.random() * operators.length)];
      const basePrice = busType === "AC Deluxe" ? 800 + Math.floor(Math.random() * 400) :
                       busType === "VIP" ? 1000 + Math.floor(Math.random() * 500) :
                       busType === "Tourist Bus" ? 900 + Math.floor(Math.random() * 300) :
                       400 + Math.floor(Math.random() * 300);

      const service = new Service({
        name: `${route.from} to ${route.to} ${busType}`,
        description: `Comfortable ${busType} bus service from ${route.from} to ${route.to} with professional drivers and quality service.`,
        shortDescription: `${busType} bus service to ${route.to}`,
        type: "bus",
        category: "Transportation",
        images: ["/placeholder.svg"],
        features: busType === "AC Deluxe" ? ["AC", "WiFi", "Entertainment", "Charging Port", "Comfortable Seats"] :
                 busType === "VIP" ? ["AC", "WiFi", "Entertainment", "Reclining Seats", "Snacks", "Water"] :
                 busType === "Tourist Bus" ? ["AC", "Tour Guide", "Refreshments", "Sightseeing Stops"] :
                 ["Comfortable Seats", "Music System"],
        isActive: Math.random() > 0.1,
        isAvailable: Math.random() > 0.05,
        isFeatured: Math.random() > 0.7,
        
        busService: {
          route: {
            from: route.from,
            to: route.to,
            distance: route.distance,
            duration: route.duration,
            stops: generateStops(route.from, route.to)
          },
          schedule: [
            {
              departureTime: `0${6 + i}:00`,
              arrivalTime: calculateArrivalTime(`0${6 + i}:00`, route.duration),
              frequency: "daily",
              daysOfOperation: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
              isActive: true
            },
            {
              departureTime: `${14 + i}:00`,
              arrivalTime: calculateArrivalTime(`${14 + i}:00`, route.duration),
              frequency: "daily",
              daysOfOperation: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
              isActive: true
            }
          ],
          vehicle: {
            busNumber: generateBusNumber(route.from),
            busType: busType,
            totalSeats: busType === "VIP" ? 32 : busType === "Tourist Bus" ? 35 : 45,
            availableSeats: Math.floor(Math.random() * 20) + 10,
            amenities: busType === "AC Deluxe" ? ["AC", "WiFi", "Entertainment", "Charging Port"] :
                      busType === "VIP" ? ["AC", "WiFi", "Reclining Seats", "Snacks"] :
                      busType === "Tourist Bus" ? ["AC", "Tour Guide", "Refreshments"] :
                      ["Comfortable Seats"],
            manufacturer: "Tata Motors",
            model: "Ultra",
            year: 2020 + Math.floor(Math.random() * 4),
            plateNumber: generatePlateNumber(route.from)
          },
          operator: {
            name: operator,
            license: `LIC-${Math.floor(Math.random() * 10000)}`,
            contact: "+977-" + Math.floor(Math.random() * 10000000000).toString().padStart(10, '0'),
            email: operator.toLowerCase().replace(/\s+/g, '') + "@transport.com"
          }
        },
        
        pricing: {
          basePrice: basePrice,
          currency: "NPR",
          priceType: "fixed",
          taxes: {
            vat: 13,
            serviceTax: 0
          }
        },
        
        rating: {
          average: 3.5 + Math.random() * 1.5,
          count: Math.floor(Math.random() * 200) + 50,
          breakdown: generateRatingBreakdown()
        },
        
        booking: {
          advanceBookingDays: 7,
          cancellationPolicy: "Free cancellation up to 24 hours before departure",
          refundPolicy: "Full refund for cancellations made 24 hours in advance",
          requiresApproval: false
        },
        
        analytics: {
          views: Math.floor(Math.random() * 1000) + 100,
          bookings: Math.floor(Math.random() * 50) + 10,
          conversions: Math.floor(Math.random() * 30) + 5,
          revenue: basePrice * (Math.floor(Math.random() * 50) + 10)
        },
        
        createdBy: adminId,
        updatedBy: adminId,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 180 * 24 * 60 * 60 * 1000))
      });
      
      busServices.push(service);
    }
  }
  
  await Service.insertMany(busServices);
  console.log(`🚌 Created ${busServices.length} bus services`);
}

async function seedCargoServices(adminId) {
  const cargoServices = [];
  const vehicleTypes = ["Light Truck", "Medium Truck", "Heavy Truck", "Container Truck"];
  const routes = nepalRoutes.slice(0, 8); // Use subset of routes
  
  for (let i = 0; i < 25; i++) {
    const vehicleType = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
    const route = routes[Math.floor(Math.random() * routes.length)];
    
    const capacity = vehicleType === "Light Truck" ? { weight: 2000, volume: 15 } :
                    vehicleType === "Medium Truck" ? { weight: 5000, volume: 35 } :
                    vehicleType === "Heavy Truck" ? { weight: 10000, volume: 60 } :
                    { weight: 20000, volume: 100 };
    
    const basePrice = vehicleType === "Light Truck" ? 5000 :
                     vehicleType === "Medium Truck" ? 8000 :
                     vehicleType === "Heavy Truck" ? 15000 : 25000;
    
    const service = new Service({
      name: `${vehicleType} Cargo Service - ${route.from} to ${route.to}`,
      description: `Professional ${vehicleType.toLowerCase()} cargo transportation from ${route.from} to ${route.to} with GPS tracking and insurance coverage.`,
      shortDescription: `${vehicleType} cargo transport to ${route.to}`,
      type: "cargo",
      category: "Logistics",
      images: ["/placeholder.svg"],
      features: ["GPS Tracking", "Insurance Covered", "Professional Drivers", "Loading/Unloading", "24/7 Support"],
      isActive: Math.random() > 0.1,
      isAvailable: Math.random() > 0.05,
      isFeatured: Math.random() > 0.8,
      
      cargoService: {
        vehicleType: vehicleType,
        capacity: {
          weight: capacity.weight,
          volume: capacity.volume,
          dimensions: {
            length: vehicleType === "Light Truck" ? 400 : vehicleType === "Medium Truck" ? 600 : 800,
            width: vehicleType === "Light Truck" ? 200 : vehicleType === "Medium Truck" ? 240 : 250,
            height: vehicleType === "Light Truck" ? 200 : vehicleType === "Medium Truck" ? 250 : 300
          }
        },
        availableRoutes: [`${route.from} → ${route.to}`, `${route.to} → ${route.from}`],
        restrictions: ["No Hazardous Materials", "Weight Limit Enforced", "Documentation Required"],
        additionalServices: ["Loading/Unloading", "GPS Tracking", "Insurance Coverage", "Door-to-Door"]
      },
      
      pricing: {
        basePrice: basePrice + Math.floor(Math.random() * 5000),
        currency: "NPR",
        priceType: "per_km",
        taxes: {
          vat: 13,
          serviceTax: 0
        }
      },
      
      rating: {
        average: 3.8 + Math.random() * 1.2,
        count: Math.floor(Math.random() * 100) + 20,
        breakdown: generateRatingBreakdown()
      },
      
      booking: {
        advanceBookingDays: 2,
        cancellationPolicy: "Free cancellation up to 12 hours before pickup",
        refundPolicy: "Partial refund for cancellations made less than 12 hours",
        requiresApproval: true
      },
      
      analytics: {
        views: Math.floor(Math.random() * 500) + 50,
        bookings: Math.floor(Math.random() * 30) + 5,
        conversions: Math.floor(Math.random() * 20) + 3,
        revenue: basePrice * (Math.floor(Math.random() * 30) + 5)
      },
      
      createdBy: adminId,
      updatedBy: adminId,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 180 * 24 * 60 * 60 * 1000))
    });
    
    cargoServices.push(service);
  }
  
  await Service.insertMany(cargoServices);
  console.log(`🚛 Created ${cargoServices.length} cargo services`);
}

async function seedConstructionServices(adminId) {
  const constructionServices = [];
  const suppliers = [
    { name: "Shree Cement Pvt. Ltd.", rating: 4.8, address: "Birgunj, Nepal" },
    { name: "Kamdhenu Steel Nepal", rating: 4.6, address: "Kathmandu, Nepal" },
    { name: "Local Building Materials", rating: 4.2, address: "Pokhara, Nepal" },
    { name: "Nepal Construction Supplies", rating: 4.5, address: "Chitwan, Nepal" },
    { name: "Himalayan Materials Co.", rating: 4.7, address: "Biratnagar, Nepal" }
  ];
  
  for (const material of constructionMaterials) {
    const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
    
    const service = new Service({
      name: material.name,
      description: `High-quality ${material.name.toLowerCase()} from ${material.brand}. Perfect for construction projects with quality certifications and reliable supply.`,
      shortDescription: `Quality ${material.name.toLowerCase()} for construction`,
      type: "construction",
      category: "Construction",
      images: ["/placeholder.svg"],
      features: ["Quality Certified", "Reliable Supply", "Bulk Orders Available", "Quick Delivery"],
      isActive: Math.random() > 0.05,
      isAvailable: Math.random() > 0.1,
      isFeatured: Math.random() > 0.7,
      
      constructionService: {
        itemType: "material",
        specifications: material.specifications,
        availability: {
          inStock: Math.random() > 0.1,
          quantity: Math.floor(Math.random() * 1000) + 100,
          unit: material.unit,
          restockDate: Math.random() > 0.8 ? new Date(Date.now() + Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)) : undefined
        },
        supplier: {
          name: supplier.name,
          contact: "+977-" + Math.floor(Math.random() * 10000000000).toString().padStart(10, '0'),
          address: supplier.address,
          rating: supplier.rating
        },
        qualityCertifications: ["ISO 9001", "Nepal Bureau of Standards (NBS)", "Quality Assurance Certificate"]
      },
      
      pricing: {
        basePrice: material.price,
        currency: "NPR",
        priceType: "per_unit",
        taxes: {
          vat: 13,
          serviceTax: 0
        }
      },
      
      rating: {
        average: 4.0 + Math.random() * 1.0,
        count: Math.floor(Math.random() * 150) + 30,
        breakdown: generateRatingBreakdown()
      },
      
      booking: {
        advanceBookingDays: 1,
        cancellationPolicy: "Free cancellation up to 6 hours before delivery",
        refundPolicy: "Full refund for quality issues",
        requiresApproval: false
      },
      
      analytics: {
        views: Math.floor(Math.random() * 800) + 100,
        bookings: Math.floor(Math.random() * 60) + 20,
        conversions: Math.floor(Math.random() * 40) + 10,
        revenue: material.price * (Math.floor(Math.random() * 60) + 20)
      },
      
      createdBy: adminId,
      updatedBy: adminId,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 120 * 24 * 60 * 60 * 1000))
    });
    
    constructionServices.push(service);
  }
  
  await Service.insertMany(constructionServices);
  console.log(`🏗️ Created ${constructionServices.length} construction material services`);
}

async function seedTourServices(adminId) {
  const tourServices = [];
  
  for (const tour of tourPackages) {
    const service = new Service({
      name: tour.name,
      description: `Experience the ${tour.name.toLowerCase()} with professional guides, quality accommodation, and comprehensive packages. Difficulty level: ${tour.difficulty}.`,
      shortDescription: `${tour.duration} ${tour.difficulty} trek in Nepal`,
      type: "tour",
      category: "Tourism",
      images: ["/placeholder.svg"],
      features: ["Professional Guide", "Accommodation", "Meals", "Permits", "Transportation", "Safety Equipment"],
      isActive: Math.random() > 0.05,
      isAvailable: Math.random() > 0.1,
      isFeatured: Math.random() > 0.5,
      
      tourService: {
        destinations: tour.destinations,
        duration: tour.duration,
        groupSize: tour.groupSize,
        inclusions: ["Professional Guide", "Accommodation", "All Meals", "Permits", "Transportation", "Safety Equipment"],
        exclusions: ["International Flights", "Travel Insurance", "Personal Equipment", "Tips"],
        difficulty: tour.difficulty,
        bestSeason: ["Spring (Mar-May)", "Autumn (Sep-Nov)"],
        highlights: tour.destinations.slice(0, 3)
      },
      
      pricing: {
        basePrice: tour.price,
        currency: "NPR",
        priceType: "per_person",
        taxes: {
          vat: 13,
          serviceTax: 0
        }
      },
      
      rating: {
        average: 4.2 + Math.random() * 0.8,
        count: Math.floor(Math.random() * 80) + 15,
        breakdown: generateRatingBreakdown()
      },
      
      booking: {
        advanceBookingDays: 30,
        cancellationPolicy: "Free cancellation up to 15 days before departure",
        refundPolicy: "Partial refund based on cancellation timing",
        requiresApproval: true
      },
      
      analytics: {
        views: Math.floor(Math.random() * 600) + 150,
        bookings: Math.floor(Math.random() * 25) + 5,
        conversions: Math.floor(Math.random() * 15) + 3,
        revenue: tour.price * (Math.floor(Math.random() * 25) + 5)
      },
      
      createdBy: adminId,
      updatedBy: adminId,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000))
    });
    
    tourServices.push(service);
  }
  
  await Service.insertMany(tourServices);
  console.log(`🏔️ Created ${tourServices.length} tour services`);
}

async function seedGarageServices(adminId) {
  const garageServicesData = [];
  
  for (const garage of garageServices) {
    const service = new Service({
      name: garage.name,
      description: `Professional ${garage.name.toLowerCase()} with experienced mechanics and quality parts. We provide comprehensive vehicle maintenance and repair services.`,
      shortDescription: `Professional ${garage.name.toLowerCase()}`,
      type: "garage",
      category: "Automotive",
      images: ["/placeholder.svg"],
      features: ["Professional Mechanics", "Quality Parts", "Warranty", "Quick Service", "Diagnostic Equipment"],
      isActive: Math.random() > 0.05,
      isAvailable: Math.random() > 0.1,
      isFeatured: Math.random() > 0.8,
      
      garageService: {
        serviceTypes: garage.serviceTypes,
        vehicleTypes: ["Car", "SUV", "Motorcycle", "Van", "Truck"],
        estimatedDuration: garage.duration,
        warranty: {
          period: "3 months or 5000 km",
          coverage: garage.serviceTypes
        },
        mechanics: [
          {
            name: "Ram Bahadur Thapa",
            experience: 8,
            specialization: ["Engine", "Brake System"],
            certification: ["ASE Certified", "Manufacturer Training"]
          },
          {
            name: "Krishna Gurung",
            experience: 12,
            specialization: ["Electrical", "Diagnostics"],
            certification: ["Advanced Diagnostics", "Electrical Systems"]
          }
        ],
        equipment: ["Computer Diagnostics", "Hydraulic Lift", "Brake Tester", "Wheel Alignment"]
      },
      
      pricing: {
        basePrice: garage.price,
        currency: "NPR",
        priceType: "fixed",
        taxes: {
          vat: 13,
          serviceTax: 0
        }
      },
      
      rating: {
        average: 4.1 + Math.random() * 0.9,
        count: Math.floor(Math.random() * 120) + 25,
        breakdown: generateRatingBreakdown()
      },
      
      booking: {
        advanceBookingDays: 3,
        cancellationPolicy: "Free cancellation up to 4 hours before appointment",
        refundPolicy: "Full refund for service issues",
        requiresApproval: false
      },
      
      analytics: {
        views: Math.floor(Math.random() * 400) + 80,
        bookings: Math.floor(Math.random() * 40) + 15,
        conversions: Math.floor(Math.random() * 25) + 8,
        revenue: garage.price * (Math.floor(Math.random() * 40) + 15)
      },
      
      createdBy: adminId,
      updatedBy: adminId,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 60 * 24 * 60 * 60 * 1000))
    });
    
    garageServicesData.push(service);
  }
  
  await Service.insertMany(garageServicesData);
  console.log(`🔧 Created ${garageServicesData.length} garage services`);
}

// Helper functions
function getStateFromCity(city) {
  const stateMap = {
    "Kathmandu": "Bagmati Province",
    "Pokhara": "Gandaki Province", 
    "Lalitpur": "Bagmati Province",
    "Biratnagar": "Province No. 1",
    "Birgunj": "Madhesh Province",
    "Dharan": "Province No. 1",
    "Bharatpur": "Bagmati Province",
    "Janakpur": "Madhesh Province",
    "Hetauda": "Bagmati Province",
    "Butwal": "Lumbini Province",
    "Dhangadhi": "Sudurpashchim Province",
    "Lamjung": "Gandaki Province",
    "Chitwan": "Bagmati Province"
  };
  return stateMap[city] || "Bagmati Province";
}

function generateStops(from, to) {
  const stopMap = {
    "Kathmandu-Pokhara": ["Thankot", "Naubise", "Kurintar", "Muglin"],
    "Kathmandu-Chitwan": ["Thankot", "Naubise", "Hetauda"],
    "Pokhara-Chitwan": ["Damauli", "Dumre", "Muglin"],
    "Lamjung-Kathmandu": ["Besisahar", "Dumre", "Muglin", "Kurintar"],
    "Lamjung-Pokhara": ["Besisahar", "Khudi"]
  };
  return stopMap[`${from}-${to}`] || [];
}

function calculateArrivalTime(departureTime, duration) {
  const [hours, minutes] = departureTime.split(':').map(Number);
  const durationHours = parseFloat(duration.replace(' hours', ''));
  const arrivalHours = hours + Math.floor(durationHours);
  const arrivalMinutes = minutes + ((durationHours % 1) * 60);
  return `${arrivalHours.toString().padStart(2, '0')}:${Math.floor(arrivalMinutes).toString().padStart(2, '0')}`;
}

function generateBusNumber(city) {
  const prefixes = {
    "Kathmandu": "KA",
    "Pokhara": "PK", 
    "Lamjung": "LJ",
    "Chitwan": "CT",
    "Biratnagar": "BR"
  };
  const prefix = prefixes[city] || "NP";
  return `${prefix}-${Math.floor(Math.random() * 9000) + 1000}`;
}

function generatePlateNumber(city) {
  const prefixes = {
    "Kathmandu": "BA",
    "Pokhara": "GA",
    "Lamjung": "GA", 
    "Chitwan": "BA",
    "Biratnagar": "PR"
  };
  const prefix = prefixes[city] || "BA";
  return `${prefix} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 900) + 100}`;
}

function generateRatingBreakdown() {
  const total = Math.floor(Math.random() * 200) + 50;
  return {
    5: Math.floor(total * 0.4),
    4: Math.floor(total * 0.3), 
    3: Math.floor(total * 0.2),
    2: Math.floor(total * 0.07),
    1: Math.floor(total * 0.03)
  };
}

async function seedDatabase() {
  console.log("🌱 Starting advanced database seeding with realistic Nepalese data...");

  await connectDB();
  await clearExistingData();
  
  const admin = await seedUsers();
  await seedBusServices(admin._id);
  await seedCargoServices(admin._id);
  await seedConstructionServices(admin._id);
  await seedTourServices(admin._id);
  await seedGarageServices(admin._id);

  console.log("✅ Advanced database seeding completed successfully!");
  console.log("\n📋 Summary:");
  console.log("   - 1 Admin user + 50 regular users created");
  console.log("   - Comprehensive bus services with realistic routes");
  console.log("   - Professional cargo transportation services");
  console.log("   - Construction materials with proper specifications");
  console.log("   - Adventure tour packages");
  console.log("   - Automotive garage services");
  console.log("\n🔐 Admin Login Credentials:");
  console.log(`   Email: ${ADMIN_USER.email}`);
  console.log(`   Password: ${ADMIN_USER.password}`);
  console.log("\n🚀 Your Kanxa Safari platform is ready for production!");

  process.exit(0);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().catch(console.error);
}

export default seedDatabase;
