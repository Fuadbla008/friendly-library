"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  LibraryBig,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import BookCard from "@/components/BookCard";
import BookCover from "@/components/BookCover";
import EmptyState from "@/components/EmptyState";
import Modal from "@/components/Modal";
import PageLoader from "@/components/PageLoader";
import { useAuth } from "@/lib/auth-context";
import { useLibrary } from "@/lib/library-context";
import { CATEGORIES } from "@/lib/seed";
import { cn, formatDate, initials } from "@/lib/utils";
import { toast } from "sonner";

function CopyMeter({ total, available }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          className={cn(
            "h-2 w-7 rounded-full",
            index < available ? "bg-[#4f7a5f]" : "bg-ink/10"
          )}
        />
      ))}
    </div>
  );
}

function BorrowModal({ open, onClose, book, user, dueDate }) {
  const { borrowBook } = useLibrary();

  function confirm() {
    const result = borrowBook(book.id, user);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(`“${book.title}” is on your shelf for 14 days.`);
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Borrow this book"
      description="Confirm the loan below. Bring it back whenever you are finished — fourteen days is the latest."
    >
      <div className="flex gap-4 rounded-2xl border border-line bg-white/50 p-3.5">
        <div className="w-[62px] shrink-0">
          <BookCover book={book} sizes="62px" />
        </div>
        <div className="min-w-0 py-1">
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-terracotta">
            {book.category}
          </p>
          <p className="mt-1 font-display text-xl font-semibold leading-tight text-ink">
            {book.title}
          </p>
          <p className="mt-1 text-[11px] text-ink/70">{book.author}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-line bg-cream/50 p-3.5">
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-ink/70">
            Borrowed by
          </p>
          <p className="mt-1.5 truncate text-[13px] font-semibold text-ink">{user.name}</p>
          <p className="truncate text-[10px] text-ink/70">{user.email}</p>
        </div>
        <div className="rounded-xl border border-line bg-cream/50 p-3.5">
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-ink/70">
            Return by
          </p>
          <p className="mt-1.5 text-[13px] font-semibold text-ink">{dueDate}</p>
          <p className="text-[10px] text-ink/70">14-day loan</p>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-sage-light/50 px-3.5 py-3 text-[11px] leading-5 text-ink/70">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#4f7a5f]" />
        No late fees and no automatic renewals. Return it whenever you are done so
        the next reader can find it.
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button type="button" onClick={onClose} className="btn-outline flex-1">
          Not yet
        </button>
        <button type="button" onClick={confirm} className="btn-brand flex-1">
          <Check className="h-4 w-4" />
          Confirm borrow
        </button>
      </div>
    </Modal>
  );
}

