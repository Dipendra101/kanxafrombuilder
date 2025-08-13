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
          // Verify token with backend
          try {
            const response = await authAPI.verifyToken(storedToken);

            if (response.success && response.user) {
              setToken(storedToken);
              setUser(response.user);
              console.log("✅ Auth initialized successfully");
            } else {
              // Token is invalid, clear storage
              console.log("❌ Token verification failed, clearing storage");
              localStorage.removeItem("kanxa_token");
              localStorage.removeItem("kanxa_user");
            }
          } catch (tokenError: any) {
            console.log("❌ Token verification error:", tokenError.message);
            // Clear invalid token data
            localStorage.removeItem("kanxa_token");
            localStorage.removeItem("kanxa_user");
          }
        } else {
          console.log("ℹ️  No stored auth data found");
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        // Clear any potentially corrupted data
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
      await new Promise(resolve => setTimeout(resolve, 1000));

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
      updatingFields: Object.keys(userData)
    });

    try {
      const response = await userAPI.updateProfile(userData);

      console.log("📝 AuthContext: Profile update response", {
        success: response.success,
        demo: response.demo,
        message: response.message
      });

      if (response.success && response.user) {
        const updatedUser = response.user;
        setUser(updatedUser);
        localStorage.setItem("kanxa_user", JSON.stringify(updatedUser));

        console.log("✅ AuthContext: User profile updated successfully", {
          userId: updatedUser._id,
          name: updatedUser.name
        });
      } else {
        const errorMessage = response.message || "Profile update failed - no user data returned";
        console.error("❌ AuthContext: Profile update failed:", errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error("💥 AuthContext: Update user error:", {
        message: error.message,
        stack: error.stack
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
      }
    } catch (error) {
      console.error("Refresh user error:", error);
      // If profile fetch fails, user might be logged out
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    isGuest,
    login,
    smsLogin,
    guestLogin,
    register,
    logout,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
