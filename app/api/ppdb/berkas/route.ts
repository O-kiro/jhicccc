import { proxyUpload } from "@/lib/api-proxy";

/** Unggah satu berkas pendaftaran (PDF). */
export async function POST(request: Request) {
  return proxyUpload("/ppdb/berkas", request);
}
