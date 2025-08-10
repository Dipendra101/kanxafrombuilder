import { toast } from 'sonner';

const API_BASE_URL = 'http://localhost:8080/api';

// Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  company?: string;
  role: 'customer' | 'admin';
  isVerified: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface BusService {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface CargoService {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface TourPackage {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  _id: string;
  userId: string;
  serviceType: 'bus' | 'cargo' | 'tour';
  serviceId: BusService | CargoService | TourPackage;
  bookingDate: string;
  travelDate: string;
  passengers: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'khalti' | 'esewa' | 'cash' | 'bank_transfer';
  contactInfo: {
    name: string;
    phone: string;
    email: string;
    address?: string;
  };
  specialRequests?: string;
  bookingReference: string;
  createdAt: string;
  updatedAt: string;
}

// API Client Class
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Set token for authentication
  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  // Get current token
  getToken(): string | null {
    return this.token;
  }

  // Auth API
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await this.request<{ data: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.success && response.data) {
      this.setToken(response.data.token);
      return { user: response.data.data, token: response.data.token };
    }
    
    throw new Error(response.error || 'Login failed');
  }

  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    address?: string;
    company?: string;
  }): Promise<{ user: User; token: string }> {
    const response = await this.request<{ data: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.success && response.data) {
      this.setToken(response.data.token);
      return { user: response.data.data, token: response.data.token };
    }
    
    throw new Error(response.error || 'Registration failed');
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.request<User>('/auth/me');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to get user data');
  }

  async updateProfile(profileData: Partial<User>): Promise<User> {
    const response = await this.request<User>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to update profile');
  }

  async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<void> {
    const response = await this.request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to change password');
    }
  }

  async forgotPassword(email: string): Promise<void> {
    const response = await this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to send reset email');
    }
  }

  async resetPassword(resetData: {
    token: string;
    password: string;
    confirmPassword: string;
  }): Promise<void> {
    const response = await this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(resetData),
    });
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to reset password');
    }
  }

  // Transportation API
  async getBusServices(params?: {
    query?: string;
    route?: string;
    type?: string;
  }): Promise<BusService[]> {
    const searchParams = new URLSearchParams();
    if (params?.query) searchParams.append('query', params.query);
    if (params?.route) searchParams.append('route', params.route);
    if (params?.type) searchParams.append('type', params.type);

    const response = await this.request<{ data: BusService[] }>(`/transportation/buses?${searchParams}`);
    
    if (response.success && response.data) {
      return response.data.data;
    }
    
    throw new Error(response.error || 'Failed to fetch bus services');
  }

  async getBusService(id: string): Promise<BusService> {
    const response = await this.request<{ data: BusService }>(`/transportation/buses/${id}`);
    
    if (response.success && response.data) {
      return response.data.data;
    }
    
    throw new Error(response.error || 'Failed to fetch bus service');
  }

  async getCargoServices(params?: {
    query?: string;
    type?: string;
  }): Promise<CargoService[]> {
    const searchParams = new URLSearchParams();
    if (params?.query) searchParams.append('query', params.query);
    if (params?.type) searchParams.append('type', params.type);

    const response = await this.request<{ data: CargoService[] }>(`/transportation/cargo?${searchParams}`);
    
    if (response.success && response.data) {
      return response.data.data;
    }
    
    throw new Error(response.error || 'Failed to fetch cargo services');
  }

  async getCargoService(id: string): Promise<CargoService> {
    const response = await this.request<{ data: CargoService }>(`/transportation/cargo/${id}`);
    
    if (response.success && response.data) {
      return response.data.data;
    }
    
    throw new Error(response.error || 'Failed to fetch cargo service');
  }

  async getTourPackages(params?: {
    query?: string;
    category?: string;
    difficulty?: string;
  }): Promise<TourPackage[]> {
    const searchParams = new URLSearchParams();
    if (params?.query) searchParams.append('query', params.query);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.difficulty) searchParams.append('difficulty', params.difficulty);

    const response = await this.request<{ data: TourPackage[] }>(`/transportation/tours?${searchParams}`);
    
    if (response.success && response.data) {
      return response.data.data;
    }
    
    throw new Error(response.error || 'Failed to fetch tour packages');
  }

  async getTourPackage(id: string): Promise<TourPackage> {
    const response = await this.request<{ data: TourPackage }>(`/transportation/tours/${id}`);
    
    if (response.success && response.data) {
      return response.data.data;
    }
    
    throw new Error(response.error || 'Failed to fetch tour package');
  }

  async searchTransportation(params: {
    query?: string;
    route?: string;
    date?: string;
    type?: 'bus' | 'cargo' | 'tour';
  }): Promise<{
    buses?: BusService[];
    cargo?: CargoService[];
    tours?: TourPackage[];
  }> {
    const searchParams = new URLSearchParams();
    if (params.query) searchParams.append('query', params.query);
    if (params.route) searchParams.append('route', params.route);
    if (params.date) searchParams.append('date', params.date);
    if (params.type) searchParams.append('type', params.type);

    const response = await this.request<{ data: any }>(`/transportation/search?${searchParams}`);
    
    if (response.success && response.data) {
      return response.data.data;
    }
    
    throw new Error(response.error || 'Failed to search transportation');
  }

  // Booking API
  async createBooking(bookingData: {
    serviceType: 'bus' | 'cargo' | 'tour';
    serviceId: string;
    travelDate: string;
    passengers: number;
    paymentMethod: 'khalti' | 'esewa' | 'cash' | 'bank_transfer';
    contactInfo: {
      name: string;
      phone: string;
      email: string;
      address?: string;
    };
    specialRequests?: string;
  }): Promise<Booking> {
    const response = await this.request<{ data: Booking }>('/booking', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
    
    if (response.success && response.data) {
      return response.data.data;
    }
    
    throw new Error(response.error || 'Failed to create booking');
  }

  async getMyBookings(): Promise<Booking[]> {
    const response = await this.request<{ data: Booking[] }>('/booking/my-bookings');
    
    if (response.success && response.data) {
      return response.data.data;
    }
    
    throw new Error(response.error || 'Failed to fetch bookings');
  }

  async getBooking(id: string): Promise<Booking> {
    const response = await this.request<{ data: Booking }>(`/booking/${id}`);
    
    if (response.success && response.data) {
      return response.data.data;
    }
    
    throw new Error(response.error || 'Failed to fetch booking');
  }

  async cancelBooking(id: string): Promise<Booking> {
    const response = await this.request<{ data: Booking }>(`/booking/${id}/cancel`, {
      method: 'POST',
    });
    
    if (response.success && response.data) {
      return response.data.data;
    }
    
    throw new Error(response.error || 'Failed to cancel booking');
  }

  // Admin API
  async getAllBookings(params?: {
    status?: string;
    serviceType?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    bookings: Booking[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.serviceType) searchParams.append('serviceType', params.serviceType);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const response = await this.request<{ data: Booking[]; pagination: any }>(`/booking?${searchParams}`);
    
    if (response.success && response.data) {
      return {
        bookings: response.data.data,
        pagination: response.data.pagination,
      };
    }
    
    throw new Error(response.error || 'Failed to fetch bookings');
  }

  async updateBookingStatus(id: string, status: string): Promise<Booking> {
    const response = await this.request<{ data: Booking }>(`/booking/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    
    if (response.success && response.data) {
      return response.data.data;
    }
    
    throw new Error(response.error || 'Failed to update booking status');
  }

  async getTransportationStats(): Promise<{
    totalServices: number;
    buses: number;
    cargo: number;
    tours: number;
  }> {
    const response = await this.request<{ data: any }>('/transportation/stats');
    
    if (response.success && response.data) {
      return response.data.data;
    }
    
    throw new Error(response.error || 'Failed to fetch transportation stats');
  }

  // Health check
  async healthCheck(): Promise<{ message: string; status: string; database: string }> {
    const response = await this.request<{ message: string; status: string; database: string }>('/ping');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Health check failed');
  }
}

// Create singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Utility function for API calls with loading and error handling
export async function apiCall<T>(
  apiFunction: () => Promise<T>,
  options: {
    loadingMessage?: string;
    successMessage?: string;
    errorMessage?: string;
    showToast?: boolean;
  } = {}
): Promise<T> {
  const {
    loadingMessage = 'Loading...',
    successMessage,
    errorMessage = 'Something went wrong',
    showToast = true,
  } = options;

  let toastId: string | number | undefined;

  try {
    if (showToast && loadingMessage) {
      toastId = toast.loading(loadingMessage);
    }

    const result = await apiFunction();

    if (showToast) {
      if (toastId) {
        toast.dismiss(toastId);
      }
      if (successMessage) {
        toast.success(successMessage);
      }
    }

    return result;
  } catch (error) {
    if (showToast) {
      if (toastId) {
        toast.dismiss(toastId);
      }
      toast.error(errorMessage || (error instanceof Error ? error.message : 'Something went wrong'));
    }
    throw error;
  }
}

export default apiClient;
