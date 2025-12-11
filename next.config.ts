import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          process.env.NEXT_PUBLIC_HOST ||
          "social-media-application-backend-y8zs.onrender.com",
        port: process.env.NEXT_PUBLIC_PORT || "5483",
        pathname: "/uploads/**",
      },
    ],
    domains: [
      process.env.NEXT_PUBLIC_HOST ||
        "social-media-application-backend-y8zs.onrender.com",
    ],
  },
  webpack: (config) => {
    // Disable webpack filesystem cache to avoid serialization warnings
    config.cache = false;
    return config;
  },
};

export default nextConfig;
