"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import BookCard from "@/components/BookCard";
import EmptyState from "@/components/EmptyState";
import { useLibrary } from "@/lib/library-context";
import { CATEGORIES } from "@/lib/seed";
import { cn } from "@/lib/utils";

const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "title", label: "Title A–Z" },
  { value: "available", label: "Most available" },
];

export default function BooksPage() {
  const searchParams = useSearchParams();
  const { books, ready } = useLibrary();
  const initialCategory = searchParams.get("category");
  const [category, setCategory] = useState(
    CATEGORIES.some((item) => item.name === initialCategory)
      ? initialCategory
      : "All"
  );
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");

  const categories = useMemo(
    () => [
      { name: "All", count: books.length },
      ...CATEGORIES.map((item) => ({
        name: item.name,
        count: books.filter((book) => book.category === item.name).length,
      })),
    ],
    [books]
  );

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = books.filter((book) => {
      const matchesCategory = category === "All" || book.category === category;
      const matchesQuery =
        !needle ||
        [book.title, book.author, book.category, book.description]
          .join(" ")
          .toLowerCase()
          .includes(needle);
      return matchesCategory && matchesQuery;
    });

    return filtered.sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "available") return b.availableCopies - a.availableCopies;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [books, category, query, sort]);

  const availableCount = books.filter((book) => book.availableCopies > 0).length;

  return (
    <div>
      <section className="shell pb-8 pt-10 sm:pt-14">
        <nav className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/70">
          <Link href="/" className="transition hover:text-terracotta">
            Home
          </Link>
          <span className="mx-2 text-ink/70">/</span>
          <span className="text-ink/70">All books</span>
        </nav>

        <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="eyebrow">
              <span className="h-px w-7 bg-terracotta/60" />
              The collection
            </p>
            <h1 className="mt-4 max-w-2xl font-display text-[46px] font-semibold leading-[0.98] tracking-[-0.04em] text-balance text-ink sm:text-[58px]">
              The whole shelf,{" "}
              <em className="font-normal italic text-terracotta">open to you.</em>
            </h1>
            <p className="mt-4 max-w-lg text-[14px] leading-7 text-ink/70">
              Every title here was added by a reader. Borrow one for two weeks,
              return it when you are done, and keep the shelf alive.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-line bg-line/70 lg:w-[330px]">
            <div className="bg-parchment px-4 py-4">
              <p className="font-display text-3xl font-semibold leading-none text-ink">
                {books.length}
              </p>
              <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-ink/70">
                Titles
              </p>
            </div>
            <div className="bg-parchment px-4 py-4">
              <p className="font-display text-3xl font-semibold leading-none text-ink">
                {availableCount}
              </p>
              <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-ink/70">
                Available
              </p>
            </div>
            <div className="bg-parchment px-4 py-4">
              <p className="font-display text-3xl font-semibold leading-none text-ink">14</p>
              <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-ink/70">
                Day loans
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="sticky top-[74px] z-30 border-y border-line/80 bg-paper/95 backdrop-blur-xl">
        <div className="shell flex flex-col gap-3 py-3.5 lg:flex-row lg:items-center lg:justify-between">
          <div className="no-scrollbar -mx-1 flex items-center gap-1.5 overflow-x-auto px-1 pb-0.5">
            {categories.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => setCategory(item.name)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[11px] font-semibold transition",
                  category === item.name
                    ? "border-forest bg-forest text-parchment"
                    : "border-line bg-parchment/60 text-ink/70 hover:border-ink/25 hover:text-ink"
                )}
              >
                {item.name}
                <span
                  className={cn(
                    "text-[9px] tabular-nums",
                    category === item.name ? "text-parchment/70" : "text-ink/70"
                  )}
                >
                  {item.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 lg:w-[250px]">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/70" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search title or author…"
                aria-label="Search books"
                className="h-10 w-full rounded-full border border-line bg-parchment/70 pl-9 pr-9 text-[12px] text-ink placeholder:text-ink/70 focus:border-terracotta/60 focus:bg-white focus:outline-none focus:ring-4 focus:ring-terracotta/10"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 grid h-5 w-5 -translate-y-1/2 place-items-center rounded-full bg-ink/10 text-ink/70 hover:bg-ink/15"
                >
                  <X className="h-3 w-3" />
                </button>
              ) : null}
            </div>

            <div className="relative hidden sm:block">
              <SlidersHorizontal className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/70" />
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                aria-label="Sort books"
                className="h-10 appearance-none rounded-full border border-line bg-parchment/70 pl-9 pr-8 text-[12px] font-medium text-ink/70 focus:border-terracotta/60 focus:outline-none focus:ring-4 focus:ring-terracotta/10"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/70" />
            </div>
          </div>
        </div>
      </div>

      <section className="shell py-10 sm:py-12">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/70">
            {results.length} {results.length === 1 ? "book" : "books"}
            {category !== "All" ? ` in ${category}` : ""}
          </p>
          <p className="hidden text-[11px] text-ink/70 sm:block">
            Loans are always free · 14 days each
          </p>
        </div>

        {!ready ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="surface h-[430px] animate-pulse" />
            ))}
          </div>
        ) : results.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((book, index) => (
              <BookCard key={book.id} book={book} priority={index < 3} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No books on this shelf yet"
            description="Try a different category or a shorter search. The right story is probably one shelf over."
            action={
              <button
                type="button"
                onClick={() => {
                  setCategory("All");
                  setQuery("");
                }}
                className="btn-outline"
              >
                Clear filters
              </button>
            }
          />
        )}
      </section>
    </div>
  );
}
