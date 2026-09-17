import { Suspense } from "react";

import LoginForm from "@/src/components/auth/login/LoginForm";

export default function Page() {
  return (
    <main className="flex min-h-full w-full items-center justify-center pb-8">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
