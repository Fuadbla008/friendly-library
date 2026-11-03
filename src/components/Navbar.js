"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  BookMarked,
  ChevronDown,
  LibraryBig,
  LogOut,
  Menu,
  PlusCircle,
  UserRound,
  X,
} from "lucide-react";
import Logo from "@/components/Logo";
import Modal from "@/components/Modal";
import { useAuth } from "@/lib/auth-context";
import { useLibrary } from "@/lib/library-context";
import { cn, initials } from "@/lib/utils";
import { toast } from "sonner";

const PUBLIC_LINKS = [
  { href: "/", label: "Home" },
  { href: "/books", label: "All Books" },
];

const PRIVATE_LINKS = [
  { href: "/add-book", label: "Add Book" },
  { href: "/my-books", label: "My Books" },
  { href: "/my-borrows", label: "My Borrows" },
];

function Avatar({ user, size = "md" }) {
  const dimension = size === "lg" ? "h-14 w-14 text-lg" : "h-9 w-9 text-[11px]";
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full border border-forest/15 bg-forest font-semibold text-parchment shadow-sm",
        dimension
      )}
      style={
        user.photo
          ? {
              backgroundImage: `url("${String(user.photo).replaceAll('"', "")}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {!user.photo ? initials(user.name) : null}
    </span>
  );
}

function isActive(pathname, href) {
  if (href === "/") return pathname === "/";
  if (href === "/books") return pathname === "/books" || pathname.startsWith("/books/");
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, ready, logout } = useAuth();
  const { books, borrows } = useLibrary();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClick(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const links = user ? [...PUBLIC_LINKS, ...PRIVATE_LINKS] : PUBLIC_LINKS;
  const emailsMatch = (value) =>
    String(value || "").toLowerCase() === user?.email?.toLowerCase();
  const booksAdded = user
    ? books.filter((book) => emailsMatch(book.addedBy.email)).length
    : 0;
  const activeLoans = user
    ? borrows.filter((borrow) => emailsMatch(borrow.userEmail)).length
    : 0;

  async function handleLogout() {
    try {
      await logout();
      setProfileOpen(false);
      setProfileModal(false);
      toast.success("Signed out. See you at the next chapter.");
      router.push("/");
    } catch (error) {
      toast.error(error.message || "Could not sign out. Please try again.");
    }
  }

  return (
    <>
      <div className="relative z-50 bg-forest text-parchment">
        <div className="shell flex h-9 items-center justify-between gap-4 text-[10px] font-medium tracking-[0.12em] text-parchment/65">
          <p className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            A shared shelf for curious minds
          </p>
          <p className="hidden sm:block">Free to join · 14-day loans · No late fees</p>
          <p className="sm:hidden">14-day loans</p>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/90 backdrop-blur-xl">
        <div className="shell flex h-[74px] items-center justify-between gap-6">
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setProfileOpen(false)}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-[12px] font-semibold tracking-[0.01em] transition-colors",
                  isActive(pathname, link.href)
                    ? "text-terracotta"
                    : "text-ink/70 hover:text-ink"
                )}
              >
                {link.label}
                {isActive(pathname, link.href) ? (
                  <span className="absolute inset-x-3.5 -bottom-[1px] h-px bg-terracotta" />
                ) : null}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2.5 lg:flex">
            {!ready ? (
              <span className="h-9 w-32 animate-pulse rounded-full bg-cream" />
            ) : user ? (
              <div ref={menuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((open) => !open)}
                  aria-expanded={profileOpen}
                  aria-haspopup="menu"
                  className="flex items-center gap-2.5 rounded-full border border-line bg-parchment py-1 pl-1 pr-3 text-left transition hover:border-ink/20 hover:bg-white"
                >
                  <Avatar user={user} />
                  <span className="max-w-[98px] truncate text-[12px] font-semibold text-ink">
                    {user.name}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-ink/70 transition-transform",
                      profileOpen && "rotate-180"
                    )}
                  />
                </button>

                {profileOpen ? (
                  <div
                    role="menu"
                    className="animate-rise absolute right-0 top-full mt-3 w-[268px] overflow-hidden rounded-2xl border border-line bg-parchment shadow-[0_28px_60px_-24px_rgba(23,38,33,0.45)]"
                  >
                    <div className="flex items-center gap-3 border-b border-line/70 px-4 py-4">
                      <Avatar user={user} size="lg" />
                      <div className="min-w-0">
                        <p className="truncate font-display text-lg font-semibold leading-tight text-ink">
                          {user.name}
                        </p>
                        <p className="truncate text-[11px] text-ink/70">{user.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-px border-b border-line/70 bg-line/60">
                      <div className="bg-parchment px-4 py-3">
                        <p className="font-display text-2xl font-semibold text-ink">
                          {booksAdded}
                        </p>
                        <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-ink/70">
                          Books added
                        </p>
                      </div>
                      <div className="bg-parchment px-4 py-3">
                        <p className="font-display text-2xl font-semibold text-ink">
                          {activeLoans}
                        </p>
                        <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-ink/70">
                          On loan
                        </p>
                      </div>
                    </div>
                    <div className="p-2">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setProfileOpen(false);
                          setProfileModal(true);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[12px] font-medium text-ink/70 transition hover:bg-ink/[0.05] hover:text-ink"
                      >
                        <UserRound className="h-4 w-4 text-terracotta" />
                        My Profile
                      </button>
                      <Link
                        href="/my-books"
                        role="menuitem"
                        onClick={() => setProfileOpen(false)}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[12px] font-medium text-ink/70 transition hover:bg-ink/[0.05] hover:text-ink"
                      >
                        <LibraryBig className="h-4 w-4 text-terracotta" />
                        My Books
                      </Link>
                      <Link
                        href="/my-borrows"
                        role="menuitem"
                        onClick={() => setProfileOpen(false)}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[12px] font-medium text-ink/70 transition hover:bg-ink/[0.05] hover:text-ink"
                      >
                        <BookMarked className="h-4 w-4 text-terracotta" />
                        My Borrows
                      </Link>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleLogout}
                        className="mt-1 flex w-full items-center gap-2.5 rounded-xl border-t border-line/60 px-3 py-2.5 text-left text-[12px] font-medium text-ink/70 transition hover:bg-terracotta/[0.07] hover:text-terracotta"
                      >
                        <LogOut className="h-4 w-4" />
                        Log out
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <>
                <Link href="/login" className="btn-quiet">
                  Log in
                </Link>
                <Link href="/register" className="btn-brand px-5 py-2.5">
                  Join the library
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-parchment text-ink lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen ? (
          <div className="animate-rise border-t border-line/70 bg-parchment lg:hidden">
            <div className="shell py-5">
              <nav className="grid gap-1" aria-label="Mobile navigation">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold transition",
                      isActive(pathname, link.href)
                        ? "bg-forest text-parchment"
                        : "text-ink/70 hover:bg-ink/[0.05]"
                    )}
                  >
                    {link.label}
                    {isActive(pathname, link.href) ? (
                      <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                    ) : null}
                  </Link>
                ))}
              </nav>

              <div className="mt-4 border-t border-line/70 pt-4">
                {ready && user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 rounded-2xl border border-line bg-white/40 p-3">
                      <Avatar user={user} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink">
                          {user.name}
                        </p>
                        <p className="truncate text-[11px] text-ink/70">{user.email}</p>
                      </div>
                    </div>
                    <button type="button" onClick={handleLogout} className="btn-outline w-full">
                      <LogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/login" className="btn-outline">
                      Log in
                    </Link>
                    <Link href="/register" className="btn-brand">
                      <PlusCircle className="h-4 w-4" />
                      Join
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </header>

      <Modal
        open={profileModal}
        onClose={() => setProfileModal(false)}
        title="Your library card"
        description="A quick look at your reading life at Friendly Library."
      >
        {user ? (
          <div>
            <div className="flex items-center gap-4 rounded-2xl border border-line bg-white/50 p-4">
              <Avatar user={user} size="lg" />
              <div className="min-w-0">
                <p className="truncate font-display text-2xl font-semibold leading-tight text-ink">
                  {user.name}
                </p>
                <p className="truncate text-xs text-ink/70">{user.email}</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-terracotta">
                  Reader since 2026
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-line bg-cream/60 p-4">
                <p className="font-display text-3xl font-semibold text-ink">{booksAdded}</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/70">
                  Books you shared
                </p>
              </div>
              <div className="rounded-2xl border border-line bg-cream/60 p-4">
                <p className="font-display text-3xl font-semibold text-ink">{activeLoans}</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/70">
                  Books with you
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Link
                href="/my-books"
                onClick={() => setProfileModal(false)}
                className="btn-brand flex-1"
              >
                My books
              </Link>
              <Link
                href="/my-borrows"
                onClick={() => setProfileModal(false)}
                className="btn-outline flex-1"
              >
                My borrows
              </Link>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 text-[12px] font-semibold text-ink/70 transition hover:text-terracotta"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out of Friendly Library
            </button>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
