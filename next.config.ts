import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // React 19 optimizations
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "openweathermap.org" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  // Allow Three.js to work properly
  transpilePackages: ["three"],
  // Headers for PWA
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
