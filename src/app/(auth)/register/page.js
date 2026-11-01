import { Suspense } from "react";
import RegisterPage from "@/components/pages/RegisterPage";
import PageLoader from "@/components/PageLoader";

export const metadata = {
  title: { absolute: "BookNook | Register" },
};

export default function Page() {
  return (
    <Suspense fallback={<PageLoader compact label="Preparing your card…" />}>
      <RegisterPage />
    </Suspense>
  );
}
