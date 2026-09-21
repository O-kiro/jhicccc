import { proxyPost, readJson } from "@/lib/api-proxy";

/** Membuka topik diskusi baru. Validasi dikerjakan Laravel. */
export async function POST(request: Request) {
  return proxyPost("/forum/threads", await readJson(request));
}
