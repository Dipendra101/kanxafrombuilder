const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['bus', 'cargo', 'tour'],
    required: true,
  },
  service: {
    // For bus bookings
    route: {
      from: String,
      to: String,
    },
    departureTime: String,
    arrivalTime: String,
    busType: String,
    operator: String,
    seats: [{
      seatNumber: String,
      passengerName: String,
      passengerAge: Number,
      passengerGender: String,
    }],
    
    // For cargo bookings
    cargoType: String,
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    pickupAddress: String,
    deliveryAddress: String,
    
    // For tour bookings
    tourDetails: {
      destination: String,
      duration: String,
      numberOfPassengers: Number,
      specialRequirements: String,
    },
  },
  contactInfo: {
    name: String,
    phone: String,
    email: String,
    alternatePhone: String,
  },
  travelDate: {
    type: Date,
    required: true,
  },
  returnDate: Date,
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['khalti', 'esewa', 'bank', 'cash'],
  },
  paymentDetails: {
    transactionId: String,
    paymentDate: Date,
    gatewayResponse: mongoose.Schema.Types.Mixed,
  },
  bookingStatus: {
    type: String,
    enum: ['confirmed', 'pending', 'cancelled', 'completed'],
    default: 'pending',
  },
  specialRequests: String,
  notes: String,
}, {
  timestamps: true,
});

// Index for efficient queries
bookingSchema.index({ user: 1, travelDate: 1 });
bookingSchema.index({ type: 1, bookingStatus: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
