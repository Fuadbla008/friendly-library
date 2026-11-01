import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import BookCover from "@/components/BookCover";
import { cn } from "@/lib/utils";

export default function BookCard({
  book,
  priority = false,
  actions,
  className,
  sizes,
}) {
  const available = book.availableCopies > 0;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col rounded-[20px] border border-line/80 bg-parchment p-3 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset] transition duration-500 hover:-translate-y-1.5 hover:border-line hover:shadow-[0_30px_50px_-34px_rgba(23,38,33,0.55)]",
        className
      )}
    >
      <Link
        href={`/books/${book.id}`}
        className="absolute inset-0 z-10 rounded-[20px]"
        aria-label={`View details for ${book.title}`}
      />

      <div className="relative">
        <BookCover book={book} priority={priority} sizes={sizes} />
        <span className="absolute left-3 top-3 z-[15] rounded-full bg-parchment/95 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-ink/70 shadow-sm backdrop-blur">
          {book.category}
        </span>
        {actions ? (
          <div className="absolute right-3 top-3 z-20 flex items-center gap-1.5">
            {actions}
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-2 pb-1 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="line-clamp-2 font-display text-[21px] font-semibold leading-[1.12] tracking-[-0.02em] text-ink transition-colors group-hover:text-terracotta">
              {book.title}
            </h2>
            <p className="mt-1.5 truncate text-[12px] font-medium text-ink/70">
              {book.author}
            </p>
          </div>
          <span
            className={cn(
              "mt-1.5 flex shrink-0 items-center gap-1.5 text-[10px] font-semibold",
              available ? "text-[#3d6a50]" : "text-terracotta"
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                available ? "bg-[#4f7a5f]" : "bg-terracotta"
              )}
            />
            {available ? `${book.availableCopies} left` : "Waitlist"}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-line/70 pt-3.5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/70">
            {book.totalCopies} {book.totalCopies === 1 ? "copy" : "copies"}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-ink/70 transition-colors group-hover:text-terracotta">
            View details
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
