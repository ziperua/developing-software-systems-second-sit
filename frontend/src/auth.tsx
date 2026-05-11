import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import * as api from './api/client';
import type { User } from './types';

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (displayName: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const readStoredUser = () => {
  const raw = localStorage.getItem('movieWatchlistUser');
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as User;
  } catch {
    localStorage.removeItem('movieWatchlistUser');
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState(() => localStorage.getItem('movieWatchlistToken'));
  const [user, setUser] = useState<User | null>(() => readStoredUser());

  const saveSession = (nextToken: string, nextUser: User) => {
    localStorage.setItem('movieWatchlistToken', nextToken);
    localStorage.setItem('movieWatchlistUser', JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const loginUser = async (email: string, password: string) => {
    const result = await api.login(email, password);
    saveSession(result.token, result.user);
  };

  const registerUser = async (displayName: string, email: string, password: string, confirmPassword: string) => {
    const result = await api.register(displayName, email, password, confirmPassword);
    saveSession(result.token, result.user);
  };

  const logout = () => {
    localStorage.removeItem('movieWatchlistToken');
    localStorage.removeItem('movieWatchlistUser');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      loginUser,
      registerUser,
      logout,
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return context;
};
