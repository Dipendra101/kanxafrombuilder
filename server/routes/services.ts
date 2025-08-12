import { Router, RequestHandler } from "express";
import Service, { IService } from "../models/Service";
import { authenticate, adminOnly, optionalAuth } from "../middleware/auth";
import { withDB, isDBConnected } from "../config/database";

const router = Router();

// Mock services for when database is unavailable
const mockServices = [
  {
    _id: "mock_service_1",
    name: "Kathmandu to Pokhara Bus",
    description: "Comfortable AC bus service from Kathmandu to Pokhara",
    type: "bus",
    category: "Transportation",
    pricing: { basePrice: 800, currency: "NPR" },
    isActive: true,
    isFeatured: true,
    rating: { average: 4.5, count: 120 },
    busDetails: {
      busNumber: "BA-1234",
      capacity: 45,
      busType: "AC",
      amenities: ["AC", "WiFi", "Entertainment"],
      route: { from: "Kathmandu", to: "Pokhara", duration: "6 hours" },
    },
    images: ["/placeholder.svg"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "mock_service_2",
    name: "Cargo Delivery Service",
    description: "Fast and reliable cargo delivery across Nepal",
    type: "cargo",
    category: "Logistics",
    pricing: { basePrice: 50, currency: "NPR" },
    isActive: true,
    isFeatured: false,
    rating: { average: 4.2, count: 85 },
    cargoDetails: {
      maxWeight: 1000,
      maxDimensions: { length: 200, width: 150, height: 100 },
      deliveryTypes: ["standard", "express", "overnight"],
      coverage: ["valley", "nationwide"],
    },
    images: ["/placeholder.svg"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "mock_service_3",
    name: "Everest Base Camp Tour",
    description: "Guided tour to Everest Base Camp with accommodation",
    type: "tour",
    category: "Adventure",
    pricing: { basePrice: 50000, currency: "NPR" },
    isActive: true,
    isFeatured: true,
    rating: { average: 4.8, count: 45 },
    tourDetails: {
      duration: "14 days",
      difficulty: "moderate",
      groupSize: { min: 4, max: 12 },
      includes: ["Guide", "Accommodation", "Meals", "Permits"],
      itinerary: [
        { day: 1, activity: "Fly to Lukla" },
        { day: 2, activity: "Trek to Namche Bazaar" },
      ],
    },
    images: ["/placeholder.svg"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// @route   GET /api/services
// @desc    Get all services with filters and pagination
// @access  Public
export const getAllServices: RequestHandler = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      type,
      category,
      search,
      isActive = "true",
      isFeatured,
      sortBy = "createdAt",
      sortOrder = "desc",
      minPrice,
      maxPrice,
      from,
      to,
    } = req.query;

    // Use safe database operation
    const result = await withDB(
      async () => {
        const query: any = {};

        // Base filters
        if (isActive !== "") {
          query.isActive = isActive === "true";
        }

        if (type) {
          query.type = type;
        }

        if (category) {
          query.category = { $regex: category, $options: "i" };
        }

        if (isFeatured !== undefined) {
          query.isFeatured = isFeatured === "true";
        }

        // Search functionality
        if (search) {
          query.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { shortDescription: { $regex: search, $options: "i" } },
            { features: { $in: [new RegExp(search as string, "i")] } },
          ];
        }

        // Price range filtering
        if (minPrice || maxPrice) {
          query["pricing.basePrice"] = {};
          if (minPrice) query["pricing.basePrice"].$gte = Number(minPrice);
          if (maxPrice) query["pricing.basePrice"].$lte = Number(maxPrice);
        }

        // Bus route filtering
        if (from || to) {
          if (from)
            query["busService.route.from"] = { $regex: from, $options: "i" };
          if (to) query["busService.route.to"] = { $regex: to, $options: "i" };
        }

        // Sorting
        const sort: any = {};
        sort[sortBy as string] = sortOrder === "asc" ? 1 : -1;

        const services = await Service.find(query)
          .populate("createdBy", "name email")
          .sort(sort)
          .limit(Number(limit))
          .skip((Number(page) - 1) * Number(limit))
          .exec();

        const total = await Service.countDocuments(query);

        return { services, total };
      },
      // Fallback: Use mock services
      (() => {
        console.log("⚠️  Database unavailable, using mock services");
        let filteredServices = [...mockServices];

        // Apply basic filters to mock data
        if (type) {
          filteredServices = filteredServices.filter((s) => s.type === type);
        }
        if (isActive === "true") {
          filteredServices = filteredServices.filter((s) => s.isActive);
        }
        if (isFeatured === "true") {
          filteredServices = filteredServices.filter((s) => s.isFeatured);
        }
        if (search) {
          const searchLower = (search as string).toLowerCase();
          filteredServices = filteredServices.filter(
            (s) =>
              s.name.toLowerCase().includes(searchLower) ||
              s.description.toLowerCase().includes(searchLower),
          );
        }

        const startIndex = (Number(page) - 1) * Number(limit);
        const paginatedServices = filteredServices.slice(
          startIndex,
          startIndex + Number(limit),
        );

        return { services: paginatedServices, total: filteredServices.length };
      })(),
    );

    res.json({
      success: true,
      services: result.services,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: result.total,
        pages: Math.ceil(result.total / Number(limit)),
      },
      ...(!isDBConnected() && { mode: "demo" }),
    });
  } catch (error: any) {
    console.error("Get all services error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch services",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// @route   GET /api/services/featured
// @desc    Get featured services
// @access  Public
export const getFeaturedServices: RequestHandler = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const services = await withDB(
      async () => {
        return await Service.find({
          isActive: true,
          isFeatured: true,
        })
          .populate("createdBy", "name email")
          .sort({ "rating.average": -1, createdAt: -1 })
          .limit(Number(limit))
          .exec();
      },
      // Fallback mock data
      mockServices.filter(s => s.isFeatured).slice(0, Number(limit))
    );

    res.json({
      success: true,
      services,
    });
  } catch (error: any) {
    console.error("Get featured services error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch featured services",
    });
  }
};

