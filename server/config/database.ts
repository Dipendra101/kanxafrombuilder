import mongoose from 'mongoose';

// Use MongoDB Atlas connection string for cloud deployment
const MONGODB_URI = process.env.MONGODB_URI ||
  process.env.MONGODB_ATLAS_URI ||
  'mongodb+srv://demo:demo@cluster.mongodb.net/kanxasafari?retryWrites=true&w=majority';

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null, isConnected: false };
}

async function connectDB() {
  // Return existing connection if available
  if (cached.conn && cached.isConnected) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 5,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB Connected Successfully');
      console.log(`📊 Database: ${mongoose.connection.name}`);
      console.log(`🌐 Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
      cached.isConnected = true;
      return mongoose;
    }).catch((error) => {
      console.error('❌ MongoDB connection error:', error.message);
      cached.promise = null;
      cached.isConnected = false;
      // Don't throw error, return null to allow app to run in mock mode
      return null;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    cached.isConnected = false;
    console.error('❌ MongoDB connection failed:', e);
    // Return null instead of throwing to allow graceful degradation
    return null;
  }
}

// Check if database is connected
function isDBConnected() {
  return cached.isConnected && mongoose.connection.readyState === 1;
}

// Safe database operation wrapper
async function withDB<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
  try {
    const db = await connectDB();
    if (!db || !isDBConnected()) {
      console.log('⚠️  Database not available, using fallback data');
      return fallback;
    }
    return await operation();
  } catch (error) {
    console.error('Database operation failed:', error);
    return fallback;
  }
}

export { connectDB, isDBConnected, withDB };
export default connectDB;
