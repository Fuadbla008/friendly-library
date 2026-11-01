"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import BookCover from "@/components/BookCover";
import { useLibrary } from "@/lib/library-context";
import { cn } from "@/lib/utils";
import "swiper/css";
import "swiper/css/effect-fade";

const slides = [
  {
    kicker: "The neighborhood shelf",
    title: (
      <>
        Every book is a{" "}
        <em className="font-normal italic text-gold">doorway.</em>
      </>
    ),
    text: "Borrow stories, ideas, and adventures from readers nearby. Fourteen days, no late fees, and always a reason to stay up one more chapter.",
    covers: ["night-circus", "song-of-achilles", "cosmos"],
    note: "A new shelf, every week",
  },
  {
    kicker: "Read · Return · Repeat",
    title: (
      <>
        Your next <em className="font-normal italic text-gold">favorite</em>{" "}
        is already here.
      </>
    ),
    text: "From Pulitzer winners to picture books, the collection grows because readers keep passing good things forward. Find something that stays with you.",
    covers: ["the-great-gatsby", "project-hail-mary", "where-wild-things-are"],
    note: "Loved by 1,200 readers",
  },
  {
    kicker: "Give a book a second life",
    title: (
      <>
        Share what you{" "}
        <em className="font-normal italic text-gold">love.</em>
      </>
    ),
    text: "Add a book from your own shelf, tell us why it matters, and watch it find its next reader. A small library is built one story at a time.",
    covers: ["hobbit", "atomic-habits", "dune"],
    note: "18 titles and counting",
  },
];