// @route   GET /api/services/buses
// @desc    Get available bus services
// @access  Public
export const getBusServices: RequestHandler = async (req, res) => {
  try {
    const { from, to, date } = req.query;

    const result = await withDB(
      async () => {
        const query: any = {
          type: "bus",
          isActive: true,
          isAvailable: true,
        };

        if (from || to) {
          if (from)
            query["busService.route.from"] = { $regex: from, $options: "i" };
          if (to) query["busService.route.to"] = { $regex: to, $options: "i" };
        }

        const buses = await Service.find(query)
          .populate("createdBy", "name email")
          .sort({ "rating.average": -1 });

        return buses;
      },
      // Fallback mock data
      mockServices.filter(s => s.type === 'bus')
    );

    const buses = Array.isArray(result) ? result : [result];

    // Transform data to match frontend expectations
    const transformedBuses = buses.map((bus) => ({
      id: bus._id,
      name: bus.name,
      from: bus.busService?.route.from,
      to: bus.busService?.route.to,
      distance: bus.busService?.route.distance,
      duration: bus.busService?.route.duration,
      schedule: bus.busService?.schedule || [],
      vehicle: bus.busService?.vehicle,
      operator: bus.busService?.operator,
      pricing: bus.pricing,
      rating: bus.rating,
      images: bus.images,
      features: bus.features,
      description: bus.shortDescription,
    }));

    res.json({
      success: true,
      buses: transformedBuses,
    });
  } catch (error: any) {
    console.error("Get bus services error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bus services",
    });
  }
};

