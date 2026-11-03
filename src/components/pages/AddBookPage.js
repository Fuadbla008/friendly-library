"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Check,
  ImageIcon,
  MessageSquareText,
  PencilLine,
} from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import BookCover from "@/components/BookCover";
import BookForm from "@/components/BookForm";
import { useAuth } from "@/lib/auth-context";
import { useLibrary } from "@/lib/library-context";
import { apiErrorMessage } from "@/lib/api";
import { toast } from "sonner";

const initialValues = {
  title: "",
  author: "",
  category: "Fiction",
  description: "",
  image: "",
  totalCopies: 1,
};

const tips = [
  {
    icon: ImageIcon,
    title: "A cover people recognize",
    text: "Use a clear front cover so the book is easy to spot on the shelf.",
  },
  {
    icon: MessageSquareText,
    title: "A note with a point of view",
    text: "Tell the next reader why this one stayed with you. One honest sentence beats ten generic ones.",
  },
  {
    icon: BookOpen,
    title: "Start with one copy",
    text: "You can always add more later. One shared copy is enough to begin.",
  },
  {
    icon: PencilLine,
    title: "Yours stays yours",
    text: "You can edit the listing or take it off the shelf whenever you like.",
  },
];

function PreviewCard({ values }) {
  const previewBook = {
    ...values,
    title: values.title || "Your book title",
    author: values.author || "Author name",
    description:
      values.description ||
      "Your note to the next reader will appear here, once you write it.",
  };

  return (
    <div className="rounded-[22px] border border-line/80 bg-parchment p-3 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset]">
      <div className="relative">
        <BookCover
          book={previewBook}
          sizes="(max-width: 1024px) 40vw, 310px"
        />
        <span className="absolute left-3 top-3 rounded-full bg-parchment/95 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-ink/70 shadow-sm">
          {values.category}
        </span>
        <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-parchment/95 px-2.5 py-1 text-[9px] font-semibold text-[#3d6a50] shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-[#4f7a5f]" />
          Available
        </span>
      </div>
      <div className="px-2 pb-1 pt-4">
        <h2 className="line-clamp-2 font-display text-[23px] font-semibold leading-[1.12] tracking-[-0.02em] text-ink">
          {previewBook.title}
        </h2>
        <p className="mt-1.5 text-[12px] font-medium text-ink/70">{previewBook.author}</p>
        <p className="mt-3 line-clamp-3 border-t border-line/70 pt-3 text-[11px] leading-5 text-ink/70">
          {previewBook.description}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-ink/70">
            {values.totalCopies || 1} {Number(values.totalCopies) === 1 ? "copy" : "copies"}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-ink/70">
            View details
            <ArrowUpRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </div>
  );
}

function AddBookContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { addBook } = useLibrary();
  const [values, setValues] = useState(initialValues);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(data) {
    setBusy(true);
    try {
      const book = await addBook(data);
      toast.success(`“${book.title}” is now on the Friendly Library shelf.`);
      router.push("/my-books");
    } catch (error) {
      toast.error(apiErrorMessage(error, "Could not add this book."));
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
          <span className="text-ink/70">Add a book</span>
        </nav>

        <div className="mt-7 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">
              <span className="h-px w-7 bg-terracotta/60" />
              Share a book
            </p>
            <h1 className="mt-4 max-w-2xl font-display text-[46px] font-semibold leading-[0.98] tracking-[-0.04em] text-balance text-ink sm:text-[58px]">
              Put a book back into the{" "}
              <em className="font-normal italic text-terracotta">world.</em>
            </h1>
            <p className="mt-4 max-w-lg text-[14px] leading-7 text-ink/70">
              Add something from your own shelf. A good note from you is what
              makes a stranger pick it up.
            </p>
          </div>
          <Link href="/my-books" className="link-underline shrink-0">
            View my books
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="shell mt-10">
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_350px] xl:gap-8">
          <div className="surface p-5 sm:p-7">
            <div className="mb-6 flex items-center justify-between border-b border-line/70 pb-4">
              <div>
                <p className="font-display text-2xl font-semibold tracking-[-0.02em] text-ink">
                  Book details
                </p>
                <p className="mt-1 text-[11px] text-ink/70">
                  Everything marked with a gentle nudge helps the next reader.
                </p>
              </div>
              <span className="hidden items-center gap-1.5 rounded-full bg-sage-light/60 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.13em] text-[#3d6a50] sm:flex">
                <Check className="h-3 w-3" />
                Free to list
              </span>
            </div>
            <BookForm
              values={values}
              setValues={setValues}
              onSubmit={handleSubmit}
              user={user}
              submitLabel="Add to the shelf"
              busy={busy}
            />
          </div>

          <aside className="space-y-5 lg:sticky lg:top-[104px]">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/70">
                  Live preview
                </p>
                <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-ink/70">
                  Updates as you type
                </span>
              </div>
              <PreviewCard values={values} />
            </div>

            <div className="rounded-2xl border border-line bg-cream/50 p-5">
              <p className="font-display text-xl font-semibold tracking-[-0.02em] text-ink">
                A better listing, in four notes
              </p>
              <ul className="mt-4 space-y-3.5">
                {tips.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex gap-3">
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-parchment text-terracotta">
                      <Icon className="h-3.5 w-3.5" strokeWidth={1.6} />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold text-ink">{title}</p>
                      <p className="mt-0.5 text-[10px] leading-4 text-ink/70">{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-line bg-forest px-5 py-5 text-parchment">
              <p className="font-display text-[19px] font-medium italic leading-7 text-parchment/85">
                “A book on a shelf is a conversation waiting to start.”
              </p>
              <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-gold">
                The Friendly Library shelf
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

export default function AddBookPage() {
  return (
    <AuthGuard>
      <AddBookContent />
    </AuthGuard>
  );
}
