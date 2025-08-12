// The base URL for your backend API, read from your .env file
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Helper function to get the auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('kanxa_token');
};

// Helper to create headers for requests, handles both JSON and FormData
const createHeaders = (includeAuth = true, isFormData = false) => {
  const headers: Record<string, string> = {};

  // Don't set Content-Type for FormData; the browser does it automatically with a boundary
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  // If authentication is required, add the Bearer token to the Authorization header
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

// Generic API request function to handle all calls
export const apiRequest = async (endpoint: string, options: RequestInit = {}, isFormData = false) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...createHeaders(true, isFormData),
      ...options.headers,
    },
  });

  // Try to parse the response as JSON. Handle cases where the response might be empty.
  let data;
  try {
    data = await response.json();
  } catch (error) {
    // If response is not JSON (e.g., empty 204 No Content response), data remains undefined
  }

  if (!response.ok) {
    // Use the error message from the parsed JSON body, or provide a default error message
    throw new Error(data?.message || 'An API error occurred');
  }

  return data;
};


// --- Authentication API ---
export const authAPI = {
  register: async (userData: { name: string; email: string; phone: string; password: string }) => {
    return apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(userData) });
  },

  login: async (credentials: { email: string; password: string }) => {
    // *** FIX #1: Added robustness for the login error ***
    // This ensures the body is always a correctly formatted JSON object string, even if the calling function makes a mistake.
    const body = typeof credentials === 'string' ? credentials : JSON.stringify(credentials);
    return apiRequest('/auth/login', { method: 'POST', body });
  },

  // *** FIX #2: Corrected logic for verifying a session token ***
  // This function no longer needs to accept a token argument.
  // The generic `apiRequest` function automatically adds the token from localStorage to the header.
  // Your backend route `/auth/verify-token` should simply use your `verifyToken` middleware.
  verifyToken: async () => {
    return apiRequest('/auth/verify-token', { method: 'POST' }); // Body is no longer needed
  },

  forgotPassword: async (email: string) => {
    return apiRequest('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
  },

  changePassword: async (passwordData: { currentPassword: string; newPassword: string; }) => {
    return apiRequest('/auth/change-password', { method: 'POST', body: JSON.stringify(passwordData) });
  },

  sendVerificationEmail: async () => {
    return apiRequest('/auth/send-verification-email', { method: 'POST' });
  },

  verifyEmailCode: async (code: string) => {
    return apiRequest('/auth/verify-email-code', { method: 'POST', body: JSON.stringify({ code }) });
  },
};


// --- User Profile API ---
export const userAPI = {
  getProfile: async () => {
    return apiRequest('/users/profile');
  },
  updateProfile: async (profileData: any) => {
    return apiRequest('/users/profile', { method: 'PUT', body: JSON.stringify(profileData) });
  },
  getActivity: async () => {
    return apiRequest('/users/activity');
  },
  getLoyalty: async () => {
    return apiRequest('/users/loyalty');
  },
  getNotifications: async () => {
    return apiRequest('/users/notifications');
  },
  updateNotifications: async (notificationData: any) => {
    return apiRequest('/users/notifications', { method: 'PUT', body: JSON.stringify(notificationData) });
  },
  uploadProfilePicture: async (formData: FormData) => {
    return apiRequest('/users/profile/picture', {
      method: 'POST',
      body: formData,
    }, true); // Pass true to indicate this is a FormData request
  },
};


// --- Services API ---
export const servicesAPI = {
  getBuses: async (filters: { from?: string; to?: string; date?: string } = {}) => {
    const params = new URLSearchParams(filters as Record<string, string>);
    return apiRequest(`/services/buses?${params.toString()}`);
  },
  getCargo: async (filters: { vehicleType?: string; route?: string } = {}) => {
    const params = new URLSearchParams(filters as Record<string, string>);
    return apiRequest(`/services/cargo?${params.toString()}`);
  },
  getConstruction: async (filters: { category?: string; search?: string } = {}) => {
    const params = new URLSearchParams(filters as Record<string, string>);
    return apiRequest(`/services/construction?${params.toString()}`);
  },
  getGarage: async (filters: { serviceType?: string; vehicleType?: string } = {}) => {
    const params = new URLSearchParams(filters as Record<string, string>);
    return apiRequest(`/services/garage?${params.toString()}`);
  },
  getServiceById: async (id: string) => {
    return apiRequest(`/services/${id}`);
  },
};


// --- Bookings API ---
export const bookingsAPI = {
  createBooking: async (bookingData: any) => {
    return apiRequest('/bookings', { method: 'POST', body: JSON.stringify(bookingData) });
  },
  getBookings: async (filters: { status?: string; type?: string } = {}) => {
    const params = new URLSearchParams(filters as Record<string, string>);
    return apiRequest(`/bookings?${params.toString()}`);
  },
  getBookingById: async (id: string) => {
    return apiRequest(`/bookings/${id}`);
  },
  updateBooking: async (id: string, updateData: any) => {
    return apiRequest(`/bookings/${id}`, { method: 'PUT', body: JSON.stringify(updateData) });
  },
  cancelBooking: async (id: string) => {
    return apiRequest(`/bookings/${id}/cancel`, { method: 'PUT' });
  },
  updatePayment: async (id: string, paymentData: any) => {
    return apiRequest(`/bookings/${id}/payment`, { method: 'PUT', body: JSON.stringify(paymentData) });
  },
};


// --- Health Check API ---
export const healthAPI = {
  check: async () => {
    return apiRequest('/health');
  },
};