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
  avatar?: string;
  address?: string | object;
  dateOfBirth?: string;
  preferences?: any;
  isEmailVerified?: boolean;
  createdAt?: string;
  profile?: {
    bio?: string;
    company?: string;
    occupation?: string;
    website?: string;
  };
  bio?: string;
  company?: string;
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
  handleTokenExpiry: (error: any) => Promise<boolean>;
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

  const isAuthenticated = !!user && !!token && !isGuest;

  // Production-ready token expiry handler
  const handleTokenExpiry = async (error: any) => {
    const isTokenExpired =
      error?.status === 401 ||
      error?.message?.includes("token") ||
      error?.message?.includes("unauthorized") ||
      error?.message?.includes("expired");

    if (isTokenExpired && isAuthenticated) {
      console.log("🔄 Token expired - logging out user");

      // Clear auth data
      localStorage.removeItem("kanxa_token");
      localStorage.removeItem("kanxa_user");
      setToken(null);
      setUser(null);
      setIsGuest(false);

      // Show notification to user
      setTimeout(() => {
        if (typeof window !== "undefined" && window.dispatchEvent) {
          window.dispatchEvent(
            new CustomEvent("tokenExpired", {
              detail: {
                message: "Your session expired. Please log in again.",
              },
            }),
          );
        }
      }, 500);

      return true;
    }

    return false;
  };

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const storedToken = localStorage.getItem("kanxa_token");
        const storedUser = localStorage.getItem("kanxa_user");
        const storedGuest = localStorage.getItem("kanxa_guest");

        if (storedGuest === "true") {
          setIsGuest(true);
          console.log("ℹ️  Guest mode restored");
        } else if (storedToken && storedUser) {
          try {
            console.log("🔄 Verifying stored authentication...");

            const response = await Promise.race([
              authAPI.verifyToken(storedToken),
              new Promise((_, reject) =>
                setTimeout(
                  () => reject(new Error("Token verification timeout")),
                  10000,
                ),
              ),
            ]);

            if (response.success && response.user) {
              setToken(storedToken);
              setUser(response.user);
              setNetworkError(false);
              console.log("✅ Auth initialized successfully");
            } else {
              console.log("🔄 Token expired - clearing auth data");
              localStorage.removeItem("kanxa_token");
              localStorage.removeItem("kanxa_user");
              setToken(null);
              setUser(null);
            }
          } catch (error: any) {
            console.log("⚠️ Auth initialization error:", error.message);

            // Check for network errors only
            const isNetworkError =
              error.message.includes("fetch") ||
              error.message.includes("Network") ||
              error.message.includes("timeout") ||
              error.name === "TypeError";

            if (isNetworkError) {
              console.log("���� Network issue detected during auth init");
              setNetworkError(true);

              // Use cached data during network issues
              try {
                const userData = JSON.parse(storedUser);
                setToken(storedToken);
                setUser(userData);
                console.log("💾 Using cached auth data during network issues");
              } catch (parseError) {
                console.log("❌ Failed to parse cached user data");
                localStorage.removeItem("kanxa_token");
                localStorage.removeItem("kanxa_user");
              }
            } else {
              // Clear invalid auth data
              console.log("🧹 Clearing invalid auth data");
              localStorage.removeItem("kanxa_token");
              localStorage.removeItem("kanxa_user");
            }
          }
        } else {
          console.log("ℹ️  No stored auth data found");
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        // Clear potentially corrupted data
        localStorage.removeItem("kanxa_token");
        localStorage.removeItem("kanxa_user");
        localStorage.removeItem("kanxa_guest");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setNetworkError(false);

      const response = await authAPI.login({ email, password });

      if (response.success) {
        setUser(response.user);
        setToken(response.token);
        setIsGuest(false);

        // Store in localStorage
        localStorage.setItem("kanxa_token", response.token);
        localStorage.setItem("kanxa_user", JSON.stringify(response.user));
        localStorage.removeItem("kanxa_guest");
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error: any) {
      console.error("Login error:", error);

      // Check for network errors
      if (
        error.message?.includes("fetch") ||
        error.message?.includes("Network")
      ) {
        setNetworkError(true);
      }

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
      setNetworkError(false);

      const response = await authAPI.register(userData);

      if (response.success) {
        setUser(response.user);
        setToken(response.token);
        setIsGuest(false);

        // Store in localStorage
        localStorage.setItem("kanxa_token", response.token);
        localStorage.setItem("kanxa_user", JSON.stringify(response.user));
        localStorage.removeItem("kanxa_guest");
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (error: any) {
      console.error("Registration error:", error);

      // Check for network errors
      if (
        error.message?.includes("fetch") ||
        error.message?.includes("Network")
      ) {
        setNetworkError(true);
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Production-ready SMS login with real API integration
  const smsLogin = async (phone: string, code: string) => {
    try {
      setIsLoading(true);
      setNetworkError(false);

      // Call real SMS authentication API
      const response = await authAPI.smsLogin({ phone, code });

      if (response.success) {
        setUser(response.user);
        setToken(response.token);
        setIsGuest(false);

        // Store in localStorage
        localStorage.setItem("kanxa_token", response.token);
        localStorage.setItem("kanxa_user", JSON.stringify(response.user));
        localStorage.removeItem("kanxa_guest");
      } else {
        throw new Error(response.message || "SMS verification failed");
      }
    } catch (error: any) {
      console.error("SMS login error:", error);

      // Check for network errors
      if (
        error.message?.includes("fetch") ||
        error.message?.includes("Network")
      ) {
        setNetworkError(true);
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const guestLogin = () => {
    setIsGuest(true);
    setUser(null);
    setToken(null);
    setNetworkError(false);
    localStorage.setItem("kanxa_guest", "true");
    localStorage.removeItem("kanxa_token");
    localStorage.removeItem("kanxa_user");
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsGuest(false);
    setNetworkError(false);
    localStorage.removeItem("kanxa_token");
    localStorage.removeItem("kanxa_user");
    localStorage.removeItem("kanxa_guest");
  };

  const updateUser = async (userData: Partial<User>) => {
    console.log("🔄 AuthContext: Updating user profile", {
      userId: user?.id,
      updatingFields: Object.keys(userData),
      userData: userData, // Debug: log the actual data being sent
    });

    try {
      const response = await userAPI.updateProfile(userData);

      if (response.success && response.user) {
        const updatedUser = response.user;
        setUser(updatedUser);
        localStorage.setItem("kanxa_user", JSON.stringify(updatedUser));

        console.log("✅ AuthContext: User profile updated successfully", {
          userId: updatedUser.id,
          name: updatedUser.name,
        });
      } else {
        const errorMessage = response.message || "Profile update failed";
        console.error("❌ AuthContext: Profile update failed:", errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error("💥 AuthContext: Update user error:", error);

      // Check for network errors
      if (
        error.message?.includes("fetch") ||
        error.message?.includes("Network")
      ) {
        setNetworkError(true);
      }

      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const response = await userAPI.getProfile();

      if (response.success && response.user) {
        setUser(response.user);
        localStorage.setItem("kanxa_user", JSON.stringify(response.user));
        setNetworkError(false);
      } else {
        throw new Error("Failed to refresh user profile");
      }
    } catch (error: any) {
      console.error("Refresh user error:", error);

      // Check for network errors
      if (
        error.message?.includes("fetch") ||
        error.message?.includes("Network")
      ) {
        setNetworkError(true);
      } else {
        // If profile fetch fails for other reasons (like 401), handle token expiry
        await handleTokenExpiry(error);
      }
    }
  };

  const retryConnection = async () => {
    console.log("🔄 Retrying connection...");
    setNetworkError(false);

    const storedToken = localStorage.getItem("kanxa_token");

    if (storedToken) {
      try {
        const response = await Promise.race([
          authAPI.verifyToken(storedToken),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Retry timeout")), 8000),
          ),
        ]);

        if (response.success && response.user) {
          setToken(storedToken);
          setUser(response.user);
          setNetworkError(false);
          console.log("✅ Connection retry successful");
        } else {
          console.log("❌ Token invalid during retry");
          localStorage.removeItem("kanxa_token");
          localStorage.removeItem("kanxa_user");
          setToken(null);
          setUser(null);
        }
      } catch (error: any) {
        console.error("��� Connection retry failed:", error);
        setNetworkError(true);
      }
    } else {
      console.log("ℹ️ No stored token to retry with");
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
    handleTokenExpiry,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
