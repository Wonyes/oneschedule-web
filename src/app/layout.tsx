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

export const metadata: Metadata = {
  title: "OneSchedule",
  description: "나와 우리 팀의 일정을 한 곳에서 관리하는 스케줄러",
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
  // 쿠키가 없으면(사용자가 아직 고른 적 없음) data-theme을 비워두고 CSS의
  // prefers-color-scheme 미디어쿼리가 기기 설정을 따르게 한다.
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
