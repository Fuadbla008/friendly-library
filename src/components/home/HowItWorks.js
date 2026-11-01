import Link from "next/link";
import { ArrowUpRight, BookOpen, RefreshCcw, Search } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const steps = [
  {
    number: "01",
    title: "Find your shelf",
    description:
      "Browse by mood, category, or whatever catches your eye. Every listing includes a note from the reader who shared it.",
    icon: Search,
  },
  {
    number: "02",
    title: "Borrow for 14 days",
    description:
      "Choose an available copy and confirm. The book is yours for two weeks — long enough for a slow reader, short enough to share.",
    icon: BookOpen,
  },
  {
    number: "03",
    title: "Return & pass it on",
    description:
      "Bring it back with one tap and leave it ready for the next person. No late fees, no forms, no guilt.",
    icon: RefreshCcw,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-line bg-cream/55 py-20 sm:py-24">
      <div className="shell">
        <SectionHeading
          align="center"
          eyebrow="How borrowing works"
          title={
            <>
              Three steps to a{" "}
              <em className="font-normal italic text-terracotta">good story.</em>
            </>
          }
          description="No card to sign, no queue to stand in. Just a shelf full of books and a community happy to share them."
        />

        <div className="relative mt-14 grid gap-5 md:grid-cols-3">
          <div className="pointer-events-none absolute left-[16%] right-[16%] top-[52px] hidden border-t border-dashed border-ink/15 md:block" />
          {steps.map(({ number, title, description, icon: Icon }) => (
            <div
              key={number}
              className="relative flex flex-col rounded-2xl border border-line/80 bg-parchment/85 p-6 transition duration-300 hover:-translate-y-1 hover:bg-parchment hover:shadow-soft"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-[42px] font-semibold leading-none tracking-[-0.05em] text-terracotta/85">
                  {number}
                </span>
                <span className="grid h-11 w-11 place-items-center rounded-full border border-line bg-cream text-ink/70">
                  <Icon className="h-4.5 w-4.5" strokeWidth={1.6} />
                </span>
              </div>
              <h3 className="mt-7 font-display text-[26px] font-semibold leading-tight tracking-[-0.02em] text-ink">
                {title}
              </h3>
              <p className="mt-3 text-[13px] leading-6 text-ink/70">{description}</p>
              <div className="mt-6 h-px w-full bg-line/80" />
              <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.18em] text-ink/70">
                Step {number} of 03
              </p>
            </div>
          ))}
        </div>

        <div className="mt-11 flex flex-col items-center justify-between gap-4 rounded-2xl border border-line/70 bg-parchment/60 px-6 py-5 sm:flex-row">
          <p className="text-[13px] text-ink/70">
            <span className="font-semibold text-ink">New here?</span> Joining takes
            less than a minute — and your first loan is on us.
          </p>
          <Link href="/books" className="btn-brand shrink-0 px-5 py-2.5">
            Start browsing
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
