'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthState } from '@/types';
import { mockUsers } from '@/data/mockData';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (email: string, password: string, name: string, role: 'driver' | 'dispatcher' | 'admin') => Promise<boolean>;
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
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored session on mount
    const storedUser = localStorage.getItem('trucking_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('trucking_user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simple mock authentication - in real app, this would make API call
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password === 'password123') { // Mock password
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('trucking_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const signup = async (email: string, password: string, name: string, role: 'driver' | 'dispatcher' | 'admin'): Promise<boolean> => {
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return false;
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role,
    };

    // In a real app, this would save to backend
    mockUsers.push(newUser);
    
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('trucking_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('trucking_user');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};