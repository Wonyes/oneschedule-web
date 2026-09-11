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
    <div className="flex flex-col w-full h-full overflow-hidden">
      <AuthRefreshListener />
      {isLoggedIn && <EventStreamListener />}
      <Header />
      <div className="relative flex-1 flex overflow-hidden">
        <main className="flex w-full h-full p-1.5 gap-2 overflow-hidden sm:p-4 sm:gap-6">
          <Sidebar />
          <div className="scroll-hidden flex-1 min-w-0 min-h-0 h-full overflow-y-auto overscroll-contain px-4 pt-3 sm:pt-4 pb-[calc(4.5rem+env(safe-area-inset-bottom))] sm:pb-0">
            {children}
          </div>
          <GlobalOverlays />
          {isLoggedIn && <Sheet />}
        </main>
      </div>
    </div>
  );
}
