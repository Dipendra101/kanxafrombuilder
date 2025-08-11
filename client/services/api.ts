import axios from 'axios';

// Type definitions
export interface BusService {
  id: string;
  name: string;
  description: string;
  type: string;
  route: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  capacity: number;
  amenities: string[];
  status: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CargoService {
  id: string;
  name: string;
  description: string;
  type: string;
  origin: string;
  destination: string;
  weight: number;
  dimensions: string;
  price: number;
  deliveryTime: string;
  features: string[];
  status: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TourPackage {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: string;
  difficulty: string;
  price: number;
  maxGroupSize: number;
  highlights: string[];
  itinerary: string[];
  included: string[];
  notIncluded: string[];
  status: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
      'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear tokens and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('user');
      localStorage.removeItem('adminUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

  // Auth API
export const authAPI = {
  // User registration
  register: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    address?: string;
    company?: string;
  }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // User login
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Admin login
  adminLogin: async (credentials: { username: string; password: string }) => {
    // For demo purposes, we'll use a simple check
    if (credentials.username === 'admin' && credentials.password === 'admin') {
      const adminUser = {
        id: 'admin-1',
        username: 'admin',
        role: 'super_admin',
        name: 'System Administrator',
      };
      
      localStorage.setItem('adminToken', 'demo-admin-token');
      localStorage.setItem('adminUser', JSON.stringify(adminUser));
      
      return {
        success: true,
        message: 'Admin login successful',
        data: adminUser,
        token: 'demo-admin-token',
      };
    }
    
    throw new Error('Invalid admin credentials');
  },

  // Forgot password
  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
      return response.data;
  },

  // Reset password
  resetPassword: async (data: { token: string; password: string; confirmPassword: string }) => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update profile
  updateProfile: async (profileData: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    company?: string;
  }) => {
    const response = await api.put('/auth/profile', profileData);
      return response.data;
  },

  // Change password
  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('user');
    localStorage.removeItem('adminUser');
  },
};

  // Transportation API
export const transportationAPI = {
  // Get all bus services
  getBusServices: async () => {
    const response = await api.get('/transportation/buses');
    return response.data;
  },

  // Get bus service by ID
  getBusService: async (id: string) => {
    const response = await api.get(`/transportation/buses/${id}`);
    return response.data;
  },

  // Create bus service (admin only)
  createBusService: async (serviceData: any) => {
    const response = await api.post('/transportation/buses', serviceData);
    return response.data;
  },

  // Update bus service (admin only)
  updateBusService: async (id: string, serviceData: any) => {
    const response = await api.put(`/transportation/buses/${id}`, serviceData);
    return response.data;
  },

  // Delete bus service (admin only)
  deleteBusService: async (id: string) => {
    const response = await api.delete(`/transportation/buses/${id}`);
    return response.data;
  },

  // Get all cargo services
  getCargoServices: async () => {
    const response = await api.get('/transportation/cargo');
    return response.data;
  },

  // Get cargo service by ID
  getCargoService: async (id: string) => {
    const response = await api.get(`/transportation/cargo/${id}`);
    return response.data;
  },

  // Create cargo service (admin only)
  createCargoService: async (serviceData: any) => {
    const response = await api.post('/transportation/cargo', serviceData);
    return response.data;
  },

  // Update cargo service (admin only)
  updateCargoService: async (id: string, serviceData: any) => {
    const response = await api.put(`/transportation/cargo/${id}`, serviceData);
    return response.data;
  },

  // Delete cargo service (admin only)
  deleteCargoService: async (id: string) => {
    const response = await api.delete(`/transportation/cargo/${id}`);
    return response.data;
  },

  // Get all tour packages
  getTourPackages: async () => {
    const response = await api.get('/transportation/tours');
    return response.data;
  },

  // Get tour package by ID
  getTourPackage: async (id: string) => {
    const response = await api.get(`/transportation/tours/${id}`);
    return response.data;
  },

  // Create tour package (admin only)
  createTourPackage: async (packageData: any) => {
    const response = await api.post('/transportation/tours', packageData);
    return response.data;
  },

  // Update tour package (admin only)
  updateTourPackage: async (id: string, packageData: any) => {
    const response = await api.put(`/transportation/tours/${id}`, packageData);
    return response.data;
  },

  // Delete tour package (admin only)
  deleteTourPackage: async (id: string) => {
    const response = await api.delete(`/transportation/tours/${id}`);
    return response.data;
  },
};

