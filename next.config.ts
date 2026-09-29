import type { NextConfig } from "next";

/**
 * Asal backend Laravel, diturunkan dari API_URL (di Docker:
 * host.docker.internal:8000, di luar Docker: localhost:8000).
 */
const BACKEND = new URL(process.env.API_URL ?? "http://localhost:8000/api/v1").origin;

const nextConfig: NextConfig = {
  // Menghasilkan `.next/standalone/server.js` — server minimal buatan Next
  // yang bisa dijalankan `node server.js` tanpa `npm install` di server.
  // Dipakai panel hosting (Webuzo/cPanel/Plesk) yang meminta "application
  // startup file" dan tidak bisa menjalankan `next start`.
  //
  // Sengaja BUKAN server.js tulisan tangan: server bawaan ini tetap
  // menjalankan proxy.ts, sedangkan server kustom berisiko melewatinya —
  // dan proxy.ts itu penjaga portal siswa/guru/alumni/PPDB.
  output: "standalone",
  // Alasannya sama dengan `turbopack.root` di bawah: ada package-lock.json
  // nyasar di folder home, dan tanpa ini Next menebak akar ruang kerja ke
  // sana lalu menaruh server.js di `.next/standalone/<jalur-panjang>/`.
  outputFileTracingRoot: __dirname,
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
  // Hanya berlaku bila NEXT_BUILD_CPUS diisi (Dockerfile mengisinya saat
  // membangun di server). Dibiarkan kosong di laptop supaya build lokal tetap
  // memakai semua inti. Bawaan Next adalah jumlah CPU dikurangi satu, yang di
  // VPS kecil menghabiskan memori sebelum build selesai.
  ...(process.env.NEXT_BUILD_CPUS
    ? { experimental: { cpus: Number(process.env.NEXT_BUILD_CPUS) } }
    : {}),
};

export default nextConfig;
