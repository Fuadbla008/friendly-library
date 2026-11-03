"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  BookMarked,
  CalendarClock,
  Check,
  RotateCcw,
} from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import BookCover from "@/components/BookCover";
import EmptyState from "@/components/EmptyState";
import Modal from "@/components/Modal";
import { useAuth } from "@/lib/auth-context";
import { useLibrary } from "@/lib/library-context";
import { apiErrorMessage } from "@/lib/api";
import { daysUntil, formatDate, loanStatus } from "@/lib/utils";
import { toast } from "sonner";

function ReturnModal({ borrow, book, open, onClose, onConfirm, busy }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Return this book?"
      description="It will go back on the shelf right away and be ready for the next reader."
      size="sm"
    >
      {borrow ? (
        <div>
          <div className="flex items-center gap-4 rounded-2xl border border-line bg-cream/50 p-3.5">
            <div className="w-[58px] shrink-0">
              <BookCover
                book={book || { title: borrow.bookTitle, category: "Fiction", image: borrow.bookImage }}
                sizes="58px"
              />
            </div>
            <div className="min-w-0">
              <p className="font-display text-xl font-semibold leading-tight text-ink">
                {borrow.bookTitle}
              </p>
              <p className="mt-1 text-[11px] text-ink/70">
                Borrowed {formatDate(borrow.borrowDate, { year: undefined })}
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <button type="button" onClick={onClose} className="btn-outline flex-1" disabled={busy}>
              Keep reading
            </button>
            <button type="button" onClick={onConfirm} className="btn-brand flex-1" disabled={busy}>
              <Check className="h-4 w-4" />
              {busy ? "Returning…" : "Return book"}
            </button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}

function MyBorrowsContent() {
  const { user } = useAuth();
  const { books, borrows, borrowError, returnBorrow } = useLibrary();
  const [returning, setReturning] = useState(null);
  const [busy, setBusy] = useState(false);

  const mine = borrows
    .filter(
      (borrow) =>
        String(borrow.userEmail).toLowerCase() === user.email.toLowerCase()
    )
    .sort((a, b) => new Date(a.returnDate) - new Date(b.returnDate));

  const reviews = mine.map((borrow) => ({
    borrow,
    book: books.find((book) => book.id === borrow.bookId),
    status: loanStatus(borrow.returnDate),
  }));

  const dueSoon = mine.filter((borrow) => {
    const days = daysUntil(borrow.returnDate);
    return days <= 7;
  }).length;
  const overdue = mine.filter((borrow) => daysUntil(borrow.returnDate) < 0).length;

  async function confirmReturn() {
    if (!returning) return;
    const title = returning.bookTitle;
    setBusy(true);
    try {
      await returnBorrow(returning.id);
      toast.success(`“${title}” is back on the shelf.`);
      setReturning(null);
    } catch (error) {
      toast.error(apiErrorMessage(error, "Could not return this book."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="pb-20">
      <section className="shell pt-10 sm:pt-14">
        <nav className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/70">
          <Link href="/" className="transition hover:text-terracotta">
            Home
          </Link>
          <span className="mx-2 text-ink/70">/</span>
          <span className="text-ink/70">My borrows</span>
        </nav>

        <div className="mt-7 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">
              <span className="h-px w-7 bg-terracotta/60" />
              On your nightstand
            </p>
            <h1 className="mt-4 max-w-2xl font-display text-[46px] font-semibold leading-[0.98] tracking-[-0.04em] text-balance text-ink sm:text-[58px]">
              Books currently{" "}
              <em className="font-normal italic text-terracotta">with you.</em>
            </h1>
            <p className="mt-4 max-w-lg text-[14px] leading-7 text-ink/70">
              Everything you have borrowed, and when it is due back. Return a book
              whenever you are finished — earlier is always welcome.
            </p>
          </div>
          <Link href="/books" className="btn-brand shrink-0">
            Find another book
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-9 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-line bg-line/70 sm:max-w-[480px]">
          <div className="bg-parchment px-4 py-4">
            <p className="flex items-center gap-2 font-display text-3xl font-semibold leading-none text-ink">
              {mine.length}
              <BookMarked className="h-4 w-4 text-ink/70" strokeWidth={1.5} />
            </p>
            <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-ink/70">
              On loan
            </p>
          </div>
          <div className="bg-parchment px-4 py-4">
            <p className="flex items-center gap-2 font-display text-3xl font-semibold leading-none text-[#7a5620]">
              {dueSoon}
              <CalendarClock className="h-4 w-4 text-[#7a5620]/30" strokeWidth={1.5} />
            </p>
            <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-ink/70">
              Due this week
            </p>
          </div>
          <div className="bg-parchment px-4 py-4">
            <p className="flex items-center gap-2 font-display text-3xl font-semibold leading-none text-terracotta">
              {overdue}
              <AlertCircle className="h-4 w-4 text-terracotta/30" strokeWidth={1.5} />
            </p>
            <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-ink/70">
              Overdue
            </p>
          </div>
        </div>
      </section>

      <section className="shell mt-9">
        {borrowError ? (
          <div className="mb-5 rounded-2xl border border-[#e4b7a8] bg-[#f4dfd6] px-5 py-4 text-[12px] font-medium text-[#9c3f27]">
            {borrowError}
          </div>
        ) : null}
        {reviews.length ? (
          <>
            <div className="hidden overflow-hidden rounded-2xl border border-line bg-parchment lg:block">
              <div className="grid grid-cols-[minmax(0,1fr)_130px_150px_160px_120px] items-center gap-4 border-b border-line/80 bg-cream/50 px-5 py-3">
                {["Book", "Borrowed", "Return by", "Status", ""].map((label, index) => (
                  <p
                    key={label || index}
                    className="text-[9px] font-semibold uppercase tracking-[0.16em] text-ink/70"
                  >
                    {label}
                  </p>
                ))}
              </div>
              {reviews.map(({ borrow, book, status }) => (
                <div
                  key={borrow.id}
                  className="grid grid-cols-[minmax(0,1fr)_130px_150px_160px_120px] items-center gap-4 border-b border-line/60 px-5 py-4 transition last:border-b-0 hover:bg-cream/25"
                >
                  <div className="flex min-w-0 items-center gap-3.5">
                    <div className="w-10 shrink-0">
                      <BookCover
                        book={book || { title: borrow.bookTitle, category: "Fiction", image: borrow.bookImage }}
                        sizes="40px"
                      />
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/books/${borrow.bookId}`}
                        className="block truncate font-display text-[18px] font-semibold leading-tight text-ink transition hover:text-terracotta"
                      >
                        {borrow.bookTitle}
                      </Link>
                      <p className="mt-0.5 truncate text-[11px] text-ink/70">
                        {book?.author || "Shared at Friendly Library"}
                      </p>
                    </div>
                  </div>
                  <p className="text-[12px] text-ink/70">
                    {formatDate(borrow.borrowDate, { year: undefined })}
                  </p>
                  <p className="text-[12px] font-medium text-ink/70">
                    {formatDate(borrow.returnDate, { year: undefined })}
                  </p>
                  <div>
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] ${status.tone}`}
                    >
                      {status.label}
                    </span>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setReturning(borrow)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-[10px] font-semibold text-ink/70 transition hover:border-terracotta/40 hover:bg-terracotta/5 hover:text-terracotta"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Return
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 lg:hidden">
              {reviews.map(({ borrow, book, status }) => (
                <div
                  key={borrow.id}
                  className="rounded-2xl border border-line bg-parchment p-4"
                >
                  <div className="flex gap-3.5">
                    <div className="w-[58px] shrink-0">
                      <BookCover
                        book={book || { title: borrow.bookTitle, category: "Fiction", image: borrow.bookImage }}
                        sizes="58px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/books/${borrow.bookId}`}
                        className="font-display text-xl font-semibold leading-tight text-ink"
                      >
                        {borrow.bookTitle}
                      </Link>
                      <p className="mt-0.5 text-[11px] text-ink/70">
                        {book?.author || "Shared at Friendly Library"}
                      </p>
                      <span
                        className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] ${status.tone}`}
                      >
                        {status.label}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 border-t border-line/70 pt-3 text-[10px]">
                    <div>
                      <p className="font-semibold uppercase tracking-[0.14em] text-ink/70">
                        Borrowed
                      </p>
                      <p className="mt-0.5 text-ink/70">
                        {formatDate(borrow.borrowDate, { year: undefined })}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold uppercase tracking-[0.14em] text-ink/70">
                        Return by
                      </p>
                      <p className="mt-0.5 text-ink/70">
                        {formatDate(borrow.returnDate, { year: undefined })}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReturning(borrow)}
                    className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-line px-3.5 py-2.5 text-[11px] font-semibold text-ink/70 transition hover:border-terracotta/40 hover:text-terracotta"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Return book
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-line bg-sage-light/35 px-6 py-5 sm:flex-row sm:items-center">
              <p className="max-w-2xl text-[12px] leading-6 text-ink/70">
                <span className="font-semibold text-ink">Reading slowly?</span> That
                is allowed. There are no late fees at Friendly Library — just return the book
                when you are ready to pass it on.
              </p>
              <Link href="/books" className="link-underline shrink-0">
                Browse the shelf
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </>
        ) : (
          <EmptyState
            title="Nothing on your nightstand yet"
            description="Borrow a book and it will show up here with its return date. Fourteen quiet days, entirely yours."
            action={
              <Link href="/books" className="btn-brand">
                Find your next read
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            }
          />
        )}
      </section>

      <ReturnModal
        borrow={returning}
        book={returning ? books.find((book) => book.id === returning.bookId) : null}
        open={Boolean(returning)}
        onClose={() => setReturning(null)}
        onConfirm={confirmReturn}
        busy={busy}
      />
    </div>
  );
}

export default function MyBorrowsPage() {
  return (
    <AuthGuard>
      <MyBorrowsContent />
    </AuthGuard>
  );
}
