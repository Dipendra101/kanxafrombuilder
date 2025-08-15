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

        // Store response metadata
        const responseStatus = response.status;
        const responseOk = response.ok;
        const responseStatusText = response.statusText;

        let data: any;
        let responseText: string;

        try {
          // Clone the response to avoid body consumption issues
          const responseClone = response.clone();
          responseText = await responseClone.text();

          // Try to parse as JSON if there's content
          if (responseText && responseText.trim()) {
            try {
              data = JSON.parse(responseText);
            } catch (jsonError) {
              console.warn(
                `⚠️ Non-JSON response from ${url}:`,
                responseText.slice(0, 100),
              );
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
        } catch (readError: any) {
          console.error(
            `❌ Failed to read response for ${url}:`,
            readError.message,
          );

          // Create fallback data structure
          data = {
            success: false,
            message: `HTTP ${responseStatus}: ${responseStatusText}`,
            error: "READ_ERROR",
            details: readError.message,
          };
          responseText = "";
        }

        console.log(`📡 API Response: ${responseStatus} ${url}`, {
          success: data.success,
          message: data.message,
          demo: data.demo,
          attempt: attempt + 1,
        });

        // Handle non-OK responses
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

            // Dispatch token expiry event
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
          console.error(
            `❌ API Error: HTTP ${responseStatus}: ${errorMessage}`,
          );
          throw new Error(`HTTP ${responseStatus}: ${errorMessage}`);
        }

        return data;
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        throw fetchError;
      }
    } catch (error: any) {
      const isLastAttempt = attempt === retries;

      // Check if it's a network/timeout error that we should retry
      const isRetryableError =
        error instanceof TypeError ||
        error.name === "TimeoutError" ||
        error.name === "AbortError" ||
        (error.message && error.message.includes("fetch")) ||
        (error.message && error.message.includes("aborted")) ||
        (error.message && error.message.includes("Failed to fetch")) ||
        (error.message && error.message.includes("NetworkError"));

      // Don't retry HTTP status errors (4xx, 5xx)
      const isHttpStatusError =
        error.message && error.message.startsWith("HTTP ");

      if (isRetryableError && !isHttpStatusError && !isLastAttempt) {
        const delay = Math.min(Math.pow(2, attempt) * 1000, 5000); // Cap at 5 seconds
        console.warn(
          `🔄 API Request failed (attempt ${attempt + 1}/${retries + 1}), retrying in ${delay}ms...`,
          error.message,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      console.error(
        `💥 API Request failed for ${url} (attempt ${attempt + 1}/${retries + 1}):`,
        error.message,
      );

      // Provide better error messages based on error type
      if (isRetryableError && !isHttpStatusError) {
        if (error.message && error.message.includes("Failed to fetch")) {
          throw new Error(
            "Network error: Unable to connect to server. Please check your internet connection and try again.",
          );
        } else if (
          error.name === "AbortError" ||
          (error.message && error.message.includes("timeout"))
        ) {
          throw new Error(
            "Request timeout: The server is taking too long to respond. Please try again.",
          );
        }
      }

      // Re-throw the original error for HTTP status errors or final attempt
      throw error;
    }
  }

  // This shouldn't be reached, but just in case
  throw new Error(`Request failed after ${retries + 1} attempts`);
};

// Helper function to make JSON requests
const jsonRequest = async (endpoint: string, data: any, method = "POST") => {
  return apiRequest(endpoint, {
    method,
    body: JSON.stringify(data),
  });
};

// Helper function to make GET requests
const getRequest = async (endpoint: string) => {
  return apiRequest(endpoint, { method: "GET" });
};

// Helper function to make PUT requests
const putRequest = async (endpoint: string, data: any) => {
  return apiRequest(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Helper function to make DELETE requests
const deleteRequest = async (endpoint: string) => {
  return apiRequest(endpoint, { method: "DELETE" });
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

  smsLogin: async (credentials: { phone: string; code: string }) => {
    return apiRequest("/auth/sms-login", {
      method: "POST",
      body: JSON.stringify(credentials),
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
    profilePicture?: string;
    avatar?: string;
    bio?: string;
    company?: string;
    profile?: {
      bio?: string;
      company?: string;
      occupation?: string;
      website?: string;
    };
  }) => {
    console.log("🔄 API: Updating profile with data:", profileData);
    const response = await apiRequest("/users/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
    console.log("✅ API: Profile update response:", response);
    return response;
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
      category?: string;
      search?: string;
      limit?: number;
      page?: number;
    } = {},
  ) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value.toString());
      }
    });

    return apiRequest(`/services?${params.toString()}`);
  },

  getBuses: async (
    filters: {
      route?: string;
      date?: string;
      search?: string;
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
      truckType?: string;
      route?: string;
      capacity?: string;
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
      limit?: number;
      page?: number;
    } = {},
  ) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value.toString());
      }
    });

    return apiRequest(`/bookings?${params.toString()}`);
  },

  getAllBookings: async (
    filters: {
      status?: string;
      type?: string;
      limit?: number;
      page?: number;
    } = {},
  ) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value.toString());
      }
    });

    return apiRequest(`/admin/bookings?${params.toString()}`);
  },

  getBookingById: async (id: string) => {
    return apiRequest(`/bookings/${id}`);
  },

  updateBooking: async (id: string, data: any) => {
    return apiRequest(`/bookings/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  cancelBooking: async (id: string) => {
    return apiRequest(`/bookings/${id}/cancel`, {
      method: "POST",
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

  getUsers: async (filters: any = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value.toString());
      }
    });

    return apiRequest(`/admin/users?${params.toString()}`);
  },

  updateUserRole: async (userId: string, role: string) => {
    return apiRequest(`/admin/users/${userId}/role`, {
      method: "PUT",
      body: JSON.stringify({ role }),
    });
  },
};

// SMS API
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

// Payment API
export const paymentsAPI = {
  initializeKhalti: async (paymentData: {
    amount: number;
    bookingId: string;
    customerInfo: any;
  }) => {
    return apiRequest("/payments/khalti/initialize", {
      method: "POST",
      body: JSON.stringify(paymentData),
    });
  },

  verifyKhalti: async (token: string, amount: number) => {
    return apiRequest("/payments/khalti/verify", {
      method: "POST",
      body: JSON.stringify({ token, amount }),
    });
  },

  initializeEsewa: async (paymentData: {
    amount: number;
    bookingId: string;
    customerInfo: any;
  }) => {
    return apiRequest("/payments/esewa/initialize", {
      method: "POST",
      body: JSON.stringify(paymentData),
    });
  },

  verifyEsewa: async (data: any) => {
    return apiRequest("/payments/esewa/verify", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

export default apiRequest;
