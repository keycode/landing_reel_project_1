import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ["@landingreel/ui"],
  allowedDevOrigins: ["localhost:4321", "localhost:4322", "172.17.208.1:3000", "172.17.208.1:3001"],
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "172.17.208.1:3000", "http://172.17.208.1:3000"],
    },
  },
  /* config options here */
};

export default nextConfig;
