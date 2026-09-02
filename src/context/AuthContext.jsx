import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { loginApi, meApi, signupApi, updateProfileApi } from "../api/authApi";
import { ROLES, STORAGE_KEYS } from "../config/constants";

const AuthContext = createContext(null);

function readStoredSession() {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || "null");

    if (token && user?.email) {
      return { token, user };
    }
  } catch {
    // Corrupted storage falls through to a logged-out state.
  }

  return null;
}

function persistSession(token, user) {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const session = readStoredSession();

    if (!session) {
      setInitializing(false);
      return;
    }

    let cancelled = false;

    const validateSession = async () => {
      try {
        const profile = await meApi(session.token);

        if (!cancelled) {
          const freshUser = {
            ...session.user,
            ...(profile?.name ? { name: profile.name } : {}),
            ...(profile?.phone ? { phone: profile.phone } : {}),
            role: profile?.role || session.user.role,
            email: profile?.email || session.user.email,
          };
          persistSession(session.token, freshUser);
          setUser(freshUser);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
      } finally {
        if (!cancelled) {
          setInitializing(false);
        }
      }
    };

    validateSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await loginApi(email, password);

    persistSession(data.access_token, data.user);
    localStorage.setItem(STORAGE_KEYS.LAST_LOGIN, new Date().toISOString());
    setUser(data.user);

    return data.user;
  }, []);

  const signup = useCallback(async (name, email, password) => {
    const data = await signupApi(name, email, password);

    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.LAST_LOGIN);
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (phone) => {
    const updated = await updateProfileApi(phone);

    setUser(updated);
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      persistSession(token, updated);
    }

    return updated;
  }, []);

  const value = useMemo(
    () => ({
      user,
      initializing,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === ROLES.ADMIN,
      login,
      signup,
      logout,
      updateProfile,
    }),
    [user, initializing, login, signup, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
}
