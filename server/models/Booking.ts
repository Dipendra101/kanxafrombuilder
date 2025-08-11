import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  bookingNumber: string;
  user: mongoose.Schema.Types.ObjectId;
  service: mongoose.Schema.Types.ObjectId;
  type: 'bus' | 'cargo' | 'construction' | 'garage' | 'tour';
  
  // Service-specific details
  serviceDetails: {
    // Bus booking details
    busDetails?: {
      route: {
        from: string;
        to: string;
      };
      schedule: {
        departureTime: string;
        arrivalTime: string;
        date: Date;
      };
      passengers: Array<{
        name: string;
        age: number;
        gender: 'male' | 'female' | 'other';
        seatNumber?: string;
        nationality?: string;
        idType?: string;
        idNumber?: string;
      }>;
      totalSeats: number;
      boardingPoint?: string;
      droppingPoint?: string;
    };
    
    // Cargo booking details
    cargoDetails?: {
      pickupLocation: {
        address: string;
        city: string;
        state: string;
        zipCode: string;
        coordinates?: {
          lat: number;
          lng: number;
        };
      };
      deliveryLocation: {
        address: string;
        city: string;
        state: string;
        zipCode: string;
        coordinates?: {
          lat: number;
          lng: number;
        };
      };
      cargo: {
        type: string;
        weight: number;
        dimensions: {
          length: number;
          width: number;
          height: number;
        };
        description: string;
        value?: number;
        isFragile: boolean;
        isHazardous: boolean;
        specialInstructions?: string;
      };
      preferredDate: Date;
      urgency: 'standard' | 'express' | 'urgent';
    };
    
    // Construction booking details
    constructionDetails?: {
      items: Array<{
        name: string;
        quantity: number;
        unit: string;
        specifications?: any;
        unitPrice: number;
        totalPrice: number;
      }>;
      deliveryAddress: {
        address: string;
        city: string;
        state: string;
        zipCode: string;
        landmark?: string;
      };
      preferredDeliveryDate: Date;
      projectDetails?: {
        type: string;
        description: string;
        timeline: string;
      };
    };
    
    // Garage booking details
    garageDetails?: {
      vehicle: {
        type: string;
        make: string;
        model: string;
        year: number;
        plateNumber: string;
        mileage?: number;
      };
      services: Array<{
        type: string;
        description: string;
        estimatedDuration: string;
        priority: 'low' | 'medium' | 'high';
      }>;
      preferredDate: Date;
      preferredTime: string;
      issues: string;
      urgency: 'routine' | 'urgent' | 'emergency';
    };
    
    // Tour booking details
    tourDetails?: {
      destinations: string[];
      startDate: Date;
      endDate: Date;
      participants: Array<{
        name: string;
        age: number;
        gender: 'male' | 'female' | 'other';
        nationality: string;
        specialRequirements?: string;
      }>;
      accommodationPreference: 'budget' | 'standard' | 'luxury';
      additionalServices: string[];
      specialRequests?: string;
    };
  };
  
  // Contact information
  contactInfo: {
    name: string;
    phone: string;
    email: string;
    alternatePhone?: string;
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
  
  // Pricing breakdown
  pricing: {
    baseAmount: number;
    taxes: {
      vat: number;
      serviceTax: number;
      others: Array<{
        name: string;
        amount: number;
      }>;
    };
    discounts: Array<{
      type: string;
      amount: number;
      reason: string;
    }>;
    totalAmount: number;
    currency: string;
  };
  
  // Payment information
  payment: {
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'partially_refunded';
    method?: 'cash' | 'khalti' | 'esewa' | 'bank_transfer' | 'card';
    transactions: Array<{
      id: string;
      amount: number;
      status: 'pending' | 'completed' | 'failed';
      method: string;
      gatewayResponse?: any;
      timestamp: Date;
      refundId?: string;
    }>;
    dueAmount: number;
    paidAmount: number;
    refundAmount: number;
  };
  
  // Booking status tracking
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'refunded';
  statusHistory: Array<{
    status: string;
    timestamp: Date;
    updatedBy: mongoose.Schema.Types.ObjectId;
    notes?: string;
  }>;
  
  // Scheduling
  schedule: {
    createdAt: Date;
    confirmedAt?: Date;
    startDate?: Date;
    endDate?: Date;
    completedAt?: Date;
    cancelledAt?: Date;
  };
  
  // Additional information
  notes?: string;
  internalNotes?: string;
  specialRequirements?: string[];
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
    uploadedAt: Date;
  }>;
  
  // Reviews and feedback
  review?: {
    rating: number;
    comment: string;
    isPublic: boolean;
    submittedAt: Date;
  };
  
  // Tracking and logistics
  tracking?: {
    currentStatus: string;
    location?: {
      lat: number;
      lng: number;
      address: string;
    };
    estimatedArrival?: Date;
    updates: Array<{
      timestamp: Date;
      status: string;
      description: string;
      location?: string;
    }>;
  };
  
  // Assignment
  assignedTo?: mongoose.Schema.Types.ObjectId;
  assignedAt?: Date;
  
  // Cancellation
  cancellation?: {
    reason: string;
    requestedBy: mongoose.Schema.Types.ObjectId;
    requestedAt: Date;
    approvedBy?: mongoose.Schema.Types.ObjectId;
    approvedAt?: Date;
    refundAmount: number;
    refundStatus: 'pending' | 'processed' | 'failed';
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>({
  bookingNumber: {
    type: String,
    unique: true,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
  },
  service: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'Service is required'],
  },
  type: {
    type: String,
    enum: ['bus', 'cargo', 'construction', 'garage', 'tour'],
    required: [true, 'Booking type is required'],
  },
  
  serviceDetails: {
    busDetails: {
      route: {
        from: String,
        to: String,
      },
      schedule: {
        departureTime: String,
        arrivalTime: String,
        date: Date,
      },
      passengers: [{
        name: { type: String, required: true },
        age: { type: Number, required: true },
        gender: { type: String, enum: ['male', 'female', 'other'], required: true },
        seatNumber: String,
        nationality: { type: String, default: 'Nepali' },
        idType: String,
        idNumber: String,
      }],
      totalSeats: Number,
      boardingPoint: String,
      droppingPoint: String,
    },
    
    cargoDetails: {
      pickupLocation: {
        address: String,
        city: String,
        state: String,
        zipCode: String,
        coordinates: {
          lat: Number,
          lng: Number,
        },
      },
      deliveryLocation: {
        address: String,
        city: String,
        state: String,
        zipCode: String,
        coordinates: {
          lat: Number,
          lng: Number,
        },
      },
      cargo: {
        type: String,
        weight: Number,
        dimensions: {
          length: Number,
          width: Number,
          height: Number,
        },
        description: String,
        value: Number,
        isFragile: { type: Boolean, default: false },
        isHazardous: { type: Boolean, default: false },
        specialInstructions: String,
      },
      preferredDate: Date,
      urgency: {
        type: String,
        enum: ['standard', 'express', 'urgent'],
        default: 'standard',
      },
    },
    
    constructionDetails: {
      items: [{
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit: { type: String, required: true },
        specifications: Schema.Types.Mixed,
        unitPrice: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
      }],
      deliveryAddress: {
        address: String,
        city: String,
        state: String,
        zipCode: String,
        landmark: String,
      },
      preferredDeliveryDate: Date,
      projectDetails: {
        type: String,
        description: String,
        timeline: String,
      },
    },
    
    garageDetails: {
      vehicle: {
        type: String,
        make: String,
        model: String,
        year: Number,
        plateNumber: String,
        mileage: Number,
      },
      services: [{
        type: String,
        description: String,
        estimatedDuration: String,
        priority: {
          type: String,
          enum: ['low', 'medium', 'high'],
          default: 'medium',
        },
      }],
      preferredDate: Date,
      preferredTime: String,
      issues: String,
      urgency: {
        type: String,
        enum: ['routine', 'urgent', 'emergency'],
        default: 'routine',
      },
    },
    
    tourDetails: {
      destinations: [String],
      startDate: Date,
      endDate: Date,
      participants: [{
        name: { type: String, required: true },
        age: { type: Number, required: true },
        gender: { type: String, enum: ['male', 'female', 'other'], required: true },
        nationality: { type: String, default: 'Nepali' },
        specialRequirements: String,
      }],
      accommodationPreference: {
        type: String,
        enum: ['budget', 'standard', 'luxury'],
        default: 'standard',
      },
      additionalServices: [String],
      specialRequests: String,
    },
  },
  
  contactInfo: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    alternatePhone: String,
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String,
    },
  },
  
  pricing: {
    baseAmount: { type: Number, required: true },
    taxes: {
      vat: { type: Number, default: 0 },
      serviceTax: { type: Number, default: 0 },
      others: [{
        name: String,
        amount: Number,
      }],
    },
    discounts: [{
      type: String,
      amount: Number,
      reason: String,
    }],
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: 'NPR' },
  },
  
  payment: {
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded'],
      default: 'pending',
    },
    method: {
      type: String,
      enum: ['cash', 'khalti', 'esewa', 'bank_transfer', 'card'],
    },
    transactions: [{
      id: String,
      amount: Number,
      status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
      },
      method: String,
      gatewayResponse: Schema.Types.Mixed,
      timestamp: { type: Date, default: Date.now },
      refundId: String,
    }],
    dueAmount: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    refundAmount: { type: Number, default: 0 },
  },
  
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded'],
    default: 'pending',
  },
  statusHistory: [{
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    notes: String,
  }],
  
  schedule: {
    createdAt: { type: Date, default: Date.now },
    confirmedAt: Date,
    startDate: Date,
    endDate: Date,
    completedAt: Date,
    cancelledAt: Date,
  },
  
  notes: String,
  internalNotes: String,
  specialRequirements: [String],
  attachments: [{
    name: String,
    url: String,
    type: String,
    uploadedAt: { type: Date, default: Date.now },
  }],
  
  review: {
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    isPublic: { type: Boolean, default: true },
    submittedAt: { type: Date, default: Date.now },
  },
  
  tracking: {
    currentStatus: String,
    location: {
      lat: Number,
      lng: Number,
      address: String,
    },
    estimatedArrival: Date,
    updates: [{
      timestamp: { type: Date, default: Date.now },
      status: String,
      description: String,
      location: String,
    }],
  },
  
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  assignedAt: Date,
  
  cancellation: {
    reason: String,
    requestedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    requestedAt: Date,
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    approvedAt: Date,
    refundAmount: Number,
    refundStatus: {
      type: String,
      enum: ['pending', 'processed', 'failed'],
      default: 'pending',
    },
  },
}, {
  timestamps: true,
});

// Indexes for better performance
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ service: 1 });
bookingSchema.index({ bookingNumber: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ type: 1 });
bookingSchema.index({ 'payment.status': 1 });
bookingSchema.index({ assignedTo: 1 });
bookingSchema.index({ createdAt: -1 });

// Generate booking number before saving
bookingSchema.pre('save', async function(next) {
  if (this.isNew && !this.bookingNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Find the last booking number for today
    const lastBooking = await mongoose.model('Booking').findOne({
      bookingNumber: { $regex: `^KS${year}${month}${day}` }
    }).sort({ bookingNumber: -1 });
    
    let sequence = 1;
    if (lastBooking) {
      const lastSequence = parseInt(lastBooking.bookingNumber.slice(-4));
      sequence = lastSequence + 1;
    }
    
    this.bookingNumber = `KS${year}${month}${day}${sequence.toString().padStart(4, '0')}`;
  }
  next();
});

// Update status history when status changes
bookingSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      updatedBy: this.assignedTo || this.user,
      notes: 'Status updated',
    } as any);
  }
  next();
});

export default mongoose.model<IBooking>('Booking', bookingSchema);
