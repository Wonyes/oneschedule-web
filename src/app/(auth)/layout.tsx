import AuthHeader from "@/src/components/common/header/AuthHeader";
import GlobalOverlays from "@/src/components/ui/GlobalOverlay";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full h-screen">
      <AuthHeader />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full h-full max-w-[420px] px-4">{children}</div>
      </div>
      <GlobalOverlays />
    </div>
  );
}