// @route   GET /api/services/cargo
// @desc    Get available cargo services
// @access  Public
export const getCargoServices: RequestHandler = async (req, res) => {
  try {
    const { vehicleType, route } = req.query;

    const query: any = {
      type: "cargo",
      isActive: true,
      isAvailable: true,
    };

    if (vehicleType) {
      query["cargoService.vehicleType"] = {
        $regex: vehicleType,
        $options: "i",
      };
    }

    if (route) {
      query["cargoService.availableRoutes"] = {
        $in: [new RegExp(route as string, "i")],
      };
    }

    const cargoServices = await Service.find(query)
      .populate("createdBy", "name email")
      .sort({ "rating.average": -1 });

    const transformedCargo = cargoServices.map((cargo) => ({
      id: cargo._id,
      name: cargo.name,
      vehicleType: cargo.cargoService?.vehicleType,
      capacity: cargo.cargoService?.capacity,
      availableRoutes: cargo.cargoService?.availableRoutes,
      restrictions: cargo.cargoService?.restrictions,
      additionalServices: cargo.cargoService?.additionalServices,
      pricing: cargo.pricing,
      rating: cargo.rating,
      images: cargo.images,
      features: cargo.features,
      description: cargo.shortDescription,
    }));

    res.json({
      success: true,
      cargo: transformedCargo,
    });
  } catch (error: any) {
    console.error("Get cargo services error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cargo services",
    });
  }
};

// @route   GET /api/services/construction
// @desc    Get construction materials and machinery
// @access  Public
export const getConstructionServices: RequestHandler = async (req, res) => {
  try {
    const { category, search, itemType } = req.query;

    const query: any = {
      type: "construction",
      isActive: true,
      isAvailable: true,
    };

    if (category) {
      query.category = { $regex: category, $options: "i" };
    }

    if (itemType) {
      query["constructionService.itemType"] = itemType;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const constructionItems = await Service.find(query)
      .populate("createdBy", "name email")
      .sort({ "rating.average": -1 });

    const transformedItems = constructionItems.map((item) => ({
      id: item._id,
      name: item.name,
      category: item.category,
      itemType: item.constructionService?.itemType,
      specifications: item.constructionService?.specifications,
      availability: item.constructionService?.availability,
      supplier: item.constructionService?.supplier,
      qualityCertifications: item.constructionService?.qualityCertifications,
      pricing: item.pricing,
      rating: item.rating,
      images: item.images,
      features: item.features,
      description: item.shortDescription,
    }));

    res.json({
      success: true,
      items: transformedItems,
    });
  } catch (error: any) {
    console.error("Get construction services error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch construction items",
    });
  }
};

// @route   GET /api/services/garage
// @desc    Get garage services
// @access  Public
export const getGarageServices: RequestHandler = async (req, res) => {
  try {
    const { serviceType, vehicleType } = req.query;

    const query: any = {
      type: "garage",
      isActive: true,
      isAvailable: true,
    };

    if (serviceType) {
      query["garageService.serviceTypes"] = {
        $in: [new RegExp(serviceType as string, "i")],
      };
    }

    if (vehicleType) {
      query["garageService.vehicleTypes"] = {
        $in: [new RegExp(vehicleType as string, "i")],
      };
    }

    const garageServices = await Service.find(query)
      .populate("createdBy", "name email")
      .sort({ "rating.average": -1 });

    const transformedServices = garageServices.map((service) => ({
      id: service._id,
      name: service.name,
      serviceTypes: service.garageService?.serviceTypes,
      vehicleTypes: service.garageService?.vehicleTypes,
      estimatedDuration: service.garageService?.estimatedDuration,
      warranty: service.garageService?.warranty,
      mechanics: service.garageService?.mechanics,
      equipment: service.garageService?.equipment,
      pricing: service.pricing,
      rating: service.rating,
      images: service.images,
      features: service.features,
      description: service.shortDescription,
    }));

    res.json({
      success: true,
      services: transformedServices,
    });
  } catch (error: any) {
    console.error("Get garage services error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch garage services",
    });
  }
};

