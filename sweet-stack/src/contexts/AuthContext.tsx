import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authService } from '@/services/authService';
import { getAuthToken } from '@/lib/api';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sweetshop_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is still authenticated on mount
  useEffect(() => {
    const token = getAuthToken();
    const savedUser = localStorage.getItem('sweetshop_user');
    
    if (token && savedUser) {
      // Token exists, user is logged in
      setUser(JSON.parse(savedUser));
    } else {
      // No token, clear user
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login(email, password);
      
      const newUser: User = {
        id: email, // Using email as ID since backend doesn't return user ID in login
        email: response.email,
        role: response.role as 'user' | 'admin',
      };
      
      setUser(newUser);
      localStorage.setItem('sweetshop_user', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      await authService.register(email, password, 'user');
      
      // After registration, automatically log in
      const loginSuccess = await login(email, password);
      if (loginSuccess && user) {
        // Update user with name
        const updatedUser = { ...user, name };
        setUser(updatedUser);
        localStorage.setItem('sweetshop_user', JSON.stringify(updatedUser));
      }
      return loginSuccess;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    localStorage.removeItem('sweetshop_user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isAdmin: user?.role === 'admin',
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
