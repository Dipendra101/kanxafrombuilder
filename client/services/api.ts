const API_BASE_URL = "/api";

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem("kanxa_token");
};

// Helper function to create headers
const createHeaders = (includeAuth = true) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Generic API request function with retry logic
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {},
  retries = 2,
) => {
  const url = `${API_BASE_URL}${endpoint}`;

  console.log(`🌐 API Request: ${options.method || "GET"} ${url}`, {
    body: options.body ? "present" : "none",
    hasAuth: !!getAuthToken(),
    retries,
  });

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Create a timeout controller for better browser compatibility
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            ...createHeaders(),
            ...options.headers,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Store response status and headers before any body reading
        const responseStatus = response.status;
        const responseOk = response.ok;
        const responseStatusText = response.statusText;

        // Read response body immediately and store it
        let responseText: string;
        let data: any;
        let parseSuccess = false;

        try {
          // Read response as text first (only way to safely read once)
          responseText = await response.text();

          // Try to parse as JSON
          if (responseText) {
            try {
              data = JSON.parse(responseText);
              parseSuccess = true;
            } catch (jsonError) {
              console.warn(
                `⚠️ Non-JSON response from ${url}:`,
                responseText.slice(0, 100),
              );
              // Create structured response for non-JSON data
              data = {
                success: false,
                message:
                  responseText ||
                  `HTTP ${responseStatus}: ${responseStatusText}`,
                error: "NON_JSON_RESPONSE",
                rawResponse: responseText,
              };
            }
          } else {
            // Empty response
            data = {
              success: false,
              message: `HTTP ${responseStatus}: Empty response`,
              error: "EMPTY_RESPONSE",
            };
          }
        } catch (readError) {
          console.error(`❌ Failed to read response for ${url}:`, readError);
          data = {
            success: false,
            message: `HTTP ${responseStatus}: Failed to read response - ${readError.message}`,
            error: "READ_ERROR",
          };
        }

        console.log(`📡 API Response: ${responseStatus} ${url}`, {
          success: data.success,
          message: data.message,
          demo: data.demo,
          attempt: attempt + 1,
          parseSuccess,
        });

        // Check response status using stored values
        if (!responseOk) {
          // Handle specific auth errors
          if (
            responseStatus === 401 &&
            (data.message?.includes("token") ||
              data.message?.includes("unauthorized") ||
              data.message?.includes("expired"))
          ) {
            console.warn(
              "🔐 Token expired/invalid detected - triggering guest mode switch",
            );

            // Dispatch token expiry event to trigger automatic guest mode
            if (typeof window !== "undefined" && window.dispatchEvent) {
              window.dispatchEvent(
                new CustomEvent("tokenExpired", {
                  detail: {
                    message:
                      "Your session expired. You can continue browsing as a guest or log in again.",
                    source: "api_call",
                    url: url,
                  },
                }),
              );
            }

            // Clear invalid token from storage
            localStorage.removeItem("kanxa_token");
            localStorage.removeItem("kanxa_user");
          }

          const errorMessage =
            data.message || `HTTP ${responseStatus}: Request failed`;
          console.error(`❌ API Error: ${errorMessage}`, data);
          throw new Error(errorMessage);
        }

        return data;
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }
    } catch (error) {
      const isLastAttempt = attempt === retries;

      // Check if it's a network/timeout error that we should retry
      const isRetryableError =
        error instanceof TypeError ||
        error.name === "TimeoutError" ||
        error.name === "AbortError" ||
        (error instanceof Error && error.message.includes("fetch")) ||
        (error instanceof Error && error.message.includes("aborted")) ||
        (error instanceof Error && error.message.includes("Failed to fetch"));

      if (isRetryableError && !isLastAttempt) {
        const delay = Math.min(Math.pow(2, attempt) * 1000, 5000); // Cap at 5 seconds
        console.warn(
          `🔄 API Request failed (attempt ${attempt + 1}/${retries + 1}), retrying in ${delay}ms...`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      console.error(
        `💥 API Request failed for ${url} (attempt ${attempt + 1}/${retries + 1}):`,
        error,
      );

      // Provide better error messages based on error type
      if (isRetryableError) {
        if (error.message.includes("Failed to fetch")) {
          throw new Error(
            "Network error: Unable to connect to server. Please check your internet connection and try again.",
          );
        } else if (
          error.name === "AbortError" ||
          error.message.includes("timeout")
        ) {
          throw new Error(
            "Request timeout: The server is taking too long to respond. Please try again.",
          );
        } else {
          throw new Error(
            "Network error: Unable to connect to server. Please check your internet connection and try again.",
          );
        }
      }
      throw error;
    }
  }
};

