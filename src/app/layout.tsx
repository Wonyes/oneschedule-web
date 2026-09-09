import type { Metadata, Viewport } from "next";
import { Geist, Plus_Jakarta_Sans } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-main",
  weight: ["400", "500", "600", "700"],
});

/**
 * 공유 미리보기에 실릴 절대 주소.
 *
 * NEXT_PUBLIC_WEB_IP를 쓰지 않는다. 배포 환경에 API 주소가 들어가 있어서
 * og:image가 api.oneschedule.site를 가리켰고, 거기선 401이라 카카오톡이
 * 이미지를 못 받았다. 서비스 도메인은 바뀌지 않는 값이니 여기 박아두고,
 * 정말 필요할 때만 NEXT_PUBLIC_SITE_URL로 덮는다.
 */
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
      className={`${geistSans.variable} ${geistMono.variable} ${jakarta.variable} antialiased`}
    >
      <body className="bg-main-bg w-full h-dvh flex justify-center">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
