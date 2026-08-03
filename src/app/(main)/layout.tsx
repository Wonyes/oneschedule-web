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
      <div className="relative pt-4 flex-1 flex overflow-hidden">
        <main className="flex w-full h-full p-4 gap-6 overflow-hidden">
          <Sidebar />
          <div className="flex-1 h-full scroll-stable">{children}</div>
          <GlobalOverlays />
        </main>
      </div>
    </div>
  );
}
