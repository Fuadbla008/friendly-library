"use client";

import { useId, useRef, useState } from "react";
import { ImagePlus, Link2, Trash2, Upload, UserRound } from "lucide-react";
import BookCover from "@/components/BookCover";
import { CATEGORIES } from "@/lib/seed";
import { cn, resizeImage } from "@/lib/utils";
import { toast } from "sonner";

const blankErrors = {};

export default function BookForm({
  values,
  setValues,
  onSubmit,
  submitLabel = "Add to the shelf",
  onCancel,
  showUser = true,
  user,
  compact = false,
}) {
  const fieldPrefix = useId().replace(/:/g, "");
  const fieldId = (name) => `book-${name}-${fieldPrefix}`;
  const [errors, setErrors] = useState(blankErrors);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleFile(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file for the cover.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Keep the cover under 8 MB.");
      return;
    }
    setUploading(true);
    try {
      const dataUrl = await resizeImage(file);
      update("image", dataUrl);
      toast.success("Cover ready. Uploads connect to imgbb with the live API.");
    } catch {
      toast.error("That image could not be read. Try another file.");
    } finally {
      setUploading(false);
    }
  }

  function validate() {
    const next = {};
    if (!values.title.trim()) next.title = "Give the book a title.";
    if (!values.author.trim()) next.author = "Add the author's name.";
    if (!values.category) next.category = "Choose a shelf.";
    if (values.description.trim().length < 30) {
      next.description = "Write at least 30 characters so readers know what to expect.";
    }
    if (!Number(values.totalCopies) || Number(values.totalCopies) < 1) {
      next.totalCopies = "There must be at least one copy.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) {
      toast.error("A few details still need your attention.");
      return;
    }
    onSubmit({
      ...values,
      title: values.title.trim(),
      author: values.author.trim(),
      description: values.description.trim(),
      totalCopies: Math.max(1, Number(values.totalCopies) || 1),
    });
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-5", compact && "space-y-4")}>
      {showUser && user ? (
        <div className="flex items-center gap-3 rounded-xl border border-line bg-cream/50 px-4 py-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-forest text-parchment">
            <UserRound className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-ink/70">
              Sharing as
            </p>
            <p className="truncate text-[12px] font-semibold text-ink">
              {user.name} <span className="font-normal text-ink/70">Â· {user.email}</span>
            </p>
          </div>
          <span className="hidden rounded-full bg-parchment px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink/70 sm:block">
            Read only
          </span>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor={fieldId("title")}>
            Book title
          </label>
          <input
            id={fieldId("title")}
            value={values.title}
            onChange={(event) => update("title", event.target.value)}
            placeholder="The book you want to share"
            className={cn("field", errors.title && "border-[#c25a36]/70 ring-4 ring-terracotta/10")}
          />
          {errors.title ? <p className="field-error">{errors.title}</p> : null}
        </div>

        <div>
          <label className="field-label" htmlFor={fieldId("author")}>
            Author
          </label>
          <input
            id={fieldId("author")}
            value={values.author}
            onChange={(event) => update("author", event.target.value)}
            placeholder="Who wrote it?"
            className={cn("field", errors.author && "border-[#c25a36]/70 ring-4 ring-terracotta/10")}
          />
          {errors.author ? <p className="field-error">{errors.author}</p> : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor={fieldId("category")}>
            Shelf
          </label>
          <select
            id={fieldId("category")}
            value={values.category}
            onChange={(event) => update("category", event.target.value)}
            className="field appearance-none"
          >
            {CATEGORIES.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category ? <p className="field-error">{errors.category}</p> : null}
        </div>

        <div>
          <label className="field-label" htmlFor={fieldId("copies")}>
            Copies you are sharing
          </label>
          <input
            id={fieldId("copies")}
            type="number"
            min="1"
            max="99"
            value={values.totalCopies}
            onChange={(event) => update("totalCopies", event.target.value)}
            className={cn("field", errors.totalCopies && "border-[#c25a36]/70")}
          />
          {errors.totalCopies ? <p className="field-error">{errors.totalCopies}</p> : null}
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor={fieldId("description")}>
          A note for the next reader
        </label>
        <textarea
          id={fieldId("description")}
          rows={compact ? 3 : 4}
          value={values.description}
          onChange={(event) => update("description", event.target.value)}
          placeholder="What makes this book worth borrowing? A sentence or two is perfect."
          className={cn(
            "field resize-none leading-6",
            errors.description && "border-[#c25a36]/70 ring-4 ring-terracotta/10"
          )}
        />
        <div className="mt-1.5 flex items-center justify-between gap-3">
          {errors.description ? (
            <p className="field-error mt-0">{errors.description}</p>
          ) : (
            <p className="text-[10px] text-ink/70">Real words only â€” no placeholder copy.</p>
          )}
          <p className="text-[10px] tabular-nums text-ink/70">
            {values.description.length}/500
          </p>
        </div>
      </div>

      <div>
        <span className="field-label">Book cover</span>
        <div className="rounded-xl border border-dashed border-line bg-white/35 p-3">
          <div className="flex items-center gap-3">
            <div className="w-[54px] shrink-0">
              <BookCover
                book={{
                  ...values,
                  title: values.title || "Your book",
                  author: values.author || "Author",
                }}
                sizes="54px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-ink">
                {values.image ? "Cover selected" : "Add a cover image"}
              </p>
              <p className="mt-0.5 text-[10px] leading-4 text-ink/70">
                Upload a JPG or PNG, or paste an image URL.
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="inline-flex items-center gap-1.5 rounded-full bg-forest px-3 py-1.5 text-[10px] font-semibold text-parchment transition hover:bg-forest-deep disabled:opacity-50"
                >
                  <Upload className="h-3 w-3" />
                  {uploading ? "Preparingâ€¦" : values.image ? "Replace" : "Upload"}
                </button>
                {values.image ? (
                  <button
                    type="button"
                    onClick={() => update("image", "")}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[10px] font-semibold text-ink/70 transition hover:border-terracotta/40 hover:text-terracotta"
                  >
                    <Trash2 className="h-3 w-3" />
                    Remove
                  </button>
                ) : null}
              </div>
            </div>
            <ImagePlus className="hidden h-8 w-8 text-ink/15 sm:block" strokeWidth={1.2} />
          </div>

          <div className="relative mt-3">
            <Link2 className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/70" />
            <input
              value={values.image.startsWith("data:") ? "" : values.image}
              onChange={(event) => update("image", event.target.value)}
              placeholder="https://â€¦ cover image URL"
              aria-label="Cover image URL"
              className="h-9 w-full rounded-lg border border-line bg-parchment/60 pl-8 pr-3 text-[11px] text-ink placeholder:text-ink/70 focus:border-terracotta/60 focus:bg-white focus:outline-none focus:ring-4 focus:ring-terracotta/10"
            />
          </div>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          aria-label="Upload cover image"
          className="sr-only"
          tabIndex={-1}
        />
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-line/70 pt-4 sm:flex-row sm:justify-end">
        {onCancel ? (
          <button type="button" onClick={onCancel} className="btn-outline">
            Cancel
          </button>
        ) : null}
        <button type="submit" className="btn-brand">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