// @route   GET /api/services/:id
// @desc    Get specific service details
// @access  Public
export const getServiceById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id)
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // Increment view count
    service.analytics.views += 1;
    await service.save();

    res.json({
      success: true,
      service,
    });
  } catch (error: any) {
    console.error("Get service by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch service",
    });
  }
};

// @route   POST /api/services
// @desc    Create new service (Admin only)
// @access  Private/Admin
export const createService: RequestHandler = async (req, res) => {
  try {
    const serviceData = {
      ...req.body,
      createdBy: req.user.userId,
      updatedBy: req.user.userId,
    };

    // Validate required fields based on service type
    const { type } = serviceData;

    if (type === "bus" && !serviceData.busService) {
      return res.status(400).json({
        success: false,
        message: "Bus service details are required for bus type services",
      });
    }

    const service = new Service(serviceData);
    await service.save();

    const populatedService = await Service.findById(service._id).populate(
      "createdBy",
      "name email",
    );

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      service: populatedService,
    });
  } catch (error: any) {
    console.error("Create service error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Service with this slug already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create service",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// @route   PUT /api/services/:id
// @desc    Update service (Admin only)
// @access  Private/Admin
export const updateService: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updatedBy: req.user.userId,
    };

    const service = await Service.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    ).populate("createdBy updatedBy", "name email");

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.json({
      success: true,
      message: "Service updated successfully",
      service,
    });
  } catch (error: any) {
    console.error("Update service error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update service",
    });
  }
};

// @route   DELETE /api/services/:id
// @desc    Delete service (Admin only)
// @access  Private/Admin
export const deleteService: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete service error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete service",
    });
  }
};

// @route   GET /api/services/stats
// @desc    Get service statistics (Admin only)
// @access  Private/Admin
export const getServiceStats: RequestHandler = async (req, res) => {
  try {
    const stats = await Service.aggregate([
      {
        $facet: {
          totalServices: [{ $count: "count" }],
          activeServices: [{ $match: { isActive: true } }, { $count: "count" }],
          servicesByType: [{ $group: { _id: "$type", count: { $sum: 1 } } }],
          featuredServices: [
            { $match: { isFeatured: true } },
            { $count: "count" },
          ],
          averageRating: [
            { $group: { _id: null, avgRating: { $avg: "$rating.average" } } },
          ],
          totalViews: [
            { $group: { _id: null, totalViews: { $sum: "$analytics.views" } } },
          ],
          totalRevenue: [
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: "$analytics.revenue" },
              },
            },
          ],
        },
      },
    ]);

    const result = {
      totalServices: stats[0].totalServices[0]?.count || 0,
      activeServices: stats[0].activeServices[0]?.count || 0,
      inactiveServices:
        (stats[0].totalServices[0]?.count || 0) -
        (stats[0].activeServices[0]?.count || 0),
      featuredServices: stats[0].featuredServices[0]?.count || 0,
      averageRating: stats[0].averageRating[0]?.avgRating || 0,
      totalViews: stats[0].totalViews[0]?.totalViews || 0,
      totalRevenue: stats[0].totalRevenue[0]?.totalRevenue || 0,
      servicesByType: stats[0].servicesByType.reduce((acc: any, item: any) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
    };

    res.json({
      success: true,
      stats: result,
    });
  } catch (error: any) {
    console.error("Get service stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch service statistics",
    });
  }
};

// Set up routes
router.get("/", optionalAuth, getAllServices);
router.get("/featured", getFeaturedServices);
router.get("/buses", getBusServices);
router.get("/cargo", getCargoServices);
router.get("/construction", getConstructionServices);
router.get("/garage", getGarageServices);
router.get("/stats", authenticate, adminOnly, getServiceStats);
router.get("/:id", getServiceById);

// Admin routes
router.post("/", authenticate, adminOnly, createService);
router.put("/:id", authenticate, adminOnly, updateService);
router.delete("/:id", authenticate, adminOnly, deleteService);

export default router;
