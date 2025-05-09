"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
  checkAuthStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Check token on initial load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('authToken', token);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    try {
      // Call logout API if needed
      const token = localStorage.getItem('authToken');
      if (token) {
        await fetch("http://localhost:8000/users/logout/", {
          method: "POST",
          headers: {
            "Authorization": `Token ${token}`,
            "Content-Type": "application/json"
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem('authToken');
      setIsLoggedIn(false);
    }
  };

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setIsLoggedIn(false);
      return false;
    }

    try {
      const res = await fetch("http://localhost:8000/users/profile/", {
        headers: {
          "Authorization": `Token ${token}`
        }
      });
      
      if (res.ok) {
        setIsLoggedIn(true);
        return true;
      } else {
        // Token is invalid
        localStorage.removeItem('authToken');
        setIsLoggedIn(false);
        return false;
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, checkAuthStatus }}>
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