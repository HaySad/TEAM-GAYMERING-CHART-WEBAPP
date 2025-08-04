import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email?: string;
  rating?: number;
  discordRoles?: string[];
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  isGuest: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginAsGuest: () => Promise<{ success: boolean; error?: string }>;
  signup: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState<boolean>(false);

  const isLoggedIn = !!user && !!token;

  // ตรวจสอบสถานะ authentication เมื่อ component mount
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('authToken');
      const isGuestMode = localStorage.getItem('isGuest') === 'true';
      
      if (savedToken && isGuestMode) {
        // Guest mode
        setUser({
          id: 'guest-' + Date.now(),
          username: 'Guest User',
          email: undefined
        });
        setToken(savedToken);
        setIsGuest(true);
      } else if (savedToken) {
        // Regular user mode
        try {
          const response = await fetch('/api/session', {
            headers: {
              'Authorization': `Bearer ${savedToken}`
            }
          });
          const data = await response.json();

          if (data.isValid) {
            setUser(data.user);
            setToken(savedToken);
            setIsGuest(false);
          } else {
            // Token หมดอายุหรือไม่ถูกต้อง
            localStorage.removeItem('authToken');
            localStorage.removeItem('isGuest');
            setToken(null);
            setUser(null);
            setIsGuest(false);
          }
        } catch (error) {
          console.error('Auth check error:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('isGuest');
          setToken(null);
          setUser(null);
          setIsGuest(false);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('authToken', data.token);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const signup = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('authToken', data.token);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Signup failed' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const loginAsGuest = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const guestUser = {
        id: 'guest-' + Date.now(),
        username: 'Guest User',
        email: undefined
      };
      
      setUser(guestUser);
      setIsGuest(true);
      setToken('guest-token');
      localStorage.setItem('authToken', 'guest-token');
      localStorage.setItem('isGuest', 'true');
      
      return { success: true };
    } catch (error) {
      console.error('Guest login error:', error);
      return { success: false, error: 'Guest login failed' };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      if (token && !isGuest) {
        await fetch('/api/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      setIsGuest(false);
      localStorage.removeItem('authToken');
      localStorage.removeItem('isGuest');
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoggedIn,
    isGuest,
    login,
    loginAsGuest,
    signup,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};