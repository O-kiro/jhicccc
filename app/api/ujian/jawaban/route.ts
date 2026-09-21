import { proxyPost, readJson } from "@/lib/api-proxy";

/** Menyimpan satu jawaban CBT. Dipanggil tiap kali siswa memilih opsi. */
export async function POST(request: Request) {
  return proxyPost("/exam-session/answers", await readJson(request));
}
