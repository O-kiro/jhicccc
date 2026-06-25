import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray lockfile in the home dir confuses workspace-root inference; pin it.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
