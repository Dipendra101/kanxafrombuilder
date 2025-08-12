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
  const [isLoading, setIsLoading] = useState(true); // Start true to show loading state on initial load
  const navigate = useNavigate();

  // This useEffect runs only once on initial app load to check for an existing session
  useEffect(() => {
    const verifyUserSession = async () => {
      const token = localStorage.getItem('kanxa_token');

      // Only try to verify if a token actually exists
      if (token) {
        try {
          // *** THE FIX IS HERE ***
          // Call verifyToken WITHOUT any arguments.
          // The apiRequest helper in `api.ts` automatically finds the token in localStorage and adds it to the header.
          const response = await authAPI.verifyToken();
          
          if (response.success) {
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
  }, []); // The empty dependency array ensures this runs only once

  const login = async (credentials: any) => {
    try {
      const response = await authAPI.login(credentials);
      if (response.success) {
        // Set state first
        setUser(response.user);
        setIsAuthenticated(true);
        // Then set localStorage
        localStorage.setItem('kanxa_token', response.token);
        return response;
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error; // Re-throw the error so the login form can catch it and display a message
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
    // Clear state and localStorage
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('kanxa_token');
    // Redirect to login page
    navigate('/login');
  };

  // Provide the context value to all children components
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily consume the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};