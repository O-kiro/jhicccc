import { proxyPost, readJson } from "@/lib/api-proxy";

/** Menyimpan nilai satu penilaian untuk satu kelas. */
export async function POST(request: Request) {
  return proxyPost("/guru/nilai", await readJson(request));
}
