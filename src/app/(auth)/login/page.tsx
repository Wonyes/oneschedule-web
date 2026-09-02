import { Suspense } from "react";

import LoginForm from "@/src/components/schedule/components/auth/LoginForm";

export default function Page() {
  return (
    <main className="flex w-full justify-center py-8">
      {/* LoginForm이 useSearchParams를 쓰므로 Suspense로 감싼다 */}
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
