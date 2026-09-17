import { Suspense } from "react";
import { cookies } from "next/headers";
import Logo from "./header/Logo";
import HeaderTabs from "./header/HeaderTabs";
import HeaderAuth from "./header/HeaderAuth";
import AuthSkeleton from "./header/AuthSkeleton";
import { getMyInfo } from "@/src/lib/member";
import ViewModeToggle from "./header/ViewModeToggle";
import LocationPicker from "./header/LocationPicker";
import ScheduleGroupSwitcher from "./header/ScheduleGroupSwitcher";
import GroupHeaderControls from "./header/GroupHeaderControls";
import ThemeToggle from "./header/ThemeToggle";
import NotificationMenu from "../notification/NotificationMenu";

async function HeaderAuthResolved() {
  const user = await getMyInfo();
  return <HeaderAuth user={user} />;
}

export default async function Header() {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("access-token");
  const initialTheme = cookieStore.get("theme")?.value === "dark" ? "dark" : "light";

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
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 lg:contents">
        <div className="flex items-center gap-2">
          <Logo />
        </div>

        <div className="flex justify-center lg:hidden">
          <GroupHeaderControls />
          <ViewModeToggle />
        </div>

        <div className="flex min-w-0 items-center justify-end gap-1 lg:hidden">
          {/* 태블릿(640~1023): 위치·그룹·종이 1줄 우측에. 폰은 위치는 로고 옆, 그룹·종은 2줄로 */}
          <div className="hidden sm:block">
            <LocationPicker />
          </div>
          <ScheduleGroupSwitcher compact className="hidden sm:block" />
          {/* 종: 태블릿은 항상 1줄, 폰은 스케줄 페이지가 아닐 때만 1줄(스케줄은 2줄 왼쪽) */}
          {isLoggedIn && <NotificationMenu className="hidden sm:block" />}
          {isLoggedIn && (
            <NotificationMenu mobileSlot="top" className="sm:hidden" />
          )}
          <ThemeToggle initial={initialTheme} />
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
        {/* 폰: 종 왼쪽 · 그룹 오른쪽 */}
        <ScheduleGroupSwitcher
          compact
          className="absolute right-0 top-1/2 -translate-y-1/2 sm:hidden"
        />
        {isLoggedIn && (
          <NotificationMenu
            mobileSlot="sub"
            className="absolute left-0 top-1/2 -translate-y-1/2 sm:hidden"
          />
        )}
      </div>

      <div className="hidden min-w-0 justify-center lg:col-start-2 lg:row-start-1 lg:flex">
        <GroupHeaderControls />
      </div>

      <div className="hidden items-center justify-end gap-2 lg:col-start-3 lg:row-start-1 lg:flex">
        <ScheduleGroupSwitcher compact />
        <LocationPicker />
        <ViewModeToggle />

        {isLoggedIn && <NotificationMenu />}
        <ThemeToggle initial={initialTheme} />
        <Suspense fallback={<AuthSkeleton />}>
          <HeaderAuthResolved />
        </Suspense>
      </div>
    </header>
  );
}
