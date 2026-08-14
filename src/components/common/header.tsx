import { Suspense } from "react";
import Logo from "./header/Logo";
import HeaderTabs from "./header/HeaderTabs";
import HeaderAuth from "./header/HeaderAuth";
import AuthSkeleton from "./header/AuthSkeleton";
import { getMyInfo } from "@/src/lib/member";
import ViewModeToggle from "./header/ViewModeToggle";

async function HeaderAuthResolved() {
  const user = await getMyInfo();
  return <HeaderAuth user={user} />;
}

export default function Header() {
  return (
    <header className="relative flex flex-col gap-3 px-3 py-3 shrink-0 lg:flex-row lg:items-center lg:gap-4 lg:px-4">
      <div className="flex items-center justify-between lg:contents">
        <Logo />
        <div className="flex items-center gap-1.5 sm:gap-3 justify-end lg:hidden">
          <ViewModeToggle />
          <Suspense fallback={<AuthSkeleton />}>
            <HeaderAuthResolved />
          </Suspense>
        </div>
      </div>

      <div
        className="
          flex justify-center
          lg:absolute lg:left-1/2 lg:top-1/2
          lg:-translate-x-1/2 lg:-translate-y-1/2
        "
      >
        <HeaderTabs />
      </div>

      <div className="hidden lg:flex items-center gap-3 lg:ml-auto">
        <ViewModeToggle />
        <Suspense fallback={<AuthSkeleton />}>
          <HeaderAuthResolved />
        </Suspense>
      </div>
    </header>
  );
}
