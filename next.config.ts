import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.loca.lt", "*.trycloudflare.com"],
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90, 95],
  },
};

export default nextConfig;
