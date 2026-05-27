import { createContext, useEffect, useState } from "react";

import apiClient from "../api/apiClient";
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from "../utils/tokenStorage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const isAuthenticated = Boolean(user);

  async function loadCurrentUser() {
    const token = getAccessToken();

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.get("/auth/me");
      setUser(response.data);
    } catch (error) {
      removeAccessToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(accessToken) {
    setAccessToken(accessToken);

    const response = await apiClient.get("/auth/me");
    setUser(response.data);

    return response.data;
  }

  function logout() {
    removeAccessToken();
    setUser(null);
  }

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    loadCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
