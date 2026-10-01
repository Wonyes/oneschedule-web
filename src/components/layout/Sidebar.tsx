"use client";

import { Calendar, Home, Lock, Users, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useOverlay } from "@/src/hooks/useOverlay";

const MENU = [
  { id: "home", label: "홈", icon: Home, path: "/" },
  { id: "calendar", label: "캘린더", icon: Calendar, path: "/schedule" },
  { id: "group", label: "그룹", icon: Users, path: "/group" },
  { id: "profile", label: "설정", icon: Settings, path: "/profile" },
];

/** 비로그인이면 홈 말고는 잠긴 상태로 보여준다. 눌러도 옮기지 않고 안내만 띄운다 */
export default function Sidebar({ isLoggedIn }: { isLoggedIn: boolean }) {
  const pathname = usePathname();
  const { openToast } = useOverlay();

  return (
    <>
      {/* 모바일: 바텀바 뒤 배경 띠. 위쪽은 투명해져서 스크롤 내용이 바 밑으로 녹아든다 */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 z-30 h-[calc(5rem+env(safe-area-inset-bottom))] bg-[linear-gradient(to_bottom,transparent,var(--main-bg)_28%)] sm:hidden"
      />
      <aside
        className="
        fixed inset-x-4 py-1 z-40 h-fit rounded-2xl max-w-md mx-auto
        bottom-[calc(0.75rem+env(safe-area-inset-bottom))]
        sm:static sm:inset-x-auto sm:bottom-auto sm:mt-4 sm:w-16 sm:h-[calc(100%-1rem)] sm:max-w-none sm:mx-0
        glass sm:neu-flat
        flex flex-row sm:flex-col items-center justify-around sm:justify-between
        py-0 sm:py-5 shrink-0
        select-none
      "
      >
        <div className="flex flex-row sm:flex-col items-center justify-around sm:justify-start gap-0 sm:gap-6 w-full sm:w-auto">
          <nav className="flex flex-row sm:flex-col justify-around sm:justify-start gap-0 sm:gap-3 w-full sm:w-auto">
            {MENU.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isActive={
                  item.path === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.path)
                }
                locked={!isLoggedIn && item.path !== "/"}
                onLockedClick={() =>
                  openToast({
                    message: `로그인하면 ${item.label} 화면을 볼 수 있어요.`,
                  })
                }
              />
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}

function NavItem({
  item,
  isActive,
  locked,
  onLockedClick,
}: {
  item: (typeof MENU)[number];
  isActive: boolean;
  locked: boolean;
  onLockedClick: () => void;
}) {
  const Icon = item.icon;

  const className = `
    relative w-11 h-11 rounded-xl
    flex items-center justify-center
    transition-all duration-200 active:scale-95 group
    ${isActive ? "neu-pressed text-accent" : "neu-btn text-secondary hover:text-foreground"}
  `;

  const inner = (
    <>
      <Icon size={18} className="transition-transform group-hover:scale-110" />
      {locked && (
        <span
          aria-hidden
          className="neu-flat absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-surface text-place-h"
        >
          <Lock size={9} strokeWidth={2.5} />
        </span>
      )}
      {isActive && (
        <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent sm:bottom-auto sm:top-0.5" />
      )}
    </>
  );

  if (locked)
    return (
      <button
        type="button"
        onClick={onLockedClick}
        title={`${item.label} (로그인 필요)`}
        aria-label={`${item.label} — 로그인이 필요해요`}
        className={className}
      >
        {inner}
      </button>
    );

  return (
    <Link
      href={item.path}
      prefetch
      title={item.label}
      aria-current={isActive ? "page" : undefined}
      className={className}
    >
      {inner}
    </Link>
  );
}