// SMS Authentication API
export const smsAPI = {
  sendCode: async (phoneNumber: string) => {
    return apiRequest("/sms/send-code", {
      method: "POST",
      body: JSON.stringify({ phoneNumber }),
    });
  },

  verifyCode: async (phoneNumber: string, code: string) => {
    return apiRequest("/sms/verify-code", {
      method: "POST",
      body: JSON.stringify({ phoneNumber, code }),
    });
  },

  resendCode: async (phoneNumber: string) => {
    return apiRequest("/sms/resend-code", {
      method: "POST",
      body: JSON.stringify({ phoneNumber }),
    });
  },
};

// Authentication API
export const authAPI = {
  register: async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    return apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials: { email: string; password: string }) => {
    return apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  verifyToken: async (token: string) => {
    return apiRequest("/auth/verify-token", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  },

  forgotPassword: async (email: string) => {
    return apiRequest("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    return apiRequest("/users/profile");
  },

  updateProfile: async (profileData: {
    name?: string;
    phone?: string;
    address?: string;
    dateOfBirth?: string;
    preferences?: any;
  }) => {
    return apiRequest("/users/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  },

  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => {
    return apiRequest("/users/change-password", {
      method: "PUT",
      body: JSON.stringify(passwordData),
    });
  },

  // Admin functions
  getAllUsers: async (
    filters: {
      page?: number;
      limit?: number;
      role?: string;
      isActive?: boolean;
    } = {},
  ) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });

    return apiRequest(`/users?${params.toString()}`);
  },

  createUser: async (userData: {
    name: string;
    email: string;
    phone: string;
    role: string;
    isActive: boolean;
  }) => {
    return apiRequest("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  updateUser: async (
    userId: string,
    userData: {
      name?: string;
      email?: string;
      phone?: string;
      role?: string;
      isActive?: boolean;
    },
  ) => {
    return apiRequest(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  },

  deleteUser: async (userId: string) => {
    return apiRequest(`/users/${userId}`, {
      method: "DELETE",
    });
  },
};

// Services API
export const servicesAPI = {
  getAllServices: async (
    filters: {
      type?: string;
      active?: boolean;
      page?: number;
      limit?: number;
    } = {},
  ) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });

    return apiRequest(`/services?${params.toString()}`);
  },

  getBuses: async (
    filters: {
      from?: string;
      to?: string;
      date?: string;
    } = {},
  ) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });

    return apiRequest(`/services/buses?${params.toString()}`);
  },

  getCargo: async (
    filters: {
      vehicleType?: string;
      route?: string;
    } = {},
  ) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });

    return apiRequest(`/services/cargo?${params.toString()}`);
  },

  getConstruction: async (
    filters: {
      category?: string;
      search?: string;
    } = {},
  ) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });

    return apiRequest(`/services/construction?${params.toString()}`);
  },

  getGarage: async (
    filters: {
      serviceType?: string;
      vehicleType?: string;
    } = {},
  ) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });

    return apiRequest(`/services/garage?${params.toString()}`);
  },

  getServiceById: async (id: string) => {
    return apiRequest(`/services/${id}`);
  },

  // Admin functions
  createService: async (serviceData: {
    name: string;
    description: string;
    type: string;
    category: string;
    pricing: {
      basePrice: number;
      currency: string;
    };
    isActive: boolean;
    isFeatured: boolean;
  }) => {
    return apiRequest("/services", {
      method: "POST",
      body: JSON.stringify(serviceData),
    });
  },

  updateService: async (
    serviceId: string,
    serviceData: {
      name?: string;
      description?: string;
      type?: string;
      category?: string;
      pricing?: {
        basePrice: number;
        currency: string;
      };
      isActive?: boolean;
      isFeatured?: boolean;
    },
  ) => {
    return apiRequest(`/services/${serviceId}`, {
      method: "PUT",
      body: JSON.stringify(serviceData),
    });
  },

  deleteService: async (serviceId: string) => {
    return apiRequest(`/services/${serviceId}`, {
      method: "DELETE",
    });
  },
};