function HeroCovers({ ids, mobile = false }) {
  const { books } = useLibrary();
  const selected = ids
    .map((id) => books.find((book) => book.id === id))
    .filter(Boolean);

  if (mobile) {
    return (
      <div className="mt-9 flex items-end justify-center gap-3 lg:hidden">
        {selected.map((book, index) => (
          <div
            key={book.id}
            className={cn(
              "w-[29%] max-w-[120px]",
              index === 1 && "-translate-y-4",
              index === 0 && "-rotate-3",
              index === 2 && "rotate-3"
            )}
          >
            <BookCover book={book} sizes="120px" className="shadow-cover" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative hidden min-h-[450px] lg:block">
      <div className="absolute left-[8%] top-[5%] h-[76%] w-[62%] rounded-full border border-parchment/10" />
      <div className="absolute bottom-[8%] right-[2%] h-36 w-36 rounded-full bg-gold/10 blur-2xl" />

      {selected[0] ? (
        <div className="animate-float absolute left-[4%] top-[7%] w-[228px] [animation-delay:-1s]" style={{ "--float-rotate": "-7deg" }}>
          <BookCover book={selected[0]} priority sizes="228px" className="rotate-[-7deg] shadow-cover" />
        </div>
      ) : null}
      {selected[1] ? (
        <div className="animate-float absolute bottom-[1%] left-[36%] w-[198px]" style={{ "--float-rotate": "6deg" }}>
          <BookCover book={selected[1]} sizes="198px" className="rotate-[6deg] shadow-cover" />
        </div>
      ) : null}
      {selected[2] ? (
        <div className="animate-float absolute right-[1%] top-[1%] w-[168px] [animation-delay:-3s]" style={{ "--float-rotate": "13deg" }}>
          <BookCover book={selected[2]} sizes="168px" className="rotate-[13deg] shadow-cover" />
        </div>
      ) : null}

      <div className="absolute right-[2%] top-[52%] flex items-center gap-2 rounded-full border border-parchment/15 bg-forest-deep/70 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-parchment/75 backdrop-blur">
        <Sparkles className="h-3.5 w-3.5 text-gold" />
        Hand-picked by readers
      </div>
      <div className="absolute bottom-[4%] right-[4%] rotate-[-2deg] rounded-xl border border-parchment/15 bg-parchment px-4 py-3 text-forest shadow-[0_18px_30px_-18px_rgba(0,0,0,0.6)]">
        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-forest/45">
          Borrowing is
        </p>
        <p className="font-display text-xl font-semibold leading-tight">always free</p>
      </div>
    </div>
  );
}

export default function HeroSlider() {
  const [swiper, setSwiper] = useState(null);
  const [active, setActive] = useState(0);

  return (
    <section className="shell pt-5 sm:pt-7">
      <div className="paper-grain relative overflow-hidden rounded-[26px] bg-forest text-parchment sm:rounded-[34px]">
        <div className="pointer-events-none absolute -right-24 -top-32 h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,rgba(217,164,65,0.16),transparent_65%)]" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(134,160,141,0.16),transparent_70%)]" />

        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={850}
          loop
          autoplay={{ delay: 6800, disableOnInteraction: false, pauseOnMouseEnter: true }}
          onSwiper={setSwiper}
          onSlideChange={(instance) => setActive(instance.realIndex)}
          className="relative z-10"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.kicker}>
              <div className="grid min-h-[600px] gap-8 px-6 pb-28 pt-10 sm:px-10 sm:pt-12 lg:min-h-[640px] lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-6 lg:px-14 lg:pb-24 lg:pt-14 xl:px-16">
                <div className="animate-rise max-w-[560px]">
                  <p className="eyebrow text-gold">
                    <span className="h-px w-7 bg-gold/70" />
                    {slide.kicker}
                  </p>
                  <h1 className="mt-5 font-display text-[42px] font-semibold leading-[0.98] tracking-[-0.035em] text-balance sm:text-[56px] lg:text-[62px] xl:text-[70px]">
                    {slide.title}
                  </h1>
                  <p className="mt-6 max-w-[470px] text-[14px] leading-7 text-parchment/60 sm:text-[15px]">
                    {slide.text}
                  </p>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link href="/books" className="btn-brand">
                      Browse the collection
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                    <a
                      href="#how-it-works"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-parchment/20 px-6 py-3 text-[13px] font-semibold text-parchment/80 transition hover:border-parchment/40 hover:bg-parchment/[0.06] hover:text-parchment"
                    >
                      How borrowing works
                    </a>
                  </div>

                  <HeroCovers ids={slide.covers} mobile />

                  <div className="mt-9 hidden items-center gap-9 border-t border-parchment/15 pt-5 sm:flex">
                    <div>
                      <p className="font-display text-2xl font-semibold text-parchment">18</p>
                      <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-parchment/70">
                        Curated titles
                      </p>
                    </div>
                    <div className="h-8 w-px bg-parchment/15" />
                    <div>
                      <p className="font-display text-2xl font-semibold text-parchment">5</p>
                      <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-parchment/70">
                        Shelves
                      </p>
                    </div>
                    <div className="h-8 w-px bg-parchment/15" />
                    <div>
                      <p className="font-display text-2xl font-semibold text-parchment">14</p>
                      <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-parchment/70">
                        Day loans
                      </p>
                    </div>
                  </div>
                </div>

                <HeroCovers ids={slide.covers} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between gap-6 px-6 pb-6 sm:px-10 lg:px-14 xl:px-16">
          <div className="flex items-center gap-3">
            <span className="font-display text-sm font-semibold tabular-nums text-parchment">
              0{active + 1}
            </span>
            <div className="flex items-center gap-1.5">
              {slides.map((slide, index) => (
                <button
                  key={slide.kicker}
                  type="button"
                  onClick={() => swiper?.slideToLoop(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={cn(
                    "h-1 rounded-full transition-all duration-500",
                    index === active
                      ? "w-9 bg-gold"
                      : "w-4 bg-parchment/25 hover:bg-parchment/45"
                  )}
                />
              ))}
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-parchment/70">
              0{slides.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => swiper?.slidePrev()}
              aria-label="Previous slide"
              className="grid h-10 w-10 place-items-center rounded-full border border-parchment/20 text-parchment/70 transition hover:border-parchment/45 hover:bg-parchment/[0.06] hover:text-parchment"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => swiper?.slideNext()}
              aria-label="Next slide"
              className="grid h-10 w-10 place-items-center rounded-full border border-parchment/20 text-parchment/70 transition hover:border-parchment/45 hover:bg-parchment/[0.06] hover:text-parchment"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
