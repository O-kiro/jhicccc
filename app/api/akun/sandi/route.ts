import { proxyPost, readJson } from "@/lib/api-proxy";

/** Mengganti kata sandi siswa. Semua pemeriksaan dikerjakan Laravel. */
export async function POST(request: Request) {
  return proxyPost("/me/password", await readJson(request));
}
