"use client";

import { createContext, useContext } from "react";
import { authClient } from "@/lib/auth-client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user
    ? {
        id: session.user.id,
        name: session.user.name || session.user.email,
        email: session.user.email,
        photo: session.user.image || "",
      }
    : null;

  const value = {
    user,
    ready: !isPending,
    isLoggedIn: Boolean(user),
    login: (email, password) =>
      authClient.signIn.email({
        email: email.trim().toLowerCase(),
        password,
        rememberMe: true,
      }),
    loginWithGoogle: (callbackURL = "/") =>
      authClient.signIn.social({ provider: "google", callbackURL }),
    register: ({ name, email, photo, password }) =>
      authClient.signUp.email({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        image: photo || undefined,
      }),
    logout: () => authClient.signOut(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
