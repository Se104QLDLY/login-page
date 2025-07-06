import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { getMe, login as apiLogin, logout as apiLogout } from '../api/auth.api';
import type { User, LoginCredentials } from '../api/auth.api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  session: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(0);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const currentUser = await getMe();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkUserSession();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    await apiLogin(credentials);
    const currentUser = await getMe();
    setUser(currentUser);
    setSession((prev) => prev + 1);
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
    setSession((prev) => prev + 1);
  };

  const value = { user, isLoading, login, logout, session };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 