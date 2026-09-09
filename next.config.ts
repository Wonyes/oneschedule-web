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

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self), payment=()",
          },
        ],
      },
    ];
  },
} satisfies NextConfig;

export default nextConfig;
