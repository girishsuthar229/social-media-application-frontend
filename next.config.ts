import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_IMAGE_HOST || "",
        port: process.env.NEXT_PUBLIC_PORT || "",
        pathname: "/**",
      },
    ],
    domains: [process.env.NEXT_PUBLIC_IMAGE_HOST || ""],
  },
  webpack: (config) => {
    // Disable webpack filesystem cache to avoid serialization warnings
    config.cache = false;
    return config;
  },
};

export default nextConfig;
