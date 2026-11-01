import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";

const covers = [
  { src: "/covers/night-circus.jpg", alt: "The Night Circus", rotate: "-8deg", top: "13%", left: "6%", width: 148 },
  { src: "/covers/song-achilles.jpg", alt: "The Song of Achilles", rotate: "4deg", top: "5%", left: "37%", width: 166 },
  { src: "/covers/cosmos.jpg", alt: "Cosmos", rotate: "11deg", top: "20%", left: "68%", width: 138 },
];

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-paper lg:grid lg:grid-cols-[1.02fr_0.98fr]">
      <aside className="paper-grain relative hidden overflow-hidden bg-forest px-12 py-10 text-parchment lg:flex lg:flex-col lg:justify-between xl:px-16">
        <div className="pointer-events-none absolute -right-32 -top-24 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(217,164,65,0.16),transparent_65%)]" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(134,160,141,0.14),transparent_70%)]" />

        <div className="relative z-10">
          <Logo tone="light" />
        </div>

        <div className="relative z-10 my-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold">
            The reading room
          </p>
          <h1 className="mt-5 max-w-lg font-display text-[46px] font-semibold leading-[1.02] tracking-[-0.035em] xl:text-[54px]">
            A quiet corner of the internet for{" "}
            <em className="font-normal italic text-gold">book people.</em>
          </h1>
          <p className="mt-5 max-w-md text-[14px] leading-7 text-parchment/55">
            Borrow from a shelf that belongs to everyone. Share the books you
            love. Keep good stories moving.
          </p>

          <div className="relative mt-14 h-[290px]">
            {covers.map((cover, index) => (
              <div
                key={cover.src}
                className="absolute overflow-hidden rounded-[12px] shadow-cover ring-1 ring-white/10"
                style={{
                  width: cover.width,
                  aspectRatio: "2 / 3",
                  top: cover.top,
                  left: cover.left,
                  transform: `rotate(${cover.rotate})`,
                  zIndex: index,
                }}
              >
                <Image
                  src={cover.src}
                  alt={`Cover of ${cover.alt}`}
                  fill
                  unoptimized
                  sizes="180px"
                  className="object-cover"
                />
              </div>
            ))}
            <div className="absolute bottom-0 right-2 rotate-[-2deg] rounded-xl border border-parchment/15 bg-parchment px-4 py-3 text-forest shadow-[0_18px_30px_-18px_rgba(0,0,0,0.6)]">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-forest/45">
                This month
              </p>
              <p className="font-display text-xl font-semibold leading-tight">
                18 stories to meet
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-6 border-t border-parchment/10 pt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-parchment/70">
          <span>Free membership</span>
          <span className="h-1 w-1 rounded-full bg-gold/60" />
          <span>14-day loans</span>
          <span className="h-1 w-1 rounded-full bg-gold/60" />
          <span>No late fees</span>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        <div className="shell flex h-[82px] items-center justify-between">
          <div className="lg:hidden">
            <Logo />
          </div>
          <Link
            href="/"
            className="ml-auto inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/70 transition hover:text-terracotta"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to the library
          </Link>
        </div>
        <main className="flex flex-1 items-start justify-center px-5 pb-14 sm:px-8 lg:items-center lg:pb-16">
          <div className="w-full max-w-[430px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
