"use client";

import {
  createContext,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import type {
  AuthUser,
  LoginInput,
  UpdateProfileInput,
} from "@/src/shared/lib/auth";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export type AuthContextValue = {
  user: AuthUser | null;
  status: AuthStatus;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<AuthUser | null>;
  updateProfile: (input: UpdateProfileInput) => Promise<AuthUser>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

const AUTH_STORAGE_KEY = "mock-auth-session";

function normalizeIdentifier(identifier: string) {
  return identifier.trim();
}

function buildMockUser(identifier: string): AuthUser {
  const normalizedIdentifier = normalizeIdentifier(identifier);
  const normalizedLogin = normalizedIdentifier || "operator";
  const email = normalizedLogin.includes("@")
    ? normalizedLogin
    : `${normalizedLogin}@local.dev`;

  return {
    id: normalizedLogin.toLowerCase(),
    email,
    login: normalizedLogin,
    displayName: normalizedLogin,
    updatedAt: new Date().toISOString(),
  };
}

function readStoredUser(): AuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as AuthUser;
  } catch (error) {
    console.error("Failed to read mock auth session", error);
    return null;
  }
}

function persistUser(user: AuthUser | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (!user) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    const storedUser = readStoredUser();
    setUser(storedUser);
    setStatus(storedUser ? "authenticated" : "unauthenticated");
  }, []);

  async function login(input: LoginInput): Promise<AuthUser> {
    const nextUser = buildMockUser(input.identifier);
    persistUser(nextUser);
    setUser(nextUser);
    setStatus("authenticated");
    return nextUser;
  }

  async function logout(): Promise<void> {
    persistUser(null);
    setUser(null);
    setStatus("unauthenticated");
  }

  async function refreshUser(): Promise<AuthUser | null> {
    const storedUser = readStoredUser();
    setUser(storedUser);
    setStatus(storedUser ? "authenticated" : "unauthenticated");
    return storedUser;
  }

  async function updateProfile(input: UpdateProfileInput): Promise<AuthUser> {
    const currentUser = readStoredUser() ?? user ?? buildMockUser("operator");
    const updatedUser = {
      ...currentUser,
      displayName: input.displayName.trim(),
      updatedAt: new Date().toISOString(),
    };

    persistUser(updatedUser);
    setUser(updatedUser);
    setStatus("authenticated");
    return updatedUser;
  }

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== AUTH_STORAGE_KEY) {
        return;
      }

      const storedUser = readStoredUser();
      setUser(storedUser);
      setStatus(storedUser ? "authenticated" : "unauthenticated");
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        isLoading: status === "loading",
        login,
        logout,
        refreshUser,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
