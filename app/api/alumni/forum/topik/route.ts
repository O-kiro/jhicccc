import { proxyPost, readJson } from "@/lib/api-proxy";

/** Membuka topik baru di Forum Alumni. */
export async function POST(request: Request) {
  return proxyPost("/alumni/forum/threads", await readJson(request));
}
