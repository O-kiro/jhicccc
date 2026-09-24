import { proxySend } from "@/lib/api-proxy";

/** Menghapus jurnal milik jadwal sendiri. Laravel yang memeriksa kepemilikannya. */
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxySend("DELETE", `/guru/jurnal/${encodeURIComponent(id)}`);
}
