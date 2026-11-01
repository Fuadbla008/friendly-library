"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, MoveRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.4-.18-2.05H12v3.87h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.32 2.98-7.35Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.97-.9 6.62-2.42l-3.24-2.51c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.06v2.6A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.41 13.9A6 6 0 0 1 6.1 12c0-.66.11-1.3.31-1.9V7.5H3.06A10 10 0 0 0 2 12c0 1.61.39 3.14 1.06 4.5l3.35-2.6Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.96c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.62 9.62 0 0 0 12 2a10 10 0 0 0-8.94 5.5l3.35 2.6C7.2 7.72 9.4 5.96 12 5.96Z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, ready, login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const rawRedirect = searchParams.get("redirect") || "/";
  const redirectTo = rawRedirect.startsWith("/") ? rawRedirect : "/";

  useEffect(() => {
    if (ready && user) router.replace(redirectTo);
  }, [ready, user, router, redirectTo]);

  function finish(message) {
    toast.success(message);
    router.replace(redirectTo);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const next = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "Enter a valid email address.";
    }
    if (!password) next.password = "Enter your password.";
    setErrors(next);
    if (Object.keys(next).length) return;

    const result = login(email, password);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    finish("Welcome back. Your shelf is ready.");
  }

  function handleGoogle() {
    loginWithGoogle();
    finish("Signed in with Google. Welcome, Ava.");
  }

  function handleDemo() {
    login("ava@booknook.demo", "demo1234");
    finish("You are in the demo library. Have a look around.");
  }

  return (
    <div className="animate-rise">
      <p className="eyebrow">
        <span className="h-px w-7 bg-terracotta/60" />
        Welcome back
      </p>
      <h1 className="mt-4 font-display text-[40px] font-semibold leading-[1.02] tracking-[-0.035em] text-ink sm:text-[44px]">
        Good to see you{" "}
        <em className="font-normal italic text-terracotta">again.</em>
      </h1>
      <p className="mt-3 text-[13px] leading-6 text-ink/70">
        Your loans, your listings, and a few new arrivals are waiting on the shelf.
      </p>

      <button
        type="button"
        onClick={handleGoogle}
        className="mt-7 flex w-full items-center justify-center gap-2.5 rounded-xl border border-line bg-parchment py-3 text-[12px] font-semibold text-ink transition hover:border-ink/25 hover:bg-white"
      >
        <GoogleMark />
        Continue with Google
      </button>

      <div className="my-5 flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-ink/70">
        <span className="h-px flex-1 bg-line" />
        or sign in with email
        <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="field-label" htmlFor="login-email">
            Email address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/70" />
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (errors.email) setErrors((current) => ({ ...current, email: undefined }));
              }}
              placeholder="you@example.com"
              className="field pl-10"
            />
          </div>
          {errors.email ? <p className="field-error">{errors.email}</p> : null}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="field-label mb-0" htmlFor="login-password">
              Password
            </label>
            <button
              type="button"
              onClick={() =>
                toast("Password reset will be available with the live auth API.")
              }
              className="text-[10px] font-semibold text-terracotta/80 transition hover:text-terracotta"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/70" />
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (errors.password) setErrors((current) => ({ ...current, password: undefined }));
              }}
              placeholder="Your password"
              className="field px-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-ink/70 transition hover:bg-ink/5 hover:text-ink/70"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password ? <p className="field-error">{errors.password}</p> : null}
        </div>

        <button type="submit" className="btn-brand w-full">
          Log in to BookNook
          <MoveRight className="h-4 w-4" />
        </button>
      </form>

      <p className="mt-5 text-center text-[12px] text-ink/70">
        New to the nook?{" "}
        <Link
          href={`/register${redirectTo !== "/" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
          className="font-semibold text-terracotta transition hover:text-terracotta-dark"
        >
          Create a library card
        </Link>
      </p>

      <div className="mt-7 rounded-2xl border border-line bg-cream/55 px-4 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold text-ink">Just exploring?</p>
            <p className="mt-0.5 text-[10px] leading-4 text-ink/70">
              Step into the demo account to see loans and listings in action.
            </p>
          </div>
          <button
            type="button"
            onClick={handleDemo}
            className="shrink-0 rounded-full border border-ink/15 bg-parchment px-3.5 py-2 text-[10px] font-semibold text-ink transition hover:border-ink/30 hover:bg-white"
          >
            Enter as Ava
          </button>
        </div>
      </div>

      <p className="mt-5 text-center text-[9px] leading-5 text-ink/70">
        Demo mode for the frontend preview. BetterAuth and the live JWT session will
        replace this screen when the API is connected.
      </p>
    </div>
  );
}
