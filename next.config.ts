import type { NextConfig } from "next";

const nextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn-lostark.game.onstove.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      // 사이드바 라벨(캘린더/설정)과 실제 라우트(/schedule, /profile)가 달라서
      // 직접 URL로 들어오면 404가 난다.
      { source: "/calendar", destination: "/schedule", permanent: false },
      { source: "/settings", destination: "/profile", permanent: false },
    ];
  },
} satisfies NextConfig;

export default nextConfig;
