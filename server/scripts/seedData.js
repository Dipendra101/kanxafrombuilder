const mongoose = require('mongoose');
const Service = require('../models/Service');
const connectDB = require('../config/database');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing services
    await Service.deleteMany({});

    // Sample bus services
    const busServices = [
      {
        type: 'bus',
        busService: {
          route: {
            from: 'Lamjung',
            to: 'Kathmandu'
          },
          schedule: [
            {
              departureTime: '06:00 AM',
              arrivalTime: '12:00 PM',
              duration: '6h 0m',
              daysOfOperation: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
            },
            {
              departureTime: '02:00 PM',
              arrivalTime: '08:00 PM',
              duration: '6h 0m',
              daysOfOperation: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
            }
          ],
          busDetails: {
            busNumber: 'KS-001',
            busType: 'Deluxe AC',
            totalSeats: 45,
            amenities: ['AC', 'WiFi', 'Charging Port', 'Entertainment', 'Comfortable Seats'],
            operator: 'Kanxa Express'
          },
          pricing: {
            basePrice: 800,
            currency: 'NPR'
          },
          isActive: true
        },
        rating: {
          average: 4.8,
          count: 156
        },
        isActive: true
      },
      {
        type: 'bus',
        busService: {
          route: {
            from: 'Lamjung',
            to: 'Pokhara'
          },
          schedule: [
            {
              departureTime: '08:30 AM',
              arrivalTime: '11:00 AM',
              duration: '2h 30m',
              daysOfOperation: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
            },
            {
              departureTime: '04:30 PM',
              arrivalTime: '07:00 PM',
              duration: '2h 30m',
              daysOfOperation: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
            }
          ],
          busDetails: {
            busNumber: 'KS-002',
            busType: 'Standard',
            totalSeats: 35,
            amenities: ['Comfortable Seats', 'Music System'],
            operator: 'Mountain Express'
          },
          pricing: {
            basePrice: 500,
            currency: 'NPR'
          },
          isActive: true
        },
        rating: {
          average: 4.6,
          count: 89
        },
        isActive: true
      }
    ];

    // Sample cargo services
    const cargoServices = [
      {
        type: 'cargo',
        cargoService: {
          vehicleType: 'Heavy Truck',
          capacity: {
            weight: 10,
            volume: 35
          },
          availableRoutes: ['Lamjung → Kathmandu', 'Kathmandu → Lamjung'],
          pricing: {
            basePrice: 15000,
            pricePerKm: 25,
            currency: 'NPR'
          },
          features: ['GPS Tracking', 'Insurance Covered', '24/7 Support', 'Professional Drivers'],
          isAvailable: true
        },
        rating: {
          average: 4.7,
          count: 45
        },
        isActive: true
      },
      {
        type: 'cargo',
        cargoService: {
          vehicleType: 'Medium Truck',
          capacity: {
            weight: 5,
            volume: 20
          },
          availableRoutes: ['Lamjung → Pokhara', 'Pokhara → Lamjung'],
          pricing: {
            basePrice: 8000,
            pricePerKm: 18,
            currency: 'NPR'
          },
          features: ['GPS Tracking', 'Insurance Covered'],
          isAvailable: true
        },
        rating: {
          average: 4.5,
          count: 32
        },
        isActive: true
      }
    ];

    // Sample construction items
    const constructionItems = [
      {
        type: 'construction',
        constructionService: {
          category: 'materials',
          itemName: 'Portland Cement',
          description: 'High-grade Portland cement suitable for all construction needs',
          specifications: {
            grade: 'OPC 53',
            packaging: '50kg bags',
            brand: 'Shivam Cement'
          },
          pricing: {
            price: 850,
            unit: 'per bag',
            currency: 'NPR'
          },
          availability: {
            inStock: true,
            quantity: 500,
          },
          supplier: 'Kathmandu Construction Supplies'
        },
        rating: {
          average: 4.9,
          count: 234
        },
        isActive: true
      },
      {
        type: 'construction',
        constructionService: {
          category: 'machinery',
          itemName: 'JCB Excavator',
          description: 'Heavy-duty excavator available for daily rental',
          specifications: {
            model: 'JCB 3DX Super',
            fuelType: 'Diesel',
            capacity: '1 cubic meter bucket'
          },
          pricing: {
            price: 8000,
            unit: 'per day',
            currency: 'NPR'
          },
          availability: {
            inStock: true,
            quantity: 3,
          },
          supplier: 'Heavy Machinery Rentals'
        },
        rating: {
          average: 4.6,
          count: 67
        },
        isActive: true
      }
    ];

    // Sample garage services
    const garageServices = [
      {
        type: 'garage',
        garageService: {
          serviceType: 'maintenance',
          vehicleTypes: ['car', 'truck', 'tractor', 'bus'],
          description: 'Complete vehicle maintenance and servicing',
          estimatedDuration: '2-4 hours',
          pricing: {
            basePrice: 2000,
            hourlyRate: 500,
            currency: 'NPR'
          },
          availability: {
            workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            workingHours: {
              start: '08:00 AM',
              end: '06:00 PM'
            }
          }
        },
        rating: {
          average: 4.7,
          count: 123
        },
        isActive: true
      }
    ];

    // Insert all services
    await Service.insertMany([
      ...busServices,
      ...cargoServices,
      ...constructionItems,
      ...garageServices
    ]);

    console.log('✅ Database seeded successfully!');
    console.log(`📊 Inserted ${busServices.length} bus services`);
    console.log(`🚛 Inserted ${cargoServices.length} cargo services`);
    console.log(`🏗️ Inserted ${constructionItems.length} construction items`);
    console.log(`🔧 Inserted ${garageServices.length} garage services`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
