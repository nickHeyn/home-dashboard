import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['node-ical'],
  reactCompiler: true,
};

export default nextConfig;
