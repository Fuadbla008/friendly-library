"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import PageLoader from "@/components/PageLoader";

export default function AuthGuard({ children }) {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) {
      const redirect = encodeURIComponent(window.location.pathname);
      router.replace(`/login?redirect=${redirect}`);
    }
  }, [ready, user, router]);

  if (!ready || !user) {
    return <PageLoader label="Checking your library card…" />;
  }

  return children;
}
