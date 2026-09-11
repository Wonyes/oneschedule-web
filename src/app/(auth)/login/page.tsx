import { Suspense } from "react";

import LoginForm from "@/src/components/schedule/components/auth/LoginForm";

export default function Page() {
  return (
    <main className="flex min-h-full w-full items-center justify-center py-8">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
