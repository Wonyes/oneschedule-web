import { cookies } from "next/headers";

import Header from "@/src/components/common/header";
import Sidebar from "@/src/components/common/Sidebar";
import AuthRefreshListener from "@/src/components/schedule/components/auth/AuthRefreshListener";
import EventStreamListener from "@/src/components/common/EventStreamListener";
import GlobalOverlays from "@/src/components/ui/GlobalOverlay";
import Sheet from "@/src/components/ui/sheet/sheet";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("access-token");

  return (
    // 헤더·사이드바·본문을 한 덩어리로 가운데 정렬 — 1920/2560에서 양끝으로 흩어지지 않게
    <div className="mx-auto flex h-full w-full max-w-[1400px] flex-col overflow-hidden">
      <AuthRefreshListener />
      {isLoggedIn && <EventStreamListener />}
      <Header />
      <div className="relative flex-1 flex overflow-hidden">
        <main className="flex w-full h-full p-1.5 gap-2 overflow-hidden sm:p-4 sm:gap-6">
          <Sidebar />
          <div className="scroll-hidden flex-1 min-w-0 min-h-0 h-full overflow-y-auto overscroll-contain px-4 pt-3 sm:pt-4 pb-[calc(4.5rem+env(safe-area-inset-bottom))] sm:pb-0">
            {/* 데스크탑에서 카드가 화면 끝까지 늘어나지 않게 본문 폭을 제한 */}
            <div className="mx-auto h-full w-full max-w-[1200px]">
              {children}
            </div>
          </div>
          <GlobalOverlays />
          {isLoggedIn && <Sheet />}
        </main>
      </div>
    </div>
  );
}
