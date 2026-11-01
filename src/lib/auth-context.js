"use client";

import { createContext, useContext, useEffect, useState } from "react";

const USER_KEY = "booknook:v1:user";
const PROFILES_KEY = "booknook:v1:profiles";

const DEMO_USER = {
  name: "Ava Reader",
  email: "ava@booknook.demo",
  photo: "",
};

const AuthContext = createContext(null);

function readProfiles() {
  try {
    return JSON.parse(window.localStorage.getItem(PROFILES_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeProfiles(profiles) {
  window.localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

function nameFromEmail(email) {
  const handle = email.split("@")[0] || "Reader";
  return handle
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(USER_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate the mock session once from localStorage
      if (stored) setUser(JSON.parse(stored));
    } catch {
      window.localStorage.removeItem(USER_KEY);
    }
    setReady(true);
  }, []);

  function persistUser(nextUser) {
    setUser(nextUser);
    if (nextUser) {
      window.localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    } else {
      window.localStorage.removeItem(USER_KEY);
    }
  }

  function login(email, password) {
    if (!email || !password) {
      return { ok: false, error: "Enter both your email and password." };
    }
    const normalized = email.trim().toLowerCase();
    const profiles = readProfiles();
    const profile = profiles[normalized];
    if (normalized === DEMO_USER.email) {
      persistUser(DEMO_USER);
      return { ok: true };
    }
    persistUser({
      name: profile?.name || nameFromEmail(normalized),
      email: normalized,
      photo: profile?.photo || "",
    });
    return { ok: true };
  }

  function loginWithGoogle() {
    persistUser(DEMO_USER);
    return { ok: true };
  }

  function register({ name, email, photo }) {
    if (!name || !email) {
      return { ok: false, error: "Name and email are required." };
    }
    const normalized = email.trim().toLowerCase();
    const profiles = readProfiles();
    profiles[normalized] = { name: name.trim(), photo: photo || "" };
    writeProfiles(profiles);
    return { ok: true };
  }

  function logout() {
    persistUser(null);
  }

  const value = {
    user,
    ready,
    isLoggedIn: Boolean(user),
    login,
    loginWithGoogle,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
