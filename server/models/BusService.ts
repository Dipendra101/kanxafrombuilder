import mongoose, { Document, Schema } from 'mongoose';

export interface IBusService extends Document {
  name: string;
  route: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  seats: number;
  availableSeats: number;
  type: 'Deluxe' | 'Standard' | 'Express';
  amenities: string[];
  rating: number;
  reviews: number;
  image: string;
  isActive: boolean;
  schedule: {
    days: string[];
    time: string;
  };
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const busServiceSchema = new Schema<IBusService>({
  name: {
    type: String,
    required: [true, 'Bus name is required'],
    trim: true,
    maxlength: [100, 'Bus name cannot exceed 100 characters']
  },
  route: {
    type: String,
    required: [true, 'Route is required'],
    trim: true
  },
  departure: {
    type: String,
    required: [true, 'Departure time is required']
  },
  arrival: {
    type: String,
    required: [true, 'Arrival time is required']
  },
  duration: {
    type: String,
    required: [true, 'Duration is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  seats: {
    type: Number,
    required: [true, 'Total seats is required'],
    min: [1, 'At least 1 seat is required']
  },
  availableSeats: {
    type: Number,
    required: [true, 'Available seats is required'],
    min: [0, 'Available seats cannot be negative']
  },
  type: {
    type: String,
    enum: ['Deluxe', 'Standard', 'Express'],
    required: [true, 'Bus type is required']
  },
  amenities: [{
    type: String,
    enum: ['AC', 'WiFi', 'Entertainment', 'Charging Port', 'Refreshments', 'USB Port', 'Reading Light', 'Reclining Seats']
  }],
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: {
    type: Number,
    default: 0,
    min: [0, 'Reviews cannot be negative']
  },
  image: {
    type: String,
    required: [true, 'Image URL is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  schedule: {
    days: [{
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],
    time: {
      type: String,
      required: [true, 'Schedule time is required']
    }
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Create default bus services if none exist
busServiceSchema.statics.createDefaultServices = async function() {
  const count = await this.countDocuments();
  
  if (count === 0) {
    const defaultServices = [
      {
        name: "Kathmandu Express",
        route: "Lamjung → Kathmandu",
        departure: "06:00",
        arrival: "12:00",
        duration: "6 hours",
        price: 800,
        seats: 45,
        availableSeats: 12,
        type: "Deluxe",
        amenities: ["AC", "WiFi", "Entertainment", "Charging Port", "Refreshments"],
        rating: 4.8,
        reviews: 156,
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop",
        schedule: {
          days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          time: "06:00"
        },
        description: "Premium deluxe bus service from Lamjung to Kathmandu with modern amenities and comfortable seating."
      },
      {
        name: "Pokhara Premium",
        route: "Lamjung → Pokhara",
        departure: "08:00",
        arrival: "11:00",
        duration: "3 hours",
        price: 600,
        seats: 50,
        availableSeats: 25,
        type: "Standard",
        amenities: ["AC", "WiFi", "Refreshments"],
        rating: 4.6,
        reviews: 89,
        image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=300&fit=crop",
        schedule: {
          days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          time: "08:00"
        },
        description: "Reliable standard bus service from Lamjung to Pokhara with essential amenities."
      },
      {
        name: "Chitwan Safari",
        route: "Lamjung → Chitwan",
        departure: "07:00",
        arrival: "11:00",
        duration: "4 hours",
        price: 700,
        seats: 40,
        availableSeats: 8,
        type: "Express",
        amenities: ["AC", "WiFi", "Entertainment", "Charging Port"],
        rating: 4.7,
        reviews: 203,
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop",
        schedule: {
          days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          time: "07:00"
        },
        description: "Express bus service from Lamjung to Chitwan for wildlife enthusiasts and adventure seekers."
      }
    ];

    await this.insertMany(defaultServices);
    console.log('✅ Default bus services created successfully');
  }
};

export default mongoose.models.BusService || mongoose.model<IBusService>('BusService', busServiceSchema);
