"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import type { CurrentSession } from "@/types";

type AuthProviderProps = {
  children: React.ReactNode;
};

type AuthProviderState = {
  currentSession: CurrentSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (name: string, email: string) => void;
  logout: () => void;
  createGuestSession: () => void;
};

const initialState: AuthProviderState = {
  currentSession: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => null,
  logout: () => null,
  createGuestSession: () => null,
};

const AuthProviderContext = createContext<AuthProviderState>(initialState);

export function AuthProvider({ children, ...props }: AuthProviderProps) {
  const [currentSession, setCurrentSession] = useState<CurrentSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const storedSession = localStorage?.getItem('test-dashboard-session');
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession);
        session.createdAt = new Date(session.createdAt);
        setCurrentSession(session);
      } catch (error) {
        console.error('Failed to parse stored session:', error);
        localStorage?.removeItem('test-dashboard-session');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (name: string, email: string) => {
    const session: CurrentSession = {
      userId: uuidv4(),
      name,
      email,
      createdAt: new Date(),
    };
    
    setCurrentSession(session);
    localStorage?.setItem('test-dashboard-session', JSON.stringify(session));
  };

  const logout = () => {
    setCurrentSession(null);
    localStorage?.removeItem('test-dashboard-session');
  };

  const createGuestSession = () => {
    const guestId = uuidv4();
    const session: CurrentSession = {
      userId: guestId,
      name: `Guest User`,
      email: `guest-${guestId.slice(0, 8)}@example.com`,
      createdAt: new Date(),
    };
    
    setCurrentSession(session);
    localStorage?.setItem('test-dashboard-session', JSON.stringify(session));
  };

  const value = {
    currentSession,
    isAuthenticated: !!currentSession,
    isLoading,
    login,
    logout,
    createGuestSession,
  };

  return (
    <AuthProviderContext.Provider {...props} value={value}>
      {children}
    </AuthProviderContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthProviderContext);

  if (context === undefined)
    throw new Error("useAuth must be used within an AuthProvider");

  return context;
};