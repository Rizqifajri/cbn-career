import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
    ],
    // atau kalau masih pakai domains array:
    // domains: ["ik.imagekit.io"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
