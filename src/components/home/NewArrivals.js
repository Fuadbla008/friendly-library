"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import BookCard from "@/components/BookCard";
import SectionHeading from "@/components/SectionHeading";
import { api, apiErrorMessage } from "@/lib/api";

export default function NewArrivals() {
  const [arrivals, setArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function loadArrivals() {
      try {
        const { data } = await api.get("/books?limit=6&sort=-createdAt");
        if (alive) setArrivals(data);
      } catch (err) {
        if (alive) {
          setError(apiErrorMessage(err, "Could not load the new arrivals."));
        }
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadArrivals();
    return () => {
      alive = false;
    };
  }, []);

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

      {error ? (
        <p className="mt-6 rounded-2xl border border-[#e4b7a8] bg-[#f4dfd6] px-5 py-4 text-[12px] font-medium text-[#9c3f27]">
          {error}
        </p>
      ) : null}

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="surface h-[430px] animate-pulse" />
            ))
          : arrivals.map((book, index) => (
              <BookCard key={book.id} book={book} priority={index < 3} />
            ))}
      </div>

      {!loading && !error && !arrivals.length ? (
        <p className="mt-8 text-center text-[13px] text-ink/70">
          The shelf is empty right now. Add the first book and start the collection.
        </p>
      ) : null}
    </section>
  );
}
