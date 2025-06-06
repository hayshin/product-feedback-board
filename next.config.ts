import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'dist',
  reactStrictMode: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
