"use client";

import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth-context";
import { LibraryProvider } from "@/lib/library-context";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <LibraryProvider>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#1d3b32",
              color: "#fbf8f1",
              border: "1px solid rgba(217, 164, 65, 0.25)",
              borderRadius: "14px",
              fontSize: "13px",
              fontWeight: "500",
            },
          }}
        />
      </LibraryProvider>
    </AuthProvider>
  );
}
