import { proxyUpload } from "@/lib/api-proxy";

/** Kegiatan harian dikirim sebagai FormData karena bisa membawa bukti foto. */
export async function POST(request: Request) {
  return proxyUpload("/guru/jurnal-harian", request);
}
