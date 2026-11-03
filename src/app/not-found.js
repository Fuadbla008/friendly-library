import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import Logo from "@/components/Logo";

export const metadata = {
  title: { absolute: "Friendly Library | Page Not Found" },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <div className="shell flex h-20 items-center">
        <Logo />
      </div>
      <main className="shell flex flex-1 flex-col items-center justify-center pb-20 text-center">
        <div className="relative">
          <p className="font-display text-[120px] font-semibold leading-none tracking-[-0.08em] text-forest/10 sm:text-[180px]">
            404
          </p>
          <span className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl border border-line bg-parchment text-terracotta shadow-soft">
            <BookOpen className="h-8 w-8" strokeWidth={1.4} />
          </span>
        </div>
        <p className="eyebrow mt-4">
          <span className="h-px w-7 bg-terracotta/60" />
          Page not found
        </p>
        <h1 className="mt-5 max-w-xl font-display text-[42px] font-semibold leading-[1.02] tracking-[-0.035em] text-ink sm:text-5xl">
          This page has wandered off the{" "}
          <em className="font-normal italic text-terracotta">shelf.</em>
        </h1>
        <p className="mt-4 max-w-md text-sm leading-7 text-ink/70">
          The link may be old, or the story may have moved. Either way, there are
          plenty of other pages waiting for you.
        </p>
        <Link href="/" className="btn-brand mt-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </main>
    </div>
  );
}
