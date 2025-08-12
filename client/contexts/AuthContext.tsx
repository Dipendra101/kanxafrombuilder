import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/services/api';

// Interface for the User object
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Interface for the context's value
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<any>;
  register: (userData: any) => Promise<any>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start true to show a loader on initial page load
  const navigate = useNavigate();

  // *** THIS IS THE CRITICAL FIX FOR STATE MANAGEMENT ***
  // This useEffect runs only once on initial app load to check for an existing session.
  useEffect(() => {
    const verifyUserSession = async () => {
      const token = localStorage.getItem('kanxa_token');

      // Only try to verify if a token actually exists in storage
      if (token) {
        try {
          // Call verifyToken WITHOUT any arguments.
          // The api.ts service automatically finds the token and adds it to the request header.
          const response = await authAPI.verifyToken();
          
          if (response.success) {
            // If the server confirms the token is valid, restore the user state
            setUser(response.user);
            setIsAuthenticated(true);
          } else {
            // This case handles a token that is present but invalid (e.g., expired)
            localStorage.removeItem('kanxa_token');
          }
        } catch (error) {
          console.error("Session verification failed:", error);
          // If the API call fails (e.g., 401 Unauthorized), remove the bad token
          localStorage.removeItem('kanxa_token');
        }
      }
      
      // We have finished checking for a token, so we are no longer loading
      setIsLoading(false);
    };

    verifyUserSession();
  }, []); // The empty dependency array [] ensures this runs only once

  const login = async (credentials: any) => {
    try {
      const response = await authAPI.login(credentials);
      if (response.success) {
        // Set state first
        setUser(response.user);
        setIsAuthenticated(true);
        // Then set the token in localStorage
        localStorage.setItem('kanxa_token', response.token);
        return response;
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error; // Re-throw the error so the login form can catch it
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await authAPI.register(userData);
      return response;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = () => {
    // Clear React state and localStorage
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('kanxa_token');
    // Redirect to login page to prevent access to protected routes
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout }}>
      {/* Don't render the rest of the app until the session check is complete */}
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily use the AuthContext in other components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};