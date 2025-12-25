import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
    domains: ["res.cloudinary.com"],
  },
  webpack: (config) => {
    // Disable webpack filesystem cache to avoid serialization warnings
    config.cache = false;
    return config;
  },
};

export default nextConfig;
