import { proxyPost, readJson } from "@/lib/api-proxy";

/** Mencatat (atau memperbarui) jurnal mengajar. Validasinya di Laravel. */
export async function POST(request: Request) {
  return proxyPost("/guru/jurnal", await readJson(request));
}
