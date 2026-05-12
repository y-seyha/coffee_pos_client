"use client";

import { apiService } from "@/helper/crud.helper";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

type Role = "admin" | "user";

interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

interface RegisterResponse {
  message: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;

  login: (payload: LoginPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "token";
const USER_KEY = "user";

const saveAuth = (token: string, user: User) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  const expires = new Date(Date.now() + 2 * 60 * 60 * 1000).toUTCString();

  document.cookie =
    `token=${token}; ` + `expires=${expires}; ` + `path=/; ` + `SameSite=Lax`;
};

const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);

  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};
const getStoredUser = (): User | null => {
  if (typeof window === "undefined") return null;

  const storedUser = localStorage.getItem(USER_KEY);

  return storedUser ? JSON.parse(storedUser) : null;
};

const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;

  return localStorage.getItem(TOKEN_KEY);
};

const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePassword = (password: string) => {
  return password.length >= 6;
};

const validateName = (name: string) => {
  return name.trim().length >= 2;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const [token, setToken] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getStoredUser();
    const storedToken = getStoredToken();

    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }

    setLoading(false);
  }, []);

  const login = async ({ email, password }: LoginPayload): Promise<User> => {
    // validation
    if (!validateEmail(email)) {
      throw new Error("Invalid email");
    }

    if (!password.trim()) {
      throw new Error("Password is required");
    }

    try {
      const data = await apiService.post<AuthResponse, LoginPayload>("/login", {
        email,
        password,
      });

      if (!data.token || !data.user) {
        throw new Error("Invalid server response");
      }

      saveAuth(data.token, data.user);
      console.log(data.token, "Token");
      console.log(data.user, "User");

    
      setUser(data.user);
      setToken(data.token);

      return data.user;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || "Login failed";

      throw new Error(message);
    }
  };

  const register = async ({
    name,
    email,
    password,
    role = "user",
  }: RegisterPayload): Promise<void> => {
    if (!validateName(name)) {
      throw new Error("Name must be at least 2 characters");
    }

    if (!validateEmail(email)) {
      throw new Error("Invalid email");
    }

    if (!validatePassword(password)) {
      throw new Error("Password must be at least 6 characters");
    }

    await apiService.post<RegisterResponse, RegisterPayload>("/register", {
      name,
      email,
      password,
      role,
    });
  };

  const logout = async (): Promise<void> => {
    try {
      await apiService.post("/logout");
    } catch (error) {
      console.error(error);
    } finally {
      clearAuth();

      setUser(null);
      setToken(null);
    }
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: !!token,

      login,
      register,
      logout,
    }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
