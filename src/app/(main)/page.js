import { Suspense } from "react";
import HeroSlider from "@/components/home/HeroSlider";
import HeroFallback from "@/components/home/HeroFallback";
import NewArrivals from "@/components/home/NewArrivals";
import HowItWorks from "@/components/home/HowItWorks";
import TopCategories from "@/components/home/TopCategories";

export const metadata = {
  title: { absolute: "Friendly Library | Home" },
};

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<HeroFallback />}>
        <HeroSlider />
      </Suspense>
      <NewArrivals />
      <section className="shell">
        <blockquote className="border-y border-line py-12 text-center">
          <p className="mx-auto max-w-2xl font-display text-[28px] font-medium italic leading-[1.35] tracking-[-0.02em] text-ink/80 sm:text-[34px]">
            “A library is just a room until someone opens a book and decides to
            share it.”
          </p>
          <footer className="mt-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/70">
            The Friendly Library promise
          </footer>
        </blockquote>
      </section>
      <HowItWorks />
      <TopCategories />
    </>
  );
}
