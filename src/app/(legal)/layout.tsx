import AuthHeader from "@/src/components/layout/header/AuthHeader";

/** 약관·개인정보처리방침. 로그인 없이 볼 수 있고 헤더만 공유한다 */
export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden">
      <AuthHeader />
      <main id="main" className="flex-1 overflow-y-auto px-4">
        {children}
      </main>
    </div>
  );
}
