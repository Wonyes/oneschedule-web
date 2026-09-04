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
      { source: "/calendar", destination: "/schedule", permanent: false },
      { source: "/settings", destination: "/profile", permanent: false },
    ];
  },
} satisfies NextConfig;

export default nextConfig;
