"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BookCard from "@/components/BookCard";
import SectionHeading from "@/components/SectionHeading";
import { useLibrary } from "@/lib/library-context";

export default function NewArrivals() {
  const { books, ready } = useLibrary();
  const arrivals = [...books]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  return (
    <section className="shell py-20 sm:py-24">
      <SectionHeading
        eyebrow="Fresh on the shelf"
        title={
          <>
            New arrivals,{" "}
            <em className="font-normal italic text-terracotta">new worlds.</em>
          </>
        }
        description="The latest books shared by readers in the nook. Six new stories to get lost in this month."
        action={
          <Link href="/books" className="link-underline">
            See all books
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {!ready
          ? Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="surface h-[430px] animate-pulse" />
            ))
          : arrivals.map((book, index) => (
              <BookCard key={book.id} book={book} priority={index < 3} />
            ))}
      </div>
    </section>
  );
}