// Construction API
export const constructionAPI = {
  // Get all materials
  getMaterials: async () => {
    const response = await api.get('/construction/materials');
    return response.data;
  },

  // Get material by ID
  getMaterial: async (id: string) => {
    const response = await api.get(`/construction/materials/${id}`);
    return response.data;
  },

  // Create material (admin only)
  createMaterial: async (materialData: any) => {
    const response = await api.post('/construction/materials', materialData);
    return response.data;
  },

  // Update material (admin only)
  updateMaterial: async (id: string, materialData: any) => {
    const response = await api.put(`/construction/materials/${id}`, materialData);
    return response.data;
  },

  // Delete material (admin only)
  deleteMaterial: async (id: string) => {
    const response = await api.delete(`/construction/materials/${id}`);
    return response.data;
  },

  // Get all machinery
  getMachinery: async () => {
    const response = await api.get('/construction/machinery');
    return response.data;
  },

  // Get machinery by ID
  getMachineryItem: async (id: string) => {
    const response = await api.get(`/construction/machinery/${id}`);
    return response.data;
  },

  // Create machinery (admin only)
  createMachinery: async (machineryData: any) => {
    const response = await api.post('/construction/machinery', machineryData);
    return response.data;
  },

  // Update machinery (admin only)
  updateMachinery: async (id: string, machineryData: any) => {
    const response = await api.put(`/construction/machinery/${id}`, machineryData);
    return response.data;
  },

  // Delete machinery (admin only)
  deleteMachinery: async (id: string) => {
    const response = await api.delete(`/construction/machinery/${id}`);
    return response.data;
  },
};

  // Booking API
export const bookingAPI = {
  // Get all bookings (user's own bookings or admin can see all)
  getBookings: async () => {
    const response = await api.get('/booking');
    return response.data;
  },

  // Get booking by ID
  getBooking: async (id: string) => {
    const response = await api.get(`/booking/${id}`);
    return response.data;
  },

  // Create booking
  createBooking: async (bookingData: any) => {
    const response = await api.post('/booking', bookingData);
    return response.data;
  },

  // Update booking
  updateBooking: async (id: string, bookingData: any) => {
    const response = await api.put(`/booking/${id}`, bookingData);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id: string) => {
    const response = await api.put(`/booking/${id}/cancel`);
    return response.data;
  },

  // Delete booking (admin only)
  deleteBooking: async (id: string) => {
    const response = await api.delete(`/booking/${id}`);
    return response.data;
  },
};

// Payment API
export const paymentAPI = {
  // Get payment methods
  getPaymentMethods: async () => {
    const response = await api.get('/payment/methods');
    return response.data;
  },

  // Initialize Khalti payment
  initKhaltiPayment: async (paymentData: {
    amount: number;
    orderId: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
  }) => {
    const response = await api.post('/payment/khalti/init', paymentData);
    return response.data;
  },

  // Verify Khalti payment
  verifyKhaltiPayment: async (verificationData: any) => {
    const response = await api.post('/payment/khalti/verify', verificationData);
    return response.data;
  },

  // Initialize Esewa payment
  initEsewaPayment: async (paymentData: {
    amount: number;
    orderId: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
  }) => {
    const response = await api.post('/payment/esewa/init', paymentData);
    return response.data;
  },

  // Verify Esewa payment
  verifyEsewaPayment: async (verificationData: any) => {
    const response = await api.post('/payment/esewa/verify', verificationData);
    return response.data;
  },

  // Process Cash on Delivery
  processCOD: async (paymentData: {
    orderId: string;
    amount: number;
  }) => {
    const response = await api.post('/payment/cod/process', paymentData);
    return response.data;
  },

  // Get payment history
  getPaymentHistory: async () => {
    const response = await api.get('/payment/history');
    return response.data;
  },
};

// User API (admin only)
export const userAPI = {
  // Get all users
  getUsers: async () => {
    const response = await api.get('/user');
    return response.data;
  },

  // Get user by ID
  getUser: async (id: string) => {
    const response = await api.get(`/user/${id}`);
    return response.data;
  },

  // Update user
  updateUser: async (id: string, userData: any) => {
    const response = await api.put(`/user/${id}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id: string) => {
    const response = await api.delete(`/user/${id}`);
    return response.data;
  },
};

// Chat API
export const chatAPI = {
  // Get chat messages
  getMessages: async (roomId?: string) => {
    const response = await api.get(`/chat/messages${roomId ? `?roomId=${roomId}` : ''}`);
    return response.data;
  },

  // Send message
  sendMessage: async (messageData: { content: string; roomId?: string }) => {
    const response = await api.post('/chat/messages', messageData);
    return response.data;
  },

  // Get chat rooms
  getRooms: async () => {
    const response = await api.get('/chat/rooms');
      return response.data;
  },
};

// Utility functions
export const isAuthenticated = () => {
  return !!(localStorage.getItem('token') || localStorage.getItem('adminToken'));
};

export const isAdmin = () => {
  const adminUser = localStorage.getItem('adminUser');
  return !!adminUser;
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  const adminUser = localStorage.getItem('adminUser');
  return user ? JSON.parse(user) : adminUser ? JSON.parse(adminUser) : null;
};

export default api;