function DetailsContent({ bookId }) {
  const { user } = useAuth();
  const { books, borrows, ready, returnBorrow } = useLibrary();
  const [borrowOpen, setBorrowOpen] = useState(false);
  const [borrowDue, setBorrowDue] = useState("");

  function openBorrow() {
    setBorrowDue(
      formatDate(new Date(Date.now() + 14 * 86400000), {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    );
    setBorrowOpen(true);
  }

  const book = books.find((item) => item.id === bookId);

  if (!ready) return <PageLoader label="Pulling this book from the shelf…" />;

  if (!book) {
    return (
      <div className="shell py-20">
        <EmptyState
          title="That book is not on the shelf"
          description="It may have been returned to its owner. Try the collection — there are plenty of other stories waiting."
          action={
            <Link href="/books" className="btn-brand">
              Back to all books
            </Link>
          }
        />
      </div>
    );
  }

  const bookBorrows = borrows.filter((borrow) => borrow.bookId === book.id);
  const activeLoan = borrows.find(
    (borrow) => borrow.bookId === book.id && borrow.userEmail === user.email
  );
  const isOwner = book.addedBy.email === user.email;
  const available = book.availableCopies > 0;
  const category = CATEGORIES.find((item) => item.name === book.category) || CATEGORIES[0];
  const related = books
    .filter((item) => item.category === book.category && item.id !== book.id)
    .slice(0, 3);

  function handleReturn() {
    if (!activeLoan) return;
    const result = returnBorrow(activeLoan.id);
    if (result.ok) toast.success(`“${book.title}” is back on the shelf.`);
    else toast.error(result.error);
  }

  return (
    <div className="pb-20">
      <section className="shell pt-7 sm:pt-9">
        <nav className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/70">
          <Link href="/" className="transition hover:text-terracotta">
            Home
          </Link>
          <span className="mx-2 text-ink/70">/</span>
          <Link href="/books" className="transition hover:text-terracotta">
            All books
          </Link>
          <span className="mx-2 text-ink/70">/</span>
          <span className="text-ink/70">{book.title}</span>
        </nav>

        <div className="mt-7 grid gap-10 lg:grid-cols-[410px_1fr] lg:gap-14 xl:grid-cols-[460px_1fr]">
          <div className="lg:sticky lg:top-[104px] lg:self-start">
            <div
              className="relative overflow-hidden rounded-[28px] border border-ink/5 p-7 sm:p-10"
              style={{ backgroundColor: category.tint }}
            >
              <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/30 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-white/20 blur-2xl" />
              <div className="relative mx-auto w-full max-w-[286px]">
                <BookCover book={book} priority sizes="286px" className="shadow-cover" />
              </div>
              <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-parchment/90 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-ink/70 backdrop-blur">
                <Sparkles className="h-3 w-3 text-terracotta" />
                Reader pick
              </div>
              <div className="absolute bottom-5 right-5 rotate-[-2deg] rounded-xl border border-ink/5 bg-parchment px-3.5 py-2.5 text-forest shadow-soft">
                <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-forest/70">
                  Loan period
                </p>
                <p className="font-display text-lg font-semibold leading-tight">
                  14 days, free
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-line bg-parchment px-4 py-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cream text-[12px] font-semibold text-forest">
                {initials(book.addedBy.name)}
              </span>
              <div className="min-w-0">
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-ink/70">
                  Shared by
                </p>
                <p className="truncate text-[13px] font-semibold text-ink">
                  {book.addedBy.name}
                </p>
              </div>
              <span className="ml-auto rounded-full bg-sage-light/70 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#3d6a50]">
                {bookBorrows.length} {bookBorrows.length === 1 ? "loan" : "loans"}
              </span>
            </div>
          </div>

          <div className="pt-1 lg:pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-forest px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-parchment">
                {book.category}
              </span>
              <span
                className={cn(
                  "rounded-full border px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.15em]",
                  available
                    ? "border-[#c2d5c6] bg-sage-light/60 text-[#3d6a50]"
                    : "border-[#e4b7a8] bg-[#f4dfd6] text-[#9c3f27]"
                )}
              >
                {available
                  ? `${book.availableCopies} ${book.availableCopies === 1 ? "copy" : "copies"} available`
                  : "All copies on loan"}
              </span>
              {isOwner ? (
                <span className="rounded-full border border-line bg-parchment px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-ink/70">
                  Your copy
                </span>
              ) : null}
            </div>

            <h1 className="mt-5 max-w-[720px] font-display text-[46px] font-semibold leading-[0.98] tracking-[-0.04em] text-balance text-ink sm:text-[58px]">
              {book.title}
            </h1>
            <p className="mt-4 text-[14px] font-medium text-ink/70">
              by <span className="text-ink/75">{book.author}</span>
            </p>

            <div className="mt-7 border-y border-line py-6">
              <p className="text-[15px] leading-8 text-ink/70">{book.description}</p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
              {[
                { label: "Total copies", value: book.totalCopies },
                { label: "On the shelf", value: book.availableCopies },
                { label: "Added on", value: formatDate(book.createdAt, { month: "short", day: "numeric" }) },
                { label: "Loan length", value: "14 days" },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-ink/70">
                    {item.label}
                  </p>
                  <p className="mt-1.5 font-display text-xl font-semibold text-ink">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-7 rounded-2xl border border-line bg-parchment p-5 sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-ink/70">
                    Availability
                  </p>
                  <div className="mt-2.5 flex items-center gap-3">
                    <CopyMeter total={book.totalCopies} available={book.availableCopies} />
                    <span className="text-[11px] font-semibold text-ink/70">
                      {book.availableCopies} of {book.totalCopies} ready to borrow
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2.5">
                  {activeLoan ? (
                    <>
                      <button type="button" onClick={handleReturn} className="btn-outline">
                        Return book
                      </button>
                      <Link href="/my-borrows" className="btn-brand">
                        <LibraryBig className="h-4 w-4" />
                        My borrows
                      </Link>
                    </>
                  ) : isOwner ? (
                    <Link href="/my-books" className="btn-brand">
                      Manage your copy
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={openBorrow}
                      disabled={!available}
                      className="btn-brand"
                    >
                      {available ? "Borrow this book" : "Not available"}
                      {available ? <ArrowUpRight className="h-4 w-4" /> : null}
                    </button>
                  )}
                </div>
              </div>

              {activeLoan ? (
                <p className="mt-4 flex items-center gap-2 border-t border-line/70 pt-4 text-[11px] text-ink/70">
                  <CalendarDays className="h-3.5 w-3.5 text-terracotta" />
                  On your shelf until{" "}
                  <span className="font-semibold text-ink/70">
                    {formatDate(activeLoan.returnDate, { weekday: "short" })}
                  </span>
                  . Return it any time.
                </p>
              ) : null}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-ink/70">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[#4f7a5f]" />
                Free to borrow
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-terracotta" />
                14-day loan
              </span>
              <span className="inline-flex items-center gap-1.5">
                <UserRound className="h-3.5 w-3.5 text-ink/70" />
                Added by a reader
              </span>
            </div>
          </div>
        </div>
      </section>

      {related.length ? (
        <section className="shell mt-16 border-t border-line pt-12 sm:mt-20">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow">
                <span className="h-px w-7 bg-terracotta/60" />
                Keep browsing
              </p>
              <h2 className="mt-3 font-display text-[34px] font-semibold tracking-[-0.03em] text-ink sm:text-[40px]">
                More from the {book.category.toLowerCase()} shelf
              </h2>
            </div>
            <Link href={`/books?category=${encodeURIComponent(book.category)}`} className="link-underline hidden sm:inline-flex">
              See all
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <BookCard key={item.id} book={item} />
            ))}
          </div>
        </section>
      ) : null}

      <div className="shell mt-10">
        <Link href="/books" className="link-underline">
          <ArrowLeft className="h-4 w-4" />
          Back to the whole shelf
        </Link>
      </div>

      <BorrowModal
        open={borrowOpen}
        onClose={() => setBorrowOpen(false)}
        book={book}
        user={user}
        dueDate={borrowDue}
      />
    </div>
  );
}

export default function BookDetailsPage() {
  const params = useParams();
  return (
    <AuthGuard>
      <DetailsContent bookId={params.id} />
    </AuthGuard>
  );
}
