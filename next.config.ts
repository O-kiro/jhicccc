import type { NextConfig } from "next";

/**
 * Asal backend Laravel, diturunkan dari API_URL (di Docker:
 * host.docker.internal:8000, di luar Docker: localhost:8000).
 */
const BACKEND = new URL(process.env.API_URL ?? "http://localhost:8000/api/v1").origin;

const nextConfig: NextConfig = {
  // Gambar unggahan CMS disimpan Laravel di /storage/..., dan API
  // mengembalikannya sebagai jalur situs. Diteruskan ke backend di sini
  // supaya gambar selalu satu asal dengan situs, dan pengoptimal gambar
  // mengambilnya lewat alamat backend yang benar — di Docker, localhost
  // di dalam container frontend menunjuk ke container itu sendiri.
  async rewrites() {
    return [{ source: "/storage/:path*", destination: `${BACKEND}/storage/:path*` }];
  },
  // A stray lockfile in the home dir confuses workspace-root inference; pin it.
  turbopack: {
    root: __dirname,
  },
  // Serve modern formats for any real photos dropped into /public (PRD NFR-02).
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Allow the dev server to be reached from this LAN address (phone/tablet testing).
  allowedDevOrigins: ["172.16.5.116"],
};

export default nextConfig;
