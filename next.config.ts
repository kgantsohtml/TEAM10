import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep AGENTS.md as the team brief. Do not let Next overwrite it.
  agentRules: false,
};

export default nextConfig;
