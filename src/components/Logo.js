import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Logo({ tone = "dark", className, href = "/" }) {
  const isLight = tone === "light";

  return (
    <Link
      href={href}
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label="Friendly Library home"
    >
      <span
        className={cn(
          "grid h-10 w-10 place-items-center rounded-[13px] shadow-[0_8px_18px_-10px_rgba(16,37,31,0.8)] transition duration-300 group-hover:-rotate-3",
          isLight ? "bg-parchment" : "bg-forest"
        )}
      >
        <svg
          viewBox="0 0 32 32"
          className={cn("h-[22px] w-[22px]", isLight ? "text-forest" : "text-parchment")}
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5.5 7.2c3.4-1.7 6.8-1.6 10.5.6v15c-3.7-2.2-7.1-2.3-10.5-.6V7.2Z"
            fill="currentColor"
            opacity="0.92"
          />
          <path
            d="M26.5 7.2c-3.4-1.7-6.8-1.6-10.5.6v15c3.7-2.2 7.1-2.3 10.5-.6V7.2Z"
            fill="currentColor"
            opacity="0.72"
          />
          <path
            d="M16 7.8v15"
            stroke={isLight ? "#1d3b32" : "#c25a36"}
            strokeWidth="1.1"
            strokeLinecap="round"
          />
          <circle cx="22.8" cy="9.6" r="2.1" fill="#d9a441" />
        </svg>
      </span>
      <span
        className={cn(
          "font-display text-[20px] font-semibold leading-none tracking-[-0.02em] sm:text-[22px]",
          isLight ? "text-parchment" : "text-ink"
        )}
      >
        Friendly Library<span className="text-terracotta">.</span>
      </span>
    </Link>
  );
}
