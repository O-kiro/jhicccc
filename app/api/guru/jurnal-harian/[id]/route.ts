import { proxySend, proxyUpload } from "@/lib/api-proxy";

/** Mengubah kegiatan; multipart karena bisa membawa foto baru. */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyUpload(`/guru/jurnal-harian/${encodeURIComponent(id)}`, request);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxySend("DELETE", `/guru/jurnal-harian/${encodeURIComponent(id)}`);
}
