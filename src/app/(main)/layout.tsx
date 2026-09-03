import { cookies } from "next/headers";

import Header from "@/src/components/common/header";
import Sidebar from "@/src/components/common/Sidebar";
import AuthRefreshListener from "@/src/components/schedule/components/auth/AuthRefreshListener";
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
      <Header />
      <div className="relative flex-1 flex overflow-hidden sm:pt-4">
        <main className="flex w-full h-full p-3 gap-3 overflow-hidden sm:p-4 sm:gap-6">
          <Sidebar />
          <div className="scroll-stable flex-1 min-w-0 min-h-0 h-full overflow-y-auto pb-[calc(4.5rem+env(safe-area-inset-bottom))] sm:pb-0">
            {children}
          </div>
          <GlobalOverlays />
          {isLoggedIn && <Sheet />}
        </main>
      </div>
    </div>
  );
}
