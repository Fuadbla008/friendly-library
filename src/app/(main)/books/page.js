import { Suspense } from "react";
import BooksPage from "@/components/pages/BooksPage";
import PageLoader from "@/components/PageLoader";

export const metadata = {
  title: { absolute: "BookNook | All Books" },
};

export default function Page() {
  return (
    <Suspense fallback={<PageLoader label="Opening the shelf…" />}>
      <BooksPage />
    </Suspense>
  );
}
