"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  Check,
  Eye,
  EyeOff,
  Image as ImageIcon,
  LockKeyhole,
  Mail,
  MoveRight,
  UserRound,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.05H12v3.87h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.32 2.98-7.35Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.42l-3.24-2.51c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.06v2.6A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.41 13.9A6 6 0 0 1 6.1 12c0-.66.11-1.3.31-1.9V7.5H3.06A10 10 0 0 0 2 12c0 1.61.39 3.14 1.06 4.5l3.35-2.6Z" />
      <path fill="#EA4335" d="M12 5.96c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.62 9.62 0 0 0 12 2a10 10 0 0 0-8.94 5.5l3.35 2.6C7.2 7.72 9.4 5.96 12 5.96Z" />
    </svg>
  );
}

const passwordRules = [
  { key: "length", label: "6+ characters", test: (value) => value.length >= 6 },
  { key: "upper", label: "One uppercase letter", test: (value) => /[A-Z]/.test(value) },
  { key: "lower", label: "One lowercase letter", test: (value) => /[a-z]/.test(value) },
];

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, loginWithGoogle, logout } = useAuth();
  const [values, setValues] = useState({ name: "", email: "", photo: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  const rawRedirect = searchParams.get("redirect") || "";
  const redirectTo = rawRedirect.startsWith("/") ? rawRedirect : "";
  const loginHref = redirectTo
    ? `/login?redirect=${encodeURIComponent(redirectTo)}`
    : "/login";

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const next = {};
    if (!values.name.trim()) next.name = "Tell us what to call you.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      next.email = "Enter a valid email address.";
    }
    if (!passwordRules.every((rule) => rule.test(values.password))) {
      next.password = "Your password does not meet all three rules yet.";
    }
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      const { error } = await register({
        name: values.name,
        email: values.email,
        photo: values.photo,
        password: values.password,
      });
      if (error) {
        toast.error(error.message || "Could not create your account.");
        return;
      }

      // The assignment expects a fresh login after registration.
      await logout();
      toast.success("Your library card is ready. Log in to start borrowing.");
      router.push(loginHref);
    } catch (error) {
      toast.error(error.message || "Could not create your account.");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setGoogleBusy(true);
    try {
      const { error } = await loginWithGoogle(redirectTo || "/");
      if (error) {
        toast.error(error.message || "Google sign-in could not start.");
        setGoogleBusy(false);
      }
    } catch (error) {
      toast.error(error.message || "Google sign-in could not start.");
      setGoogleBusy(false);
    }
  }

  return (
    <div className="animate-rise">
      <p className="eyebrow">
        <span className="h-px w-7 bg-terracotta/60" />
        A library card, free forever
      </p>
      <h1 className="mt-4 font-display text-[40px] font-semibold leading-[1.02] tracking-[-0.035em] text-ink sm:text-[44px]">
        Join the{" "}
        <em className="font-normal italic text-terracotta">nook.</em>
      </h1>
      <p className="mt-3 text-[13px] leading-6 text-ink/70">
        Borrow books, share the ones you love, and keep good stories moving through
        the neighborhood.
      </p>

      <button
        type="button"
        onClick={handleGoogle}
        disabled={googleBusy}
        className="mt-7 flex w-full items-center justify-center gap-2.5 rounded-xl border border-line bg-parchment py-3 text-[12px] font-semibold text-ink transition hover:border-ink/25 hover:bg-white disabled:opacity-60"
      >
        <GoogleMark />
        {googleBusy ? "Opening Google…" : "Continue with Google"}
      </button>

      <div className="my-5 flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-ink/70">
        <span className="h-px flex-1 bg-line" />
        or create an account
        <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="field-label" htmlFor="register-name">
            Your name
          </label>
          <div className="relative">
            <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/70" />
            <input
              id="register-name"
              value={values.name}
              onChange={(event) => update("name", event.target.value)}
              placeholder="Ava Reader"
              autoComplete="name"
              className={cn("field pl-10", errors.name && "border-terracotta/70 ring-4 ring-terracotta/10")}
            />
          </div>
          {errors.name ? <p className="field-error">{errors.name}</p> : null}
        </div>

        <div>
          <label className="field-label" htmlFor="register-email">
            Email address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/70" />
            <input
              id="register-email"
              type="email"
              value={values.email}
              onChange={(event) => update("email", event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className={cn("field pl-10", errors.email && "border-terracotta/70 ring-4 ring-terracotta/10")}
            />
          </div>
          {errors.email ? <p className="field-error">{errors.email}</p> : null}
        </div>

        <div>
          <label className="field-label" htmlFor="register-photo">
            Photo URL <span className="normal-case tracking-normal text-ink/70">(optional)</span>
          </label>
          <div className="relative">
            <ImageIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/70" />
            <input
              id="register-photo"
              value={values.photo}
              onChange={(event) => update("photo", event.target.value)}
              placeholder="https://… a photo of you"
              className="field pl-10"
            />
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="register-password">
            Password
          </label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/70" />
            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              value={values.password}
              onChange={(event) => update("password", event.target.value)}
              placeholder="At least 6 characters"
              autoComplete="new-password"
              className={cn("field px-10", errors.password && "border-terracotta/70 ring-4 ring-terracotta/10")}
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

          <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5">
            {passwordRules.map((rule) => {
              const passed = rule.test(values.password);
              return (
                <span
                  key={rule.key}
                  className={cn(
                    "inline-flex items-center gap-1.5 text-[10px] font-medium transition",
                    passed ? "text-[#3d6a50]" : "text-ink/70"
                  )}
                >
                  <span
                    className={cn(
                      "grid h-3.5 w-3.5 place-items-center rounded-full border",
                      passed ? "border-[#4f7a5f] bg-[#4f7a5f] text-parchment" : "border-ink/20"
                    )}
                  >
                    {passed ? <Check className="h-2.5 w-2.5" /> : <X className="h-2.5 w-2.5 text-ink/70" />}
                  </span>
                  {rule.label}
                </span>
              );
            })}
          </div>
          {errors.password ? <p className="field-error">{errors.password}</p> : null}
        </div>

        <button type="submit" className="btn-brand w-full" disabled={busy}>
          {busy ? "Creating your card…" : "Create my library card"}
          <MoveRight className="h-4 w-4" />
        </button>
      </form>

      <p className="mt-5 text-center text-[12px] text-ink/70">
        Already have a card?{" "}
        <Link href={loginHref} className="font-semibold text-terracotta transition hover:text-terracotta-dark">
          Log in
        </Link>
      </p>
    </div>
  );
}
