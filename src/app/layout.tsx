import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import "./globals.css";
import Providers from "./providers";

// 본문: Pretendard(가변), 제목: GmarketSans — 셀프 호스팅 (CDN @import는 렌더 블로킹이라 제거)
const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  display: "swap",
});

const gmarket = localFont({
  src: "./fonts/GmarketSansMedium.woff",
  variable: "--font-gmarket-local",
  weight: "500",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://oneschedule.site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: "OneSchedule",
  description: "나와 우리 팀의 일정을 한 곳에서 관리하는 스케줄러",

  openGraph: {
    type: "website",
    siteName: "OneSchedule",
    url: SITE_URL,
    title: "OneSchedule",
    description: "나와 우리 팀의 일정을 한 곳에서 관리하는 스케줄러",
    locale: "ko_KR",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("theme")?.value;
  const theme =
    themeCookie === "dark" || themeCookie === "light" ? themeCookie : undefined;

  return (
    <html
      lang="ko"
      data-theme={theme}
      className={`${pretendard.variable} ${gmarket.variable} antialiased`}
    >
      <body className="bg-main-bg w-full h-dvh flex justify-center">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
