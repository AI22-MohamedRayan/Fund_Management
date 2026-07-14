import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";
import { getStoredUser, setToken as persistToken, setStoredUser } from "@/lib/api";
import * as authService from "@/services/auth";

const AuthContext = createContext(null);

function isTokenValid() {
  if (typeof window === "undefined") return false;
  const token = window.localStorage.getItem("fms_token");
  if (!token) return false;
  try {
    const { exp } = jwtDecode(token);
    if (!exp) return true;
    return Date.now() < exp * 1000;
  } catch {
    return false;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isTokenValid()) {
      setUser(getStoredUser());
    } else {
      persistToken(null);
      setStoredUser(null);
    }
    setReady(true);
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (payload) => {
    return authService.register(payload);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, ready, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
