'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'field_officer' | 'viewer';
  avatar?: string;
  department?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}



const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

const STORAGE_KEY = 'tablettrack_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // Persist user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {\n    setIsLoading(true);\n    try {\n      const response = await fetch('/api/auth/login', {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify({ email, password }),\n      });\n\n      const data = await response.json();\n      \n      if (data.success && data.user) {\n        // Map Prisma User to frontend User\n        const frontendUser = {\n          ...data.user,\n          role: data.user.role.toLowerCase().replace('_', ' ') as any,\n        };\n        setUser(frontendUser);\n        return true;\n      }\n      return false;\n    } catch (error) {\n      console.error('Login error:', error);\n      return false;\n    } finally {\n      setIsLoading(false);\n    }\n  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const updateProfile = useCallback((updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      return { ...prev, ...updates };
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Helper hook to check role permissions
export function useHasPermission(requiredRoles: User['role'][]) {
  const { user } = useAuth();
  return user ? requiredRoles.includes(user.role) : false;
}
