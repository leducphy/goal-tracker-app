import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, LoginRequest, RegisterRequest } from '../api/services/authService';
import { UserData } from '../utils/tokenStorage';
import { userService } from '../utils/userService';

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
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
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      
      // First check if user is logged in via userService
      const isLoggedIn = await userService.isLoggedIn();
      
      if (isLoggedIn) {
        const userData = await userService.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
        console.log('✅ User loaded from storage:', userData);
      } else {
        // Fallback to authService for backward compatibility
        const authenticated = await authService.isAuthenticated();
        
        if (authenticated) {
          const userResponse = await authService.getCurrentUser();
          setUser(userResponse.data);
          setIsAuthenticated(true);
          console.log('✅ User loaded from authService:', userResponse.data);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          console.log('❌ No authenticated user found');
        }
      }
    } catch (error) {
      console.error('❌ Error checking auth status:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      // Check authentication status and user data
      const isLoggedIn = await userService.isLoggedIn();
      
      if (isLoggedIn) {
        const userData = await userService.getCurrentUser();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
          console.log('✅ User data refreshed and authenticated:', userData);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          console.log('❌ No user data found, setting unauthenticated');
        }
      } else {
        // Fallback to authService for backward compatibility
        const authenticated = await authService.isAuthenticated();
        
        if (authenticated) {
          const userResponse = await authService.getCurrentUser();
          setUser(userResponse.data);
          setIsAuthenticated(true);
          console.log('✅ User refreshed via authService:', userResponse.data);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          console.log('❌ No authenticated user found during refresh');
        }
      }
    } catch (error) {
      console.error('❌ Error refreshing user data:', error);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await userService.clearUserData();
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      console.log('✅ User logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      await authService.register(userData);
      console.log('✅ User registered successfully');
    } catch (error) {
      console.error('❌ Error registering user:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 