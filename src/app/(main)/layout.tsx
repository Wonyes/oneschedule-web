import { cookies } from "next/headers";

import Header from "@/src/components/layout/Header";
import Sidebar from "@/src/components/layout/Sidebar";
import AuthRefreshListener from "@/src/components/auth/AuthRefreshListener";
import EventStreamListener from "@/src/components/common/EventStreamListener";
import GlobalOverlays from "@/src/components/ui/overlay/GlobalOverlay";
import Sheet from "@/src/components/schedule/sheet/sheet";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("access-token");

  return (
    <div className="mx-auto flex h-full w-full max-w-[1400px] flex-col overflow-hidden">
      <AuthRefreshListener />
      {isLoggedIn && <EventStreamListener />}
      <Header />
      <div className="relative flex-1 flex overflow-hidden">
        <main className="flex w-full h-full p-1.5 gap-2 overflow-hidden sm:p-4 sm:gap-6">
          <Sidebar />
          <div className="scroll-hidden flex-1 min-w-0 min-h-0 h-full overflow-y-auto overscroll-contain px-3 pt-2 sm:px-4 sm:pt-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:pb-0">
            <div className="mx-auto grid min-h-full w-full max-w-[1200px] grid-rows-[1fr]">
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
