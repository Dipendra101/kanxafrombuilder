import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authAPI, userAPI } from "@/services/api";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  profilePicture?: string;
  address?: string;
  dateOfBirth?: string;
  preferences?: any;
  isEmailVerified?: boolean;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
  networkError: boolean;
  login: (email: string, password: string) => Promise<void>;
  smsLogin: (phone: string, code: string) => Promise<void>;
  guestLogin: () => void;
  register: (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
  retryConnection: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  const isAuthenticated = !!user && !!token;

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem("kanxa_token");
        const storedUser = localStorage.getItem("kanxa_user");
        const storedGuest = localStorage.getItem("kanxa_guest");

        if (storedGuest === "true") {
          setIsGuest(true);
          console.log("ℹ️  Guest mode restored");
        } else if (storedToken && storedUser) {
          // Try to verify token with graceful fallback
          try {
            console.log("🔄 Verifying stored authentication...");

            // Add timeout to verification to prevent hanging
            const response = await Promise.race([
              authAPI.verifyToken(storedToken),
              new Promise((_, reject) =>
                setTimeout(
                  () => reject(new Error("Token verification timeout")),
                  8000,
                ),
              ),
            ]);

            if (response.success && response.user) {
              setToken(storedToken);
              setUser(response.user);
              setNetworkError(false);
              console.log("✅ Auth initialized successfully");
            } else {
              // Token is invalid/expired - switch to guest mode instead of full logout
              console.log("🔄 Token expired - switching to guest mode");
              localStorage.removeItem("kanxa_token");
              localStorage.removeItem("kanxa_user");

              // Automatically switch to guest mode for better UX
              await guestLogin();
              setNetworkError(false);

              // Show user-friendly notification
              setTimeout(() => {
                if (typeof window !== 'undefined' && window.dispatchEvent) {
                  window.dispatchEvent(new CustomEvent('tokenExpired', {
                    detail: { message: 'Your session expired. You can continue browsing as a guest or log in again.' }
                  }));
                }
              }, 1000);
            }
          } catch (tokenError: any) {
            console.log("⚠️ Auth initialization error:", tokenError.message);

            // Better network error detection
            const isNetworkError =
              tokenError.message.includes("fetch") ||
              tokenError.message.includes("Network") ||
              tokenError.message.includes("timeout") ||
              tokenError.name === "TypeError" ||
              tokenError.message.includes("Unable to connect");

            if (isNetworkError) {
              console.log("🌐 Network issue detected - preserving auth state");
              setNetworkError(true);

              // Use cached user data during network issues
              try {
                const userData = JSON.parse(storedUser);
                setToken(storedToken);
                setUser(userData);
                console.log("💾 Using cached auth data during network issues");
              } catch (parseError) {
                console.log("❌ Failed to parse cached user data");
                // Only clear if we can't parse the data
                localStorage.removeItem("kanxa_token");
                localStorage.removeItem("kanxa_user");
                setNetworkError(false);
              }
            } else {
              // Clear invalid token data for non-network errors
              console.log("🗑️ Clearing invalid auth data");
              localStorage.removeItem("kanxa_token");
              localStorage.removeItem("kanxa_user");
              setNetworkError(false);
            }
          }
        } else {
          console.log("ℹ️  No stored auth data found");
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        // Only clear data if it's not a network-related error
        if (!(error instanceof TypeError && error.message.includes("fetch"))) {
          localStorage.removeItem("kanxa_token");
          localStorage.removeItem("kanxa_user");
          localStorage.removeItem("kanxa_guest");
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authAPI.login({ email, password });

      if (response.success) {
        setUser(response.user);
        setToken(response.token);

        // Store in localStorage
        localStorage.setItem("kanxa_token", response.token);
        localStorage.setItem("kanxa_user", JSON.stringify(response.user));
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    try {
      setIsLoading(true);
      const response = await authAPI.register(userData);

      if (response.success) {
        setUser(response.user);
        setToken(response.token);

        // Store in localStorage
        localStorage.setItem("kanxa_token", response.token);
        localStorage.setItem("kanxa_user", JSON.stringify(response.user));
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const smsLogin = async (phone: string, code: string) => {
    try {
      setIsLoading(true);

      // Simulate SMS verification API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, accept any 6-digit code
      if (code.length !== 6) {
        throw new Error("Invalid verification code");
      }

      // Create user with phone number
      const smsUser = {
        _id: `sms_${Date.now()}`,
        name: "SMS User",
        email: "",
        phone: phone,
        role: "user",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockToken = `sms_token_${Date.now()}`;

      setUser(smsUser);
      setToken(mockToken);
      setIsGuest(false);

      // Store in localStorage
      localStorage.setItem("kanxa_token", mockToken);
      localStorage.setItem("kanxa_user", JSON.stringify(smsUser));
      localStorage.removeItem("kanxa_guest");
    } catch (error) {
      console.error("SMS login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const guestLogin = () => {
    setIsGuest(true);
    setUser(null);
    setToken(null);
    localStorage.setItem("kanxa_guest", "true");
    localStorage.removeItem("kanxa_token");
    localStorage.removeItem("kanxa_user");
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsGuest(false);
    localStorage.removeItem("kanxa_token");
    localStorage.removeItem("kanxa_user");
    localStorage.removeItem("kanxa_guest");
  };

  const updateUser = async (userData: Partial<User>) => {
    console.log("🔄 AuthContext: Updating user profile", {
      userId: user?._id,
      updatingFields: Object.keys(userData),
    });

    try {
      const response = await userAPI.updateProfile(userData);

      console.log("📝 AuthContext: Profile update response", {
        success: response.success,
        demo: response.demo,
        message: response.message,
      });

      if (response.success && response.user) {
        const updatedUser = response.user;
        setUser(updatedUser);
        localStorage.setItem("kanxa_user", JSON.stringify(updatedUser));

        console.log("✅ AuthContext: User profile updated successfully", {
          userId: updatedUser._id,
          name: updatedUser.name,
        });
      } else {
        const errorMessage =
          response.message || "Profile update failed - no user data returned";
        console.error("❌ AuthContext: Profile update failed:", errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error("💥 AuthContext: Update user error:", {
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const response = await userAPI.getProfile();

      if (response.success) {
        setUser(response.user);
        localStorage.setItem("kanxa_user", JSON.stringify(response.user));
        setNetworkError(false); // Clear network error on successful request
      }
    } catch (error) {
      console.error("Refresh user error:", error);
      // Check if it's a network error
      if (error instanceof Error && error.message.includes("Network")) {
        setNetworkError(true);
      } else {
        // If profile fetch fails for other reasons, user might be logged out
        logout();
      }
    }
  };

  const retryConnection = async () => {
    console.log("🔄 Retrying connection...");
    setNetworkError(false);

    const storedToken = localStorage.getItem("kanxa_token");
    const storedUser = localStorage.getItem("kanxa_user");

    if (storedToken && storedUser) {
      try {
        // Add timeout to retry as well
        const response = await Promise.race([
          authAPI.verifyToken(storedToken),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Retry timeout")), 5000),
          ),
        ]);

        if (response.success && response.user) {
          setToken(storedToken);
          setUser(response.user);
          setNetworkError(false);
          console.log("✅ Connection retry successful");
        } else {
          console.log("❌ Token invalid during retry");
          setNetworkError(false);
          localStorage.removeItem("kanxa_token");
          localStorage.removeItem("kanxa_user");
          setToken(null);
          setUser(null);
        }
      } catch (error) {
        console.error("❌ Connection retry failed:", error);
        setNetworkError(true);

        // Keep using cached data if network still has issues
        try {
          const userData = JSON.parse(storedUser);
          if (!user) {
            setToken(storedToken);
            setUser(userData);
            console.log("💾 Keeping cached auth during retry failure");
          }
        } catch (parseError) {
          console.log("❌ Unable to use cached data");
        }
      }
    } else {
      setNetworkError(false);
      console.log("ℹ️ No stored credentials to retry with");
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    isGuest,
    networkError,
    login,
    smsLogin,
    guestLogin,
    register,
    logout,
    updateUser,
    refreshUser,
    retryConnection,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
