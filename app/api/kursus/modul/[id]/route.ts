import { proxyPost } from "@/lib/api-proxy";

/** Menandai modul selesai atau membatalkannya. Progres dihitung Laravel. */
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyPost(`/courses/modules/${encodeURIComponent(id)}/toggle`, {});
}
