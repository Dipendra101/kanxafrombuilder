// const API_BASE_URL = '/api';

// // Helper function to get auth token
// const getAuthToken = () => {
//   return localStorage.getItem('kanxa_token');
// };

// // Helper function to create headers
// const createHeaders = (includeAuth = true) => {
//   const headers: Record<string, string> = {
//     'Content-Type': 'application/json',
//   };

//   if (includeAuth) {
//     const token = getAuthToken();
//     if (token) {
//       headers['Authorization'] = `Bearer ${token}`;
//     }
//   }

//   return headers;
// };

// // Generic API request function
// const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
//   const url = `${API_BASE_URL}${endpoint}`;
  
//   const response = await fetch(url, {
//     ...options,
//     headers: {
//       ...createHeaders(),
//       ...options.headers,
//     },
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || 'API request failed');
//   }

//   return data;
// };

// // Authentication API
// export const authAPI = {
//   register: async (userData: {
//     name: string;
//     email: string;
//     phone: string;
//     password: string;
//   }) => {
//     return apiRequest('/auth/register', {
//       method: 'POST',
//       body: JSON.stringify(userData),
//     });
//   },

//   login: async (credentials: { email: string; password: string }) => {
//     return apiRequest('/auth/login', {
//       method: 'POST',
//       body: JSON.stringify(credentials),
//     });
//   },

//   verifyToken: async (token: string) => {
//     return apiRequest('/auth/verify-token', {
//       method: 'POST',
//       body: JSON.stringify({ token }),
//     });
//   },

//   forgotPassword: async (email: string) => {
//     return apiRequest('/auth/forgot-password', {
//       method: 'POST',
//       body: JSON.stringify({ email }),
//     });
//   },
// };

// // User API
// export const userAPI = {
//   getProfile: async () => {
//     return apiRequest('/users/profile');
//   },

//   updateProfile: async (profileData: {
//     name?: string;
//     phone?: string;
//     address?: string;
//     dateOfBirth?: string;
//     preferences?: any;
//   }) => {
//     return apiRequest('/users/profile', {
//       method: 'PUT',
//       body: JSON.stringify(profileData),
//     });
//   },

//   changePassword: async (passwordData: {
//     currentPassword: string;
//     newPassword: string;
//   }) => {
//     return apiRequest('/users/change-password', {
//       method: 'PUT',
//       body: JSON.stringify(passwordData),
//     });
//   },
// };

// // Services API
// export const servicesAPI = {
//   getAllServices: async (filters: {
//     type?: string;
//     active?: boolean;
//     page?: number;
//     limit?: number;
//   } = {}) => {
//     const params = new URLSearchParams();
//     Object.entries(filters).forEach(([key, value]) => {
//       if (value !== undefined) {
//         params.append(key, value.toString());
//       }
//     });
    
//     return apiRequest(`/services?${params.toString()}`);
//   },

//   getBuses: async (filters: {
//     from?: string;
//     to?: string;
//     date?: string;
//   } = {}) => {
//     const params = new URLSearchParams();
//     Object.entries(filters).forEach(([key, value]) => {
//       if (value) {
//         params.append(key, value);
//       }
//     });
    
//     return apiRequest(`/services/buses?${params.toString()}`);
//   },

//   getCargo: async (filters: {
//     vehicleType?: string;
//     route?: string;
//   } = {}) => {
//     const params = new URLSearchParams();
//     Object.entries(filters).forEach(([key, value]) => {
//       if (value) {
//         params.append(key, value);
//       }
//     });
    
//     return apiRequest(`/services/cargo?${params.toString()}`);
//   },

//   getConstruction: async (filters: {
//     category?: string;
//     search?: string;
//   } = {}) => {
//     const params = new URLSearchParams();
//     Object.entries(filters).forEach(([key, value]) => {
//       if (value) {
//         params.append(key, value);
//       }
//     });
    
//     return apiRequest(`/services/construction?${params.toString()}`);
//   },

//   getGarage: async (filters: {
//     serviceType?: string;
//     vehicleType?: string;
//   } = {}) => {
//     const params = new URLSearchParams();
//     Object.entries(filters).forEach(([key, value]) => {
//       if (value) {
//         params.append(key, value);
//       }
//     });
    
//     return apiRequest(`/services/garage?${params.toString()}`);
//   },

