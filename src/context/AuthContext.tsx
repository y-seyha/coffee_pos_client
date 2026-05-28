"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";

import { apiRequest } from "@/helper/api.helper";
import { User } from "@/types";
import { toast } from "sonner";
import { successToast } from "@/components/ui/successToast";
import { useRouter } from "next/navigation";

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

  const router = useRouter();
  const isAuthenticated = !!user;

  const fetchMe = useCallback(async () => {
    try {
      const res = await apiRequest<{ user: User }>("get", "/auth/me");

      setUser(res?.user ?? null);
    } catch (err: any) {
      setUser(null);

      if (err?.status !== 401) {
        console.error("fetchMe error:", err);
        toast.error("Failed to load session");
      }
    }
  }, []);

  const login = async (data: { email: string; password: string }) => {
    setLoading(true);

    const loadingToast = toast.loading("Logging in...");

    try {
      const res = await apiRequest<{ user: User }>(
          "post",
          "/auth/login",
          data
      );

      setUser(res.user);

      toast.dismiss(loadingToast);
      successToast("Login successful", "Welcome back ", 3000);

      router.push("/");
    } catch (err) {
      toast.error("Invalid email or password");
      throw err;
    } finally {
      toast.dismiss(loadingToast);
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);

    const loadingToast = toast.loading("Logging out...");

    try {
      await apiRequest("post", "/auth/logout");

      setUser(null);

      toast.success("Logged out");

      router.push("/auth/login"); // SPA navigation
    } catch (err) {
      console.error("Logout API failed:", err);
      toast.error("Logout failed");
    } finally {
      toast.dismiss(loadingToast);
      setLoading(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);

      if (window.location.pathname !== "/auth/login") {
        await fetchMe();
      }

      setLoading(false);
    };

    initAuth();
  }, [fetchMe]);

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