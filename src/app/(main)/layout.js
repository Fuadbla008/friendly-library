import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";

function NavbarFallback() {
  return (
    <>
      <div className="h-9 bg-forest" />
      <header className="border-b border-line/70 bg-paper">
        <div className="shell flex h-[74px] items-center justify-between gap-6">
          <Logo />
          <div className="hidden items-center gap-2 lg:flex">
            <span className="h-8 w-16 animate-pulse rounded-full bg-cream" />
            <span className="h-8 w-16 animate-pulse rounded-full bg-cream" />
            <span className="h-8 w-16 animate-pulse rounded-full bg-cream" />
          </div>
          <span className="h-9 w-24 animate-pulse rounded-full bg-cream lg:block" />
        </div>
      </header>
    </>
  );
}

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<NavbarFallback />}>
        <Navbar />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
