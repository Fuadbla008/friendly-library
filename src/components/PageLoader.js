import { BookOpen } from "lucide-react";

export default function PageLoader({ label = "Opening the library…", compact = false }) {
  return (
    <div
      className={
        compact
          ? "flex items-center justify-center gap-3 py-16 text-sm text-ink/70"
          : "flex min-h-[60vh] flex-col items-center justify-center gap-4 text-sm text-ink/70"
      }
    >
      <span className="relative grid h-12 w-12 place-items-center rounded-full border border-line bg-parchment">
        <BookOpen className="h-5 w-5 text-terracotta" />
        <span className="absolute inset-0 animate-ping rounded-full border border-terracotta/20" />
      </span>
      <span className="font-medium">{label}</span>
    </div>
  );
}
