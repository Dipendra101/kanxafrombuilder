const express = require('express');
const Service = require('../models/Service');
const router = express.Router();

// @route   GET /api/services
// @desc    Get all services with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { type, active = true, page = 1, limit = 10 } = req.query;
    
    const query = { isActive: active === 'true' };
    
    if (type) query.type = type;

    const services = await Service.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Service.countDocuments(query);

    res.json({
      success: true,
      services,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services',
      error: error.message
    });
  }
});

// @route   GET /api/services/buses
// @desc    Get available bus services
// @access  Public
router.get('/buses', async (req, res) => {
  try {
    const { from, to, date } = req.query;
    
    const query = { 
      type: 'bus',
      isActive: true,
      'busService.isActive': true
    };

    if (from || to) {
      if (from) query['busService.route.from'] = new RegExp(from, 'i');
      if (to) query['busService.route.to'] = new RegExp(to, 'i');
    }

    const buses = await Service.find(query);

    // Transform data to match frontend expectations
    const transformedBuses = buses.map(bus => ({
      id: bus._id,
      from: bus.busService.route.from,
      to: bus.busService.route.to,
      schedule: bus.busService.schedule,
      busDetails: bus.busService.busDetails,
      pricing: bus.busService.pricing,
      rating: bus.rating,
      images: bus.images
    }));

    res.json({
      success: true,
      buses: transformedBuses
    });
  } catch (error) {
    console.error('Get buses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bus services',
      error: error.message
    });
  }
});

// @route   GET /api/services/cargo
// @desc    Get available cargo services
// @access  Public
router.get('/cargo', async (req, res) => {
  try {
    const { vehicleType, route } = req.query;
    
    const query = { 
      type: 'cargo',
      isActive: true,
      'cargoService.isAvailable': true
    };

    if (vehicleType) {
      query['cargoService.vehicleType'] = new RegExp(vehicleType, 'i');
    }

    if (route) {
      query['cargoService.availableRoutes'] = new RegExp(route, 'i');
    }

    const cargoServices = await Service.find(query);

    const transformedCargo = cargoServices.map(cargo => ({
      id: cargo._id,
      vehicleType: cargo.cargoService.vehicleType,
      capacity: cargo.cargoService.capacity,
      availableRoutes: cargo.cargoService.availableRoutes,
      pricing: cargo.cargoService.pricing,
      features: cargo.cargoService.features,
      rating: cargo.rating,
      images: cargo.images
    }));

    res.json({
      success: true,
      cargo: transformedCargo
    });
  } catch (error) {
    console.error('Get cargo error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cargo services',
      error: error.message
    });
  }
});

// @route   GET /api/services/construction
// @desc    Get construction materials and machinery
// @access  Public
router.get('/construction', async (req, res) => {
  try {
    const { category, search } = req.query;
    
    const query = { 
      type: 'construction',
      isActive: true
    };

    if (category) {
      query['constructionService.category'] = category;
    }

    if (search) {
      query.$or = [
        { 'constructionService.itemName': new RegExp(search, 'i') },
        { 'constructionService.description': new RegExp(search, 'i') }
      ];
    }

    const constructionItems = await Service.find(query);

    const transformedItems = constructionItems.map(item => ({
      id: item._id,
      category: item.constructionService.category,
      itemName: item.constructionService.itemName,
      description: item.constructionService.description,
      specifications: item.constructionService.specifications,
      pricing: item.constructionService.pricing,
      availability: item.constructionService.availability,
      supplier: item.constructionService.supplier,
      rating: item.rating,
      images: item.images
    }));

    res.json({
      success: true,
      items: transformedItems
    });
  } catch (error) {
    console.error('Get construction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch construction items',
      error: error.message
    });
  }
});

// @route   GET /api/services/garage
// @desc    Get garage services
// @access  Public
router.get('/garage', async (req, res) => {
  try {
    const { serviceType, vehicleType } = req.query;
    
    const query = { 
      type: 'garage',
      isActive: true
    };

    if (serviceType) {
      query['garageService.serviceType'] = new RegExp(serviceType, 'i');
    }

    if (vehicleType) {
      query['garageService.vehicleTypes'] = vehicleType;
    }

    const garageServices = await Service.find(query);

    const transformedServices = garageServices.map(service => ({
      id: service._id,
      serviceType: service.garageService.serviceType,
      vehicleTypes: service.garageService.vehicleTypes,
      description: service.garageService.description,
      estimatedDuration: service.garageService.estimatedDuration,
      pricing: service.garageService.pricing,
      availability: service.garageService.availability,
      rating: service.rating,
      images: service.images
    }));

    res.json({
      success: true,
      services: transformedServices
    });
  } catch (error) {
    console.error('Get garage services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch garage services',
      error: error.message
    });
  }
});

// @route   GET /api/services/:id
// @desc    Get specific service details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      service
    });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service',
      error: error.message
    });
  }
});

module.exports = router;
