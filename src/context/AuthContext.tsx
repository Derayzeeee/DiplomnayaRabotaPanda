'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { checkAuthStatus } from '@/lib/client-auth';

// Добавляем интерфейс для пользователя
interface User {
  userId: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  updateAuthStatus: () => Promise<void>;
  user: User | null;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const updateAuthStatus = async () => {
    try {
      const status = await checkAuthStatus();
      setIsAuthenticated(status);
      
      if (status) {
        // Получаем информацию о пользователе
        const response = await fetch('/api/auth/user');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error updating auth status:', error);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  useEffect(() => {
    updateAuthStatus();
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        setIsAuthenticated, 
        updateAuthStatus,
        user,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}