"use client";

import Image from "next/image";
import { useState } from "react";
import { CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/utils";

function categoryStyle(category) {
  return CATEGORIES.find((item) => item.name === category) || CATEGORIES[0];
}

export default function BookCover({
  book,
  className,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 320px",
  priority = false,
}) {
  const [failed, setFailed] = useState(false);
  const style = categoryStyle(book.category);

  return (
    <div
      className={cn(
        "relative aspect-[2/3] w-full overflow-hidden rounded-[14px] bg-forest-deep",
        className
      )}
    >
      <div
        className="absolute inset-0 flex flex-col justify-between p-4"
        style={{
          background: `linear-gradient(150deg, ${style.tint} 0%, #f8f2e7 46%, ${style.tint} 100%)`,
        }}
      >
        <div className="flex items-center justify-between">
          <span
            className="h-1.5 w-8 rounded-full"
            style={{ backgroundColor: style.accent }}
          />
          <span className="text-right text-[7px] font-semibold uppercase leading-[1.35] tracking-[0.18em] text-ink/70">
            Friendly
            <br />
            Library
          </span>
        </div>
        <div>
          <p className="font-display text-[clamp(16px,3.2vw,28px)] font-semibold leading-[1.05] tracking-[-0.02em] text-ink">
            {book.title}
          </p>
          <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-ink/70">
            {book.author}
          </p>
        </div>
        <div
          className="h-px w-full"
          style={{ background: `${style.accent}55` }}
        />
      </div>

      {!failed && book.image ? (
        <Image
          src={book.image}
          alt={`Cover of ${book.title}`}
          fill
          sizes={sizes}
          priority={priority}
          unoptimized
          onError={() => setFailed(true)}
          className="object-cover"
        />
      ) : null}

      <div className="pointer-events-none absolute inset-0 rounded-[14px] ring-1 ring-inset ring-white/15" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[10%] bg-gradient-to-r from-black/25 via-black/5 to-transparent" />
      <div className="pointer-events-none absolute -left-8 top-0 h-full w-14 rotate-12 bg-gradient-to-r from-white/15 to-transparent blur-md" />
    </div>
  );
}
