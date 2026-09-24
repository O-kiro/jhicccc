import { proxySend } from "@/lib/api-proxy";

/** Menghapus balasan milik sendiri. Laravel yang memeriksa kepemilikannya. */
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxySend("DELETE", `/forum/replies/${encodeURIComponent(id)}`);
}
