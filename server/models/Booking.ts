import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  serviceType: 'bus' | 'cargo' | 'tour';
  serviceId: mongoose.Types.ObjectId;
  bookingDate: Date;
  travelDate: Date;
  passengers: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'khalti' | 'esewa' | 'cash' | 'bank_transfer';
  contactInfo: {
    name: string;
    phone: string;
    email: string;
    address?: string;
  };
  specialRequests?: string;
  bookingReference: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  serviceType: {
    type: String,
    enum: ['bus', 'cargo', 'tour'],
    required: [true, 'Service type is required']
  },
  serviceId: {
    type: Schema.Types.ObjectId,
    required: [true, 'Service ID is required']
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  travelDate: {
    type: Date,
    required: [true, 'Travel date is required']
  },
  passengers: {
    type: Number,
    required: [true, 'Number of passengers is required'],
    min: [1, 'At least 1 passenger is required']
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['khalti', 'esewa', 'cash', 'bank_transfer'],
    required: [true, 'Payment method is required']
  },
  contactInfo: {
    name: {
      type: String,
      required: [true, 'Contact name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Contact phone is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Contact email is required'],
      trim: true,
      lowercase: true
    },
    address: {
      type: String,
      trim: true
    }
  },
  specialRequests: {
    type: String,
    trim: true,
    maxlength: [500, 'Special requests cannot exceed 500 characters']
  },
  bookingReference: {
    type: String,
    unique: true,
    required: true
  }
}, {
  timestamps: true
});

// Generate booking reference before saving
bookingSchema.pre('save', async function(next) {
  if (!this.isNew) return next();
  
  try {
    const count = await mongoose.model('Booking').countDocuments();
    this.bookingReference = `KS${Date.now().toString().slice(-6)}${(count + 1).toString().padStart(4, '0')}`;
    next();
  } catch (error) {
    next(error as Error);
  }
});

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema);
