import { proxyPost, readJson } from "@/lib/api-proxy";

/** Memberi tugas baru untuk kursus yang diampu. */
export async function POST(request: Request) {
  return proxyPost("/guru/tugas", await readJson(request));
}
