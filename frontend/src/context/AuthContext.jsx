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
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = Boolean(user);

  function setAuthHeader(token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  function clearAuthHeader() {
    delete apiClient.defaults.headers.common.Authorization;
  }

  async function loadCurrentUser() {
    const token = getAccessToken();

    if (!token) {
      clearAuthHeader();
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      setAuthHeader(token);

      const response = await apiClient.get("/auth/me");

      setUser(response.data);
    } catch (error) {
      removeAccessToken();
      clearAuthHeader();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(accessToken) {
    setAccessToken(accessToken);
    setAuthHeader(accessToken);

    const response = await apiClient.get("/auth/me");

    setUser(response.data);

    return response.data;
  }

  function logout() {
    removeAccessToken();
    clearAuthHeader();
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
