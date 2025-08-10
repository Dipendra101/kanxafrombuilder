import mongoose, { Document, Schema } from 'mongoose';

export interface ITourPackage extends Document {
  name: string;
  destination: string;
  duration: string;
  price: number;
  groupSize: number;
  rating: number;
  reviews: number;
  highlights: string[];
  image: string;
  isActive: boolean;
  description: string;
  itinerary: string[];
  included: string[];
  excluded: string[];
  difficulty: 'Easy' | 'Moderate' | 'Difficult';
  category: 'Adventure' | 'Cultural' | 'Wildlife' | 'Religious' | 'Leisure';
  createdAt: Date;
  updatedAt: Date;
}

const tourPackageSchema = new Schema<ITourPackage>({
  name: {
    type: String,
    required: [true, 'Tour name is required'],
    trim: true,
    maxlength: [100, 'Tour name cannot exceed 100 characters']
  },
  destination: {
    type: String,
    required: [true, 'Destination is required'],
    trim: true
  },
  duration: {
    type: String,
    required: [true, 'Duration is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  groupSize: {
    type: Number,
    required: [true, 'Group size is required'],
    min: [1, 'Group size must be at least 1']
  },
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
  highlights: [{
    type: String,
    trim: true
  }],
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
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  itinerary: [{
    type: String,
    trim: true
  }],
  included: [{
    type: String,
    trim: true
  }],
  excluded: [{
    type: String,
    trim: true
  }],
  difficulty: {
    type: String,
    enum: ['Easy', 'Moderate', 'Difficult'],
    default: 'Easy'
  },
  category: {
    type: String,
    enum: ['Adventure', 'Cultural', 'Wildlife', 'Religious', 'Leisure'],
    required: [true, 'Category is required']
  }
}, {
  timestamps: true
});

// Create default tour packages if none exist
tourPackageSchema.statics.createDefaultPackages = async function() {
  const count = await this.countDocuments();
  
  if (count === 0) {
    const defaultPackages = [
      {
        name: "Annapurna Circuit Trek",
        destination: "Annapurna Region",
        duration: "15 days",
        price: 25000,
        groupSize: 8,
        rating: 4.9,
        reviews: 45,
        highlights: ["Mountain Views", "Cultural Villages", "Hot Springs", "Local Cuisine"],
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        description: "Experience the majestic Annapurna Circuit trek with breathtaking mountain views, cultural villages, and natural hot springs.",
        itinerary: [
          "Day 1: Arrival in Kathmandu",
          "Day 2: Drive to Besisahar",
          "Day 3-14: Trek through Annapurna Circuit",
          "Day 15: Return to Kathmandu"
        ],
        included: ["Accommodation", "Meals", "Guide", "Permits", "Transportation"],
        excluded: ["International Flights", "Personal Expenses", "Insurance"],
        difficulty: "Difficult",
        category: "Adventure"
      },
      {
        name: "Pokhara Valley Tour",
        destination: "Pokhara",
        duration: "3 days",
        price: 8000,
        groupSize: 12,
        rating: 4.7,
        reviews: 78,
        highlights: ["Phewa Lake", "World Peace Pagoda", "Sarangkot Sunrise", "Adventure Sports"],
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        description: "Explore the beautiful Pokhara valley with lake views, sunrise at Sarangkot, and adventure activities.",
        itinerary: [
          "Day 1: Arrival and Phewa Lake",
          "Day 2: Sarangkot Sunrise and World Peace Pagoda",
          "Day 3: Adventure Sports and Departure"
        ],
        included: ["Hotel", "Meals", "Guide", "Transportation", "Activities"],
        excluded: ["Personal Expenses", "Optional Activities"],
        difficulty: "Easy",
        category: "Leisure"
      },
      {
        name: "Chitwan Wildlife Safari",
        destination: "Chitwan National Park",
        duration: "4 days",
        price: 12000,
        groupSize: 6,
        rating: 4.8,
        reviews: 92,
        highlights: ["Jungle Safari", "Elephant Ride", "Bird Watching", "Tharu Culture"],
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        description: "Discover the rich wildlife of Chitwan National Park with jungle safaris, elephant rides, and cultural experiences.",
        itinerary: [
          "Day 1: Arrival and Tharu Village",
          "Day 2: Jungle Safari and Elephant Ride",
          "Day 3: Bird Watching and Cultural Show",
          "Day 4: Departure"
        ],
        included: ["Lodge", "Meals", "Guide", "Safari Activities", "Cultural Show"],
        excluded: ["Personal Expenses", "Optional Activities"],
        difficulty: "Easy",
        category: "Wildlife"
      }
    ];

    await this.insertMany(defaultPackages);
    console.log('✅ Default tour packages created successfully');
  }
};

export default mongoose.models.TourPackage || mongoose.model<ITourPackage>('TourPackage', tourPackageSchema);
