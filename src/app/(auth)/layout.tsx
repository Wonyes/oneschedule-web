import AuthHeader from "@/src/components/layout/header/AuthHeader";
import GlobalOverlays from "@/src/components/ui/overlay/GlobalOverlay";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-dvh w-full flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full glow-blob"
      />

      <AuthHeader />
      <main
        id="main"
        className="relative flex flex-1 items-center justify-center overflow-y-auto"
      >
        <div className="h-full w-full max-w-[420px] px-4 lg:max-w-[960px]">
          {children}
        </div>
      </main>
      <GlobalOverlays />
    </div>
  );
}
