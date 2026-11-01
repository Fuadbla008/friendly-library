"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import BookDetailsPage from "@/components/pages/BookDetailsPage";
import PageLoader from "@/components/PageLoader";

function RouteContent() {
  const params = useParams();
  return <BookDetailsPage key={params.id} />;
}

export default function Page() {
  return (
    <Suspense fallback={<PageLoader label="Opening this book…" />}>
      <RouteContent />
    </Suspense>
  );
}
