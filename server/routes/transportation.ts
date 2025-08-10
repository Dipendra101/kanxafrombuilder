import { Router } from "express";
import { z } from "zod";
import { verifyToken } from "./auth";
import BusService from "../models/BusService";
import CargoService from "../models/CargoService";
import TourPackage from "../models/TourPackage";

const router = Router();

// Validation schemas
const searchSchema = z.object({
  query: z.string().optional(),
  route: z.string().optional(),
  date: z.string().optional(),
  type: z.enum(['bus', 'cargo', 'tour']).optional(),
});

// Get all bus services
router.get("/buses", async (req, res) => {
  try {
    const { query, route, type } = req.query;
    
    let filter: any = { isActive: true };
    
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { route: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }
    
    if (route) {
      filter.route = { $regex: route, $options: 'i' };
    }
    
    if (type) {
      filter.type = type;
    }
    
    const buses = await BusService.find(filter).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: buses,
      count: buses.length
    });
  } catch (error) {
    console.error('Error fetching bus services:', error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch bus services"
    });
  }
});

// Get bus service by ID
router.get("/buses/:id", async (req, res) => {
  try {
    const bus = await BusService.findById(req.params.id);
    
    if (!bus) {
      return res.status(404).json({
        success: false,
        error: "Bus service not found"
      });
    }
    
    res.json({
      success: true,
      data: bus
    });
  } catch (error) {
    console.error('Error fetching bus service:', error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch bus service"
    });
  }
});

// Get all cargo services
router.get("/cargo", async (req, res) => {
  try {
    const { query, type } = req.query;
    
    let filter: any = { isActive: true };
    
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }
    
    if (type) {
      filter.type = type;
    }
    
    const cargo = await CargoService.find(filter).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: cargo,
      count: cargo.length
    });
  } catch (error) {
    console.error('Error fetching cargo services:', error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch cargo services"
    });
  }
});

// Get cargo service by ID
router.get("/cargo/:id", async (req, res) => {
  try {
    const cargo = await CargoService.findById(req.params.id);
    
    if (!cargo) {
      return res.status(404).json({
        success: false,
        error: "Cargo service not found"
      });
    }
    
    res.json({
      success: true,
      data: cargo
    });
  } catch (error) {
    console.error('Error fetching cargo service:', error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch cargo service"
    });
  }
});

// Get all tour packages
router.get("/tours", async (req, res) => {
  try {
    const { query, category, difficulty } = req.query;
    
    let filter: any = { isActive: true };
    
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { destination: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }
    
    if (category) {
      filter.category = category;
    }
    
    if (difficulty) {
      filter.difficulty = difficulty;
    }
    
    const tours = await TourPackage.find(filter).sort({ createdAt: -1 });
  
  res.json({
      success: true,
      data: tours,
      count: tours.length
    });
  } catch (error) {
    console.error('Error fetching tour packages:', error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch tour packages"
    });
  }
});

// Get tour package by ID
router.get("/tours/:id", async (req, res) => {
  try {
    const tour = await TourPackage.findById(req.params.id);
    
    if (!tour) {
      return res.status(404).json({
        success: false,
        error: "Tour package not found"
      });
  }
  
  res.json({
      success: true,
      data: tour
    });
  } catch (error) {
    console.error('Error fetching tour package:', error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch tour package"
    });
  }
});

// Search transportation services
router.get("/search", async (req, res) => {
  try {
    const validatedData = searchSchema.parse(req.query);
    
    const { query, route, date, type } = validatedData;
    
    let results: any = {};
    
    if (!type || type === 'bus') {
      let busFilter: any = { isActive: true };
      if (query) {
        busFilter.$or = [
          { name: { $regex: query, $options: 'i' } },
          { route: { $regex: query, $options: 'i' } }
        ];
      }
      if (route) {
        busFilter.route = { $regex: route, $options: 'i' };
      }
      results.buses = await BusService.find(busFilter).limit(5);
    }
    
    if (!type || type === 'cargo') {
      let cargoFilter: any = { isActive: true };
      if (query) {
        cargoFilter.$or = [
          { name: { $regex: query, $options: 'i' } },
          { routes: { $regex: query, $options: 'i' } }
        ];
      }
      results.cargo = await CargoService.find(cargoFilter).limit(5);
    }
    
    if (!type || type === 'tour') {
      let tourFilter: any = { isActive: true };
      if (query) {
        tourFilter.$or = [
          { name: { $regex: query, $options: 'i' } },
          { destination: { $regex: query, $options: 'i' } }
        ];
      }
      results.tours = await TourPackage.find(tourFilter).limit(5);
  }
  
  res.json({
      success: true,
      data: results,
      query,
      date
    });
  } catch (error) {
    console.error('Error searching transportation services:', error);
    res.status(500).json({
      success: false,
      error: "Failed to search transportation services"
    });
  }
});

// Get transportation statistics (admin only)
router.get("/stats", verifyToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: "Access denied. Admin only."
      });
    }
    
    const busCount = await BusService.countDocuments({ isActive: true });
    const cargoCount = await CargoService.countDocuments({ isActive: true });
    const tourCount = await TourPackage.countDocuments({ isActive: true });
    
    const totalServices = busCount + cargoCount + tourCount;
    
    res.json({
      success: true,
      data: {
        totalServices,
        buses: busCount,
        cargo: cargoCount,
        tours: tourCount
      }
    });
  } catch (error) {
    console.error('Error fetching transportation stats:', error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch transportation statistics"
    });
  }
});

export { router as transportationRoutes };
