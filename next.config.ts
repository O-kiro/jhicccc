import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray lockfile in the home dir confuses workspace-root inference; pin it.
  turbopack: {
    root: __dirname,
  },
  // Serve modern formats for any real photos dropped into /public (PRD NFR-02).
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
