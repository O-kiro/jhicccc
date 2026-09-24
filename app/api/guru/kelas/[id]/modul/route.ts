import { proxyPost, readJson } from "@/lib/api-proxy";

/** Menambah modul ke kursus yang diampu. */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyPost(`/guru/kelas/${encodeURIComponent(id)}/modul`, await readJson(request));
}
