import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: process.env.NEXT_PUBLIC_HOST || "localhost",
        port: process.env.NEXT_PUBLIC_PORT || "3000",
        pathname: "/uploads/**",
      },
    ],
  },
  webpack: (config) => {
    // Disable webpack filesystem cache to avoid serialization warnings
    config.cache = false;
    return config;
  },
};

export default nextConfig;
