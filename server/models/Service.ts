import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  name: string;
  type: 'bus' | 'cargo' | 'construction' | 'garage' | 'tour';
  category: string;
  description: string;
  shortDescription: string;
  images: string[];
  features: string[];
  isActive: boolean;
  isAvailable: boolean;
  isFeatured: boolean;
  
  // Bus Service Specific
  busService?: {
    route: {
      from: string;
      to: string;
      stops?: string[];
      distance: number;
      duration: string;
    };
    schedule: Array<{
      departureTime: string;
      arrivalTime: string;
      frequency: string;
      daysOfOperation: string[];
      isActive: boolean;
    }>;
    vehicle: {
      busNumber: string;
      busType: string;
      totalSeats: number;
      availableSeats: number;
      amenities: string[];
      manufacturer?: string;
      model?: string;
      year?: number;
      plateNumber?: string;
    };
    operator: {
      name: string;
      license: string;
      contact: string;
      email: string;
    };
  };
  
  // Cargo Service Specific
  cargoService?: {
    vehicleType: string;
    capacity: {
      weight: number;
      volume: number;
      dimensions: {
        length: number;
        width: number;
        height: number;
      };
    };
    availableRoutes: string[];
    restrictions: string[];
    additionalServices: string[];
  };
  
  // Construction Service Specific
  constructionService?: {
    itemType: 'material' | 'machinery' | 'tool';
    specifications: any;
    availability: {
      inStock: boolean;
      quantity: number;
      unit: string;
      restockDate?: Date;
    };
    supplier: {
      name: string;
      contact: string;
      address: string;
      rating: number;
    };
    qualityCertifications: string[];
  };
  
  // Garage Service Specific
  garageService?: {
    serviceTypes: string[];
    vehicleTypes: string[];
    estimatedDuration: string;
    warranty: {
      period: string;
      coverage: string[];
    };
    mechanics: Array<{
      name: string;
      experience: number;
      specialization: string[];
      certification: string[];
    }>;
    equipment: string[];
  };
  
  // Tour Service Specific
  tourService?: {
    destinations: string[];
    duration: string;
    groupSize: {
      min: number;
      max: number;
    };
    inclusions: string[];
    exclusions: string[];
    difficulty: 'easy' | 'moderate' | 'challenging';
    bestSeason: string[];
    highlights: string[];
  };
  
  // Pricing
  pricing: {
    basePrice: number;
    currency: string;
    priceType: 'fixed' | 'per_km' | 'per_hour' | 'per_day' | 'per_unit';
    discounts?: Array<{
      type: string;
      value: number;
      validFrom: Date;
      validTo: Date;
      conditions?: string;
    }>;
    taxes?: {
      vat: number;
      serviceTax: number;
      others?: Array<{
        name: string;
        rate: number;
      }>;
    };
  };
  
  // Reviews and Ratings
  rating: {
    average: number;
    count: number;
    breakdown: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };
  
  // Booking Information
  booking: {
    advanceBookingDays: number;
    cancellationPolicy: string;
    refundPolicy: string;
    requiresApproval: boolean;
  };
  
  // SEO and Marketing
  seo: {
    slug: string;
    metaTitle?: string;
    metaDescription?: string;
    keywords: string[];
  };
  
  // Analytics
  analytics: {
    views: number;
    bookings: number;
    conversions: number;
    revenue: number;
  };
  
  // Audit fields
  createdBy: mongoose.Schema.Types.ObjectId;
  updatedBy: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
    maxlength: [200, 'Service name cannot exceed 200 characters'],
  },
  type: {
    type: String,
    enum: ['bus', 'cargo', 'construction', 'garage', 'tour'],
    required: [true, 'Service type is required'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    maxlength: [300, 'Short description cannot exceed 300 characters'],
  },
  images: [String],
  features: [String],
  isActive: { type: Boolean, default: true },
  isAvailable: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  
  // Service-specific schemas
  busService: {
    route: {
      from: { type: String, required: function() { return this.type === 'bus'; } },
      to: { type: String, required: function() { return this.type === 'bus'; } },
      stops: [String],
      distance: Number,
      duration: String,
    },
    schedule: [{
      departureTime: String,
      arrivalTime: String,
      frequency: String,
      daysOfOperation: [String],
      isActive: { type: Boolean, default: true },
    }],
    vehicle: {
      busNumber: String,
      busType: String,
      totalSeats: Number,
      availableSeats: Number,
      amenities: [String],
      manufacturer: String,
      model: String,
      year: Number,
      plateNumber: String,
    },
    operator: {
      name: String,
      license: String,
      contact: String,
      email: String,
    },
  },
  
  cargoService: {
    vehicleType: String,
    capacity: {
      weight: Number,
      volume: Number,
      dimensions: {
        length: Number,
        width: Number,
        height: Number,
      },
    },
    availableRoutes: [String],
    restrictions: [String],
    additionalServices: [String],
  },
  
  constructionService: {
    itemType: {
      type: String,
      enum: ['material', 'machinery', 'tool'],
    },
    specifications: Schema.Types.Mixed,
    availability: {
      inStock: Boolean,
      quantity: Number,
      unit: String,
      restockDate: Date,
    },
    supplier: {
      name: String,
      contact: String,
      address: String,
      rating: { type: Number, min: 1, max: 5 },
    },
    qualityCertifications: [String],
  },
  
  garageService: {
    serviceTypes: [String],
    vehicleTypes: [String],
    estimatedDuration: String,
    warranty: {
      period: String,
      coverage: [String],
    },
    mechanics: [{
      name: String,
      experience: Number,
      specialization: [String],
      certification: [String],
    }],
    equipment: [String],
  },
  
  tourService: {
    destinations: [String],
    duration: String,
    groupSize: {
      min: Number,
      max: Number,
    },
    inclusions: [String],
    exclusions: [String],
    difficulty: {
      type: String,
      enum: ['easy', 'moderate', 'challenging'],
    },
    bestSeason: [String],
    highlights: [String],
  },
  
  pricing: {
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: [0, 'Price cannot be negative'],
    },
    currency: { type: String, default: 'NPR' },
    priceType: {
      type: String,
      enum: ['fixed', 'per_km', 'per_hour', 'per_day', 'per_unit'],
      default: 'fixed',
    },
    discounts: [{
      type: String,
      value: Number,
      validFrom: Date,
      validTo: Date,
      conditions: String,
    }],
    taxes: {
      vat: { type: Number, default: 13 },
      serviceTax: { type: Number, default: 0 },
      others: [{
        name: String,
        rate: Number,
      }],
    },
  },
  
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 },
    breakdown: {
      5: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      1: { type: Number, default: 0 },
    },
  },
  
  booking: {
    advanceBookingDays: { type: Number, default: 0 },
    cancellationPolicy: { type: String, default: 'Free cancellation up to 24 hours before service' },
    refundPolicy: { type: String, default: 'Full refund for cancellations made 24 hours in advance' },
    requiresApproval: { type: Boolean, default: false },
  },
  
  seo: {
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
  },
  
  analytics: {
    views: { type: Number, default: 0 },
    bookings: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
  },
  
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Indexes for better performance
serviceSchema.index({ type: 1, isActive: 1 });
serviceSchema.index({ 'seo.slug': 1 });
serviceSchema.index({ isFeatured: 1, isActive: 1 });
serviceSchema.index({ 'pricing.basePrice': 1 });
serviceSchema.index({ 'rating.average': -1 });
serviceSchema.index({ 'busService.route.from': 1, 'busService.route.to': 1 });
serviceSchema.index({ createdAt: -1 });

// Generate slug before saving
serviceSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.seo?.slug) {
    this.seo = this.seo || {};
    this.seo.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

export default mongoose.model<IService>('Service', serviceSchema);
