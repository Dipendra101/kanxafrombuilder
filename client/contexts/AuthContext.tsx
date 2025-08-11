import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authAPI, isAuthenticated, isAdmin, getCurrentUser } from '@/services/api';

interface User {
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

interface AdminUser {
  id: string;
  username: string;
  role: string;
  name: string;
}

interface AuthContextType {
  user: User | AdminUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (username: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateProfile: (profileData: any) => Promise<void>;
  changePassword: (passwordData: any) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (resetData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (isAuthenticated()) {
          const currentUser = getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          } else {
            // Try to get user from API if not in localStorage
            try {
              const response = await authAPI.getCurrentUser();
              if (response.success) {
                setUser(response.data);
                localStorage.setItem('user', JSON.stringify(response.data));
              }
            } catch (error) {
              console.error('Failed to get current user:', error);
              // Clear invalid tokens
              authAPI.logout();
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        authAPI.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      if (response.success) {
        setUser(response.data);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const adminLogin = async (username: string, password: string) => {
    try {
      const response = await authAPI.adminLogin({ username, password });
      if (response.success) {
        setUser(response.data);
        localStorage.setItem('adminToken', response.token);
        localStorage.setItem('adminUser', JSON.stringify(response.data));
      } else {
        throw new Error(response.message || 'Admin login failed');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await authAPI.register(userData);
      if (response.success) {
        setUser(response.data);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    authAPI.logout();
  };

  const updateProfile = async (profileData: any) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      if (response.success) {
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const changePassword = async (passwordData: any) => {
    try {
      const response = await authAPI.changePassword(passwordData);
      if (!response.success) {
        throw new Error(response.message || 'Password change failed');
      }
    } catch (error) {
      console.error('Password change error:', error);
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await authAPI.forgotPassword(email);
      if (!response.success) {
        throw new Error(response.message || 'Forgot password failed');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  };

  const resetPassword = async (resetData: any) => {
    try {
      const response = await authAPI.resetPassword(resetData);
      if (!response.success) {
      throw new Error(response.message || 'Password reset failed');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: isAuthenticated(),
    isAdmin: isAdmin(),
    isLoading,
    login,
    adminLogin,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
