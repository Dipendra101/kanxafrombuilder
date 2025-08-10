import mongoose, { Document, Schema } from 'mongoose';

export interface ICargoService extends Document {
  name: string;
  type: 'Truck' | 'Van' | 'Container';
  capacity: string;
  routes: string[];
  price: number;
  deliveryTime: string;
  insurance: boolean;
  tracking: boolean;
  image: string;
  isActive: boolean;
  description: string;
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}

const cargoServiceSchema = new Schema<ICargoService>({
  name: {
    type: String,
    required: [true, 'Cargo service name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  type: {
    type: String,
    enum: ['Truck', 'Van', 'Container'],
    required: [true, 'Cargo type is required']
  },
  capacity: {
    type: String,
    required: [true, 'Capacity is required'],
    trim: true
  },
  routes: [{
    type: String,
    required: [true, 'At least one route is required'],
    trim: true
  }],
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  deliveryTime: {
    type: String,
    required: [true, 'Delivery time is required'],
    trim: true
  },
  insurance: {
    type: Boolean,
    default: true
  },
  tracking: {
    type: Boolean,
    default: true
  },
  image: {
    type: String,
    required: [true, 'Image URL is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  features: [{
    type: String,
    enum: ['GPS Tracking', 'Insurance Coverage', 'Real-time Updates', 'Door-to-Door', 'Express Delivery', 'Fragile Handling', 'Temperature Control', '24/7 Support']
  }]
}, {
  timestamps: true
});

// Create default cargo services if none exist
cargoServiceSchema.statics.createDefaultServices = async function() {
  const count = await this.countDocuments();
  
  if (count === 0) {
    const defaultServices = [
      {
        name: "Heavy Duty Truck",
        type: "Truck",
        capacity: "10-15 tons",
        routes: ["Lamjung → Kathmandu", "Lamjung → Pokhara", "Lamjung → Chitwan"],
        price: 15000,
        deliveryTime: "1-2 days",
        insurance: true,
        tracking: true,
        image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=300&fit=crop",
        description: "Heavy duty truck service for large cargo transportation with full insurance and GPS tracking.",
        features: ["GPS Tracking", "Insurance Coverage", "Real-time Updates", "Door-to-Door", "24/7 Support"]
      },
      {
        name: "Express Van",
        type: "Van",
        capacity: "1-2 tons",
        routes: ["Lamjung → Kathmandu", "Lamjung → Pokhara"],
        price: 5000,
        deliveryTime: "Same day",
        insurance: true,
        tracking: true,
        image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=300&fit=crop",
        description: "Express van service for quick and reliable small cargo delivery with same-day service.",
        features: ["GPS Tracking", "Insurance Coverage", "Express Delivery", "Door-to-Door", "Real-time Updates"]
      },
      {
        name: "Container Service",
        type: "Container",
        capacity: "20-40 tons",
        routes: ["Lamjung → Kathmandu", "Lamjung → Pokhara", "Lamjung → Chitwan"],
        price: 25000,
        deliveryTime: "2-3 days",
        insurance: true,
        tracking: true,
        image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=300&fit=crop",
        description: "Container service for bulk cargo transportation with secure and insured delivery.",
        features: ["GPS Tracking", "Insurance Coverage", "Real-time Updates", "Temperature Control", "Fragile Handling", "24/7 Support"]
      }
    ];

    await this.insertMany(defaultServices);
    console.log('✅ Default cargo services created successfully');
  }
};

export default mongoose.models.CargoService || mongoose.model<ICargoService>('CargoService', cargoServiceSchema);
