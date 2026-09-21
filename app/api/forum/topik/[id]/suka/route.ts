import { proxyPost } from "@/lib/api-proxy";

/** Sakelar suka: memanggilnya lagi membatalkan suka sebelumnya. */
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyPost(`/forum/threads/${encodeURIComponent(id)}/like`, {});
}
