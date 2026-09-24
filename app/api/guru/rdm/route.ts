import { proxyUpload } from "@/lib/api-proxy";

/** Unggah berkas rapor (PDF/Excel). */
export async function POST(request: Request) {
  return proxyUpload("/guru/rdm", request);
}
