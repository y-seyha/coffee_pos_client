"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { apiRequest } from "@/helper/api.helper";
import { User } from "@/types";
import {toast} from "sonner";
import {successToast} from "@/components/ui/successToast";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  const fetchMe = async () => {
    setLoading(true);

    try {
      const res = await apiRequest<{ user: User }>("get", "/auth/me");

      if (res?.user) {
        setUser(res.user);
      } else {
        setUser(null);
      }
    } catch (err: any) {
      setUser(null);

      if (err?.status !== 401) {
        console.error("fetchMe error:", err);
        toast.error("Failed to load user session");
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: { email: string; password: string }) => {
    setLoading(true);

    const loadingToast = toast.loading("Logging in...");

    try {
      await apiRequest("post", "/auth/login", data);

      await fetchMe();

      toast.dismiss(loadingToast);

      successToast("Login successful", "Welcome back ", 5000);
    } catch (err) {
      toast.dismiss(loadingToast);

      toast.error("Invalid email or password");

      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);

    const loadingToast = toast.loading("Logging out...");

    try {
      await apiRequest("post", "/auth/logout");

      toast.success("Logged out");
    } catch (err) {
      console.error("Logout API failed:", err);
      toast.error("Logout failed");
    } finally {
      toast.dismiss(loadingToast);

      setUser(null);
      setLoading(false);

      window.location.href = "/auth/login";
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (window.location.pathname !== "/auth/login") {
          await fetchMe();
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Auth init error:", err);
        toast.error("Auth initialization failed");
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
      <AuthContext.Provider
          value={{
            user,
            loading,
            isAuthenticated,
            login,
            logout,
            fetchMe,
          }}
      >
        {children}
      </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}