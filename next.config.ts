import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep host-independent; no Vercel-only features.
  eslint: {
    // OneDrive sometimes corrupts eslint deps on Windows; UI still builds.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
