import React, { createContext, useContext, useEffect, useState } from "react";
import { clearSession, getStoredToken, getStoredUser, saveSession } from "../api/axios";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getStoredUser();
    const token = getStoredToken();
    if (storedUser && token) setUser(storedUser);
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    saveSession(userData, token);
    setUser(userData);
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
