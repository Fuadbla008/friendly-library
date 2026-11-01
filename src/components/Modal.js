"use client";

import { useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
  size = "md",
}) {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  useEffect(() => {
    if (!open) return;
    function handleKey(event) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-forest-deep/55 backdrop-blur-[6px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        className={cn(
          "animate-rise relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-[26px] border border-line bg-parchment p-6 shadow-[0_40px_80px_-30px_rgba(16,37,31,0.6)] sm:rounded-[26px] sm:p-8",
          sizes[size],
          className
        )}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            {title ? (
              <h2
                id="modal-title"
                className="font-display text-[28px] font-semibold leading-tight tracking-[-0.02em] text-ink"
              >
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-1.5 max-w-sm text-sm leading-6 text-ink/70">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-ink/70 transition hover:border-ink/25 hover:bg-white hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}
