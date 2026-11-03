import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import Logo from "@/components/Logo";

function XLogo({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

function InstagramLogo({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookLogo({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M14.2 20v-7h2.6l.4-3h-3V8.1c0-.9.3-1.5 1.6-1.5h1.6V4a21 21 0 0 0-2.4-.1c-2.4 0-4 1.4-4 4.1V10H8.3v3H11v7h3.2Z" />
    </svg>
  );
}

function LinkedinLogo({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6.6 8.8H3.7V20h2.9V8.8ZM5.1 3.7a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4ZM20.3 20h-2.9v-5.5c0-1.4-.5-2.4-1.8-2.4-1 0-1.6.7-1.9 1.4-.1.2-.1.6-.1.9V20h-2.9V8.8h2.9v1.3a3 3 0 0 1 2.7-1.5c2 0 3.5 1.3 3.5 4.1V20Z" />
    </svg>
  );
}

const socialLinks = [
  { label: "X", href: "https://x.com", icon: XLogo },
  { label: "Instagram", href: "https://instagram.com", icon: InstagramLogo },
  { label: "Facebook", href: "https://facebook.com", icon: FacebookLogo },
  { label: "LinkedIn", href: "https://linkedin.com", icon: LinkedinLogo },
];

export default function Footer() {
  return (
    <footer className="paper-grain relative mt-auto overflow-hidden bg-forest-deep text-parchment">
      <div className="pointer-events-none absolute -right-32 -top-40 h-[420px] w-[420px] animate-soft-pulse rounded-full bg-[radial-gradient(circle,rgba(217,164,65,0.16),transparent_65%)]" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(134,160,141,0.12),transparent_70%)]" />

      <div className="shell relative z-10">
        <div className="grid gap-10 py-14 lg:grid-cols-[1.15fr_0.7fr_0.7fr_0.9fr] lg:gap-8">
          <div>
            <Logo tone="light" />
            <p className="mt-5 max-w-xs text-[13px] leading-6 text-parchment/55">
              A neighborhood shelf for anyone who believes a good book is better
              when it is passed on.
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-parchment/15 text-parchment/55 transition hover:border-gold/50 hover:bg-gold/10 hover:text-gold"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
              Explore
            </p>
            <ul className="mt-4 space-y-2.5 text-[13px] text-parchment/55">
              <li>
                <Link href="/" className="transition hover:text-parchment">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/books" className="transition hover:text-parchment">
                  All books
                </Link>
              </li>
              <li>
                <Link href="/add-book" className="transition hover:text-parchment">
                  Add a book
                </Link>
              </li>
              <li>
                <Link href="/my-borrows" className="transition hover:text-parchment">
                  My borrows
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
              Good to know
            </p>
            <ul className="mt-4 space-y-2.5 text-[13px] text-parchment/55">
              <li>14-day loans</li>
              <li>No late fees, ever</li>
              <li>Free membership</li>
              <li>Every book is shared by a reader</li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
              Visit the nook
            </p>
            <ul className="mt-4 space-y-3 text-[13px] text-parchment/55">
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage" />
                <span>
                  14 Willow Lane
                  <br />
                  Riverside, open daily
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-3.5 w-3.5 shrink-0 text-sage" />
                <a href="mailto:hello@friendlylibrary.app" className="transition hover:text-parchment">
                  hello@friendlylibrary.app
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-3.5 w-3.5 shrink-0 text-sage" />
                <a href="tel:+15550142026" className="transition hover:text-parchment">
                  (555) 014-2026
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-parchment/10 py-6 text-[11px] text-parchment/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Friendly Library. Stories belong to everyone.</p>
          <p className="font-display text-[13px] italic tracking-wide text-parchment/70">
            Keep turning pages.
          </p>
        </div>
      </div>
    </footer>
  );
}
