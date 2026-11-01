"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, BookPlus, Pencil, Trash2 } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import BookCard from "@/components/BookCard";
import BookCover from "@/components/BookCover";
import BookForm from "@/components/BookForm";
import EmptyState from "@/components/EmptyState";
import Modal from "@/components/Modal";
import { useAuth } from "@/lib/auth-context";
import { useLibrary } from "@/lib/library-context";
import { toast } from "sonner";

function toValues(book) {
  return {
    title: book.title,
    author: book.author,
    category: book.category,
    description: book.description,
    image: book.image,
    totalCopies: book.totalCopies,
  };
}

function MyBooksContent() {
  const { user } = useAuth();
  const { books, updateBook, deleteBook } = useLibrary();
  const [editing, setEditing] = useState(null);
  const [editValues, setEditValues] = useState(null);
  const [deleting, setDeleting] = useState(null);
  // Keep the memo dependency null-safe: the compiler hoists property reads out of callbacks.
  const editingId = editing?.id ?? "";
  const deletingId = deleting?.id ?? "";
  const deletingTitle = deleting?.title ?? "";

  const mine = books
    .filter((book) => book.addedBy.email === user.email)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const totalCopies = mine.reduce((sum, book) => sum + book.totalCopies, 0);
  const onLoan = mine.reduce(
    (sum, book) => sum + (book.totalCopies - book.availableCopies),
    0
  );

  function openEdit(book) {
    setEditing(book);
    setEditValues(toValues(book));
  }

  function closeEdit() {
    setEditing(null);
    setEditValues(null);
  }

  function saveEdit(data) {
    if (!editingId) return;
    updateBook(editingId, data);
    toast.success(`“${data.title}” has been updated.`);
    closeEdit();
  }

  function confirmDelete() {
    if (!deletingId) return;
    deleteBook(deletingId);
    toast.success(`“${deletingTitle}” is off the shelf.`);
    setDeleting(null);
  }

  return (
    <div className="pb-20">
      <section className="shell pt-10 sm:pt-14">
        <nav className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/70">
          <Link href="/" className="transition hover:text-terracotta">
            Home
          </Link>
          <span className="mx-2 text-ink/70">/</span>
          <span className="text-ink/70">My books</span>
        </nav>

        <div className="mt-7 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">
              <span className="h-px w-7 bg-terracotta/60" />
              Your shelf
            </p>
            <h1 className="mt-4 max-w-2xl font-display text-[46px] font-semibold leading-[0.98] tracking-[-0.04em] text-balance text-ink sm:text-[58px]">
              Books you have{" "}
              <em className="font-normal italic text-terracotta">shared.</em>
            </h1>
            <p className="mt-4 max-w-lg text-[14px] leading-7 text-ink/70">
              These are the copies you brought to the nook. Edit the details,
              check what is out on loan, or take a book off the shelf.
            </p>
          </div>
          <Link href="/add-book" className="btn-brand shrink-0">
            <BookPlus className="h-4 w-4" />
            Add a book
          </Link>
        </div>

        <div className="mt-9 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-line bg-line/70 sm:max-w-[480px]">
          <div className="bg-parchment px-4 py-4">
            <p className="font-display text-3xl font-semibold leading-none text-ink">
              {mine.length}
            </p>
            <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-ink/70">
              Listings
            </p>
          </div>
          <div className="bg-parchment px-4 py-4">
            <p className="font-display text-3xl font-semibold leading-none text-ink">
              {totalCopies}
            </p>
            <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-ink/70">
              Copies
            </p>
          </div>
          <div className="bg-parchment px-4 py-4">
            <p className="font-display text-3xl font-semibold leading-none text-terracotta">
              {onLoan}
            </p>
            <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-ink/70">
              On loan
            </p>
          </div>
        </div>
      </section>

      <section className="shell mt-9">
        {mine.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {mine.map((book, index) => (
              <BookCard
                key={book.id}
                book={book}
                priority={index < 3}
                actions={
                  <>
                    <button
                      type="button"
                      onClick={() => openEdit(book)}
                      aria-label={`Edit ${book.title}`}
                      className="grid h-8 w-8 place-items-center rounded-full border border-line bg-parchment/95 text-ink/70 shadow-sm backdrop-blur transition hover:bg-forest hover:text-parchment"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(book)}
                      aria-label={`Delete ${book.title}`}
                      className="grid h-8 w-8 place-items-center rounded-full border border-line bg-parchment/95 text-ink/70 shadow-sm backdrop-blur transition hover:bg-terracotta hover:text-parchment"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </>
                }
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Your shelf is still waiting"
            description="Every library starts with one book. Share something you love and it will find its next reader."
            action={
              <Link href="/add-book" className="btn-brand">
                <BookPlus className="h-4 w-4" />
                Add your first book
              </Link>
            }
          />
        )}

        {mine.length ? (
          <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-line bg-cream/50 px-6 py-5 sm:flex-row sm:items-center">
            <p className="max-w-xl text-[12px] leading-6 text-ink/70">
              <span className="font-semibold text-ink">A small reminder:</span>{" "}
              you can edit a listing any time. If a copy is out on loan, returning
              it will put it back on your shelf automatically.
            </p>
            <Link href="/books" className="link-underline shrink-0">
              Browse all books
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        ) : null}
      </section>

      <Modal
        open={Boolean(editing)}
        onClose={closeEdit}
        title="Edit this listing"
        description="Update the details readers see. Copies already on loan stay with their borrower."
        size="lg"
      >
        {editValues ? (
          <BookForm
            values={editValues}
            setValues={setEditValues}
            onSubmit={saveEdit}
            onCancel={closeEdit}
            submitLabel="Save changes"
            showUser={false}
            compact
          />
        ) : null}
      </Modal>

      <Modal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Take this book off the shelf?"
        description="This removes the listing and any active loan records for this copy."
        size="sm"
      >
        {deleting ? (
          <div>
            <div className="flex items-center gap-4 rounded-2xl border border-line bg-cream/50 p-3.5">
              <div className="w-[58px] shrink-0">
                <BookCover book={deleting} sizes="58px" />
              </div>
              <div className="min-w-0">
                <p className="font-display text-xl font-semibold leading-tight text-ink">
                  {deleting.title}
                </p>
                <p className="mt-1 text-[11px] text-ink/70">{deleting.author}</p>
              </div>
            </div>
            <p className="mt-4 text-[12px] leading-6 text-ink/70">
              This cannot be undone. If you only need to update the details, choose
              Edit instead.
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => setDeleting(null)}
                className="btn-outline flex-1"
              >
                Keep it
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-terracotta px-6 py-3 text-[13px] font-semibold text-parchment transition hover:bg-terracotta-dark"
              >
                <Trash2 className="h-4 w-4" />
                Delete listing
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

export default function MyBooksPage() {
  return (
    <AuthGuard>
      <MyBooksContent />
    </AuthGuard>
  );
}
