"use client";

import Link from "next/link";
import { ArrowUpRight, BookOpen, FlaskConical, Landmark, Sparkles, Sprout } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { useLibrary } from "@/lib/library-context";
import { CATEGORIES } from "@/lib/categories";

const icons = {
  book: BookOpen,
  flask: FlaskConical,
  landmark: Landmark,
  sprout: Sprout,
  sparkles: Sparkles,
};

export default function TopCategories() {
  const { books } = useLibrary();

  return (
    <section className="shell py-20 sm:py-24">
      <SectionHeading
        eyebrow="Browse by feeling"
        title={
          <>
            There is a shelf for{" "}
            <em className="font-normal italic text-terracotta">every mood.</em>
          </>
        }
        description="Whether you want to understand the universe or escape it for an afternoon, start with a shelf."
        action={
          <Link href="/books" className="link-underline">
            Explore all shelves
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        }
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {CATEGORIES.map((category) => {
          const count = books.filter((book) => book.category === category.name).length;
          const Icon = icons[category.icon] || BookOpen;
          return (
            <Link
              key={category.name}
              href={`/books?category=${encodeURIComponent(category.name)}`}
              className="group relative flex min-h-[224px] flex-col justify-between overflow-hidden rounded-2xl border border-ink/5 p-5 transition duration-500 hover:-translate-y-1.5 hover:shadow-soft"
              style={{ backgroundColor: category.tint }}
            >
              <span
                className="absolute inset-y-0 left-0 w-1.5"
                style={{ backgroundColor: category.accent }}
              />
              <Icon
                className="absolute -bottom-5 -right-4 h-28 w-28 opacity-[0.09] transition duration-500 group-hover:rotate-6 group-hover:opacity-[0.14]"
                strokeWidth={1}
                style={{ color: category.accent }}
              />
              <div className="flex items-start justify-between pl-1.5">
                <span
                  className="grid h-10 w-10 place-items-center rounded-full bg-parchment/70"
                  style={{ color: category.accent }}
                >
                  <Icon className="h-4.5 w-4.5" strokeWidth={1.6} />
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/70">
                  {String(count).padStart(2, "0")} books
                </span>
              </div>
              <div className="relative pl-1.5">
                <h3 className="font-display text-[27px] font-semibold leading-none tracking-[-0.02em] text-ink">
                  {category.name}
                </h3>
                <p className="mt-2 text-[11px] leading-5 text-ink/70">
                  {category.blurb}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/70 transition group-hover:text-ink">
                  Browse
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