// Bookings API
export const bookingsAPI = {
  createBooking: async (bookingData: any) => {
    return apiRequest("/bookings", {
      method: "POST",
      body: JSON.stringify(bookingData),
    });
  },

  getBookings: async (
    filters: {
      status?: string;
      type?: string;
      page?: number;
      limit?: number;
    } = {},
  ) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });

    return apiRequest(`/bookings?${params.toString()}`);
  },

  getBookingById: async (id: string) => {
    return apiRequest(`/bookings/${id}`);
  },

  updateBooking: async (id: string, updateData: any) => {
    return apiRequest(`/bookings/${id}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
  },

  cancelBooking: async (id: string) => {
    return apiRequest(`/bookings/${id}/cancel`, {
      method: "PUT",
    });
  },

  // Admin functions
  getAllBookings: async (
    filters: {
      status?: string;
      userId?: string;
      serviceId?: string;
      page?: number;
      limit?: number;
    } = {},
  ) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });

    return apiRequest(`/admin/bookings?${params.toString()}`);
  },

  updatePayment: async (
    id: string,
    paymentData: {
      paymentStatus: string;
      paymentMethod: string;
      transactionId?: string;
      gatewayResponse?: any;
    },
  ) => {
    return apiRequest(`/bookings/${id}/payment`, {
      method: "PUT",
      body: JSON.stringify(paymentData),
    });
  },
};

// Admin API
export const adminAPI = {
  getDashboard: async () => {
    return apiRequest("/admin/dashboard");
  },

  getStats: async () => {
    return apiRequest("/admin/stats");
  },

  getAnalytics: async (period: string = "30d") => {
    return apiRequest(`/admin/analytics?period=${period}`);
  },

  exportData: async (type: string) => {
    return apiRequest(`/admin/export/${type}`);
  },

  getSystemHealth: async () => {
    return apiRequest("/admin/health");
  },
};

// Payment API
export const paymentAPI = {
  initiatePayment: async (paymentData: {
    amount: number;
    productName: string;
    transactionId: string;
    method: "khalti" | "esewa";
    customerInfo?: {
      name?: string;
      email?: string;
      phone?: string;
    };
  }) => {
    return apiRequest("/payments/initiate", {
      method: "POST",
      body: JSON.stringify(paymentData),
    });
  },

  verifyKhaltiPayment: async (pidx: string) => {
    return apiRequest("/payments/verify/khalti", {
      method: "POST",
      body: JSON.stringify({ pidx }),
    });
  },

  verifyEsewaPayment: async (oid: string, amt: string, refId: string) => {
    return apiRequest("/payments/verify/esewa", {
      method: "POST",
      body: JSON.stringify({ oid, amt, refId }),
    });
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    return apiRequest("/health");
  },
};

export default {
  authAPI,
  smsAPI,
  userAPI,
  servicesAPI,
  bookingsAPI,
  adminAPI,
  paymentAPI,
  healthAPI,
};
