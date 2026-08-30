import Header from "@/src/components/common/header";
import Sidebar from "@/src/components/common/Sidebar";
import AuthRefreshListener from "@/src/components/schedule/components/auth/AuthRefreshListener";
import GlobalOverlays from "@/src/components/ui/GlobalOverlay";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <AuthRefreshListener />
      <Header />
      <div className="relative flex-1 flex overflow-hidden sm:pt-4">
        <main className="flex w-full h-full p-2 gap-3 overflow-hidden sm:p-4 sm:gap-6">
          <Sidebar />
          <div className="flex-1 min-w-0 min-h-0 h-full pb-18 sm:pb-0">
            {children}
          </div>
          <GlobalOverlays />
        </main>
      </div>
    </div>
  );
}
