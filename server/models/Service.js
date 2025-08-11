const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['bus', 'cargo', 'construction', 'garage'],
    required: true,
  },
  
  // Bus service details
  busService: {
    route: {
      from: String,
      to: String,
    },
    schedule: [{
      departureTime: String,
      arrivalTime: String,
      duration: String,
      daysOfOperation: [String], // ['Monday', 'Tuesday', etc.]
    }],
    busDetails: {
      busNumber: String,
      busType: String, // 'Standard', 'Deluxe AC', etc.
      totalSeats: Number,
      amenities: [String],
      operator: String,
    },
    pricing: {
      basePrice: Number,
      currency: {
        type: String,
        default: 'NPR',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  
  // Cargo service details
  cargoService: {
    vehicleType: String, // 'Heavy Truck', 'Medium Truck', etc.
    capacity: {
      weight: Number, // in tons
      volume: Number, // in cubic meters
    },
    availableRoutes: [String],
    pricing: {
      basePrice: Number,
      pricePerKm: Number,
      currency: {
        type: String,
        default: 'NPR',
      },
    },
    features: [String],
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  
  // Construction materials/services
  constructionService: {
    category: String, // 'materials', 'machinery'
    itemName: String,
    description: String,
    specifications: mongoose.Schema.Types.Mixed,
    pricing: {
      price: Number,
      unit: String, // 'per bag', 'per kg', 'per day', etc.
      currency: {
        type: String,
        default: 'NPR',
      },
    },
    availability: {
      inStock: Boolean,
      quantity: Number,
      restockDate: Date,
    },
    supplier: String,
  },
  
  // Garage services
  garageService: {
    serviceType: String, // 'maintenance', 'repair', 'inspection'
    vehicleTypes: [String], // ['car', 'truck', 'tractor', etc.]
    description: String,
    estimatedDuration: String,
    pricing: {
      basePrice: Number,
      hourlyRate: Number,
      currency: {
        type: String,
        default: 'NPR',
      },
    },
    availability: {
      workingDays: [String],
      workingHours: {
        start: String,
        end: String,
      },
    },
  },
  
  images: [String],
  rating: {
    average: {
      type: Number,
      default: 0,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes for efficient queries
serviceSchema.index({ type: 1, isActive: 1 });
serviceSchema.index({ 'busService.route.from': 1, 'busService.route.to': 1 });
serviceSchema.index({ 'cargoService.vehicleType': 1 });
serviceSchema.index({ 'constructionService.category': 1 });

module.exports = mongoose.model('Service', serviceSchema);
