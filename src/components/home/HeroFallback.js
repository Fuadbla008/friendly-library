import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";

const covers = [
  { src: "/covers/night-circus.jpg", alt: "The Night Circus", className: "left-[4%] top-[7%] w-[228px] rotate-[-7deg]" },
  { src: "/covers/song-achilles.jpg", alt: "The Song of Achilles", className: "bottom-[1%] left-[36%] w-[198px] rotate-[6deg]" },
  { src: "/covers/cosmos.jpg", alt: "Cosmos", className: "right-[1%] top-[1%] w-[168px] rotate-[13deg]" },
];

export default function HeroFallback() {
  return (
    <section className="shell pt-5 sm:pt-7">
      <div className="paper-grain relative overflow-hidden rounded-[26px] bg-forest text-parchment sm:rounded-[34px]">
        <div className="pointer-events-none absolute -right-24 -top-32 h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,rgba(217,164,65,0.16),transparent_65%)]" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(134,160,141,0.16),transparent_70%)]" />

        <div className="relative z-10 grid min-h-[600px] gap-8 px-6 pb-28 pt-10 sm:px-10 sm:pt-12 lg:min-h-[640px] lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-6 lg:px-14 lg:pb-24 lg:pt-14 xl:px-16">
          <div className="animate-rise max-w-[560px]">
            <p className="eyebrow text-gold">
              <span className="h-px w-7 bg-gold/70" />
              The neighborhood shelf
            </p>
            <h1 className="mt-5 font-display text-[42px] font-semibold leading-[0.98] tracking-[-0.035em] text-balance sm:text-[56px] lg:text-[62px] xl:text-[70px]">
              Every book is a{" "}
              <em className="font-normal italic text-gold">doorway.</em>
            </h1>
            <p className="mt-6 max-w-[470px] text-[14px] leading-7 text-parchment/60 sm:text-[15px]">
              Borrow stories, ideas, and adventures from readers nearby. Fourteen
              days, no late fees, and always a reason to stay up one more chapter.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/books" className="btn-brand">
                Browse the collection
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-parchment/20 px-6 py-3 text-[13px] font-semibold text-parchment/80"
              >
                How borrowing works
              </a>
            </div>
            <div className="mt-9 flex items-center gap-9 border-t border-parchment/15 pt-5">
              {[
                ["18", "Curated titles"],
                ["5", "Shelves"],
                ["14", "Day loans"],
              ].map(([value, label]) => (
                <div key={label}>
                  <p className="font-display text-2xl font-semibold text-parchment">{value}</p>
                  <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-parchment/70">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden min-h-[450px] lg:block">
            <div className="absolute left-[8%] top-[5%] h-[76%] w-[62%] rounded-full border border-parchment/10" />
            {covers.map((cover) => (
              <div
                key={cover.src}
                className={`absolute overflow-hidden rounded-[14px] shadow-cover ring-1 ring-white/10 ${cover.className}`}
                style={{ aspectRatio: "2 / 3" }}
              >
                <Image src={cover.src} alt={`Cover of ${cover.alt}`} fill unoptimized sizes="230px" className="object-cover" />
              </div>
            ))}
            <div className="absolute right-[2%] top-[52%] flex items-center gap-2 rounded-full border border-parchment/15 bg-forest-deep/70 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-parchment/75">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              Hand-picked by readers
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between px-6 pb-6 sm:px-10 lg:px-14 xl:px-16">
          <div className="flex items-center gap-3">
            <span className="font-display text-sm font-semibold text-parchment">01</span>
            <div className="flex gap-1.5">
              <span className="h-1 w-9 rounded-full bg-gold" />
              <span className="h-1 w-4 rounded-full bg-parchment/25" />
              <span className="h-1 w-4 rounded-full bg-parchment/25" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-parchment/70">03</span>
          </div>
          <div className="flex gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-parchment/20 text-parchment/70">
              <ArrowLeft className="h-4 w-4" />
            </span>
            <span className="grid h-10 w-10 place-items-center rounded-full border border-parchment/20 text-parchment/70">
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
