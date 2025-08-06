"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth-context";
import type { User, Permission } from "@/types";

type UserProviderProps = {
  children: React.ReactNode;
};

type UserProviderState = {
  currentUser: User | null;
  permissions: Permission[];
  userRole: string | null;
  canEdit: boolean;
  canComment: boolean;
  canView: boolean;
  loading: boolean;
  fetchPermissions: () => void;
};

const initialState: UserProviderState = {
  currentUser: null,
  permissions: [],
  userRole: null,
  canEdit: false,
  canComment: false,
  canView: false,
  loading: true,
  fetchPermissions: () => null,
};

const UserProviderContext = createContext<UserProviderState>(initialState);

export function UserProvider({ children, ...props }: UserProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { currentSession } = useAuth();

  // Convert auth session to user
  useEffect(() => {
    if (currentSession) {
      const user: User = {
        id: currentSession.userId,
        name: currentSession.name,
        email: currentSession.email,
      };
      setCurrentUser(user);
    } else {
      setCurrentUser(null);
    }
  }, [currentSession]);

  const fetchPermissions = async () => {
    try {
      const response = await fetch('/api/permissions');
      const data = await response.json();
      setPermissions(data);
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  // Determine user's role and capabilities
  const userPermission = currentUser 
    ? permissions.find(p => p.userId === currentUser.id && p.status === 'accepted')
    : null;
  
  // Give new users default owner permissions
  const userRole = userPermission?.role || 'owner';
  const canEdit = userRole === 'owner' || userRole === 'editor';
  const canComment = userRole === 'owner' || userRole === 'editor' || userRole === 'commentor';
  const canView = userRole === 'owner' || userRole === 'editor' || userRole === 'viewer' || userRole === 'commentor';

  const value = {
    currentUser,
    permissions,
    userRole,
    canEdit,
    canComment,
    canView,
    loading,
    fetchPermissions,
  };

  return (
    <UserProviderContext.Provider {...props} value={value}>
      {children}
    </UserProviderContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserProviderContext);

  if (context === undefined)
    throw new Error("useUser must be used within a UserProvider");

  return context;
};