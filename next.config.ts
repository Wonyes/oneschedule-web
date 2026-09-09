import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const apiOrigin = process.env.NEXT_PUBLIC_SERVER_IP ?? "";

const FONT_CDN = "https://cdn.jsdelivr.net";

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  `style-src 'self' 'unsafe-inline' ${FONT_CDN}`,
  "img-src 'self' data: blob: https:",
  `font-src 'self' data: ${FONT_CDN}`,
  ["connect-src 'self'", apiOrigin, isDev ? "ws: http://localhost:*" : ""]
    .filter(Boolean)
    .join(" "),
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
]
  .join("; ")
  .concat(";");

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
          { key: "Content-Security-Policy", value: csp },
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
