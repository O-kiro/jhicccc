import { proxyPost } from "@/lib/api-proxy";

/** Menandai tugas selesai atau membatalkannya. */
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyPost(`/tugas/${encodeURIComponent(id)}/toggle`, {});
}
