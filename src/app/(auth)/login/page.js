import { Suspense } from "react";
import LoginPage from "@/components/pages/LoginPage";
import PageLoader from "@/components/PageLoader";

export const metadata = {
  title: { absolute: "Friendly Library | Login" },
};

export default function Page() {
  return (
    <Suspense fallback={<PageLoader compact label="Opening the door…" />}>
      <LoginPage />
    </Suspense>
  );
}
