import { Suspense } from "react";
import { cookies } from "next/headers";
import Logo from "./header/Logo";
import HeaderTabs from "./header/HeaderTabs";
import HeaderAuth from "./header/HeaderAuth";
import AuthSkeleton from "./header/AuthSkeleton";
import { getMyInfo } from "@/src/lib/member";
import LocationPicker from "./header/LocationPicker";
import ScheduleGroupSwitcher from "./header/ScheduleGroupSwitcher";
import GroupHeaderControls from "./header/GroupHeaderControls";
import ThemeToggle from "./header/ThemeToggle";
import NotificationMenu from "./header/NotificationMenu";

async function HeaderAuthResolved() {
  const user = await getMyInfo();
  return <HeaderAuth user={user} />;
}

export default async function Header() {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("access-token");

  return (
    <header
      className="
        relative z-50 flex flex-col gap-2 shrink-0
        mx-2 mt-2 px-3 py-2
        rounded-2xl
        glass
        sm:mx-3 sm:mt-3 sm:px-4
        lg:grid lg:h-14 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-4 lg:py-0
      "
    >
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-1 lg:contents">
        <div className="flex items-center gap-2">
          <Logo />
          {isLoggedIn && (
            <NotificationMenu mobileSlot="top" className="lg:hidden" />
          )}
        </div>

        <div className="flex justify-center lg:hidden">
          <GroupHeaderControls />
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
          relative flex min-w-0 justify-center empty:hidden
          lg:col-start-2 lg:row-start-1
        "
      >
        <HeaderTabs />
        <ScheduleGroupSwitcher
          compact
          className="absolute right-0 top-1/2 -translate-y-1/2 lg:hidden"
        />
        {isLoggedIn && (
          <NotificationMenu
            mobileSlot="sub"
            className="absolute left-0 top-1/2 -translate-y-1/2 lg:hidden"
          />
        )}
      </div>

      <div className="hidden min-w-0 justify-center lg:col-start-2 lg:row-start-1 lg:flex">
        <GroupHeaderControls />
      </div>

      <div className="hidden items-center justify-end gap-3 lg:col-start-3 lg:row-start-1 lg:flex">
        <ScheduleGroupSwitcher compact />
        <LocationPicker />

        {isLoggedIn && <NotificationMenu />}
        <ThemeToggle />
        <Suspense fallback={<AuthSkeleton />}>
          <HeaderAuthResolved />
        </Suspense>
      </div>
    </header>
  );
}
