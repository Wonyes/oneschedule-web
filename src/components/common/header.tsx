import { Suspense } from "react";
import Logo from "./header/Logo";
import HeaderTabs from "./header/HeaderTabs";
import HeaderAuth from "./header/HeaderAuth";
import AuthSkeleton from "./header/AuthSkeleton";
import { getMyInfo } from "@/src/lib/member";
import ViewModeToggle from "./header/ViewModeToggle";
import LocationPicker from "./header/LocationPicker";
import MobileGroupSwitcher from "./header/MobileGroupSwitcher";
import GroupHeaderControls from "./header/GroupHeaderControls";
import ThemeToggle from "./header/ThemeToggle";

async function HeaderAuthResolved() {
  const user = await getMyInfo();
  return <HeaderAuth user={user} />;
}

export default function Header() {
  return (
    <header
      className="
        relative z-50 flex flex-col gap-2 shrink-0
        mx-2 mt-2 px-3 py-2
        rounded-2xl
        glass
        sm:mx-3 sm:mt-3 sm:px-4
        lg:h-14 lg:flex-row lg:items-center lg:gap-4 lg:py-0
      "
    >
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-1 lg:contents">
        <Logo />

        <div className="flex justify-center lg:hidden">
          <GroupHeaderControls />
          <ViewModeToggle />
        </div>

        <div className="flex min-w-0 items-center justify-end gap-1 lg:hidden">
          <ThemeToggle />
          <Suspense fallback={<AuthSkeleton />}>
            <HeaderAuthResolved />
          </Suspense>
        </div>
      </div>

      <div
        className="
          relative flex justify-center
          lg:absolute lg:left-1/2 lg:top-1/2
          lg:-translate-x-1/2 lg:-translate-y-1/2
        "
      >
        <HeaderTabs />

        <div className="absolute right-0 top-1/2 -translate-y-1/2 lg:hidden">
          <MobileGroupSwitcher />
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-3 lg:ml-auto">
        <LocationPicker />
        <ViewModeToggle />

        <ThemeToggle />
        <Suspense fallback={<AuthSkeleton />}>
          <HeaderAuthResolved />
        </Suspense>
      </div>
    </header>
  );
}