//   getServiceById: async (id: string) => {
//     return apiRequest(`/services/${id}`);
//   },
// };

// // Bookings API
// export const bookingsAPI = {
//   createBooking: async (bookingData: any) => {
//     return apiRequest('/bookings', {
//       method: 'POST',
//       body: JSON.stringify(bookingData),
//     });
//   },

//   getBookings: async (filters: {
//     status?: string;
//     type?: string;
//     page?: number;
//     limit?: number;
//   } = {}) => {
//     const params = new URLSearchParams();
//     Object.entries(filters).forEach(([key, value]) => {
//       if (value !== undefined) {
//         params.append(key, value.toString());
//       }
//     });
    
//     return apiRequest(`/bookings?${params.toString()}`);
//   },

//   getBookingById: async (id: string) => {
//     return apiRequest(`/bookings/${id}`);
//   },

//   updateBooking: async (id: string, updateData: any) => {
//     return apiRequest(`/bookings/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(updateData),
//     });
//   },

//   cancelBooking: async (id: string) => {
//     return apiRequest(`/bookings/${id}/cancel`, {
//       method: 'PUT',
//     });
//   },

//   updatePayment: async (id: string, paymentData: {
//     paymentStatus: string;
//     paymentMethod: string;
//     transactionId?: string;
//     gatewayResponse?: any;
//   }) => {
//     return apiRequest(`/bookings/${id}/payment`, {
//       method: 'PUT',
//       body: JSON.stringify(paymentData),
//     });
//   },
// };

// // Health check
// export const healthAPI = {
//   check: async () => {
//     return apiRequest('/health');
//   },
// };

// export default {
//   authAPI,
//   userAPI,
//   servicesAPI,
//   bookingsAPI,
//   healthAPI,
// };





const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('kanxa_token');
};

// Helper function to create standard headers for requests
const createHeaders = (includeAuth = true) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

// Generic API request function to handle all fetch calls
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...createHeaders(),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};

// --- Authentication API ---
export const authAPI = {
  // --- Existing Methods ---
  register: async (userData: { name: string; email: string; phone: string; password: string }) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  login: async (credentials: { email: string; password: string }) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  verifyToken: async (token: string) => {
    return apiRequest('/auth/verify-token', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },
  forgotPassword: async (email: string) => {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // --- NEW Methods ---
  changePassword: async (passwordData: { currentPassword: string; newPassword: string; }) => {
    return apiRequest('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  },

  sendVerificationEmail: async () => {
    return apiRequest('/auth/send-verification-email', {
      method: 'POST',
    });
  },

  verifyEmailCode: async (code: string) => {
    return apiRequest('/auth/verify-email-code', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  },
};

// --- User Profile API ---
// export const userAPI = {
//   getProfile: async () => {
//     return apiRequest('/users/profile');
//   },
//   updateProfile: async (profileData: any) => {
//     return apiRequest('/users/profile', {
//       method: 'PUT',
//       body: JSON.stringify(profileData),
//     });
//   },
//   changePassword: async (passwordData: { currentPassword: string; newPassword: string }) => {
//     return apiRequest('/users/change-password', {
//       method: 'PUT',
//       body: JSON.stringify(passwordData),
//     });
//   },
// };
export const userAPI = {
  getProfile: async () => {
    return apiRequest('/users/profile');
  },
  updateProfile: async (profileData: any) => {
    return apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
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
    return apiRequest('/users/notifications', {
      method: 'PUT',
      body: JSON.stringify(notificationData),
    });
  },
}

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
    return apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },
  getBookings: async (filters: { status?: string; type?: string } = {}) => {
    const params = new URLSearchParams(filters as Record<string, string>);
    return apiRequest(`/bookings?${params.toString()}`);
  },
  getBookingById: async (id: string) => {
    return apiRequest(`/bookings/${id}`);
  },
  updateBooking: async (id: string, updateData: any) => {
    return apiRequest(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },
  cancelBooking: async (id: string) => {
    return apiRequest(`/bookings/${id}/cancel`, {
      method: 'PUT',
    });
  },
  updatePayment: async (id: string, paymentData: any) => {
    return apiRequest(`/bookings/${id}/payment`, {
      method: 'PUT',
      body: JSON.stringify(paymentData),
    });
  },
};


// --- Health Check API ---
export const healthAPI = {
  check: async () => {
    return apiRequest('/health');
  },
};